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
    </nav>

    <section class="main-content columns">
      <aside class="column is-2 section">
		<p>
		Shromažďujeme ty nejlepší haléřové vzkazy pro Andyho.
		</p>

		<p>
		Pošlete taky něco pěkného na účet
		<a href="https://www.kb.cz/cs/transparentni-ucty/4090453">
			 4090453/0100
		</a> :)
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

<script>
export default {
  data () {
    return {
      items: [
        {
          title: 'Vzkazy',
          icon: 'home',
          to: { name: 'index' }
        },
        {
          title: 'O stránce',
          icon: 'information',
          to: { name: 'about' }
        }
      ]
    }
  }
}
</script>
