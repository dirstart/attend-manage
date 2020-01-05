import Vue from 'vue'
import Router from 'vue-router'
import Layout from '@/views/layout';

const _import = require('./_import_' + process.env.NODE_ENV);

Vue.use(Router)

export const constantRouterMap = [
  { path: '/login', component: _import('login/index'), hidden: true },
  { path: '/authredirect', component: _import('login/authredirect'), hidden: true },
  { path: '/404', component: _import('errorPage/404'), hidden: true },
  { path: '/401', component: _import('errorPage/401'), hidden: true },
  { path: '/_empty', component: null },
  {
    path: '',
    component: Layout,
    redirect: 'homepage',
    children: [{
      path: 'icon',
      component: _import('svg-icons/index'),
      name: 'icons',
      meta: {
        title: '图标库'
      }
    }, {
      path: '/homepage',
      component: _import('homepage/index'),
      name: 'homepage',
      meta: {
        title: '首页'
      }
    }, {
      path: '/person',
      component: _import('statistic/person/index'),
      name: 'person',
      meta: {
        title: '个人统计'
      }
    }, {
      path: '/depart',
      component: _import('statistic/depart/index'),
      name: 'depart',
      meta: {
        title: '部门统计'
      }
    }]
  }
];
export default new Router({
  routes: constantRouterMap
})
