export default {
	// Global page headers: https://go.nuxtjs.dev/config-head
	head: {
		title: 'Probureše: Crowd-unfunding ANO 2021',
		htmlAttrs: {
			lang: 'en'
		},
		meta: [
			{charset: 'utf-8'},
			{name: 'viewport', content: 'width=device-width, initial-scale=1'},
			{
				hid: 'description', name: 'description',
				content:
					"Toto je první, největší, a nejlepší crowd-unfunding v dějinách česka." +
					" Pošlete haléř a oni zaplatí 6 kč transakční poplatek :)" +
					" S láskou, pro Bureše."
			}
		],
		link: [
			{rel: 'icon', type: 'image/x-icon', href: '/favicon.ico'},
			{rel: 'icon', type: 'image/png', href: '/favicon-16x16.png'},
			{rel: 'icon', type: 'image/png', href: '/favicon-32x32.png'},
			{rel: 'icon', type: 'image/png', href: '/apple-touch-icon.png'},
			{rel: 'manifest', href: '/site.webmanifest'}
		]
	},

	// Global CSS: https://go.nuxtjs.dev/config-css
	css: [
		'@/assets/scss/main.scss'
	],

	// Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
	plugins: [
		"~/plugins/directives.js"
	],

	// Auto import components: https://go.nuxtjs.dev/config-components
	components: true,

	// Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
	buildModules: [
		// https://go.nuxtjs.dev/typescript
		'@nuxt/typescript-build'
	],

	// Modules: https://go.nuxtjs.dev/config-modules
	modules: [
		// https://go.nuxtjs.dev/buefy
		'nuxt-buefy',
		'@nuxtjs/apollo',
	],
	buefy: {
		/* buefy options */
		materialDesignIcons: true,
		css: false
	},
	apollo: {
		clientConfigs: {
			default: {
				httpEndpoint: 'http://localhost:4000/graphql',
			}
		}
	},

	// Build Configuration: https://go.nuxtjs.dev/config-build
	build: {
	}
}