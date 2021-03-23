interface KbItem {
	id: string, //	"361-20032021 1086 086151 100779"
	date: string, //	"22.&nbsp;3.&nbsp;2021"
	amount: string, // 	"0,01 CZK"
	symbols: string, // 	"0 / 0 / 0"
	notes: string // "Ing. Tomáš Nový<br />Příchozí platba<br />být tvým synem tak ti rozkopu rypák"
}

export interface KbResponse {
	loadMore: Boolean,
	items: KbItem[]
}
