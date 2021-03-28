<template>
  <div>
    <nav
      class="navbar header has-shadow is-primary"
      role="navigation"
      aria-label="main navigation"
    >
      <div class="navbar-brand">
        <a
          class="navbar-item"
          href="/"
        >
		  probureše.cz
        </a>

      </div>
	  <div class="navbar-end">
		  <div class="navbar-item">
			  <a
			  v-if="!authorized"
			  class="button is-light"
			  @click="isComponentModalActive = true"
			  >
				Log in
			  </a>
		  </div>

		  <div v-if="authorized" class="navbar-item">
			  <span>{{me.displayName}}</span>
		  </div>
		  <div v-if="authorized" class="navbar-item">
			  <b-button @click="logout()" size="is-small">Odhlásit se</b-button>
		  </div>
	  </div>
	  <b-modal
            v-model="isComponentModalActive"
            has-modal-card
            trap-focus
            :destroy-on-hide="false"
            aria-role="dialog"
            aria-label="Example Modal"
            aria-modal>
				<form action="">
					<div class="modal-card" style="width: auto">
						<header class="modal-card-head">
							<p class="modal-card-title">Login</p>
							<button
								type="button"
								class="delete"
								@click="isComponentModalActive = false"/>
						</header>
						<section class="modal-card-body">

							<p>
							<b-button
								tag="a"
								href="/api/auth/facebook"
								icon-left="facebook"
								class="button has-text-centered is-link">
							Přihlásit se přes Facebook</b-button>
							</p>

						</section>
						<footer class="modal-card-foot">
						</footer>
					</div>
				</form>
        </b-modal>
    </nav>

    <section class="main-content columns">
      <aside class="column is-2 section">
		<p>
		Shromažďujeme ty nejlepší haléřové vzkazy pro Andyho.
		</p>

		<p>
		Pošlete taky něco pěkného na účet
		<a href="https://www.kb.cz/cs/transparentni-ucty/4090453" target="_blank">
			 4090453/0100
		</a> nebo <a href="https://www.kb.cz/cs/transparentni-ucty/4070217" target="_blank">4070217/0100</a> :)
		</p>
		<br>
        <p class="menu-label is-hidden-touch">
          General
        </p>
        <ul class="menu-list">
          <li
            v-for="(item, key) of items"
            :key="key"
          >
            <nuxt-link
              :to="item.to"
              exact-active-class="is-active"
            >
              <b-icon :icon="item.icon" /> {{ item.title }}
            </nuxt-link>
          </li>
        </ul>
      </aside>

      <div class="container column is-10">
        <nuxt />
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import { Prop, Watch, Component, Vue , Inject} from 'vue-property-decorator'
import  gql  from "graphql-tag"
import { BuresUser  } from "~/server-middleware/entity/User"

const ME_QUERY = gql`
query {
	me {
		displayName
	}
}
`
const LOGOUT_MUTATION = gql`
mutation {
	logout {
		displayName
	}
}
`

interface MeQuery {
	displayName: string
}


@Component({
	apollo: {
		me: {
			query: ME_QUERY,
			prefetch: false
		}
	}
})
export default class Default extends Vue {
	private me: BuresUser | undefined
	private isComponentModalActive  = false
    private items = [
		{
			title: 'Vzkazy',
			icon: 'home',
			to: { name: 'index' }
		},
		{
			title: 'Real Lovers',
			icon: 'cash-100',
			to: { name: 'donators' }
		},
		{
			title: 'O stránce',
			icon: 'information',
			to: { name: 'about' }
		}
	]

	get authorized() {
		return this.$store.state.authorized
	}

	@Watch("me")
	onCurrentUserChanged() {
		const authorized = Boolean(this.me?.displayName )
		if (authorized) {
			this.$nuxt.$emit('force-refetch')
		}
		this.$store.commit("authorized", authorized)
	}

	logout() {
		this.$apollo.mutate({ mutation: LOGOUT_MUTATION}).then((fetchResult) => {
			this.$store.commit("authorized", fetchResult?.data.displayName)
			this.$nuxt.$emit('force-refetch')
		})
	}
	created() {
		this.$nuxt.$on('pls-login', () => {
			this.isComponentModalActive = true
		})
	}
	beforeDestroy(){
		this.$nuxt.$off('pls-login')
	}
}
</script>
