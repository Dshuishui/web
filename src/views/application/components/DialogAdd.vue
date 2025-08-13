<template>
  <div class="common-dialog test_dialog">
    <el-dialog
      :model-value="visibleModel"
      title="对话框示例"
      width="560"
      align-center
      :modal="false"
      destroy-on-close
      :before-close = "handleClose"
    >
    <el-form ref="formRef" :model="form" :rules="rules" class="app-form">
        <el-form-item label="输入框:" prop="a" :label-width="labelWidth" class="name-item">
          <el-input class="common-input" v-model="form.a" placeholder="请输入" type="text" />
        </el-form-item>
        <el-form-item label="文本框:" prop="b" :label-width="labelWidth">
          <el-input class="common-textarea" v-model="form.b" placeholder="最多输入200字"  type="textarea" minlength="1" maxlength="200" />
        </el-form-item>
        <el-form-item label="下拉框:" prop="c" :label-width="labelWidth">
          <el-select
            v-model="form.c"
            placeholder="请选择"
            class="common-select"
            popper-class="common-select_popper related-bus-select_popper"
          >
            <el-option key="option1" label="option1" value="option1"/>
            <el-option key="option2" label="option2" value="option2"/>
            <el-option key="option3" label="option3" value="option3"/>
          </el-select>
        </el-form-item>
        <el-form-item label="多选:" prop="d" :label-width="labelWidth"> 
          <el-checkbox-group v-model="form.d">
            <el-checkbox class="common-checkbox" v-for="city in cities" :key="city" :label="city" :value="city">
              {{ city }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="日期：" prop="e" :label-width="labelWidth">
          <ElDatePicker
            type="daterange"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            start-placeholder="关单开始日期"
            end-placeholder="结束日期"
            v-model="form.e"
            class="common-date-range"
            popper-class="common-date-range-poper"
          />
        </el-form-item>
        <el-form-item label="开关:" prop="f" :label-width="labelWidth">
          <el-switch v-model="form.f" class="common-switch" />
        </el-form-item>
        <el-form-item label="单选:" prop="g" :label-width="labelWidth">
          <el-radio-group v-model="form.g">
            <el-radio class="common-radio" :value="3">Option A</el-radio>
            <el-radio class="common-radio" :value="6">Option B</el-radio>
            <el-radio class="common-radio" :value="9">Option C</el-radio>
          </el-radio-group>
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

const labelWidth = "80px"
const formRef: any = ref(null)
const form: any = reactive({
  a: '',
  b: '',
  c: '',
  d: ['Shanghai'],
  e: '',
  f: '',
  g: 3,
  file: null
})


const rules = reactive<FormRules>({
  a: [
    { required: true, message: '请输入', trigger: 'blur' },
  ],
  b: [
    { required: true, message: '请输入', trigger: 'blur' },
  ],
  c: [
    { required: true, message: '请选择', trigger: 'blur' },
  ],
  d: [
    { required: true, message: '请选择', trigger: 'blur' },
  ],
  e: [
    { required: true, message: '请选择', trigger: 'blur' },
  ],
  g: [
    { required: true, message: '请选择', trigger: 'blur' },
  ],
  file: [
  { required: true, message: '请上传', trigger: 'blur' },
  ]
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

const cities = ['Shanghai', 'Beijing', 'Guangzhou', 'Shenzhen']

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