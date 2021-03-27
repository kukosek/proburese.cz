export interface CardData {
	id: number,
	author: string,
	authorId: number,
	amount: string,
	message: string,
	date: Date,
	score: Number,
	userScore: number
};

export interface DonatorData {
	id: number
	name: string,
	amountDonated: string
	donationCount: number,
	score: number
}

export interface UserScores {
	[score: number]: number
}
