<template>
  <el-menu :unique-opened="true"
    :collapse-transition="false" :default-active="activeMenu()"
    :style="'height:' + mainHeight + 'px'" mode="vertical" router class="common-menu">
    
    <el-sub-menu index="/serverless/index">
      <template #title>
        <i class="iconfont icon-menu icon-a-01-2zhisuanchihuaziyuanchi"></i>
        <span>无服务器计算</span>
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
import { ElMenu, ElSubMenu, ElMenuItem } from 'element-plus'; // 确保导入了 ElSubMenu 和 ElMenuItem
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router';

const mainHeight = ref<number>(0)
const route = useRoute()

onMounted(() => {
  if (document.getElementById("header")) {
    mainHeight.value = window.innerHeight - document.getElementById("header")!.clientHeight - 74
  } else {
    mainHeight.value = window.innerHeight - 124
  }
})

window.onresize = () => {
  if (document.getElementById("header")) {
    mainHeight.value = window.innerHeight - document.getElementById("header")!.clientHeight - 74
  } else {
    mainHeight.value = window.innerHeight - 124
  }
}

const activeMenu = (): string => {
  // 修改这里：使用 route.path 来确保子路由被正确高亮
  // console.log('route.path:', route.path)
  return route.path
}
</script>

<style lang="less" scoped>
/* 样式不需要更改 */
</style>