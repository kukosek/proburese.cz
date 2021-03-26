import {
	Resolver, Query, Arg,
	Field, ArgsType, Args,
	registerEnumType, ID, InputType,
	Mutation, Ctx,
} from 'type-graphql';
import {
	//IsDate,
	Length,
	Min,
	Max,
} from 'class-validator';
import {ContextType} from './Context';

import {Donator} from "../entity/Donator"

export enum DonatorSortType {
	AMOUNT = "AMOUNT",
	LIKES = "LIKES",
	COUNT = "COUNT",
}

registerEnumType(DonatorSortType, {
	name: "DonatorsSortType", // this one is mandatory
	description: "Enumeration for sort types", // this one is optional
});

@ArgsType()
class DonatorsArgs {
	@Field(() => Number)
	@Min(0)
	skip: number = 0;

	@Field(() => Number)
	@Min(1)
	@Max(50)
	take: number = 25;

	@Field(() => DonatorSortType)
	sortBy: DonatorSortType = DonatorSortType.AMOUNT
}

@Resolver(Donator)
export class DonatorResolver {
	@Query(() => [Donator])
	async donators(@Args() {skip, take, sortBy}: DonatorsArgs,
		@Ctx() ctx: ContextType) {
		let query = Donator.createQueryBuilder()
			.skip(skip).take(take)
		if (sortBy == DonatorSortType.AMOUNT) {
			query = query.orderBy({
				'amount_donated': 'DESC'
			})
		} else if (sortBy == DonatorSortType.COUNT) {
			query = query.orderBy({
				'donation_count': 'DESC'
			})
		} else if (sortBy == DonatorSortType.LIKES) {
			query = query.orderBy({
				'score': 'DESC'
			})
		}
		const items = await query.getMany()
		return items
	}

	@Query(() => Donator, {nullable: true})
	async donator(@Arg("id") id: number) {
		const item = Donator.findOne({where: {id: id}})
		return item
	}
}
