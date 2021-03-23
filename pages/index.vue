<template> <section class="section">
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
	  $sortBy: SortType

) {
	donates(skip: $skip, take: $take, search: $search, sortBy: $sortBy) {
		id
		author
		amount
		message
		date
		score
	}
}
`

const take = 25;

@Component({
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
				sortBy: "HOT"
			},
			prefetch: true

		}
	}
})


export default class Index extends Vue {
	private donates: CardData[] = [
	]

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



	@Watch('searchString')
	@Watch('currentSort')
	triggerSearch(value: string) : void {
		this.donates = []
		this.$apollo.queries.donates.setVariables({
			search: this.searchString,
			sortBy: this.currentSort.value.toString()
		})
		this.$apollo.queries.donates.refresh()
	}


	mounted() {
		window.onscroll = () => {
			let distFromBottom = document.documentElement.offsetHeight - document.documentElement.scrollTop - window.innerHeight
			if (distFromBottom < 800 && !this.$apollo.queries.donates.loading) {
				this.$apollo.queries.donates.fetchMore({
					variables: { skip: this.donates.length + take*this.page },
					updateQuery: (previousResult, { fetchMoreResult }) => {
						return {
							__typename: previousResult.__typename,
							donates: [...previousResult.donates, ...fetchMoreResult.donates ]
						}
					}
				})
			}
		};
	}


}
</script>
