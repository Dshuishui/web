
Copy

<template>
  <div class="app-container">
    <main class="main-content">
      <router-view />
    </main>
    <Footer />
  </div>
</template>

<script lang="ts" setup>
import Footer from './components/Footer.vue';
</script>

<style lang="less" scoped>
.app-container {
  min-height: 100vh;
  background-color: #F5F7FA;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  padding: 20px;
  width: 90%; // 默认90%宽度
  margin: 0 auto;
  box-sizing: border-box;
  
  // 响应式设计：在不同屏幕尺寸下调整宽度
  @media (max-width: 768px) {
    width: 95%; // 小屏幕使用95%宽度
    padding: 15px;
  }
  
  @media (max-width: 480px) {
    width: 98%; // 手机屏幕使用98%宽度
    padding: 10px;
  }
  
  @media (min-width: 1920px) {
    width: 85%; // 大屏幕使用85%宽度，避免内容过于分散
  }
}
</style>