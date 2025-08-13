<template>
  <el-card>
    <el-scrollbar :style="'minHeight:' + mainHeight + 'px'">
      <router-view></router-view>
    </el-scrollbar>
  </el-card>
</template>

<script lang="ts" setup>
import { ref, onMounted} from 'vue'
const mainHeight = ref<number>(0)
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
</script>

<style lang="less" scoped>
:deep(.el-card__body){
  padding: 0px;
}
</style>