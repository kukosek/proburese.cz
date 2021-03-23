import {
	Resolver, Query, Arg,
	Field, ArgsType, Args,
	registerEnumType, ID, InputType,
	Mutation
} from 'type-graphql';
import {Like} from "typeorm";
import {SortType} from "../types/Sort"

registerEnumType(SortType, {
	name: "SortType", // this one is mandatory
	description: "Enumeration for sort types", // this one is optional
});


import {Donate} from "../entity/Donate"

import {
	//IsDate,
	Length,
	Min,
	Max,
} from 'class-validator';


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
}

@InputType({description: "New recipe data"})
class ChangeDonateScore implements Partial<Donate> {
	@Field(() => ID)
	id!: number;

	@Field()
	@Min(-2)
	@Max(2)
	userScore: number = 0
}


@Resolver(Donate)
export class DonateResolver {
	@Query(() => [Donate])
	async donates(@Args() {skip, take, search, sortBy}: DonatesArgs) {
		let query = Donate.createQueryBuilder()
			.skip(skip)
			.take(take)
		var whereExpr = "duplicate = false"
		var whereParams = {searchLikeStr: ""}
		if (search != "") {
			whereExpr += " AND (LOWER(message) LIKE :searchLikeStr OR LOWER(author) LIKE :searchLikeStr)"
			whereParams.searchLikeStr = `%${search.toLowerCase()}%`
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
		return await query.getMany()
	}

	@Mutation(() => Donate)
	async mutateDonate(@Arg("data") changeData: ChangeDonateScore): Promise<Donate> {
		return Donate.findOne({where: {id: changeData.id}}).then((donate) => {
			if (donate === undefined) {
				console.log("donate undefined")
				return Donate.create();
			} else {
				donate.score = Number(donate.score) + changeData.userScore
				donate.save()
				return donate;
			}
		})
	}
}
