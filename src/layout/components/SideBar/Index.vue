<template>
<el-menu :unique-opened="true"
    :collapse-transition="false" :default-active="activeMenu()"
    :style="'height:' + mainHeight + 'px'" 
    mode="vertical" router class="common-menu">
    
    <el-sub-menu index="/serverless/index">
      <template #title>
        <i class="iconfont icon-menu icon-a-01-2zhisuanchihuaziyuanchi"></i>
        <span style="margin-left: 0px;">方舱无感子系统</span>
      </template>

      <el-menu-item index="/serverless/index/functions">
        函数管理
      </el-menu-item>
      <el-menu-item index="/serverless/index/performance">
        性能评估
      </el-menu-item>
      <el-menu-item index="/serverless/index/achievements">
        项目成果
      </el-menu-item>
    </el-sub-menu>

  </el-menu>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router';

const mainHeight = ref<number>(0)
const route = useRoute()

const calculateHeight = () => {
  mainHeight.value = window.innerHeight - 50
}

// 处理窗口大小变化的函数
const handleResize = () => {
  calculateHeight()
}

onMounted(() => {
  calculateHeight()
  // 监听窗口大小变化
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  // 组件销毁时移除监听
  window.removeEventListener('resize', handleResize)
})

const activeMenu = (): string => {
  return route.path
}
</script>

<style lang="less" scoped>
/* 样式不需要更改 */
</style>