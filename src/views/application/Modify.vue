<template>
  <div class="app-modify_container">
    <div class="content">
      <el-form ref="formRef" :model="form" :rules="rules" label-position="top" class="app-form">
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
        <el-form-item label="日期：" prop="e">
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
        <el-form-item label="开关:" prop="f">
          <el-switch v-model="form.f" class="common-switch" />
        </el-form-item>
        <el-form-item label="单选:" prop="g">
          <el-radio-group v-model="form.g">
            <el-radio class="common-radio" :value="3">Option A</el-radio>
            <el-radio class="common-radio" :value="6">Option B</el-radio>
            <el-radio class="common-radio" :value="9">Option C</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="文件上传:" prop="file" :label-width="labelWidth">
          <el-upload
            accept=".yaml"
            ref="upload"
            :limit="1"
            :auto-upload="false"
            :on-exceed="handleExceed"
            :on-change="handleChange"
            list-type="text"
          >
          <el-button class="-emdc-button-primary" type="primary">{{ mode === 'create' ? '点击上传' : '重新上传' }}</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
      <div>
        <el-button class="-emdc-button-plain" @click="handleCancel">取消</el-button>
        <el-button class="-emdc-button-primary" @click="handleConfirm">确定</el-button>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import type { FormRules, UploadInstance, UploadRawFile } from 'element-plus'
import { genFileId } from 'element-plus'
import { useRouter, useRoute } from 'vue-router'

const emit = defineEmits(['cancel','submit'])

const route = useRoute()
const router = useRouter()

const labelWidth= "110px"
const formRef: any = ref(null)
const mode: any = ref('create')
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
  formRef.value.validate(async (valid: any) => {
    console.log('handleConfirm:',form)
    if (valid) {
      
    }
  })
}

const handleCancel = () => {
  router.push('/app/list')
}

// 文件上传相关
const upload = ref<UploadInstance>()
const fileList = ref<any>([])

const handleExceed = (files: any) => {
  upload.value!.clearFiles()
  const file = files[0] as UploadRawFile
  file.uid = genFileId()
  upload.value!.handleStart(file)
}

const handleChange = (file: any) => {
  console.log('handleChange:',file)
  form.file = file.raw
  // fileList.value = [file]
}

onMounted(async () => {
  
})

const cities = ['Shanghai', 'Beijing', 'Guangzhou', 'Shenzhen']

</script>
<style lang="less" scoped>
.app-modify_container {
  .title {
    height: 50px;
    display: flex;
    align-items: center;
    padding-left: 20px;
    font-size: 20px;
    border-bottom: 1px solid #dddd;
  }
  .content {
    width: 100%;
    padding: 20px;
    display: flex;
    justify-content: center;
    flex-direction: column;
    .app-form {
      width: 800px !important;
    }
  }
  :deep(.el-upload-list__item-info) {
    width: 100%;
  }
}
</style>