import {
  listByPageApi
} from "@/api/application";
import { ref } from 'vue'

interface IQueryParam {
  // tenantId: string,
  pageNumber: number,
  pageSize: number,
  name?: string,
}

export function useFetchList(options?: { page: number; size: number }) {

  const listLoading = ref<boolean>(false)
  const list = ref<any[]>([])
  const loadList = ref<any[]>([])
  
  const pageNumber = ref(options?.page || 1)
  const pageSize = ref(options?.size || 10)
  const total = ref(0)
  
  const defaultParams: IQueryParam = {
    pageNumber: pageNumber.value,
    pageSize: pageSize.value,
    name: '',
  }
  let lastQueryParams: IQueryParam = defaultParams // 记录每次查询接口的参数，用于页码变化时直接查询

  async function fetchList(queryParams: IQueryParam | { [key: string]: any }) {
    listLoading.value = true
    let response = null
    try{
      lastQueryParams = { ...defaultParams, ...queryParams }

      response = await Promise.resolve({
        code: '200',
        data: {
          "code": "200",
          "message": "成功",
          "requestId": "e0b37781-bb08-4ec2-9422-60db763ae605",
          "data": {
              "result": [],
              "page": {
                  "pageSize": 10,
                  "current": 1,
                  "total": 2
              }
          },
          "success": true,
          "failed": false
      }
      })

      const { code, data } = response

      if(code === '200') {
        list.value = data.result || []
        total.value = data.page?.total || 0
        pageNumber.value = data.page?.current || 0
        loadList.value = pageNumber.value === 1 ? data.result : loadList.value?.concat([...data.result])
      }

    } finally {
      listLoading.value = false
    }
    // return response
  }

  async function onParamsPageChange(page: number, size?: number) {
    await fetchList({ ...lastQueryParams, pageNumber: page, pageSize: size || pageSize.value })
  }

  return {
    pageNumber,
    total,
    listLoading,
    list,
    fetchList,
    onParamsPageChange,
    loadList,
  }
}