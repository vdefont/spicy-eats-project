// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import App from './App'
import router from './router'

Vue.config.productionTip = false

// Set up vuex store (to store states)
Vue.use(Vuex)
const store = new Vuex.Store({
  state: {
    username: null,
    city: {
      id: '',
      name: ''
    },
    lastRoute: null // Useful for login page to redirect
  },
  mutations: {
    username: function (state, username) {
      state.username = username
    },
    city: function (state, city) {
      state.city = city
    },
    deleteCity: function (state) {
      state.city = {
        id: '',
        name: ''
      }
    }
  }
})

// Global methods
Vue.mixin({
  methods: {
    // helloWorld -> Hello World
    camelCaseToLabel: function (propName) {
      var label = ''
      for (var i in propName) {
        var curChar = propName[i]
        // eslint-disable-next-line
        if (i == 0) {
          label += curChar.toUpperCase()
        } else if (curChar >= 'A' && curChar <= 'Z') {
          label += ' ' + curChar
        } else {
          label += curChar
        }
      }
      return label
    }
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>',
  store
})
