<template>
  <div class="empty-container">
    <div class="img-container">
      <img class="img-empty" src="@/assets/imgs/empty_rank.webp" />
    </div>
    <div class="tips-container">
      <strong class="-emdc-font-size-large">抱歉，暂无 XXXXXXX</strong>
      <p class="-emdc-font-size-base">请点击下方 创建 XXXX 进行添加。</p>
      <el-button class="-emdc-button-primary" @click="create">创建 XXXXX</el-button>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { useRouter } from 'vue-router';

const router = useRouter()

const create = () => {
  router.push('/app/form')
}

</script>
<style lang="less" scoped>
.empty-container {
  display: flex;
  justify-content: center;
  align-items: center;

  gap: 50px;

  margin-top: 242px;

  .img-container {
    .img-empty {
      width: 153px;
    } 
  }
  .tips-container {

  }
}
</style>