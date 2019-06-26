import Vue from 'vue'
import Router from 'vue-router'

const search = resolve => require.ensure([],() => resolve(require('../view/search/index')),'search') 
const oneMap = resolve => require.ensure([],() => resolve(require('../view/oneMap/index')),'oneMap') 

const oneMap1 = resolve => require.ensure([],() => resolve(require('../view/oneMap/index625')),'index625') 

Vue.use(Router)

export default new Router({
  // mode:'history',//去掉路由的#
  routes: [
    {
      path: '/',
      name: 'search',
      component: search
    },
    {
      path: '/search',
      name: 'search',
      component: search
    },
    {
      path: '/oneMap',
      name: 'oneMap',
      component: oneMap
    },{
      path: '/oneMap1',
      name: 'oneMap1',
      component: oneMap1
    }
  ]
})
