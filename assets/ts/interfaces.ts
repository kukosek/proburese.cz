export interface CardData {
	id: number,
	author: string,
	amount: string,
	message: string,
	date: Date,
	score: Number,
	userScore: number
};

export interface UserScores {
	[score: number]: number
}
