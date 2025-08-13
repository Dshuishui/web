<template>
  <div class="dialog-container">
    <el-button class="-emdc-button-primary" @click="open">打开对话框</el-button>
  </div>
  <DialogTest  v-model:visible="visible" />
</template>
<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import DialogTest from './components/DialogTest.vue'

const visible = ref<boolean>(false)
const open = () => {
  visible.value = true
}


</script>
<style lang="less" scoped>
.dialog-container {
  padding: 20px;
}
</style>