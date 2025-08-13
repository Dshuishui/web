<script setup lang="ts">
import UserInfo from '@/layout/components/Header/UserInfo.vue';

</script>

<template>
    <div class="header-container">
        <div class="header-wrapper">
            <span class="header--span__title">面向边缘微小型数据中心的系统软件平台</span>
        </div>
        <div class="header-menu">
            <UserInfo />
        </div>
    </div>
</template>

<style scoped lang="less">
.header-wrapper {
  display: flex;
  align-items: center;
}

.header--span__title {
  width: 288px;
  height: 22px;
  font-family: PingFangSC, PingFang SC;
  font-weight: 500;
  font-size: 16px;
  color: #FFFFFF;
  line-height: 22px;
  text-align: left;
  font-style: normal;
}

.heeder--img__logo {
  height: 26px;
}

.header-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 10px 10px 35px;
    background: #202231;
    height: 100%;
    box-sizing: border-box;
}

.full {
  width: 100%;
}
.header-menu {
  display: flex;
  align-items: center;
}
</style>