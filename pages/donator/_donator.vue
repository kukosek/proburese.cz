<template>
	<section class="section">
	<div class="level">
		<div class="level-left">
			<h2 class="level-item title is-3 has-text-grey">
				{{ donator.name }}
			</h2>
			<span class="level-item" v-if="parseFloat(donator.amountDonated) > 1000">
				(<a :href="hlidacUrl" target="_blank">Hlídač</a>)
			</span>
		</div>
		<div class="level-right">
			<share class="level-item"
					:shareUrl="'https://proburese.cz/donator/'+id"
			/>
		</div>
	</div>
	<nav class="level">
	  <div class="level-item has-text-centered">
		<div>
		  <p class="heading">Celkově zasláno</p>
		  <p class="title">{{numberFormat.format(donator.amountDonated)}} Kč</p>
		</div>
	  </div>
	  <div class="level-item has-text-centered">
		<div>
		  <p class="heading">Počet příspěvků</p>
		  <p class="title">{{donator.donationCount}}</p>
		</div>
	  </div>
	  <div class="level-item has-text-centered">
		<div>
		  <p class="heading">Posbíráno lajků</p>
		  <p class="title">{{donator.score}}</p>
		</div>
	  </div>
	</nav>
	  <div class="columns">
		  <b-dropdown
			class="column"
			v-model="currentSort"
			aria-role="list"
		>
			<template #trigger>
				<b-button
					:label="currentSort.text"
					type="is-primary"
					:icon-left="currentSort.icon"
					icon-right="menu-down" />
			</template>


			<b-dropdown-item
				v-for="(menu, index) in sorts"
				:key="index"
				:value="menu" aria-role="listitem">
				<div class="media">
					<b-icon class="media-left" :icon="menu.icon"></b-icon>
					<div class="media-content">
						<h3>{{menu.text}}</h3>
					</div>
				</div>
			</b-dropdown-item>
		</b-dropdown>
		<b-field class="column is-narrow">
			<b-input placeholder="Hledat..."
				type="search"
				v-model="searchString"
				icon="magnify"
				icon-clickable
				@icon-click="triggerSearch">
			</b-input>
		</b-field>
	</div>
	<b-progress v-if="$apollo.queries.donates.loading" type="is-primary" size="is-small"></b-progress>
    <div class="is-mobile">

		<card
		v-for="item in donates"
		v-bind:key="item.id"
		:data="item"
		:inputUserScore="item.userScore"
		>
		</card>

    </div>
  </section>
</template>

<script lang="ts">
import Card from '~/components/Card.vue'
import {CardData, UserScores} from '~/assets/ts/interfaces'
import { Prop, Watch, Component, Vue , Inject} from 'vue-property-decorator'
import ApolloClient from 'apollo-boost';
import gql from 'graphql-tag'
import { SortType } from "~/server-middleware/types/Sort"

interface Sort {
	value: SortType,
	icon: string,
	text: string
}

const DONATES_QUERY = gql`
query($skip: Float,
	  $take: Float,
	  $search: String,
	  $sortBy: SortType,
	  $donatorId: Float

) {
	donates(skip: $skip, take: $take, search: $search, sortBy: $sortBy, donatorId: $donatorId) {
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

const DONATOR_QUERY = gql`
query($id: Float!) {
	donator(id: $id) {
		name,
		amountDonated,
		donationCount,
		score
	}
}
`

interface Donator {
	name: string,
	amountDonated: number,
	donationCount: number,
	score: number
}

const take = 25;

Component.registerHooks([
  'head',
])

@Component<Index>({
	components: {
		Card
	},
	apollo: {
		donates: {
			query: DONATES_QUERY,
			variables: {
				skip: 0,
				take: take,
				search: "",
				sortBy: "HOT",
				donatorId: null
			},
			prefetch: true,
		},

		donator: {
			query: DONATOR_QUERY,
			variables: {
				id: 0
			},
			prefetch: true,
		}

	}
})


export default class Index extends Vue {
	private donates: CardData[] = [
	]
	private donator: Donator = {name: "", amountDonated: 0, donationCount: 0, score: 0}

	private id = 0

	private name: string = 'HomePage'
	private sorts: Sort[]  =  [
		{ value: SortType.HOT, icon: 'trending-up', text: 'Žhavé' },
		{ value: SortType.NEWEST, icon: 'clock-outline', text: 'Nejnovější' },
		{ value: SortType.TOP, icon: 'arrow-up-thick', text: 'Nejlepší' },
	]
	private currentSort: Sort = this.sorts[0]
	private searchString: string = ""
	private loadingIsFullPage : Boolean = false

	private page = 0

	private numberFormat = new Intl.NumberFormat('cs-CZ')

	@Watch('searchString')
	@Watch('currentSort')
	triggerSearch(value: string) : void {
		this.hasMore = true
		const id = parseInt(this.$route.params.donator)
		this.donates = []
		this.$apollo.queries.donates.setVariables({
			search: this.searchString,
			sortBy: this.currentSort.value.toString(),
			donatorId: id
		})
		this.$apollo.queries.donates.refresh()
	}

	created() {
		const id = parseInt(this.$route.params.donator)
		this.id = id
		this.$apollo.queries.donates.setVariables({donatorId: id})
		this.$apollo.queries.donator.setVariables({id: id})
		if (process.server) {
			this.$apollo.queries.donates.refetch()
			this.$apollo.queries.donator.refetch()
		}
	}

	private hasMore = true

	head() {
		return {title:
			this.numberFormat.format(this.donator.amountDonated)
			+ " Kč pro Bureše od " + this.donator.name
		}
	}

	mounted() {
		window.onscroll = () => {
			if (this.hasMore) {
				let distFromBottom = document.documentElement.offsetHeight - document.documentElement.scrollTop - window.innerHeight
				if (distFromBottom < 800 && !this.$apollo.queries.donates.loading) {
					this.$apollo.queries.donates.fetchMore({
						variables: { skip: this.donates.length + take*this.page },
						updateQuery: (previousResult, { fetchMoreResult }) => {
							if (fetchMoreResult.donates.length == 0 ) {
								this.hasMore = false
							}
							return {
								__typename: previousResult.__typename,
								donates: [...previousResult.donates, ...fetchMoreResult.donates ]
							}
						}
					})
				}
			}
		}
		this.$nuxt.$on('force-refetch', () => {
			this.$apollo.queries.donates.refetch()
		})
	}
	beforeDestroy(){
		this.$nuxt.$off('force-refetch')
	}
	get hlidacUrl() {
		return "https://www.hlidacstatu.cz/hledat?q="+this.donator.name.split(' ').join('+')
	}




}
</script>
