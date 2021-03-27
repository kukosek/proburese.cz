<template>
	<section class="section">
		<h2 class="title is-3 has-text-grey">
		Přehled přispěvatelů na transparentní účet ANO
		</h2>
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
	<b-progress v-if="$apollo.queries.donators.loading" type="is-primary" size="is-small"></b-progress>
    <div class="is-mobile">

		<donator-card
		v-for="item in donators"
		v-bind:key="item.id"
		:data="item"
		>
		</donator-card>

    </div>
  </section>
</template>

<script lang="ts">
import DonatorCard from '~/components/DonatorCard.vue'
import {DonatorData} from '~/assets/ts/interfaces'
import { Prop, Watch, Component, Vue , Inject} from 'vue-property-decorator'
import ApolloClient from 'apollo-boost';
import gql from 'graphql-tag'
import { DonatorSortType as SortType} from "~/server-middleware/types/Sort"

interface Sort {
	value: SortType,
	icon: string,
	text: string
}

const DONATORS_QUERY = gql`
query($skip: Float,
	  $take: Float,
	  $search: String,
	  $sortBy: DonatorsSortType

) {
	donators(skip: $skip, take: $take, search: $search, sortBy: $sortBy) {
		id
		name
		amountDonated
		donationCount
		score
	}
}
`

const take = 25;

@Component({
	components: {
		DonatorCard
	},
	apollo: {
		donators: {
			query: DONATORS_QUERY,
			variables: {
				skip: 0,
				take: take,
				search: "",
				sortBy: SortType.AMOUNT
			},
			prefetch: true

		}
	}
})


export default class Index extends Vue {
	private donators: DonatorData[] = [
	]

	private name: string = 'HomePage'
	private sorts: Sort[]  =  [
		{ value: SortType.AMOUNT, icon: 'currency-usd', text: 'Celkově zasláno' },
		{ value: SortType.COUNT, icon: 'account-details', text: 'Počet zaslaných' },
		{ value: SortType.LIKES, icon: 'thumbs-up-down', text: 'Počet liků' },
	]
	private currentSort: Sort = this.sorts[0]
	private searchString: string = ""
	private loadingIsFullPage : Boolean = false

	private page = 0



	@Watch('searchString')
	@Watch('currentSort')
	triggerSearch(value: string) : void {
		this.hasMore = true
		this.donators = []
		this.$apollo.queries.donators.setVariables({
			search: this.searchString,
			sortBy: this.currentSort.value.toString()
		})
		this.$apollo.queries.donators.refresh()
	}

	private hasMore = true

	mounted() {
		window.onscroll = () => {
			if (this.hasMore) {
				let distFromBottom = document.documentElement.offsetHeight - document.documentElement.scrollTop - window.innerHeight
				if (distFromBottom < 800 && !this.$apollo.queries.donators.loading) {
					this.$apollo.queries.donators.fetchMore({
						variables: { skip: this.donators.length + take*this.page },
						updateQuery: (previousResult, { fetchMoreResult }) => {
							if (fetchMoreResult.donators.length == 0 ) {
								this.hasMore = false
							}
							return {
								__typename: previousResult.__typename,
								donators: [...previousResult.donators, ...fetchMoreResult.donators ]
							}
						}
					})
				}
			}
		}
		this.$nuxt.$on('force-refetch', () => {
			this.$apollo.queries.donators.refetch()
		})
	}
	beforeDestroy(){
		this.$nuxt.$off('force-refetch')
	}




}
</script>
