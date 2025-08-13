<script setup lang="ts">
import { ElConfigProvider } from 'element-plus';
//@ts-ignore
import zhCn from 'element-plus/dist/locale/zh-cn.mjs';

</script>

<template>
  <ElConfigProvider :locale="zhCn">
    <router-view></router-view>
  </ElConfigProvider>
</template>

<style scoped>
html,
body {
  margin: 0;
  height: 100%;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
