import Vue from 'vue'
import VueCookies from 'vue-cookies'
import linkify from 'vue-linkify'


Vue.directive('linkified', linkify)
Vue.use(VueCookies)
