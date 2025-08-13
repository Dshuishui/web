import { createApp } from 'vue';
import App from './App.vue';
import router from './router/index';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';
import 'element-plus/dist/index.css';
import '@/utils/flexible.js';

import 'normalize.css';
import '@/styles/common.less';
import '@/styles/index.less'; // global css
import { createPinia } from 'pinia';
import piniaPersist from 'pinia-plugin-persist';


const app = createApp(App);
const pinia = createPinia();
pinia.use(piniaPersist);


for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}
app.use(router);
app.use(pinia);
app.mount('#app');

