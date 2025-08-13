<template>
  <el-menu :unique-opened="true"
    :collapse-transition="false" :default-active="activeMenu()"
    :style="'height:' + mainHeight + 'px'" mode="vertical" router class="common-menu">
    <el-sub-menu index="/app">
      <template #title>
        <i class="iconfont icon-menu icon-a-01-2zhisuanchihuaziyuanchi"></i>
        <span>示例</span>
      </template>
      <el-menu-item index="/app/list">表格</el-menu-item>
      <el-menu-item index="/app/tabs">标签页</el-menu-item>
      <el-menu-item index="/app/form">表单</el-menu-item>
      <el-menu-item index="/app/serverless">无服务器计算</el-menu-item>
    </el-sub-menu>
    <el-menu-item index="/test">
      <i class="iconfont icon-menu icon-a-01-2zhisuanchihuaziyuanchi"></i>
      <span>缺省页</span>
    </el-menu-item>
    <el-menu-item index="/test1">
      <i class="iconfont icon-menu icon-a-01-2zhisuanchihuaziyuanchi"></i>
      <span>对话框</span>
    </el-menu-item>
  </el-menu>
</template>

<script lang="ts" setup>
import { ElMenu } from 'element-plus';
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

const activeMenu = () => {
  console.log('route.meta.name:',route.meta.name)
  return route.meta.name
}
</script>

<style lang="less" scoped>
</style>