<template>
  <div class="column">
    <div class="card">
      <div class="card-content" >
		<div class="columns is-vcentered is-desktop">
			<p class="column is-narrow card-header-title has-text-grey">
				{{ numberFormat.format(data.amount) }} Kč od
					<nuxt-link
					  :to="'/donator/'+data.authorId"
					  exact-active-class="is-active"
					>
						{{ data.author }}
					</nuxt-link>
			</p>
			<div v-html="data.message" v-linkified class="column ">
			</div>


			<div class="column is-narrow is-flex is-flex-direction-column is-align-items-center has-text-grey m-0 p-0">
				<b-field class="m-0">
			<b-button
				tag="a"
				type="is-text"
				v-clipboard:copy="shareUrl"
				v-clipboard:success="copySuccess"
				v-clipboard:error="copyError"
				size="is-small"
				icon-right="content-copy"
			/>
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
		authorId
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
	@Prop(Number) inputUserScore!: number
	private checkboxGroup: string[] = []
	private lastCheckboxGroup: string[] = []

	private isMobile = false

	private userScore = 0

	private ignoreNext = false

	private numberFormat = new Intl.NumberFormat('cs-CZ')

	get shareUrl() {
		return "http://proburese.cz/donate/"+ this.data.id
	}

	@Watch('checkboxGroup')
	onCheckboxGroupChanged(value: string[]) : void {
		if (this.authorized && this.changedByUser) {
			if (!this.ignoreNext) {
				const lastLike : boolean = this.lastCheckboxGroup.includes("like")
				const lastDislike : boolean = this.lastCheckboxGroup.includes("dislike")
				let like = value.includes("like")
				let dislike = value.includes("dislike")
				this.changedByUser = false
				if (like && lastDislike) {
					this.ignoreNext = true
					this.checkboxGroup.splice(this.checkboxGroup.indexOf("dislike"), 1)
				}
				else if (dislike && lastLike) {
					this.ignoreNext = true
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
				this.onUserScoreChanged(this.userScore)
				this.changedByUser = true
			} else this.ignoreNext = false

		} else if (this.changedByUser) {
			this.$nuxt.$emit('pls-login')
			if (this.checkboxGroup.length > 0) {
				this.checkboxGroup = []
			}
		} else {
			this.changedByUser = true
		}

		this.lastCheckboxGroup = this.checkboxGroup;
	}

	private changedByUser = true

	onUserScoreChanged(value: number) : void {
			this.$apollo.mutate({
				mutation: LIKE_MUTATION,
				variables: {
					id: this.data.id,
					userScore: value
				}
			})
	}


	@Watch("inputUserScore")
	setupByInputUserScore() {
		this.changedByUser = false
		if (this.inputUserScore == 1) {
			this.checkboxGroup = ["like"]
		}
		else if (this.inputUserScore == -1) {
			this.checkboxGroup = ["dislike"]
		}else {
			this.checkboxGroup = []
		}
	}
	mounted() {
		this.setupByInputUserScore()
	}
	get authorized() {
		return this.$store.state.authorized
	}
	copySuccess() {
		this.$buefy.toast.open({
			message: 'Odkaz na položku byl zkopírován do schránky',
			type: 'is-success'
		})
	}

	copyError() {
		this.$buefy.dialog.prompt({
			message: `Zkopírujte si odkaz.`,
			inputAttrs: {
				value: this.shareUrl,
				placeholder: 'Oh, tys to smazal!',
				maxlength: 50
			},
			trapFocus: true,
		})
	}
}
</script>
