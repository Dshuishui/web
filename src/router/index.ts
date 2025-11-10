import { RouteRecordRaw, createRouter, createWebHistory } from 'vue-router';
/** Layout */
import Layout from '@/layout/Index.vue';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'default',
    // hidden: true,
    // 重定向到 /serverless，它会进一步重定向到 /serverless/index/functions
    redirect: '/serverless', 
  },
  {
    path: '/serverless',
    component: Layout,
    // 将重定向指向新的默认子页面
    redirect: '/serverless/index/functions', 
    meta: {title: '无服务器计算', name: '/serverless'},
    children: [
      {
        // 这是父路由，路径是 /serverless/index
        path: 'index',
        // 这是我们修改为带 <router-view> 的父组件
        component: () =>
          import('@/views/application/ServerlessComputing.vue'),
        // 这个 meta 标题会用于侧边栏的父菜单
        meta: {title: '无服务器计算', name: '/serverless/index'},
        // 为 ServerlessComputing.vue 中的 <router-view> 添加子路由
        redirect: '/serverless/index/functions', // 默认显示函数管理
        children: [
          {
            // 路径: /serverless/index/functions
            path: 'functions',
            name: 'FunctionManagement',
            component: () => import('@/views/application/serverless/FunctionManagement.vue'),
            // 这个 meta 标题会用于侧边栏子菜单和面包屑
            meta: { title: '函数管理' }
          },
          {
            // 路径: /serverless/index/performance
            path: 'performance',
            name: 'PerformanceEvaluation',
            component: () => import('@/views/application/serverless/PerformanceEvaluation.vue'),
            meta: { title: '性能评估' }
          },
          {
            // 路径: /serverless/index/achievements
            path: 'achievements',
            name: 'ProjectAchievements',
            component: () => import('@/views/application/serverless/ProjectAchievements.vue'),
            meta: { title: '项目成果' }
          }
        ]
      }
    ]
  },
  {
    // (修正了您原始代码中的 /44)
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