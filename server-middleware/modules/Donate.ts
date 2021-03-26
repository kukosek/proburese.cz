import {
	Resolver, Query, Arg,
	Field, ArgsType, Args,
	registerEnumType, ID, InputType,
	Mutation, Ctx,
	Authorized
} from 'type-graphql';
import {Like} from "typeorm";
import {SortType} from "../types/Sort"

registerEnumType(SortType, {
	name: "SortType", // this one is mandatory
	description: "Enumeration for sort types", // this one is optional
});


import {Donate} from "../entity/Donate"
import {Donator} from "../entity/Donator"
import {UserScore} from "../entity/UserScore"

import {
	//IsDate,
	Length,
	Min,
	Max,
} from 'class-validator';
import {ContextType} from './Context';


@ArgsType()
class DonatesArgs {
	@Field(() => Number)
	@Min(0)
	skip: number = 0;

	@Field(() => Number)
	@Min(1)
	@Max(50)
	take: number = 25;

	@Field(() => String)
	@Length(0, 50)
	search: string = ""

	@Field(() => SortType)
	sortBy: SortType = SortType.HOT

	@Field(() => Number, {nullable: true})
	donatorId!: number
}

@InputType({description: "New recipe data"})
class ChangeDonateScore implements Partial<Donate> {
	@Field(() => ID)
	id!: number;

	@Field()
	@Min(-1)
	@Max(1)
	userScore: number = 0
}


@Resolver(Donate)
export class DonateResolver {
	@Query(() => [Donate])
	async donates(@Args() {skip, take, search, sortBy, donatorId}: DonatesArgs, @Ctx() ctx: ContextType) {
		let query = Donate.createQueryBuilder()
			.skip(skip)
			.take(take)
		var whereExpr = "duplicate = false"
		var whereParams = {searchLikeStr: "", authorId: 0}
		if (search != "") {
			whereExpr += " AND (LOWER(message) LIKE :searchLikeStr OR LOWER(author) LIKE :searchLikeStr)"
			whereParams.searchLikeStr = `%${search.toLowerCase()}%`
		}

		if (donatorId) {
			whereExpr += " AND author_id = :authorId"
			whereParams.authorId = donatorId
		}
		query = query.where(whereExpr, whereParams)


		if (sortBy == SortType.NEWEST) {
			query = query.orderBy({
				'date': 'DESC',
				'id': 'DESC'
			})
		} else if (sortBy == SortType.TOP) {
			query = query.orderBy({
				'score': 'DESC',
				'id': 'DESC'
			})
		} else if (sortBy == SortType.HOT) {
			query = query.orderBy({
				'score': 'DESC',
				'date': 'DESC',
				'id': 'DESC'
			})
		}

		const items = await query.getMany()

		// Now we modify the values of scores based on User's likes
		if (ctx.user) {
			for (const item of items) {
				const userScore = await UserScore.findOne({
					where: {
						userId: ctx.user.id,
						donateId: item.id
					}
				})
				if (userScore) {
					item.userScore = userScore.score
				}
			}
		}

		return items
	}

	@Query(() => Donate, {nullable: true})
	async donate(@Arg("id") id: number, @Ctx() ctx: ContextType) {
		const donate = await Donate.findOne({where: {id: id}})
		if (donate) {
			if (ctx.user) {
				const userScore = await UserScore.findOne({
					where: {
						userId: ctx.user.id,
						donateId: id
					}
				})
				if (userScore) {
					donate.userScore = userScore.score
				}
			}
		}
		return donate
	}

	@Authorized()
	@Mutation(() => Donate)
	async mutateDonate(@Arg("data") changeData: ChangeDonateScore, @Ctx() ctx: ContextType): Promise<Donate> {
		return Donate.findOne({where: {id: changeData.id}}).then((donate) => {
			if (donate === undefined) {
				return Donate.create();
			} else {
				return UserScore.findOne({
					where: {
						userId: ctx.user.id,
						donateId: changeData.id
					}
				}).then((userScore) => {
					if (userScore === undefined) {
						userScore = UserScore.create()
						userScore.userId = ctx.user.id
						userScore.donateId = changeData.id
					}

					const previousScore: number = Number(userScore.score)

					userScore.score = changeData.userScore
					userScore.save()

					const scoreChange = Number(userScore.score) - previousScore



					donate.score = Number(donate.score) + scoreChange

					Donator.findOne({where: {id: donate.authorId}}).then((donator) => {
						if (donator) {
							donator.score += scoreChange
						}
					})

					donate.save()
					return donate;
				})
			}
		})
	}
}
