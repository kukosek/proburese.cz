import {
	Resolver, Query
} from 'type-graphql';

import {MonthStat} from "../entity/MonthStat"

@Resolver(MonthStat)
export class MonthStatResolver {
	@Query(() => [MonthStat])
	async monthStats() {
		const items = await MonthStat.find({order: {month: "ASC"}})
		for (const item of items) {
			const splitted = item.month.split('-')
			splitted.pop()
			item.month = splitted.join('-')
		}
		return items
	}
}
