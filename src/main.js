import Vue from 'vue'
import App from './App.vue'
import data from './components/cities.js'

// Object.defineProperty(Vue.prototype, '$cities', { value: data.cities });

new Vue({
  el: '#app',
  render: h => h(App)
})
