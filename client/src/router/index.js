import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import City from '@/components/City'
import Restaurant from '@/components/Restaurant'
import Login from '@/components/Login'
import Logout from '@/components/Logout'
import User from '@/components/User'
import About from '@/components/About'
import Test from '@/components/Test'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path:'/about',
      name: 'About',
      component: About
    },
    {
      path: '/city/:citiesId',
      name: 'City',
      component: City
    },
    {
      path: '/restaurant/:restaurantsId',
      name: 'Restaurant',
      component: Restaurant
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/logout',
      name: 'Logout',
      component: Logout
    },
    {
      path: '/user/:username',
      name: 'User',
      component: User
    },
    {
      path: '/test',
      name: 'test',
      component: Test
    }
  ]
})
