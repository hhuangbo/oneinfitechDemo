import Vue from 'vue'
import Router from 'vue-router'

const login = resolve => require.ensure([],() => resolve(require('../view/login/login')),'login') 
const oneMap = resolve => require.ensure([],() => resolve(require('../view/oneMap/index')),'oneMap') 
const demo = resolve => require.ensure([],() => resolve(require('../view/oneMap/demo')),'demo') 

Vue.use(Router)

export default new Router({
  mode:'history',//去掉路由的#
  routes: [
    {
      path: '/',
      name: 'login',
      component: login
    },
    {
      path: '/login',
      name: 'login',
      component: login
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
  ]
})
