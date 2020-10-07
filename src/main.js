import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import VueScrollTo from 'vue-scrollto'

Vue.config.productionTip = false

Vue.use(VueScrollTo)

new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')
