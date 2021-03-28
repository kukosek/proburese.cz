<template>
  <div class="column">
    <div class="card">
      <div class="card-content" >
		<div class="columns is-vcentered is-desktop">
			<div class="column is-narrow card-header-title has-text-grey">
				<span class="has-text-weight-medium">celkem</span>
				{{ numberFormat.format(data.amountDonated) }} Kč
				<span class="has-text-weight-medium">od</span>
					<nuxt-link
					  :to="'/donator/'+data.id"
					  exact-active-class="is-active"
					>
						{{ data.name }}
					</nuxt-link>
				<span class="has-text-weight-medium">
				({{data.donationCount}} {{wordString}})
				</span>
				<span v-if="parseFloat(data.amountDonated) > 1000">
				(<a :href="hlidacUrl" target="_blank">Hlídač</a>)
				</span>
			</div>
			<div class="column"/>
			<div class="column is-narrow">
				<share
						:shareUrl="'https://proburese.cz/donator/'+data.id"
				/>
			</div>
		</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Prop, Watch, Component, Vue , Inject} from 'vue-property-decorator'
import {DonatorData} from '~/assets/ts/interfaces'
import gql from 'graphql-tag'
import Share from "~/components/Share.vue"




@Component({
	components: {
		Share
	}
})
export default class DonatorCard extends Vue{
	@Prop(Object) data!: DonatorData;

	get wordString() {
		const count = this.data.donationCount
		if (count <= 0) {
			return "příspěvků"
		} else if (count == 1) {
			return "příspěvek"
		} else if (count >= 2 && count <= 4) {
			return "příspěvky"
		} else {
			return "příspěvků"
		}
	}

	get hlidacUrl() {
		return "https://www.hlidacstatu.cz/hledat?q="+this.data.name.split(' ').join('+')
	}

	private numberFormat = new Intl.NumberFormat('cs-CZ')

	get authorized() {
		return this.$store.state.authorized
	}
}
</script>
