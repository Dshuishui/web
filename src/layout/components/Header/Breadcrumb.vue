<template>
  <el-breadcrumb separator="/">
    <el-breadcrumb-item
      v-for="item in routes"
      :key="item.path"
      @click="go(item.path)"
    >{{ item.meta.title }}</el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter()
const routes = computed(() => {
  return router.currentRoute.value.matched.filter((item) => {
    return item.meta.title
  })
})

const go = (path: string) => {
  router.push(path)
}

</script>

<style lang="less" scoped>
.el-breadcrumb__item{
  font-family: PingFangSC, PingFang SC;
  font-weight: 400;
  font-size: 14px;
  color: var(--emdc-text-color-primary);
  line-height: 22px;
  text-align: left;
  font-style: normal;
  margin-top: 5px;
  margin-left: 7px;
}
:deep(.el-breadcrumb__item:last-child .el-breadcrumb__inner){
  color: var(--emdc-text-color-secondary);
}
</style>
