<template>
  <div class="userInfo-container">
    <img class="img-userInfo" src="@/assets/imgs/page_profile@2X.png" />
    <span class="name -emdc-font-size-base">小之</span>
  </div>
</template>
<script lang="ts" setup>


</script>
<style lang="less" scoped>
.userInfo-container {
  display: flex;
  align-items: center;
  gap: 4px;

  margin-right: 36px;

 .img-userInfo {
  width:32px;
 }
 .name {
  color: #fff;
 }
}
</style>