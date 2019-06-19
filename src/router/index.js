import Vue from 'vue'
import Router from 'vue-router'

const search = resolve => require.ensure([],() => resolve(require('../view/search/index')),'search') 
const oneMap = resolve => require.ensure([],() => resolve(require('../view/oneMap/index')),'oneMap') 

const demo = resolve => require.ensure([],() => resolve(require('../view/oneMap/demo')),'demo') 
// const demo2 = resolve => require.ensure([],() => resolve(require('../view/oneMap/demo2')),'demo2') 

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
      path: '/demo',
      name: 'demo',
      component: demo
    }
    // ,{
    //   path: '/demo2',
    //   name: 'demo2',
    //   component: demo2
    // }
  ]
})
