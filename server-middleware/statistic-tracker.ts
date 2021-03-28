import {MonthStat} from "./entity/MonthStat"
import {Donate} from "./entity/Donate"
import {getRepository, Repository, createConnection} from "typeorm"

const take = 100
export async function trackStats() {
	let currentSkip = 0
	const monthRepo: Repository<MonthStat>
		= getRepository(MonthStat)
	monthRepo.createQueryBuilder()
		.delete()
		.execute()
	while (true) {
		const donateBatch = await Donate.find({
			skip: currentSkip, take: take,
			order: {date: "ASC"}
		})
		if (donateBatch.length > 0) {
			currentSkip += donateBatch.length
			for (const donate of donateBatch) {
				const monthString = donate.date.getUTCFullYear() + '-' +
					(donate.date.getUTCMonth() + 1).toString().padStart(2, '0') + '-01'
				let monthStat = await monthRepo.findOne({where: {month: monthString}})
				if (monthStat === undefined) {
					monthStat = MonthStat.create()
					monthStat.month = monthString
				}
				monthStat.amount = (parseFloat(monthStat.amount) + donate.amount).toString()
				monthStat.count++
				await monthStat.save()
			}
		} else {
			break
		}
	}
}

createConnection().then(() => {
	trackStats()
})
