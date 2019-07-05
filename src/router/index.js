import Vue from 'vue'
import Router from 'vue-router'

const search = resolve => require.ensure([],() => resolve(require('../view/search/index')),'search')
const oneMap = resolve => require.ensure([],() => resolve(require('../view/oneMap/index')),'oneMap')
const oneMap1 = resolve => require.ensure([],() => resolve(require('../view/oneMap/index625')),'index625')
const DataKanbanList = resolve => require.ensure([],() => resolve(require('../view/dataKanban/list')),'dataKanbanList')
const Dashboard = resolve => require.ensure([],() => resolve(require('../view/dataKanban/dashboard')),'dashboard')
const ProjectComparison = resolve => require.ensure([],() => resolve(require('../view/dataKanban/projectComparison')),'projectComparison')
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
    },{
      path: '/dataKanbanList',
      name: 'DataKanbanList',
      component: DataKanbanList
    },{
      path: '/dashboard',
      name: 'Dashboard',
      component: Dashboard
    },{
      path: '/projectComparison',
      name: 'ProjectComparison',
      component: ProjectComparison
    }
  ]
})
