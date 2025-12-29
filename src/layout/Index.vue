<template>
  <el-container style="height: 100vh;">
    <el-header id="header">
      <NavBar />
    </el-header>
    <el-container style="height: calc(100% - 50px);">
      <el-aside>
        <SideBar class="sidebar-container" />
      </el-aside>
      <el-main>
        <Breadcrumb />
        <LayoutMain />
        <Footer />
      </el-main>
    </el-container>
  </el-container>
</template>

<script lang="ts" setup>
import NavBar from './components/NavBar.vue';
import Breadcrumb from './components/Header/Breadcrumb.vue';
import LayoutMain from './components/LayoutMain.vue';
import SideBar from './components/SideBar/Index.vue';
import Footer from './components/Footer.vue';
</script>

<style lang="less" scoped>
.el-container{
  background-color: #F5F7FA;
}
.el-header{
  height: 50px;
  padding: 0px;
}
.el-aside{
  width: 208px;
  background-color: var(--emdc-bg-color-container);
  color: var(--emdc-text-color-primary);
  font-size: 14px;
}
.el-main{
  background-color: #F5F7FA;
  padding: 0 16px 0px 16px;
  overflow-y: auto;
}
</style>
