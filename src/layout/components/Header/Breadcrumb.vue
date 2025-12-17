<template>
  <el-breadcrumb separator="/">
    <el-breadcrumb-item 
      v-for="(item, index) in levelList" 
      :key="item.path"
    >
      <!-- 最后一个元素不跳转，只显示文本 -->
      <span v-if="index === levelList.length - 1">{{ item.meta.title }}</span>
      <!-- 非最后一个元素可以点击跳转 -->
      <router-link v-else :to="item.path">{{ item.meta.title }}</router-link>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>


<script lang="ts" setup>
import { ref, watch } from 'vue';
import { useRoute, RouteLocationMatched } from 'vue-router';

const route = useRoute();
const levelList = ref<RouteLocationMatched[]>([]);

const getBreadcrumb = () => {
  // 过滤掉没有 title 的路由，或者隐藏的路由
  let matched = route.matched.filter(item => item.meta && item.meta.title && item.meta.hidden !== true);
  
  // 检查第一个路由是否是首页，如果不是，可以手动添加一个
  // 假设您的首页路径是 '/' 且 title 是 '首页'
  const first = matched[0];
  if (first && first.path !== '/') {
    matched = [{ path: '/', meta: { title: '服务器无感协同调度平台' } } as unknown as RouteLocationMatched].concat(matched);
  }
  
  levelList.value = matched;
};

// 初始加载时执行一次
getBreadcrumb();

// 监听路由变化，每次变化时重新生成面包屑
watch(
  () => route.path,
  () => getBreadcrumb()
);
</script>


<style lang="less" scoped>
.el-breadcrumb__item {
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

// 非末级项的内部文字和链接颜色
:deep(.el-breadcrumb__inner) {
  color: var(--emdc-text-color-primary);
}

:deep(.el-breadcrumb__inner a),
:deep(.el-breadcrumb__inner.is-link) {
  color: var(--el-text-color-regular);
  font-weight: 400;
}

// 分隔符颜色
:deep(.el-breadcrumb__separator) {
  color: var(--emdc-text-color-secondary);
}

// 末级项（最后一个）的颜色
:deep(.el-breadcrumb__item:last-child .el-breadcrumb__inner) {
  color: var(--emdc-text-color-secondary);
}
</style>