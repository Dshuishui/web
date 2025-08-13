import {
  createApi,
  detailApi,
  updateApi,
  downloadApi
} from "@/api/application";
import { ref } from 'vue'
import { ElMessage } from 'element-plus'


export function useApp() {

  const loading = ref<boolean>(false)
  const detail: any = ref(null)
  const downloading = ref<boolean>(false)

  async function getDetail(name: string) {
    const response = await detailApi({
      params: {
        name
      }
    })
    const { code, data } = response
    if(code === '200') {
      detail.value = data
    }
  }

  async function create(_payload: any) {
    loading.value = true
    let response = null
    try {
      response = await createApi({
        data: _payload
      })
      const { code, message } = response
      if(code === '200') {
        ElMessage.success({
          message: '创建成功',
        })
      } else {
        ElMessage.error({
          message
        })
      }
    } finally {
      loading.value = false
      return response?.code === '200'
    }
  }

  async function modify(_payload: any) {
    loading.value = true
    let response = null
    try {
      response = await updateApi({
        data: _payload
      })
      const { code, message } = response
      if(code === '200') {
        ElMessage.success({
          message: '编辑成功',
        })
      } else {
        ElMessage.error({
          message
        })
      }
    } finally {
      loading.value = false
      return response?.code === '200'
    }
  }

  async function download(name: any) {
    downloading.value = true
    let response = null
    try {
      response = await downloadApi({
        params: {
          name
        } 
      })
    } finally {
      downloading.value = false
      return response
    }
  }

  return {
    create,
    loading,
    getDetail,
    detail,
    modify,
    download,
    downloading
  }
}