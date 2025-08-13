<template>
    <el-table
      :data="data" size="small" style="width: 100%" class="common-table app-table"
    >
      <el-table-column prop="id" label="ID">
      </el-table-column>
      <el-table-column prop="name" label="名称">
      </el-table-column>
      <el-table-column prop="descr" label="描述">
      </el-table-column>
      <el-table-column prop="displayGmtCreated" label="创建时间">
      </el-table-column>
      <el-table-column prop="displayGmtModified" label="更新时间">
      </el-table-column>
      <el-table-column fixed="right" prop="operate" label="操作" width="160">
        <template #default="scope">
          <el-button link type="primary" class="-emdc-button-link" @click="handleEdit(scope.row)">
            编辑
          </el-button>
          <el-button link type="primary" class="-emdc-button-link" @click="handleDel(scope.row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <ElPagination
      :current-page="current"
      layout="total, prev, pager, next"
      :total="total"
      @current-change="handleCurrentChange"
      class="common-pagination app-table_page"
    />
  </template>
  <script setup lang="ts">
  import { ElMessageBox, ElMessage } from 'element-plus';

  defineProps({
    data: {
      type: Array,
      default: () => []
    },
    current: {
      type: Number,
      default: 0,
    },
    total: {
      type: Number,
      default: 0
    },
  })
  
  const emit = defineEmits(['edit','account','auth', 'page', 'selection'])
  
  const handleCurrentChange = (val: number) => {
    emit('page', val)
  }
  
  
  const handleEdit = (_payload: any) => {
    emit('edit',_payload)
  }

  const handleDel = (payload: any) => {
    ElMessageBox.confirm(`确定删除xxxxx吗？`, '删除提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
      customClass: 'common-messagebox disable-messagebox',
      cancelButtonClass: '-emdc-button-plain',
      confirmButtonClass: '-emdc-button-primary',
      autofocus: false,
      beforeClose: async (action, instance, done) => {
        if(action === 'confirm') {
          instance.confirmButtonLoading = true
          try {
            console.log('todo');
            ElMessage.success({
              message: '删除成功',
              customClass: 'common-message',
              duration: 2000 * 50
            })
          }finally{
            instance.confirmButtonLoading = false
          }
          done()
        }else{
          done()
        }
      }
    }).then(async () => {
      
    })
}
  
  </script>
  <style lang="less" scoped>
  .app-table {

  }
  .app-table_page {
    display: flex;
    justify-content: center;
    margin-top: 18px;
  }
  </style>