import { listByPageApi  } from "@/api/test"
import { ref } from 'vue'

export const useTest = () => {
  const list = ref<any>([])
  async function getList() {
    const response =  await listByPageApi({
      type: 'test'
    })
    const { code, data } = response
    if(code === '200') {
      list.value = data?.map((item: any)=>{
        return {
          label: item.name,
          value: item.code
        }
      })
    } else {
      list.value = []
    }
    return list.value
  }

  return {
    getList,
    list
  };
};
