export const state = () => ({
	authorized: false
})

export const mutations = {
	authorized(state, authorized) {
		state.authorized = authorized
	}
}

export const getters = {
	getAuthorized(state) {
		return state.authorized
	}
}
