import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Layout from '@/components/Layout'
import RuleValidate from '@/components/RuleValidate'
import Home from '@/components/Home'
import Home1 from '@/components/Home1'
import Home2 from '@/components/Home2'
import Echarts from '@/components/Echarts'
import Echarts1 from '@/components/Echarts1'
import Echarts2 from '@/components/Echarts2'
import Select from '@/components/Select'
import Tab from '@/components/Tab'
import Tvuex from '@/components/vuex'
import One from '@/components/one'
import Two from '@/components/two'
import websocket from '@/components/websocket'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld,
      children:[          
        {
          path:'/one',
          name:'One',
          component:One
        },
        {
          path:'/two',
          name:'Two',
          component:Two
        }]
    },
    {
      path: '/v',
      name: 'Tvuex',
      component: Tvuex
    },
    {
      path: '/websocket',
      name: 'websocket',
      component: websocket
    },
    {
      path: '/tab',
      name: 'Tab',
      component: Tab
    },
    {
      path: '/select',
      name: 'Select',
      component: Select
    },
    {
      path: '/home/:id',
      name: 'Home',
      component: Home
    },
    {
      path: '/home1',
      name: 'Home1',
      component: Home1
    },
    {
      path: '/home2',
      name: 'Home2',
      component: Home2
    },
    {
      path: '/echarts',
      name: 'Echarts',
      component: Echarts
    },
    {
      path: '/echarts1',
      name: 'Echarts1',
      component: Echarts1
    },
    {
      path: '/echarts2',
      name: 'Echarts2',
      component: Echarts2
    },
    {
      path: '/layout',
      name: 'Layout',
      component: Layout
    },
    {
      path: '/ruleValidate',
      name: 'RuleValidate',
      component: RuleValidate
    }
  ]
})
