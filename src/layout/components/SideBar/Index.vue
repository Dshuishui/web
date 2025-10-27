<template>
  <el-menu :unique-opened="true"
    :collapse-transition="false" :default-active="activeMenu()"
    :style="'height:' + mainHeight + 'px'" mode="vertical" router class="common-menu">
    <el-menu-item index="/serverless/index">
      <i class="iconfont icon-menu icon-a-01-2zhisuanchihuaziyuanchi"></i>
      <span>首页</span>
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

const activeMenu = (): string => {
  console.log('route.meta.name:', route.meta.name)
  return (route.meta.name as string) || '/serverless/index'
}
</script>

<style lang="less" scoped>
</style>