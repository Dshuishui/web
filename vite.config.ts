import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import ElementPlus from 'unplugin-element-plus/vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
    ElementPlus({}),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  base: '/',
  server: {
    host: '0.0.0.0',
    // host: 'dev-zjic.zhejianglab.com', // 配置本地开发域名
    proxy: {
      '/apis': {
        target: 'http://10.15.16.100:30001',
        changeOrigin: true,
      },
      '/api/throughput': {
        target: 'http://127.0.0.1:30085',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/throughput/, '')
      },
    },
  },
  css: {
    // 预处理器配置项
    preprocessorOptions: {
      less: {
        math: 'always',
      },
    },
  },
});
