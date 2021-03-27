import Vue from 'vue'
import VueCookies from 'vue-cookies'
import linkify from 'vue-linkify'
import VueClipboard from 'vue-clipboard2'


Vue.directive('linkified', linkify)
Vue.use(VueCookies)
Vue.use(VueClipboard)
