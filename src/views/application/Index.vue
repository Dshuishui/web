<template>
  <div class="app-container">
    <div class="content">
      <div class="operate">
        <el-button class="-emdc-button-primary" @click="create">新建项目</el-button>
        <el-button class="-emdc-button-primary" @click="create1">新建项目1</el-button>
        <el-input v-model="queryParams.a" class="common-input search-item" placeholder="请输入名称" />
        <el-select
          v-model="queryParams.b"
          placeholder="请选择"
          class="common-select search-item"
          popper-class="common-select_popper related-bus-select_popper"
        >
            <el-option key="option1" label="option1" value="option1"/>
            <el-option key="option2" label="option2" value="option2"/>
            <el-option key="option3" label="option3" value="option3"/>
        </el-select>
        <el-button class="-emdc-button-plain" @click="search">搜索</el-button>
        <el-button class="-emdc-button-plain" @click="reset">重置</el-button>
      </div>
      <div class="list">
        <AppTable
          :data="list"
          :current="pageNumber"
          :total="total"
          @edit="handleEdit"
          @page="handlePage"
        />
      </div>
    </div>
  </div>
  <DialogAdd v-model:visible="visible" />
</template>
<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import AppTable from './components/AppTable.vue'
import DialogAdd from './components/DialogAdd.vue'

const router = useRouter()

const queryParams = reactive({
  a: '',
  b:''
})

const pageNumber = ref(1);
const total = ref(2);
const list = [
    {
        "id": "8392316238392328192",
        "name": "app_test",
        "descr": "",
        "file": null,
        "gmtCreated": "2024-10-30T08:29:40.000+00:00",
        "gmtModified": "2024-10-30T08:29:40.000+00:00",
        "displayGmtModified": "2024/10/30 16:29:40",
        "displayGmtCreated": "2024/10/30 16:29:40"
    },
    {
        "id": "8183390423685283840",
        "name": "test",
        "descr": "test001",
        "file": null,
        "gmtCreated": "2024-08-19T06:55:05.000+00:00",
        "gmtModified": "2024-08-19T06:55:13.000+00:00",
        "displayGmtModified": "2024/08/19 14:55:13",
        "displayGmtCreated": "2024/08/19 14:55:05"
    }
]
const create = () => {
  router.push('/app/create')
}

const handleEdit = (_payload: any) => {
  router.push({
    path: '/app/edit',
    query: 
    {
      name: _payload.name
    }
  })
}

const handlePage = (pageNumber: number) => {
  
}

const search = () => {}
const reset = () => {
  queryParams.a = '';
  queryParams.b = '';
}

const visible = ref<boolean>(false);

const create1 = () => {
  visible.value = true;
}

</script>
<style lang="less" scoped>
.app-container {
  .title {
    height: 50px;
    display: flex;
    align-items: center;
    padding-left: 20px;
    font-size: 20px;
    border-bottom: 1px solid #dddd;
  }
  .content {
    padding: 20px;
  }
  .operate {
    margin-bottom: 20px;
    display: flex;
    flex-direction: row;
    gap: 8px;
    .search-item {
      width: 200px;
    }
    .el-button+.el-button {
      margin-left: 0;
    }
  }
}
</style>