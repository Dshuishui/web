<template>
  <el-breadcrumb separator="/">
    <el-breadcrumb-item>首页</el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script lang="ts" setup>
// 简化版面包屑，只显示当前页面标题
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