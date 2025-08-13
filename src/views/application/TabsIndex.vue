<template>
  <div class="tabs-container">
    <ElTabs v-model="active" class="common-tabs">
      <ElTabPane label="标签1" name="one" >内容1</ElTabPane>
      <ElTabPane label="标签2" name="two" >内容2</ElTabPane>
    </ElTabs>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue';

const active = ref('one');

</script>
<style lang="less" scoped>
.tabs-container {
  padding: 20px;
}
</style>