<template>
  <div class="common-dialog test_dialog">
    <el-dialog
      :model-value="visibleModel"
      title="对话框示例"
      width="360"
      align-center
      :modal="false"
      destroy-on-close
      :before-close = "handleClose"
    >
      <el-form ref="formRef" :model="form" :rules="rules" label-position="left">
        <el-form-item label="xxxxx:" prop="x" :label-width="labelWidth" class="reason-item">
          <el-input class="common-input" v-model="form.reason" placeholder="请输入" type="input" />
        </el-form-item>
        <el-form-item label="xxxxx:" prop="y" :label-width="labelWidth" class="reason-item">
          <el-select
            v-model="form.services"
            placeholder="请选择"
            class="common-select"
            popper-class="common-select_popper related-bus-select_popper"
          >
            <el-option key="option1" label="option1" value="option1"/>
            <el-option key="option2" label="option2" value="option2"/>
            <el-option key="option3" label="option3" value="option3"/>
          </el-select>
        </el-form-item>
        <el-form-item label="备注:" prop="z" :label-width="labelWidth" class="reason-item">
          <el-input class="common-textarea" v-model="form.z" placeholder="请输入详细的备注" type="textarea" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="common-footer">
          <el-button class="-emdc-button-plain" @click="handleClose">取消</el-button>
          <el-button class="-emdc-button-primary" @click="handleConfirm">确定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import type { FormRules } from 'element-plus'

const props = defineProps({
  visible: { type: Boolean, default: false },
  current: {
    type: Object,
    default: () => { }
  },
})

const emit = defineEmits(['callback'])

const visibleModel = defineModel('visible')

const labelWidth = "90px"
const formRef: any = ref(null)
const form: any = reactive({
  x: '',
  y: '',
  z: ''
})

const rules = reactive<FormRules>({
  x: [
    {
      required: true,
      message: '请输入',
      trigger: 'blur'
    }
  ],
  y: [
    {
      required: true,
      message: '请选择',
      trigger: 'blur'
    }
  ],
})
const handleConfirm = () => {
  formRef.value.validate((valid: any) => {
    console.log('handleConfirm:', form)
    if (valid) {
      
    }
  })
}

watch(
  () => props.visible,
  () => {
    
  },
  {
    deep: true,
    immediate: true
  }
)

const handleClose = () => {
  visibleModel.value = false
}

</script>
<style lang="less" scoped>
.test_dialog {
  :deep(.el-textarea__inner) {
    min-height: 100px !important;
  }
  .common-footer {
    display: flex;
    justify-content: center;
  }
}
</style>