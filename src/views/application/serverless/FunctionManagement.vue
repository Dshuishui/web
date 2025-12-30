<template>
  <div class="content-panel">
    <div class="section-header">
      <h2 class="section-title">函数管理</h2>
      <div class="function-header-controls">
        <div class="namespace-selector">
          <span>选择命名空间:</span>
          <el-select v-model="selectedNamespace" class="common-select" @change="changeNamespace">
            <el-option v-for="ns in namespaces" :key="ns.name" :label="ns.name" :value="ns.name" />
          </el-select>
        </div>
        <div class="function-header-info">
          <span class="current-namespace">当前命名空间: <strong>{{ selectedNamespace }}</strong></span>
          <span class="function-count">函数数量: <strong>{{ functions.length }}</strong></span>
          <span class="loading-status" v-if="functionsLoading">(加载中...)</span>
        </div>
      </div>
      <div class="function-actions-header">
        <el-button class="-emdc-button-plain" @click="refreshFunctions" :loading="functionsLoading">
          <el-icon>
            <Loading />
          </el-icon>
          刷新
        </el-button>
        <el-button class="-emdc-button-primary" @click="createDialogVisible = true">
          <el-icon>
            <Plus />
          </el-icon>
          创建函数
        </el-button>
      </div>
    </div>

    <el-table :data="functions" class="common-table function-table" v-loading="functionsLoading"
      v-if="functions.length > 0">
      <el-table-column prop="metadata.name" label="函数名称" min-width="160" />
      <el-table-column prop="spec.environment.name" label="环境" min-width="100" />
      <el-table-column prop="metadata.namespace" label="命名空间" min-width="120" />
      <el-table-column prop="spec.concurrency" label="并发数" min-width="80" />
      <el-table-column prop="spec.functionTimeout" label="超时时间" min-width="90">
        <template #default="scope">
          {{ scope.row.spec.functionTimeout }}s
        </template>
      </el-table-column>
      <el-table-column label="伸缩策略" min-width="120">
        <template #default="scope">
          <el-tag size="small" type="info">
            {{
              scope.row.spec.InvokeStrategy.ExecutionStrategy.MinScale
            }}-{{
              scope.row.spec.InvokeStrategy.ExecutionStrategy.MaxScale
            }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="状态" min-width="80">
        <template #default="scope">
          <el-tag :type="getFunctionStatusType(scope.row)" size="small">
            {{ getFunctionStatusText(scope.row) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="150" fixed="right">
        <template #default="scope">
          <div class="function-actions">
            <el-button link type="primary" class="-emdc-button-link" @click="showDetails(scope.row)">
              详情
            </el-button>
            <el-button link type="primary" class="-emdc-button-link" @click="deleteFunction(scope.row)">
              删除
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <div v-if="!functionsLoading && functions.length === 0" class="empty-state">
      <el-empty description="当前命名空间下暂无函数" :image-size="120">
        <el-button class="-emdc-button-primary " @click="createDialogVisible = true">
          创建第一个函数
        </el-button>
      </el-empty>
    </div>

    <el-dialog v-model="createDialogVisible" title="创建函数" width="800px" class="common-dialog">
      <el-steps :active="createStep" finish-status="success" class="create-steps">
        <el-step title="创建环境" description="配置运行环境" />
        <el-step title="创建包" description="上传函数代码" />
        <el-step title="创建函数" description="配置函数参数" />
      </el-steps>

      <div v-if="createStep === 0" class="step-content">
        <h4>环境配置</h4>
        <el-form :model="envForm" label-width="120px">
          <el-form-item label="环境名称" required>
            <el-input v-model="envForm.name" placeholder="请输入环境名称，如：python-env" class="common-input" />
          </el-form-item>
          <el-form-item label="运行时镜像" required>
            <el-input v-model="envForm.image" placeholder="请输入镜像地址，如：ghcr.io/fission/python-env" class="common-input" />
          </el-form-item>
          <el-form-item label="版本">
            <el-input-number v-model="envForm.version" :min="1" :max="10" placeholder="3" />
          </el-form-item>
          <el-form-item label="预热池大小">
            <el-input-number v-model="envForm.poolsize" :min="0" :max="10" placeholder="1" />
          </el-form-item>
        </el-form>
      </div>

      <div v-if="createStep === 1" class="step-content">
        <h4>包配置</h4>
        <el-form :model="pkgForm" label-width="120px">
          <el-form-item label="包名称" required>
            <el-input v-model="pkgForm.name" placeholder="请输入包名称，如：my-function-pkg" class="common-input" />
          </el-form-item>
          <el-form-item label="环境名称" required>
            <el-input v-model="pkgForm.environment" :disabled="true" class="common-input" />
          </el-form-item>
          <el-form-item label="函数代码" required>
            <el-input v-model="pkgForm.code" type="textarea" :rows="8" placeholder="请输入函数代码，如：
def main():
    return 'Hello World'" class="common-textarea" />
          </el-form-item>
          <el-form-item label="函数入口">
            <el-input v-model="pkgForm.functionName" placeholder="如：main" class="common-input" />
          </el-form-item>
        </el-form>
      </div>

      <div v-if="createStep === 2" class="step-content">
        <h4>函数配置</h4>
        <el-form :model="fnForm" label-width="120px">
          <el-form-item label="函数名称" required>
            <el-input v-model="fnForm.name" placeholder="请输入函数名称，如：my-function" class="common-input" />
          </el-form-item>
          <el-form-item label="环境名称" required>
            <el-input v-model="fnForm.environment" :disabled="true" class="common-input" />
          </el-form-item>
          <el-form-item label="包名称" required>
            <el-input v-model="fnForm.package" :disabled="true" class="common-input" />
          </el-form-item>
          <el-form-item label="函数入口" required>
            <el-input v-model="fnForm.functionName" placeholder="如：main" class="common-input" />
          </el-form-item>
          <el-form-item label="并发数">
            <el-input-number v-model="fnForm.concurrency" :min="1" :max="1000" placeholder="500" />
          </el-form-item>
          <el-form-item label="超时时间(秒)">
            <el-input-number v-model="fnForm.functionTimeout" :min="1" :max="300" placeholder="60" />
          </el-form-item>
          <el-form-item label="空闲超时(秒)">
            <el-input-number v-model="fnForm.idletimeout" :min="1" :max="600" placeholder="120" />
          </el-form-item>
          <el-form-item label="每Pod请求数">
            <el-input-number v-model="fnForm.requestsPerPod" :min="1" :max="100" placeholder="1" />
          </el-form-item>
          <el-form-item label="一致性程度">
            <el-radio-group v-model="fnForm.consistencyLevel">
              <el-radio value="strong">
                <span class="consistency-option">
                  <strong>强一致性</strong>
                  <span class="consistency-desc">保证数据强一致，适用于对数据准确性要求高的场景</span>
                </span>
              </el-radio>
              <el-radio value="elastic">
                <span class="consistency-option">
                  <strong>弹性一致性</strong>
                  <span class="consistency-desc">允许短暂不一致，适用于高并发、高吞吐场景</span>
                </span>
              </el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </div>

      <template #footer>
        <span class="dialog-footer">
          <el-button class="-emdc-button-plain" @click="createDialogVisible = false">取消</el-button>
          <el-button v-if="createStep > 0" @click="prevStep">上一步</el-button>
          <el-button v-if="createStep < 2" class="-emdc-button-primary" @click="nextStep" :loading="stepLoading">
            下一步
          </el-button>
          <el-button v-if="createStep === 2" class="-emdc-button-primary" @click="createFunction"
            :loading="stepLoading">
            创建函数
          </el-button>
        </span>
      </template>
    </el-dialog>

    <el-dialog v-model="detailsDialogVisible" title="函数详情" width="700px" class="common-dialog">
      <div v-if="selectedFunction">
        <h4 style="margin-top: 0; margin-bottom: 15px">基本信息:</h4>
        <p><strong>名称:</strong> {{ selectedFunction.metadata.name }}</p>
        <p><strong>命名空间:</strong> {{ selectedFunction.metadata.namespace }}</p>
        <p><strong>创建时间:</strong> {{ selectedFunction.metadata.creationTimestamp }}</p>
        <p><strong>版本:</strong> {{ selectedFunction.metadata.generation }}</p>
        <p><strong>状态:</strong> {{ getFunctionStatusText(selectedFunction) }}</p>
        <p><strong>并发数:</strong> {{ selectedFunction.spec.concurrency }}</p>
        <p><strong>超时时间:</strong> {{ selectedFunction.spec.functionTimeout }}s</p>
        <p><strong>空闲超时:</strong> {{ selectedFunction.spec.idletimeout }}s</p>
        <p><strong>每Pod请求数:</strong> {{ selectedFunction.spec.requestsPerPod }}</p>

        <h4 style="margin-top: 20px; margin-bottom: 10px">环境信息:</h4>
        <p><strong>环境名称:</strong> {{ selectedFunction.spec.environment.name }}</p>
        <p><strong>环境命名空间:</strong> {{ selectedFunction.spec.environment.namespace }}</p>

        <h4 style="margin-top: 20px; margin-bottom: 10px">包信息:</h4>
        <p><strong>函数名:</strong> {{ selectedFunction.spec.package.functionName }}</p>
        <p><strong>包引用:</strong> {{ selectedFunction.spec.package.packageref.name }}</p>

        <h4 style="margin-top: 20px; margin-bottom: 10px">伸缩策略:</h4>
        <p><strong>策略类型:</strong> {{ selectedFunction.spec.InvokeStrategy.StrategyType }}</p>
        <p><strong>执行器类型:</strong> {{ selectedFunction.spec.InvokeStrategy.ExecutionStrategy.ExecutorType }}</p>
        <p><strong>最小副本:</strong> {{ selectedFunction.spec.InvokeStrategy.ExecutionStrategy.MinScale }}</p>
        <p><strong>最大副本:</strong> {{ selectedFunction.spec.InvokeStrategy.ExecutionStrategy.MaxScale }}</p>
        <p><strong>专业化超时:</strong> {{ selectedFunction.spec.InvokeStrategy.ExecutionStrategy.SpecializationTimeout }}s
        </p>
        <p><strong>目标CPU百分比:</strong> {{ selectedFunction.spec.InvokeStrategy.ExecutionStrategy.TargetCPUPercent }}%</p>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { Plus, Loading } from "@element-plus/icons-vue";

// 接口定义 - 从useNamespace导入
// (注意：这里的路径是 '../hooks/useNamespace'，假设 hooks 目录与 serverless 目录同级)
// (如果 useNamespace.ts 在 'src/views/application/hooks/' 目录下, 路径是正确的)
import { useNamespace, type FunctionItem } from "../hooks/useNamespace";
import {
  createEnvironment,
  createPackage,
  createFunction as createFunctionAPI,
  deleteFunction as deleteFunctionAPI,
} from "@/api/fission";

// 使用命名空间Hook
const {
  namespaces,
  functions,
  selectedNamespace,
  functionsLoading,
  changeNamespace,
  fetchFunctionsByNamespace,
} = useNamespace();

// 响应式数据
const createDialogVisible = ref(false);
const detailsDialogVisible = ref(false);
const selectedFunction = ref<FunctionItem | null>(null);

// 创建函数步骤控制
const createStep = ref(0);
const stepLoading = ref(false);

// 环境表单数据
const envForm = reactive({
  name: "",
  image: "",
  version: 3,
  poolsize: 1,
});

// 包表单数据
const pkgForm = reactive({
  name: "",
  environment: "",
  code: "",
  functionName: "main",
});

// 函数表单数据
const fnForm = reactive({
  name: "",
  environment: "",
  package: "",
  functionName: "main",
  concurrency: 500,
  functionTimeout: 60,
  idletimeout: 120,
  requestsPerPod: 1,
  consistencyLevel: "elastic", // 新增：一致性程度，默认弹性一致性
});

// 旧的表单数据（保留兼容性）
const createForm = reactive({
  name: "",
  image: "",
  envVars: "",
  labels: "",
});

// 根据新的函数数据结构判断状态
const getFunctionStatusType = (functionItem: FunctionItem) => {
  const maxScale = functionItem.spec.InvokeStrategy.ExecutionStrategy.MaxScale;
  const minScale = functionItem.spec.InvokeStrategy.ExecutionStrategy.MinScale;

  if (maxScale === 0 && minScale === 0) {
    return "warning"; // 未配置伸缩策略
  } else if (maxScale > 0) {
    return "success"; // 已配置伸缩策略
  } else {
    return "info"; // 默认状态
  }
};

const getFunctionStatusText = (functionItem: FunctionItem) => {
  const maxScale = functionItem.spec.InvokeStrategy.ExecutionStrategy.MaxScale;
  const minScale = functionItem.spec.InvokeStrategy.ExecutionStrategy.MinScale;

  if (maxScale === 0 && minScale === 0) {
    return "未配置";
  } else if (maxScale > 0) {
    return "已配置";
  } else {
    return "默认";
  }
};

// 函数管理方法
const showDetails = (func: FunctionItem) => {
  selectedFunction.value = func;
  detailsDialogVisible.value = true;
};

// 刷新函数列表
const refreshFunctions = async () => {
  if (selectedNamespace.value) {
    await fetchFunctionsByNamespace(selectedNamespace.value);
    ElMessage.success("函数列表已刷新");
  }
};

// 步骤控制函数
const nextStep = async () => {
  if (createStep.value === 0) {
    // 验证环境配置
    if (!envForm.name || !envForm.image) {
      ElMessage.error("请填写环境名称和运行时镜像");
      return;
    }

    stepLoading.value = true;
    try {
      const envData = {
        apiVersion: "fission.io/v1",
        kind: "Environment",
        metadata: { name: envForm.name },
        spec: {
          version: envForm.version,
          poolsize: envForm.poolsize,
          runtime: { image: envForm.image },
        },
      };
      await createEnvironment(selectedNamespace.value, envData);
      pkgForm.environment = envForm.name;
      createStep.value = 1;
      ElMessage.success("环境创建成功，请配置包信息");
    } catch (error) {
      ElMessage.error("环境创建失败");
    } finally {
      stepLoading.value = false;
    }
  } else if (createStep.value === 1) {
    // 验证包配置
    if (!pkgForm.name || !pkgForm.code) {
      ElMessage.error("请填写包名称和函数代码");
      return;
    }

    stepLoading.value = true;
    try {
      const pkgData = {
        apiVersion: "fission.io/v1",
        kind: "Package",
        metadata: { name: pkgForm.name },
        spec: {
          environment: {
            name: pkgForm.environment,
            namespace: selectedNamespace.value,
          },
          deployment: {
            type: "literal",
            literal: stringToAscii(pkgForm.code),
          },
        },
      };
      await createPackage(selectedNamespace.value, pkgData);
      fnForm.package = pkgForm.name;
      fnForm.environment = pkgForm.environment;
      createStep.value = 2;
      ElMessage.success("包创建成功，请配置函数信息");
    } catch (error) {
      ElMessage.error("包创建失败");
    } finally {
      stepLoading.value = false;
    }
  }
};

const prevStep = () => {
  if (createStep.value > 0) {
    createStep.value--;
  }
};

// 将函数代码转换为ASCII码数组
const stringToAscii = (str: string): number[] => {
  return Array.from(str).map((char) => char.charCodeAt(0));
};

const deleteFunction = async (func: FunctionItem) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除函数 "${func.metadata.name}" 吗？`,
      "确认删除",
      {
        type: "warning",
        customClass: "common-messagebox",
        cancelButtonClass: "-emdc-button-plain",
        confirmButtonClass: "-emdc-button-primary",
      }
    );

    // 调用后端 API 删除函数
    await deleteFunctionAPI(selectedNamespace.value, func.metadata.name);

    // 删除成功后，从本地数组中移除
    const index = functions.value.findIndex(
      (f) => f.metadata.name === func.metadata.name
    );
    if (index > -1) {
      functions.value.splice(index, 1);
    }

    ElMessage.success(`函数 "${func.metadata.name}" 已删除`);
  } catch (error: any) {
    // 用户点击取消时，error 没有 message 属性
    if (error === 'cancel' || error?.toString().includes('cancel')) {
      ElMessage.info("已取消删除");
    } else {
      console.error("删除函数失败:", error);
      ElMessage.error(`删除函数失败: ${error?.message || '未知错误'}`);
    }
  }
};

const createFunction = async () => {
  // 验证函数配置
  if (!fnForm.name || !fnForm.functionName) {
    ElMessage.error("请填写函数名称和函数入口");
    return;
  }

  stepLoading.value = true;
  try {
    const fnData = {
      apiVersion: "fission.io/v1",
      kind: "Function",
      metadata: { name: fnForm.name },
      spec: {
        environment: {
          name: fnForm.environment,
          namespace: selectedNamespace.value,
        },
        package: {
          packageref: {
            name: fnForm.package,
            namespace: selectedNamespace.value,
          },
          functionName: fnForm.functionName,
        },
        concurrency: fnForm.concurrency,
        functionTimeout: fnForm.functionTimeout,
        idletimeout: fnForm.idletimeout,
        requestsPerPod: fnForm.requestsPerPod,
        InvokeStrategy: {
          StrategyType: "execution",
          ExecutionStrategy: {
            ExecutorType: "poolmgr",
            MaxScale: 0,
            MinScale: 0,
            SpecializationTimeout: 120,
            TargetCPUPercent: 0,
          },
        },
      },
    };
    await createFunctionAPI(selectedNamespace.value, fnData);
    ElMessage.success("函数创建成功");
    createDialogVisible.value = false;
    resetCreateForms();
    await refreshFunctions();
  } catch (error) {
    ElMessage.error("函数创建失败");
  } finally {
    stepLoading.value = false;
  }
};

// 重置创建表单
const resetCreateForms = () => {
  createStep.value = 0;
  Object.assign(envForm, { name: "", image: "", version: 3, poolsize: 1 });
  Object.assign(pkgForm, { name: "", environment: "", code: "", functionName: "main" });
  Object.assign(fnForm, {
    name: "",
    environment: "",
    package: "",
    functionName: "main",
    concurrency: 500,
    functionTimeout: 60,
    idletimeout: 120,
    requestsPerPod: 1,
    consistencyLevel: "elastic",
  });
};
</script>

<style lang="less" scoped>
// 一致性选项样式
.consistency-option {
  display: flex;
  // flex-direction: column;
  line-height: 1.4;

  strong {
    font-size: 14px;
    color: #303133;
  }

  .consistency-desc {
    font-size: 12px;
    color: #909399;
    margin-top: 2px;
  }
}

:deep(.el-radio-group) {
  display: flex;
  // flex-direction: column;
  gap: 16px;
}

:deep(.el-radio) {
  height: auto;
  align-items: flex-start;

  .el-radio__input {
    margin-top: 2px;
  }

  .el-radio__label {
    white-space: normal;
    padding-left: 8px;
  }
}

/* 函数管理页面的样式 */
.content-panel {
  background: #ffffff;
  border: 1px solid #e6e6e6;
  border-radius: 8px;
  padding: 25px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid #e6e6e6;
  flex-wrap: wrap;
  gap: 15px;

  .section-title {
    font-size: 20px;
    font-weight: 600;
    color: var(--emdc-text-color-primary);
    margin: 0;
  }

  .namespace-selector {
    display: flex;
    align-items: center;
    gap: 10px;

    span {
      font-size: 16px;
      color: var(--emdc-text-color-regular);
    }
  }

  .function-header-controls {
    display: flex;
    gap: 30px;
    align-items: center;
    flex-wrap: wrap;

    .namespace-selector {
      display: flex;
      align-items: center;
      gap: 10px;

      span {
        font-size: 14px;
        color: var(--emdc-text-color-regular);
        white-space: nowrap;
      }

      .common-select {
        min-width: 150px;
      }
    }

    .function-header-info {
      display: flex;
      gap: 20px;
      align-items: center;
      flex-wrap: wrap;

      .current-namespace,
      .function-count {
        font-size: 14px;
        color: var(--emdc-text-color-regular);

        strong {
          color: var(--emdc-color-primary);
          font-weight: 600;
        }
      }
    }
  }
}

.function-actions {
  display: flex;
  gap: 8px;
  margin-top: 0 !important;
  align-items: center;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  background: white;
  border-radius: 8px;
  border: 1px solid #e6e6e6;
}

.function-actions-header {
  display: flex;
  gap: 12px;
  align-items: center;
}

.loading-status {
  color: var(--emdc-color-primary);
  font-size: 12px;
  font-style: italic;
}

// 创建函数步骤样式
.create-steps {
  margin-bottom: 24px;
  padding: 20px 0;
  border-bottom: 1px solid #e6e6e6;
}

.step-content {
  padding: 20px 0;

  h4 {
    font-size: 16px;
    font-weight: 600;
    color: var(--emdc-text-color-primary);
    margin: 0 0 20px 0;
    padding-bottom: 8px;
    border-bottom: 1px solid #f0f0f0;
  }
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>