import { RouteRecordRaw, createRouter, createWebHistory } from 'vue-router';
/** Layout */
import Layout from '@/layout/Index.vue';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'default',
    // hidden: true,
    redirect: '/serverless', // 直接重定向到无服务器计算页面
  },
  {
    path: '/serverless',
    component: Layout,
    redirect: '/serverless/index',
    meta: {title: '无服务器计算', name: '/serverless'},
    children: [
      {
        path: 'index',
        component: () =>
          import('@/views/application/ServerlessComputing.vue'),
        meta: {title: '无服务器计算', name: '/serverless/index'},
      }
    ]
  },
  {
    path: '/404',
    redirect: '/404',
    // hidden: true,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;