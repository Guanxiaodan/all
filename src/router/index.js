/* eslint-disable import/extensions */
import Vue from 'vue';
import Router from 'vue-router';
import Hello from '@/components/Hello';
import login from '@/pages/login';
import authorize from '@/pages/authorize';
import logs from '@/pages/logs';
import choose from '@/pages/choose';
import change from '@/pages/changePassword';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/hello',
      name: 'Hello',
      component: Hello,
    },
    {
      path: '/',
      name: 'login',
      component: login,
    },
    {
      path: '/authorize',
      name: 'authorize',
      component: authorize,
    },
    {
      path: '/logs',
      name: 'logs',
      component: logs,
    },
    {
      path: '/choose',
      name: 'choose',
      component: choose,
    },
    {
      path: '/change',
      name: 'change',
      component: change,
    },
  ],
});
