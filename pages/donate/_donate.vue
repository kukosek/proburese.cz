<template>
	<section class="section">
		<card
		:data="donate"
		:inputUserScore="donate.userScore"
		>
		</card>
  </section>
</template>

<script lang="ts">
import Card from '~/components/Card.vue'
import {CardData, UserScores} from '~/assets/ts/interfaces'
import { Prop, Watch, Component, Vue , Inject} from 'vue-property-decorator'
import ApolloClient from 'apollo-boost';
import gql from 'graphql-tag'
import { SortType } from "~/server-middleware/types/Sort"

const DONATES_QUERY = gql`
query($id: Float!) {
	donate(id: $id) {
		id
		author
		authorId
		amount
		message
		date
		score
		userScore
	}
}
`


@Component<Donate>({
	components: {
		Card
	},
	apollo: {
		donate: {
			query: DONATES_QUERY,
			variables: {
				id: 0
			},
			prefetch: true,
		}

	}
})


export default class Donate extends Vue {
	private donate!: CardData

	private id = 0

	created() {
		const id = parseInt(this.$route.params.donate)
		this.id = id
		this.$apollo.queries.donate.setVariables({id: id})
		if (process.server) {
			this.$apollo.queries.donate.refetch()
		}
	}

	private hasMore = true

	mounted() {
		this.$nuxt.$on('force-refetch', () => {
			this.$apollo.queries.donate.refetch()
		})
	}
	beforeDestroy(){
		this.$nuxt.$off('force-refetch')
	}
}
</script>
