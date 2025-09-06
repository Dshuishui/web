<template>
  <div class="serverless-container">
    <!-- 统一的页面介绍区域 -->
    <div class="page-intro">
      <div class="intro-header">
        <h1>无服务器计算平台</h1>
        <p class="subtitle">面向边缘微小型数据中心的高性能函数计算服务</p>
      </div>

      <div class="intro-divider"></div>

      <div class="research-section">
        <h2>研究背景与核心技术</h2>
        <div class="research-content">
          <p>本项目致力于构建面向边缘微小型数据中心的无服务器计算平台，重点解决边缘环境下的函数计算性能与资源管理挑战。</p>
          <p>核心技术包括：强隔离弹性一致性代数系统设计、函数级动态资源配置机制、高性能函数间通信框架等关键技术，实现了边缘环境下的高并发、低延迟函数计算服务。</p>
          <p>技术创新点：提供面向边缘服务器无感的强隔离弹性一致性调度算法，实现复杂函数工作流的智能资源管理与编排，构建了高效的函数间直接通信机制。</p>
        </div>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <el-tabs v-model="activeTab" class="main-tabs common-tabs">

      <!-- 函数管理Tab -->
      <el-tab-pane label="函数管理" name="functions">
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

          <!-- 函数表格 -->
          <el-table :data="functions" class="common-table" stripe v-loading="functionsLoading"
            v-if="functions.length > 0">
            <el-table-column prop="metadata.name" label="函数名称" width="180" />
            <el-table-column prop="spec.environment.name" label="环境" width="120" />
            <el-table-column prop="metadata.namespace" label="命名空间" width="120" />
            <el-table-column prop="spec.concurrency" label="并发数" width="100" />
            <el-table-column prop="spec.functionTimeout" label="超时时间" width="100">
              <template #default="scope">
                {{ scope.row.spec.functionTimeout }}s
              </template>
            </el-table-column>
            <el-table-column label="伸缩策略" width="120">
              <template #default="scope">
                <el-tag size="small" type="info">
                  {{ scope.row.spec.InvokeStrategy.ExecutionStrategy.MinScale }}-{{
                    scope.row.spec.InvokeStrategy.ExecutionStrategy.MaxScale }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="状态" width="100">
              <template #default="scope">
                <el-tag :type="getFunctionStatusType(scope.row)" size="small">
                  {{ getFunctionStatusText(scope.row) }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="200">
              <template #default="scope">
                <div class="function-actions">
                  <el-button class="-emdc-button-plain" size="small" @click="showDetails(scope.row)">
                    详情
                  </el-button>
                  <el-button type="danger" size="small" @click="deleteFunction(scope.row)">
                    删除
                  </el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>

          <!-- 空状态显示 -->
          <div v-if="!functionsLoading && functions.length === 0" class="empty-state">
            <el-empty description="当前命名空间下暂无函数" :image-size="120">
              <el-button type="primary" @click="createDialogVisible = true">
                创建第一个函数
              </el-button>
            </el-empty>
          </div>
        </div>
      </el-tab-pane>

      <!-- 性能评估Tab -->
      <el-tab-pane label="性能评估" name="performance">
        <div class="content-panel">
          <!-- 核心指标展示区 -->
          <div class="performance-header">
            <h2 class="section-title">核心技术指标</h2>
            <p class="performance-subtitle">面向边缘服务器的强隔离弹性一致性代数系统</p>
          </div>

          <div class="metrics-showcase">
            <div class="metric-card primary-metric">
              <div class="metric-icon">
                <el-icon>
                  <Timer />
                </el-icon>
              </div>
              <div class="metric-content">
                <h3>并发处理能力</h3>
                <div class="metric-value">
                  <span class="target-value">≥ 10万</span>
                  <span class="unit">TPS</span>
                </div>
                <p class="metric-desc">函数级强隔离弹性一致性调度</p>
                <div class="metric-status" :class="performanceStatus.concurrency">
                  <el-icon v-if="performanceStatus.concurrency === 'achieved'">
                    <Check />
                  </el-icon>
                  <el-icon v-else-if="performanceStatus.concurrency === 'testing'">
                    <Loading />
                  </el-icon>
                  <el-icon v-else>
                    <Clock />
                  </el-icon>
                  <span>{{ getStatusText(performanceStatus.concurrency) }}</span>
                </div>
              </div>
            </div>

            <div class="metric-card primary-metric">
              <div class="metric-icon">
                <el-icon>
                  <Connection />
                </el-icon>
              </div>
              <div class="metric-content">
                <h3>数据吞吐率</h3>
                <div class="metric-value">
                  <span class="target-value">≥ 30</span>
                  <span class="unit">Gb/s</span>
                </div>
                <p class="metric-desc">函数间直接通信端到端性能</p>
                <div class="metric-status" :class="performanceStatus.throughput">
                  <el-icon v-if="performanceStatus.throughput === 'achieved'">
                    <Check />
                  </el-icon>
                  <el-icon v-else-if="performanceStatus.throughput === 'testing'">
                    <Loading />
                  </el-icon>
                  <el-icon v-else>
                    <Clock />
                  </el-icon>
                  <span>{{ getStatusText(performanceStatus.throughput) }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 测试模块区域 -->
          <div class="performance-modules">
            <!-- 左侧：并发处理能力测试模块 -->
            <div class="test-module">
              <div class="module-header">
                <h3>并发处理能力测试</h3>
                <p>测试函数级强隔离弹性一致性调度性能，目标：≥ 10万 TPS</p>
              </div>

              <div class="chart-section">
                <div class="chart-wrapper">
                  <canvas ref="concurrencyChart" width="400" height="250"></canvas>
                </div>

                <div class="test-control">
                  <div v-if="concurrencyTesting" class="test-progress">
                    <el-progress :percentage="concurrencyProgress" :show-text="false" />
                    <p>测试进行中... {{ concurrencyProgress.toFixed(0) }}% ({{ Math.floor(concurrencyProgress * 30 / 100) }}s
                      /
                      30s)</p>
                  </div>

                  <div class="test-actions">
                    <el-button class="-emdc-button-primary" :loading="concurrencyTesting" @click="startConcurrencyTest">
                      <el-icon>
                        <CaretRight />
                      </el-icon>
                      {{ concurrencyTesting ? '测试中...' : '开始并发测试' }}
                    </el-button>

                    <div v-if="concurrencyResults" class="test-result-summary">
                      <span class="result-item">峰值TPS: <strong>{{ concurrencyResults.peakTPS }}</strong></span>
                      <span class="result-item">平均TPS: <strong>{{ concurrencyResults.avgTPS }}</strong></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 右侧：数据吞吐率测试模块 -->
            <div class="test-module">
              <div class="module-header">
                <h3>数据吞吐率测试</h3>
                <p>测试不同包大小下的函数间通信性能，目标：≥ 30 Gb/s</p>
              </div>

              <div class="chart-section">
                <div class="chart-wrapper">
                  <canvas ref="throughputChart" width="400" height="250"></canvas>
                </div>

                <div class="test-control">
                  <div v-if="throughputTesting" class="test-progress">
                    <el-progress :percentage="throughputProgress" :show-text="false" />
                    <p>测试进行中... {{ throughputProgress.toFixed(0) }}% ({{ throughputCurrentPackage }} KB包)</p>
                  </div>

                  <div class="test-actions">
                    <el-button class="-emdc-button-primary" :loading="throughputTesting" @click="startThroughputTest">
                      <el-icon>
                        <CaretRight />
                      </el-icon>
                      {{ throughputTesting ? '测试中...' : '开始吞吐测试' }}
                    </el-button>

                    <el-button class="-emdc-button-plain" :loading="throughputTesting" @click="startMockThroughputTest"
                      style="margin-left: 10px;">
                      <el-icon>
                        <Download />
                      </el-icon>
                      模拟测试
                    </el-button>

                    <p class="test-description">
                      <strong>真实测试</strong>：启动测试 → 发送数据 → 等待结果（约15秒）<br>
                      <strong>模拟测试</strong>：快速演示效果，使用预设数据
                    </p>

                    <div v-if="throughputResults" class="test-result-summary">
                      <span class="result-item">峰值吞吐: <strong>{{ throughputResults.peakThroughput }}
                          Gb/s</strong></span>
                      <span class="result-item">平均吞吐: <strong>{{ throughputResults.avgThroughput }} Gb/s</strong></span>
                      <span class="result-item">测试包数: <strong>{{ throughputResults.finalData.length }}</strong></span>
                    </div>

                    <!-- 详细测试数据表格 -->
                    <div v-if="throughputResults && throughputResults.finalData.length > 0" class="detailed-results">
                      <h4 style="margin: 15px 0 10px 0; color: var(--emdc-text-color-primary);">详细测试数据</h4>
                      <el-table :data="getDetailedTestData()" size="small" border class="detailed-table">
                        <el-table-column prop="pkt_kb" label="包大小(KB)" width="100" />
                        <el-table-column prop="throughput_gbps" label="吞吐率(Gb/s)" width="120" />
                        <el-table-column prop="packets_per_sec" label="包/秒" width="150" />
                        <el-table-column prop="duration_sec" label="持续时间(s)" width="120" />
                      </el-table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>

    <!-- 创建函数对话框 -->
    <el-dialog v-model="createDialogVisible" title="创建函数" width="800px" class="common-dialog">
      <el-steps :active="createStep" finish-status="success" class="create-steps">
        <el-step title="创建环境" description="配置运行环境" />
        <el-step title="创建包" description="上传函数代码" />
        <el-step title="创建函数" description="配置函数参数" />
      </el-steps>

      <!-- 步骤1：创建环境 -->
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

      <!-- 步骤2：创建包 -->
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

      <!-- 步骤3：创建函数 -->
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
        </el-form>
      </div>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="createDialogVisible = false">取消</el-button>
          <el-button v-if="createStep > 0" @click="prevStep">上一步</el-button>
          <el-button v-if="createStep < 2" type="primary" @click="nextStep" :loading="stepLoading">
            下一步
          </el-button>
          <el-button v-if="createStep === 2" type="primary" @click="createFunction" :loading="stepLoading">
            创建函数
          </el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 函数详情对话框 -->
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
import { ref, reactive, onMounted, nextTick, onUnmounted } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { Plus, CaretRight, Timer, Connection, Check, Loading, Clock, Download } from "@element-plus/icons-vue";

// 接口定义 - 从useNamespace导入
import { useNamespace, type FunctionItem } from './hooks/useNamespace';
import { createEnvironment, createPackage, createFunction as createFunctionAPI, startPerformanceTest, sendPerformanceTest } from '@/api/fission';

interface ConcurrencyResults {
  peakTPS: string;
  avgTPS: string;
  finalData: number[];
}

// 修改接口定义，使 detailedData 可选且类型更灵活
interface ThroughputResults {
  peakThroughput: string;
  avgThroughput: string;
  finalData: number[];
  detailedData?: any[]; // 修改为 any[] 以支持不同的数据结构
}

// 性能测试API返回的数据结构
interface PerformanceTestItem {
  role: string;
  pkt_kb: number;
  packets_per_sec: number;
  throughput_gbps: number;
  duration_sec: number;
}

interface PerformanceTestResponse extends Array<PerformanceTestItem> { }

// 处理后的数据结构（用于图表显示）
interface ProcessedTestItem {
  pkt_kb: number;
  throughput_gbps: number;
  packets_per_sec: number;
  duration_sec: number;
}

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
const activeTab = ref("functions");
const createDialogVisible = ref(false);
const detailsDialogVisible = ref(false);
const selectedFunction = ref<FunctionItem | null>(null);

// 性能状态
const performanceStatus = ref({
  concurrency: 'pending', // pending, testing, achieved, failed
  throughput: 'pending'
});

// 并发测试相关
const concurrencyTesting = ref(false);
const concurrencyProgress = ref(0);
const concurrencyResults = ref<ConcurrencyResults | null>(null);
const concurrencyInterval = ref<NodeJS.Timeout | null>(null);
const concurrencyRealTimeData = ref<number[]>([]);

// 吞吐测试相关 - 修改 throughputCurrentPackage 类型
const throughputTesting = ref(false);
const throughputProgress = ref(0);
const throughputResults = ref<ThroughputResults | null>(null);
const throughputCurrentPackage = ref<string | number>(''); // 支持字符串和数字类型
const throughputRealTimeData = ref<number[]>([]);

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
});

// 旧的表单数据（保留兼容性）
const createForm = reactive({
  name: "",
  image: "",
  envVars: "",
  labels: "",
});

// 图表引用
const concurrencyChart = ref(null);
const throughputChart = ref(null);

// 图表实例
let concurrencyChartInstance: any = null;
let throughputChartInstance: any = null;

// 工具方法
const getStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    running: "运行中",
    pending: "待启动",
    testing: "测试中",
    achieved: "已达标",
    failed: "未达标",
  };
  return statusMap[status] || status;
};

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

