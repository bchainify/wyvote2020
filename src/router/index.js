import Vue from 'vue'
import Router from 'vue-router'

import Timeline from '@/components/Timeline'
import Create from '@/components/Create'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Timeline',
      component: Timeline
    },
    {
      path: '/create',
      name: 'Create',
      component: Create
    }
  ]
})