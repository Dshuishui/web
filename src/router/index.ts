import { RouteRecordRaw, createRouter, createWebHistory } from 'vue-router';
/** Layout */
import Layout from '@/layout/Index.vue';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'default',
    // component: () => import('@/views/login/Login.vue'),
    // @ts-ignore
    hidden: true,
    redirect: '/app/list',
  },
  {
    path: '/test',
    component: Layout,
    redirect: '/test/empty',
    meta: {title: '其他', name: '/test'},
    children: [
      {
        path: 'empty',
        component: () =>
          import('@/views/application/Empty.vue'),
        meta: {title: '缺省页', name: '/test'},
      },
    ]
  },
  {
    path: '/test1',
    component: Layout,
    redirect: '/test1/dialog',
    meta: {title: '对话框', name: '/test1'},
    children: [
      {
        path: 'dialog',
        component: () =>
          import('@/views/application/DialogIndex.vue'),
        meta: {title: '对话框', name: '/test1'},
      },
    ]
  },
  {
    path: '/app',
    component: Layout,
    redirect: '/app/list',
    meta: {title: '示例', name: '/app'},
    children: [
      {
        path: 'list',
        component: () =>
          import('@/views/application/Index.vue'),
        meta: {title: '表格', name: '/app/list'},
      },
      {
        path: 'edit',
        component: () =>
          import('@/views/application/Modify.vue'),
        meta: {title: '编辑', name: '/app/edit'},
      },
      {
        path: 'create',
        component: () =>
          import('@/views/application/Modify.vue'),
        meta: {title: '新建', name: '/app/create'},
      },
      {
        path: 'tabs',
        component: () =>
          import('@/views/application/TabsIndex.vue'),
        meta: {title: '标签页', name: '/app/tabs'},
      },
      {
        path: 'form',
        component: () =>
          import('@/views/application/Modify.vue'),
        meta: {title: '表单', name: '/app/form'},
      },
      {
        path: 'serverless',
        component: () =>
          import('@/views/application/ServerlessComputing.vue'),
        meta: {title: '无服务器计算', name: '/app/serverless'},
      }
    ]
  },
  {
    path: '/404',
    redirect: '/404',
    // @ts-ignore
    hidden: true,
  },
];

const router = createRouter({
  history: createWebHistory(), // url中不带"#"
  routes,
});

export default router;