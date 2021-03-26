import {createConnection} from "typeorm";
require('dotenv').config()
import {DonateScrapingState} from "./entity/DonateScrapingState"
import {Donate} from "./entity/Donate"
import {normalizeName} from "./utils/normalize-name"
import {Donator} from "./entity/Donator"
import {BuresUser as User} from "./entity/User"
import {KbResponse} from "./scrape/kbtypes"
import {getRepository, Repository} from "typeorm"
import {Moment} from 'moment'
import fetch from 'node-fetch'
let moment = require('moment');

const perform_full_parse: boolean =
	process.env.PERFORM_FULL_PARSE! == "true"

const accounts: string[] = ["4070217", "4090453"]

const baseUrl = "https://www.kb.cz/transparentsapi/transactions/"
const timer = (ms: number) => new Promise(res => setTimeout(res, ms))

async function main() {
	const scrapingStateRepo: Repository<DonateScrapingState>
		= getRepository(DonateScrapingState)

	const donateRepository: Repository<Donate> = getRepository(Donate)
	const userRepository: Repository<User> = getRepository(User)
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

		let perform_full_parse_now = perform_full_parse

		if (account.records < 1000) perform_full_parse_now = true

		var parsingSameCount = 0;
		while (parsingSameCount < 30) {
			const url = baseUrl + accountId + '?skip=' + currentSkip.toString()

			try {
				let response = await fetch(url);
				if (response.ok) { // if HTTP-status is 200-299
					let responseJson: KbResponse = await response.json();
					let items = responseJson.items

					for (const item of items) {
						//Check if donate with this id already exists
						// We don't yet have it in database, add it
						const notesParts = item.notes.split("<br />")

						// Check if the notes fields has the length we need
						if (notesParts.length >= 2) {
							const transactionType = notesParts[1].toLowerCase()
							// We only want to add transactions that were sent to the account
							// not the ones that were send back
							if (transactionType.includes("příchozí")) {

								const donate = Donate.create()
								donate.bankId = item.id
								donate.account = accountId

								donate.author = notesParts[0]
								if (notesParts.length > 2)
									donate.message = notesParts[2].trim()
								else donate.message = ""

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
								const amount = parseFloat(
									item.amount.replace(" CZK", "").replace(',', '.').replace(" ", "")
								)
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
								const foundDonate =
									await donateRepository.findOne({
										where: {
											bankId: donate.bankId,
											message: donate.message,
											author: donate.author,
											amount: donate.amount,
											account: donate.account
										}
									})

								if (foundDonate === undefined) {

									let donateDonator = await Donator.findOne({
										where: {
											name: donate.author
										}
									})

									if (donateDonator === undefined) {
										donateDonator = Donator.create()
										donateDonator.name = donate.author
									}

									donateDonator.amountDonated =
										(parseFloat(donateDonator.amountDonated) +
											amount).toString()
									donateDonator.donationCount++


									// find user

									const normalizedAuthor = normalizeName(donate.author)
									const normalizedAuthorSplitted = normalizedAuthor.split(" ")

									donateDonator.normalizedName = normalizedAuthor


									let query = userRepository.createQueryBuilder("user")

									let whereExpr = ""
									let whereParams: any = {}
									for (let i = 0; i < normalizedAuthorSplitted.length; i++) {
										if (i == 0 || i == normalizedAuthorSplitted.length - 1) {
											const normAuthorPart = normalizedAuthorSplitted[i]
											const searchLikeStr = "%" + normAuthorPart + "%"

											whereExpr += "user.normalizedName LIKE :v" + i.toString()
											whereParams["v" + i.toString()] = searchLikeStr

											if (i != normalizedAuthorSplitted.length - 1) {
												whereExpr += " AND "
											}
										}
									}

									query = query.where(whereExpr, whereParams)
									const foundUser = await query.getOne()



									await donateDonator.save()
									donate.authorId = donateDonator.id
									console.log(donate)
									if (foundUser) {
										console.log("found user with this name")
										console.log("donate")
										foundUser.donatorId = donateDonator.id
										await foundUser.save()
									}
									await donate.save()
									await account.save()
									parsingSameCount = 0
								} else {
									//console.log("already parsed at skip: ", currentSkip)
									// We already parsed it somewhere, so we can assume the next
									// items will be also parsed
									if (!perform_full_parse_now)
										parsingSameCount++
								}

							} else {
								//console.info("Odchozi")
							}
						} else {
							console.debug("errorous:", item.notes)
						}

					}

					if (responseJson.loadMore) {
						currentSkip += items.length
					} else {
						parsingSameCount = 50;
						console.log("No more! At", currentSkip)
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
	console.log("Finished.")
	console.log()
}
createConnection().then(() => {
	main()

	const minutes = 60

	setInterval(main, minutes * 60 * 1000)
})
