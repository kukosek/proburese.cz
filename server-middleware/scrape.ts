import {createConnection} from "typeorm";
import {DonateScrapingState} from "./entity/DonateScrapingState"
import {Donate} from "./entity/Donate"
import {KbResponse} from "./scrape/kbtypes"
import {getRepository, Repository} from "typeorm"
import {Moment} from 'moment'
import fetch from 'node-fetch'
let moment = require('moment');


const accounts: string[] = ["4070217"]

const baseUrl = "https://www.kb.cz/transparentsapi/transactions/"
const timer = (ms: number) => new Promise(res => setTimeout(res, ms))

async function main() {
	await createConnection();
	const scrapingStateRepo: Repository<DonateScrapingState>
		= getRepository(DonateScrapingState)

	const donateRepository: Repository<Donate> = getRepository(Donate)
	console.log("made connection")
	var currentSkip: number = 0
	for (const accountId of accounts) {
		var account: DonateScrapingState | undefined = await scrapingStateRepo.findOne({
			where: {account: accountId}
		})

		if (account === undefined) {
			account = DonateScrapingState.create()
			account.account = accountId;
		}

		var parsing = true;
		while (parsing) {
			const url = baseUrl + accountId + '?skip=' + currentSkip.toString()

			try {
				let response = await fetch(url);
				if (response.ok) { // if HTTP-status is 200-299
					let responseJson: KbResponse = await response.json();
					let items = responseJson.items

					for (const item of items) {
						//Check if donate with this id already exists
						const foundDonate =
							await donateRepository.findOne({where: {bankId: item.id}})

						if (foundDonate === undefined) {
							// We don't yet have it in database, add it
							const notesParts = item.notes.split("<br />")

							// Check if the notes fields has the length we need
							if (notesParts.length >= 3) {
								const transactionType = notesParts[1].toLowerCase()
								// We only want to add transactions that were sent to the account
								// not the ones that were send back
								if (transactionType.includes("příchozí")) {

									const donate = Donate.create()
									donate.bankId = item.id
									donate.account = accountId

									donate.author = notesParts[0]
									donate.message = notesParts[2].trim()

									//Check if donate with same message already exists
									//If yes, set duplicate to true
									const sameMsgDonate =
										await donateRepository.findOne({
											where: {message: donate.message}
										})
									if (sameMsgDonate !== undefined) {
										donate.duplicate = true;
									}

									// determine the amount in CZK
									const amountParts = item.amount.split(' ')
									const amount = parseFloat(
										amountParts[0].replace(',', '.'))
									donate.amount = amount.toString()

									// update statistics
									account.income = (parseFloat(account.income) + amount).toString()
									account.records++
									if (amount == 0.01) {
										account.oneCentsDonateCount++;
									}


									// Parse date of transaction
									donate.date = moment(
										item.date.replace("&nbsp;", ' '), 'D. M. YYYY').toDate();
									if (donate.date.toDateString() == (new Date()).toDateString()) {
										donate.date = new Date()
									}

									console.log(donate)

									donate.save()
									account.save()

								} else {
									console.info("Odchozi")
								}
							} else {
								console.debug("errorous:", item.notes)
							}

						} else {
							console.log("already parsed")
							// We already parsed it somewhere, so we can assume the next
							// items will be also parsed
							parsing = false
							break
						}
					}

					if (responseJson.loadMore) {
						currentSkip += items.length
					} else {
						parsing = false;
					}
				} else {
					console.log("HTTP-Error: " + response.status);
				}
			} catch (e) {
				console.log("Network error: ", e)
			}
			await timer(3000)
		}
	}
}

main()
