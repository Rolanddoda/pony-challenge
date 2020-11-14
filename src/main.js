import Vue from 'vue'
import './plugins/axios'
import App from './App.vue'
import store from './store'
import vuetify from './plugins/vuetify'
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import '@mdi/font/css/materialdesignicons.css'
import { runBetOnInitialRender } from '@/functionalities/bet'

runBetOnInitialRender()

Vue.config.productionTip = false

new Vue({
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