const formatNumber = (row: any, column: any, cellValue: number) => {
  return cellValue.toLocaleString();
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
    ElMessage.success('函数列表已刷新');
  }
};

// 步骤控制函数
const nextStep = async () => {
  if (createStep.value === 0) {
    // 验证环境配置
    if (!envForm.name || !envForm.image) {
      ElMessage.error('请填写环境名称和运行时镜像');
      return;
    }

    stepLoading.value = true;
    try {
      // 创建环境
      const envData = {
        apiVersion: "fission.io/v1",
        kind: "Environment",
        metadata: {
          name: envForm.name
        },
        spec: {
          version: envForm.version,
          poolsize: envForm.poolsize,
          runtime: {
            image: envForm.image
          }
        }
      };

      // 调用创建环境的API
      await createEnvironment(selectedNamespace.value, envData);
      console.log('创建环境:', envData);

      // 更新包表单中的环境名称
      pkgForm.environment = envForm.name;

      createStep.value = 1;
      ElMessage.success('环境创建成功，请配置包信息');
    } catch (error) {
      ElMessage.error('环境创建失败');
    } finally {
      stepLoading.value = false;
    }
  } else if (createStep.value === 1) {
    // 验证包配置
    if (!pkgForm.name || !pkgForm.code) {
      ElMessage.error('请填写包名称和函数代码');
      return;
    }

    stepLoading.value = true;
    try {
      // 创建包
      const pkgData = {
        apiVersion: "fission.io/v1",
        kind: "Package",
        metadata: { name: pkgForm.name },
        spec: {
          environment: {
            name: pkgForm.environment,
            namespace: selectedNamespace.value
          },
          deployment: {
            type: "literal",
            literal: stringToAscii(pkgForm.code)
          }
        }
      };

      // 调用创建包的API
      await createPackage(selectedNamespace.value, pkgData);
      console.log('创建包:', pkgData);

      // 更新函数表单中的包名称
      fnForm.package = pkgForm.name;
      fnForm.environment = pkgForm.environment;

      createStep.value = 2;
      ElMessage.success('包创建成功，请配置函数信息');
    } catch (error) {
      ElMessage.error('包创建失败');
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
  return Array.from(str).map(char => char.charCodeAt(0));
};

const deleteFunction = async (func: FunctionItem) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除函数 "${func.metadata.name}" 吗？`,
      "确认删除",
      {
        type: "warning",
        customClass: "common-messagebox",
      }
    );
    const index = functions.value.findIndex((f) => f.metadata.name === func.metadata.name);
    if (index > -1) {
      functions.value.splice(index, 1);
      ElMessage.success(`函数 "${func.metadata.name}" 已删除`);
    }
  } catch {
    ElMessage.info("已取消删除");
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
    // 创建函数
    const fnData = {
      apiVersion: "fission.io/v1",
      kind: "Function",
      metadata: { name: fnForm.name },
      spec: {
        environment: {
          name: fnForm.environment,
          namespace: selectedNamespace.value
        },
        package: {
          packageref: {
            name: fnForm.package,
            namespace: selectedNamespace.value
          },
          functionName: fnForm.functionName
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
            TargetCPUPercent: 0
          }
        }
      }
    };

    // 调用创建函数的API
    await createFunctionAPI(selectedNamespace.value, fnData);
    console.log('创建函数:', fnData);

    ElMessage.success("函数创建成功");
    createDialogVisible.value = false;

    // 重置表单和步骤
    resetCreateForms();

    // 刷新函数列表
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
  Object.assign(envForm, {
    name: "",
    image: "",
    version: 3,
    poolsize: 1,
  });
  Object.assign(pkgForm, {
    name: "",
    environment: "",
    code: "",
    functionName: "main",
  });
  Object.assign(fnForm, {
    name: "",
    environment: "",
    package: "",
    functionName: "main",
    concurrency: 500,
    functionTimeout: 60,
    idletimeout: 120,
    requestsPerPod: 1,
  });
};

// 并发处理能力测试 - 真实API实现
const startConcurrencyTest = async () => {
  concurrencyTesting.value = true;
  concurrencyProgress.value = 0;
  concurrencyRealTimeData.value = [];
  performanceStatus.value.concurrency = 'testing';

  // 初始化图表
  await nextTick();
  initConcurrencyChart();

  const totalDuration = 30; // 30秒测试时长
  const expectedDataPoints = 10; // 预期获得10个数据点（每3秒一个）
  let currentDataPoints = 0;
  let startTime = Date.now();

  try {
    // 发送POST请求启动性能测试
    const response = await fetch('http://127.0.0.1:30081/kvstore', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        servers: ["10.15.16.40:3088", "10.15.16.141:3088", "10.15.17.215:3088"]
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // 检查响应是否支持流式读取
    if (!response.body) {
      throw new Error('ReadableStream not supported in this browser.');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    // 设置超时定时器，防止测试卡住
    const timeoutId = setTimeout(() => {
      reader.cancel();
      finishConcurrencyTest();
      ElMessage.error('测试超时，已自动结束');
    }, 35000); // 35秒超时，比预期的30秒多5秒缓冲

    // 读取流式数据
    while (true) {
      const { done, value } = await reader.read();
      
      if (done) {
        clearTimeout(timeoutId);
        break;
      }

      // 将接收到的数据解码并添加到缓冲区
      buffer += decoder.decode(value, { stream: true });
      
      // 处理缓冲区中的完整数据行
      let lines = buffer.split('\n');
      buffer = lines.pop() || ''; // 保留最后一个可能不完整的行

      for (let line of lines) {
        // 去除前缀 "data: " 并解析JSON
        if (line.startsWith('data: ')) {
          try {
            const jsonStr = line.substring(6); // 移除 "data: " 前缀
            const data = JSON.parse(jsonStr);
            
            // 验证数据格式并提取TPS
            if (data.success && data.results && data.results.tps) {
              const tpsValue = parseFloat(data.results.tps);
              
              if (!isNaN(tpsValue)) {
                // 添加TPS数据到数组
                concurrencyRealTimeData.value.push(tpsValue);
                currentDataPoints++;
                
                // 计算进度（基于已接收的数据点数）
                concurrencyProgress.value = Math.min((currentDataPoints / expectedDataPoints) * 100, 100);
                
                // 更新图表
                updateConcurrencyChart();
                
                // 输出调试信息
                console.log(`接收到TPS数据: ${tpsValue}, 进度: ${concurrencyProgress.value.toFixed(1)}%`);
                
                // 检查是否已接收足够的数据点或者时间已到
                const elapsedTime = (Date.now() - startTime) / 1000;
                if (currentDataPoints >= expectedDataPoints || elapsedTime >= totalDuration) {
                  clearTimeout(timeoutId);
                  reader.cancel();
                  break;
                }
              }
            }
          } catch (parseError) {
            console.warn('解析数据行失败:', line, parseError);
          }
        }
      }
    }

    // 测试完成
    finishConcurrencyTest();

  } catch (error) {
    console.error('并发测试失败:', error);
    
    // 错误处理
    concurrencyTesting.value = false;
    performanceStatus.value.concurrency = 'failed';
    
    // 安全的错误信息提取
    // const errorMessage = error?.message || error?.toString() || '未知错误';
    // const errorName = error?.name || '';
    
    // // 根据错误类型显示不同的错误信息
    // if (errorName === 'TypeError' && errorMessage.includes('fetch')) {
    //   ElMessage.error('无法连接到测试服务器，请检查服务器是否启动');
    // } else if (errorName === 'AbortError' || errorMessage.includes('aborted')) {
    //   ElMessage.error('请求被取消');
    // } else if (errorName === 'TimeoutError' || errorMessage.includes('timeout')) {
    //   ElMessage.error('请求超时，请检查网络连接');
    // } else if (errorMessage.includes('HTTP error')) {
    //   ElMessage.error(`服务器返回错误: ${errorMessage}`);
    // } else if (errorMessage.includes('CORS') || errorMessage.includes('cross-origin')) {
    //   ElMessage.error('跨域请求被阻止，请检查服务器CORS配置');
    // } else if (errorMessage.includes('network') || errorMessage.includes('NetworkError')) {
    //   ElMessage.error('网络错误，请检查网络连接');
    // } else {
    //   ElMessage.error(`测试执行失败: ${errorMessage}`);
    // }
  }
};

// 完成并发测试的处理函数
const finishConcurrencyTest = () => {
  // 清理定时器（如果有的话）
  if (concurrencyInterval.value) {
    clearInterval(concurrencyInterval.value);
    concurrencyInterval.value = null;
  }

  // 检查是否有有效数据
  if (concurrencyRealTimeData.value.length === 0) {
    ElMessage.error('未接收到有效的测试数据');
    concurrencyTesting.value = false;
    performanceStatus.value.concurrency = 'failed';
    return;
  }

  // 计算峰值和平均TPS
  const peakTPS = Math.max(...concurrencyRealTimeData.value);
  const avgTPS = Math.floor(concurrencyRealTimeData.value.reduce((a, b) => a + b, 0) / concurrencyRealTimeData.value.length);

  // 设置测试结果
  concurrencyResults.value = {
    peakTPS: peakTPS.toLocaleString(),
    avgTPS: avgTPS.toLocaleString(),
    finalData: [...concurrencyRealTimeData.value]
  };

  // 更新性能状态（目标是10万TPS）
  performanceStatus.value.concurrency = peakTPS >= 100000 ? 'achieved' : 'failed';

  // 设置测试完成状态
  concurrencyTesting.value = false;
  concurrencyProgress.value = 100;

  // 显示完成消息
  ElMessage.success(`并发处理能力测试完成！峰值TPS: ${peakTPS.toLocaleString()}`);
  
  // 输出详细结果到控制台
  console.log("测试结果详情:", {
    dataPoints: concurrencyRealTimeData.value.length,
    peakTPS: peakTPS,
    avgTPS: avgTPS,
    allData: concurrencyRealTimeData.value,
    achieved: peakTPS >= 100000
  });
};

const startThroughputTest = async () => {
  throughputTesting.value = true;
  throughputProgress.value = 0;
  throughputRealTimeData.value = [];
  throughputCurrentPackage.value = ''; // 清空当前包大小显示
  performanceStatus.value.throughput = 'testing';

  // 初始化图表
  await nextTick();
  initThroughputChart();

  try {
    // 显示测试开始
    ElMessage.info('开始数据吞吐率测试...');
    throughputProgress.value = 10; // 显示开始进度

    // 并行发送两个请求
    console.log('同时发送请求到 sender 和 receiver 端点...');
    
    const [senderResponse, receiverResponse] = await Promise.all([
      fetch('http://127.0.0.1:30085/topic3-pro-kp-sender', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        signal: AbortSignal.timeout(60000) // 60秒超时
      }),
      fetch('http://127.0.0.1:30085/topic3-pro-kp-receiver', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        signal: AbortSignal.timeout(60000) // 60秒超时
      })
    ]);

    throughputProgress.value = 50; // 请求已发送

    // 检查两个响应的状态
    if (!senderResponse.ok) {
      throw new Error(`Sender endpoint error! status: ${senderResponse.status}`);
    }
    if (!receiverResponse.ok) {
      throw new Error(`Receiver endpoint error! status: ${receiverResponse.status}`);
    }

    // 解析两个响应的JSON数据
    const [senderData, receiverData] = await Promise.all([
      senderResponse.json(),
      receiverResponse.json()
    ]);

    throughputProgress.value = 80; // 数据已接收

    // 输出调试信息
    console.log('Sender 数据:', senderData);
    console.log('Receiver 数据:', receiverData);

    // 选择使用哪个数据源（优先使用 sender 数据，如果没有则使用 receiver 数据）
    let data = senderData;
    if (!Array.isArray(senderData) || senderData.length === 0) {
      if (Array.isArray(receiverData) && receiverData.length > 0) {
        data = receiverData;
        console.log('使用 receiver 数据作为主要数据源');
      } else {
        throw new Error('两个端点都没有返回有效数据');
      }
    } else {
      console.log('使用 sender 数据作为主要数据源');
    }

    // 验证响应数据格式
    if (!Array.isArray(data)) {
      throw new Error('响应数据格式错误：期望数组格式');
    }

    if (data.length === 0) {
      throw new Error('未接收到测试数据');
    }

    // 处理测试数据
    const processedData: ProcessedTestItem[] = data
      .filter(item => {
        // 过滤有效数据
        return item && 
               typeof item.pkt_kb === 'number' && 
               typeof item.throughput_gbps === 'number' &&
               !isNaN(item.pkt_kb) && 
               !isNaN(item.throughput_gbps);
      })
      .map(item => ({
        pkt_kb: item.pkt_kb,
        throughput_gbps: parseFloat(item.throughput_gbps.toFixed(2)), // 保留2位小数
        packets_per_sec: item.packets_per_sec,
        duration_sec: item.duration_sec
      }))
      .sort((a, b) => a.pkt_kb - b.pkt_kb); // 按包大小排序

    if (processedData.length === 0) {
      throw new Error('没有有效的测试数据');
    }

    // 更新数据到状态
    throughputRealTimeData.value = processedData.map(item => item.throughput_gbps);
    
    // 更新图表数据
    updateThroughputChart(processedData);
    
    throughputProgress.value = 100; // 完成

    // 计算结果统计
    const throughputValues = processedData.map(item => item.throughput_gbps);
    const peakThroughput = Math.max(...throughputValues);
    const avgThroughput = (throughputValues.reduce((a, b) => a + b, 0) / throughputValues.length).toFixed(1);

    // 设置测试结果
    throughputResults.value = {
      peakThroughput: peakThroughput.toFixed(1),
      avgThroughput: avgThroughput,
      finalData: [...throughputValues],
      detailedData: processedData // 保存详细数据供调试使用
    };

    // 更新性能状态（目标是30 Gb/s）
    performanceStatus.value.throughput = peakThroughput >= 30 ? 'achieved' : 'failed';

    // 设置测试完成状态
    throughputTesting.value = false;

    // 显示完成消息
    const statusText = peakThroughput >= 30 ? '达标' : '未达标';
    ElMessage.success(`数据吞吐率测试完成！峰值: ${peakThroughput.toFixed(1)} Gb/s (${statusText})`);
    
    // 输出详细结果到控制台
    console.log("吞吐率测试结果详情:", {
      dataPoints: processedData.length,
      peakThroughput: peakThroughput,
      avgThroughput: parseFloat(avgThroughput),
      achieved: peakThroughput >= 30,
      detailedData: processedData
    });

    // 显示每个包大小的详细结果
    console.table(processedData.map(item => ({
      '包大小 (KB)': item.pkt_kb,
      '吞吐率 (Gb/s)': item.throughput_gbps,
      '包每秒': Math.round(item.packets_per_sec),
      '持续时间 (s)': item.duration_sec?.toFixed(2)
    })));

  } catch (error) {
    console.error('数据吞吐率测试失败:', error);
    
    // 错误处理
    throughputTesting.value = false;
    performanceStatus.value.throughput = 'failed';
    throughputProgress.value = 0;
    
    // 安全的错误信息提取
    // const errorMessage = error?.message || error?.toString() || '未知错误';
    // const errorName = error?.name || '';
    
    // // 根据错误类型显示不同的错误信息
    // if (errorName === 'TypeError' && errorMessage.includes('fetch')) {
    //   ElMessage.error('无法连接到吞吐测试服务器，请检查服务器是否启动');
    // } else if (errorName === 'AbortError' || errorMessage.includes('aborted')) {
    //   ElMessage.error('请求被取消');
    // } else if (errorName === 'TimeoutError' || errorMessage.includes('timeout')) {
    //   ElMessage.error('吞吐测试超时，请检查服务器响应');
    // } else if (errorMessage.includes('HTTP error')) {
    //   ElMessage.error(`服务器返回错误: ${errorMessage}`);
    // } else if (errorMessage.includes('JSON') || errorMessage.includes('parse')) {
    //   ElMessage.error('服务器返回的数据格式错误');
    // } else if (errorMessage.includes('CORS') || errorMessage.includes('cross-origin')) {
    //   ElMessage.error('跨域请求被阻止，请检查服务器CORS配置');
    // } else if (errorMessage.includes('network') || errorMessage.includes('NetworkError')) {
    //   ElMessage.error('网络错误，请检查网络连接');
    // } else {
    //   ElMessage.error(`吞吐测试失败: ${errorMessage}`);
    // }
  }
};
// 处理性能测试结果
const processPerformanceTestResults = (results: PerformanceTestResponse) => {
  console.log("收到API测试结果:", results);

  // 验证数据格式
  if (!Array.isArray(results) || results.length === 0) {
    throw new Error("API返回的测试结果格式无效或为空");
  }

  // 处理数据格式，确保与新版本兼容
  const processedData: ProcessedTestItem[] = results
    .filter(item => {
      return item && 
             typeof item.throughput_gbps === 'number' && 
             !isNaN(item.throughput_gbps);
    })
    .map(item => ({
      pkt_kb: item.pkt_kb || 4, // 如果没有pkt_kb，默认为4
      throughput_gbps: parseFloat(item.throughput_gbps.toFixed(2)),
      packets_per_sec: item.packets_per_sec,
      duration_sec: item.duration_sec
    }))
    .sort((a, b) => a.pkt_kb - b.pkt_kb);

  // 提取吞吐率数据
  throughputRealTimeData.value = processedData.map(item => item.throughput_gbps);

  // 保存详细数据用于表格显示
  throughputResults.value = {
    peakThroughput: Math.max(...processedData.map(item => item.throughput_gbps)).toFixed(1),
    avgThroughput: (processedData.reduce((sum, item) => sum + item.throughput_gbps, 0) / processedData.length).toFixed(1),
    finalData: processedData.map(item => item.throughput_gbps),
    detailedData: processedData // 保存详细数据
  };

  // 更新进度
  throughputProgress.value = 100;

  // 使用新的参数格式更新图表显示
  updateThroughputChart(processedData);

  // 完成测试
  finishThroughputTest();
};

// 模拟吞吐率测试（用于演示效果）
const startMockThroughputTest = async () => {
  try {
    throughputTesting.value = true;
    throughputProgress.value = 0;
    throughputRealTimeData.value = [];
    throughputCurrentPackage.value = 4;
    performanceStatus.value.throughput = 'testing';

    // 初始化图表
    await nextTick();
    initThroughputChart();

    // 模拟测试流程
    ElMessage.info("模拟测试：正在启动性能测试...");
    throughputProgress.value = 25;
    await new Promise(resolve => setTimeout(resolve, 1000));

    ElMessage.info("模拟测试：等待系统准备就绪...");
    throughputProgress.value = 50;
    await new Promise(resolve => setTimeout(resolve, 1000));

    ElMessage.info("模拟测试：正在发送测试数据，等待测试完成...");
    throughputProgress.value = 75;
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 模拟API返回的数据结构（基于你提供的真实数据）
    const mockApiResponse: PerformanceTestResponse = [
      { "role": "sender", "pkt_kb": 4, "packets_per_sec": 2359053.9960401347, "throughput_gbps": 31.99261462524825, "duration_sec": 4.23898733 },
      { "role": "sender", "pkt_kb": 8, "packets_per_sec": 1574278.9256324528, "throughput_gbps": 36.08636020705889, "duration_sec": 6.352114506 },
      { "role": "sender", "pkt_kb": 16, "packets_per_sec": 1406212.6714035033, "throughput_gbps": 31.65682023968546, "duration_sec": 7.111299879 },
      { "role": "sender", "pkt_kb": 32, "packets_per_sec": 688132.5815047595, "throughput_gbps": 38.00111853143542, "duration_sec": 14.532083306 }
    ];

    console.log("模拟测试数据:", mockApiResponse);
    console.log("图表实例状态:", !!throughputChartInstance);

    // 处理模拟测试结果
    processPerformanceTestResults(mockApiResponse);

  } catch (error) {
    console.error("模拟测试失败:", error);
    ElMessage.error("模拟测试失败，请重试");
    throughputTesting.value = false;
    performanceStatus.value.throughput = 'failed';
  }
};

// 获取详细测试数据用于表格显示
const getDetailedTestData = () => {
  if (throughputResults.value && throughputResults.value.detailedData) {
    return throughputResults.value.detailedData;
  }
  // 如果没有详细数据，返回空数组
  return [];
};

const finishThroughputTest = () => {
  // 性能状态已经在processPerformanceTestResults中设置
  const peakThroughput = Math.max(...throughputRealTimeData.value);

  // 更新性能状态 - 根据实际数据调整阈值
  performanceStatus.value.throughput = peakThroughput >= 30 ? 'achieved' : 'failed';

  throughputTesting.value = false;
  ElMessage.success("数据吞吐率测试完成！");

  // 显示详细结果
  console.log("测试结果详情:", {
    peakThroughput: peakThroughput.toFixed(2),
    avgThroughput: throughputResults.value?.avgThroughput,
    dataPoints: throughputRealTimeData.value.length,
    allData: throughputRealTimeData.value
  });
};

// 图表初始化和更新方法
const initConcurrencyChart = async () => {
  try {
    const Chart = (await import("chart.js/auto")).default;

    if (concurrencyChart.value) {
      // 如果已存在图表实例，先销毁
      if (concurrencyChartInstance) {
        concurrencyChartInstance.destroy();
      }

      concurrencyChartInstance = new Chart(concurrencyChart.value, {
        type: "line",
        data: {
          labels: ['0s', '3s', '6s', '9s', '12s', '15s', '18s', '21s', '24s', '27s', '30s'], // 预设时间标签
          datasets: [
            {
              label: "实时TPS",
              data: [],
              borderColor: "#0C8357",
              backgroundColor: "rgba(12, 131, 87, 0.1)",
              tension: 0.4,
              fill: true,
            },
            {
              label: "目标线 (10万TPS)",
              data: new Array(11).fill(100000), // 预设目标线数据
              borderColor: "#e02020",
              borderDash: [5, 5],
              pointRadius: 0,
              fill: false,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          animation: false,
          plugins: {
            legend: {
              display: true,
              position: 'top',
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              max: 120000,
              title: {
                display: true,
                text: 'TPS (每秒事务数)'
              }
            },
            x: {
              title: {
                display: true,
                text: '测试时间'
              }
            }
          },
        },
      });
    }
  } catch (error) {
    console.error("并发图表初始化失败:", error);
  }
};

const updateConcurrencyChart = () => {
  if (concurrencyChartInstance) {
    const labels = Array.from({ length: concurrencyRealTimeData.value.length }, (_, i) => `${i * 3}s`);

    concurrencyChartInstance.data.labels = labels;
    concurrencyChartInstance.data.datasets[0].data = [...concurrencyRealTimeData.value];
    concurrencyChartInstance.data.datasets[1].data = new Array(labels.length).fill(100000);
    concurrencyChartInstance.update('none');
  }
};

const initThroughputChart = async () => {
  try {
    const Chart = (await import("chart.js/auto")).default;

    if (throughputChart.value) {
      // 如果已存在图表实例，先销毁
      if (throughputChartInstance) {
        throughputChartInstance.destroy();
      }

      throughputChartInstance = new Chart(throughputChart.value, {
        type: "line",
        data: {
          labels: ['4', '8', '16', '32'], // 包大小标签 (pkt_kb)
          datasets: [
            {
              label: "吞吐率 (Gb/s)",
              data: [],
              borderColor: "#4EC58C",
              backgroundColor: "rgba(78, 197, 140, 0.1)",
              tension: 0.4,
              fill: true,
              pointRadius: 4,
              pointHoverRadius: 6,
            },
            {
              label: "目标线 (30 Gb/s)",
              data: new Array(4).fill(30), // 目标线数据
              borderColor: "#e02020",
              borderDash: [5, 5],
              pointRadius: 0,
              fill: false,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          animation: false,
          plugins: {
            legend: {
              display: true,
              position: 'top',
            },
            tooltip: {
              callbacks: {
                label: function (context) {
                  if (context.datasetIndex === 0) {
                    return `吞吐率: ${context.parsed.y.toFixed(2)} Gb/s`;
                  }
                  return context.dataset.label;
                }
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              max: 40, // 固定Y轴最大值为40
              title: {
                display: true,
                text: '吞吐率 (Gb/s)'
              }
            },
            x: {
              title: {
                display: true,
                text: '包大小 (KB)'
              }
            }
          },
        },
      });
    }
  } catch (error) {
    console.error("吞吐图表初始化失败:", error);
  }
};

// 更新吞吐率图表函数，支持可选参数
const updateThroughputChart = (processedData?: ProcessedTestItem[]) => {
  if (!throughputChartInstance) {
    console.warn('图表实例不存在，无法更新');
    return;
  }

  let labels, throughputData;

  if (processedData && Array.isArray(processedData)) {
    // 新版本：使用传入的 processedData
    labels = processedData.map(item => item.pkt_kb.toString());
    throughputData = processedData.map(item => item.throughput_gbps);
  } else {
    // 旧版本：使用 throughputRealTimeData 和固定的包大小
    const packageSizes = [4, 8, 16, 32];
    labels = packageSizes.slice(0, throughputRealTimeData.value.length).map(size => size.toString());
    throughputData = [...throughputRealTimeData.value];
  }

  console.log("更新吞吐率图表:", {
    labels: labels,
    data: throughputData,
    chartInstance: !!throughputChartInstance
  });

  // 更新图表数据
  throughputChartInstance.data.labels = labels;
  throughputChartInstance.data.datasets[0].data = throughputData;
  
  // 更新目标线数据（保持30 Gb/s的目标线）
  throughputChartInstance.data.datasets[1].data = new Array(labels.length).fill(30);
  
  // 更新图表
  throughputChartInstance.update('none');
};

// 清理函数
const cleanup = () => {
  if (concurrencyInterval.value) {
    clearInterval(concurrencyInterval.value);
  }
  if (concurrencyChartInstance) {
    concurrencyChartInstance.destroy();
  }
  if (throughputChartInstance) {
    throughputChartInstance.destroy();
  }
};

onMounted(async () => {
  // 页面加载完成后立即初始化图表
  await nextTick();
  initConcurrencyChart();
  initThroughputChart();
});

onUnmounted(() => {
  cleanup();
});
</script>

<style lang="less" scoped>
.serverless-container {
  padding: 20px;

  .page-intro {
    background: #ffffff;
    border: 1px solid #e6e6e6;
    border-radius: 8px;
    padding: 32px;
    margin-bottom: 25px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);

    .intro-header {
      text-align: center;
      margin-bottom: 24px;

      h1 {
        font-size: 28px;
        font-weight: 600;
        color: #2c3e50;
        margin-bottom: 12px;
      }

      .subtitle {
        font-size: 16px;
        color: #7f8c8d;
        margin: 0;
      }
    }

    .intro-divider {
      height: 1px;
      background: linear-gradient(90deg, transparent, #e6e6e6, transparent);
      margin: 24px 0;
    }

    .research-section {
      h2 {
        font-size: 20px;
        font-weight: 600;
        color: var(--emdc-color-primary);
        margin-bottom: 16px;
        text-align: center;
      }

      .research-content {
        font-size: 15px;
        line-height: 1.8;
        color: var(--emdc-text-color-primary);

        p {
          margin-bottom: 12px;
          text-indent: 2em;
        }
      }
    }
  }

  .main-tabs {
    margin-bottom: 20px;
  }

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

  // 性能评估专用样式
  .performance-header {
    text-align: center;
    margin-bottom: 30px;

    .section-title {
      font-size: 22px;
      font-weight: 600;
      color: var(--emdc-text-color-primary);
      margin-bottom: 8px;
    }

    .performance-subtitle {
      font-size: 16px;
      color: var(--emdc-text-color-regular);
      margin: 0;
    }
  }

  .metrics-showcase {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
    gap: 24px;
    margin-bottom: 40px;
  }

  .metric-card {
    background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
    border: 2px solid #e6e6e6;
    border-radius: 12px;
    padding: 24px;
    display: flex;
    align-items: center;
    gap: 20px;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(90deg, var(--emdc-color-primary) 0%, var(--emdc-hover-color-primary) 100%);
    }

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(12, 131, 87, 0.15);
      border-color: var(--emdc-color-primary);
    }

    .metric-icon {
      width: 60px;
      height: 60px;
      background: linear-gradient(135deg, var(--emdc-color-primary) 0%, var(--emdc-hover-color-primary) 100%);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 24px;
      flex-shrink: 0;
    }

    .metric-content {
      flex: 1;

      h3 {
        font-size: 18px;
        font-weight: 600;
        color: var(--emdc-text-color-primary);
        margin: 0 0 8px 0;
      }

      .metric-value {
        display: flex;
        align-items: baseline;
        gap: 8px;
        margin-bottom: 8px;

        .target-value {
          font-size: 32px;
          font-weight: 700;
          color: var(--emdc-color-primary);
          line-height: 1;
        }

        .unit {
          font-size: 16px;
          font-weight: 500;
          color: var(--emdc-text-color-regular);
        }
      }

      .metric-desc {
        font-size: 14px;
        color: var(--emdc-text-color-secondary);
        margin: 0 0 12px 0;
        line-height: 1.4;
      }

      .metric-status {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 14px;
        font-weight: 500;

        &.pending {
          color: var(--emdc-text-color-secondary);
        }

        &.testing {
          color: var(--emdc-color-warning);
        }

        &.achieved {
          color: var(--emdc-color-success);
        }

        &.failed {
          color: var(--emdc-color-danger);
        }
      }
    }
  }

  .performance-modules {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
    gap: 32px;
    margin-bottom: 32px;
  }

  .test-module {
    background: white;
    border: 1px solid #e6e6e6;
    border-radius: 12px;
    padding: 24px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);

    .module-header {
      text-align: center;
      margin-bottom: 24px;
      padding-bottom: 16px;
      border-bottom: 2px solid #f0f0f0;

      h3 {
        font-size: 18px;
        font-weight: 600;
        color: var(--emdc-text-color-primary);
        margin: 0 0 8px 0;
      }

      p {
        font-size: 14px;
        color: var(--emdc-text-color-secondary);
        margin: 0;
        line-height: 1.5;
      }
    }

    .chart-section {
      .chart-wrapper {
        height: 250px;
        margin-bottom: 20px;
        position: relative;
        background: #fafafa;
        border-radius: 8px;
        padding: 16px;
      }

      .test-control {
        .test-progress {
          margin-bottom: 16px;

          p {
            font-size: 14px;
            color: var(--emdc-text-color-regular);
            margin: 8px 0 0 0;
            text-align: center;
          }
        }

        .test-actions {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;

          .test-result-summary {
            display: flex;
            gap: 20px;
            flex-wrap: wrap;
            justify-content: center;

            .result-item {
              font-size: 14px;
              color: var(--emdc-text-color-regular);

              strong {
                color: var(--emdc-color-primary);
                font-weight: 600;
              }
            }
          }

          .detailed-results {
            margin-top: 20px;
            padding: 16px;
            background: #fafafa;
            border-radius: 8px;
            border: 1px solid #e6e6e6;

            .detailed-table {
              margin-top: 10px;

              :deep(.el-table__header) {
                background-color: #f5f5f5;
              }

              :deep(.el-table__row) {
                &:hover {
                  background-color: #f0f9ff;
                }
              }
            }
          }

          .test-description {
            font-size: 12px;
            color: var(--emdc-text-color-secondary);
            text-align: center;
            margin: 8px 0 0 0;
            font-style: italic;
            line-height: 1.4;

            strong {
              color: var(--emdc-color-primary);
            }
          }
        }
      }
    }
  }

  // 响应式设计
  @media (max-width: 768px) {
    padding: 15px;

    .metrics-showcase {
      grid-template-columns: 1fr;
    }

    .performance-modules {
      grid-template-columns: 1fr;
    }
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
}
</style>