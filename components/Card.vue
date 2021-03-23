<template>
  <div class="column">
    <div class="card">
      <div class="card-content" >
		<div class="columns is-vcentered is-desktop">
			<p class="column is-narrow card-header-title has-text-grey"> {{ data.amount }} kč od {{ data.author }}
			</p>
			<div v-html="data.message" v-linkified class="column ">
			</div>

			<div class="column is-narrow is-flex is-flex-direction-column is-align-items-center has-text-grey m-0 p-0">
				<b-field class="m-0">
					<b-checkbox-button size="is-small" v-model="checkboxGroup"
						native-value="dislike"
						type="is-danger">
						<b-icon icon="thumb-down-outline"></b-icon>
					</b-checkbox-button>

					<b-checkbox-button size="is-small" v-model="checkboxGroup"
						native-value="like"
						type="is-success">
						<b-icon icon="thumb-up-outline"></b-icon>
					</b-checkbox-button>
				</b-field>
				<div v-if="data.score != 0">{{ data.score }}</div>
			</div>
		</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Prop, Watch, Component, Vue , Inject} from 'vue-property-decorator'
import {CardData, UserScores} from '~/assets/ts/interfaces'
import gql from 'graphql-tag'


const LIKE_MUTATION = gql`
mutation(
		$id: ID!,
		$userScore: Float,
) {
	mutateDonate(data: {id: $id, userScore: $userScore}) {
		id
		author
		amount
		message
		date
		score
	}
}
`



@Component({
})
export default class Card extends Vue{
	@Prop(Object) data!: CardData;
	private checkboxGroup: string[] = []
	private lastCheckboxGroup: string[] = []

	private isMobile = false

	private userScore = 0



	@Watch('checkboxGroup')
	onCheckboxGroupChanged(value: string[]) : void {
		const lastLike : boolean = this.lastCheckboxGroup.includes("like")
		const lastDislike : boolean = this.lastCheckboxGroup.includes("dislike")
		let like = value.includes("like")
		let dislike = value.includes("dislike")
		if (like && lastDislike) {
			this.checkboxGroup.splice(this.checkboxGroup.indexOf("dislike"), 1)
		}
		else if (dislike && lastLike) {
			this.checkboxGroup.splice(this.checkboxGroup.indexOf("like"), 1)
		}

		like = this.checkboxGroup.includes("like")
		dislike = this.checkboxGroup.includes("dislike")

		if (like) {
			this.userScore = 1
		} else if (dislike) {
			this.userScore = -1
		} else {
			this.userScore = 0
		}

		this.lastCheckboxGroup = this.checkboxGroup;
	}

	@Watch('data')
	onDataChanged(value: CardData) : void {
	}

	@Watch('userScore')
	onUserScoreChanged(value: number, oldValue: number) : void {
		const savedString = localStorage.getItem("likes")

		var saved : UserScores = {}
		if (savedString != null) {
			saved = JSON.parse(savedString)
		}
		saved[this.data.id] = value

		localStorage.setItem("likes", JSON.stringify(saved))

		const scoreDelta =value-oldValue
		this.$apollo.mutate({
			mutation: LIKE_MUTATION,
			variables: {
				id: this.data.id,
				userScore: scoreDelta
			}
		})

		}

}
</script>
