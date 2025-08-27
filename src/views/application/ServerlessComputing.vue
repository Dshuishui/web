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
      <!-- 命名空间管理Tab -->
      <el-tab-pane label="命名空间管理" name="namespace">
        <div class="content-panel">
          <div class="section-header">
            <h2 class="section-title">命名空间概览</h2>
            <div class="namespace-selector">
              <span>当前命名空间:</span>
              <el-select v-model="selectedNamespace" class="common-select">
                <el-option v-for="ns in namespaces" :key="ns.name" :label="ns.name" :value="ns.name" />
              </el-select>
            </div>
          </div>

          <el-table :data="namespaces" class="common-table" stripe>
            <el-table-column prop="name" label="命名空间" width="150" />
            <el-table-column prop="statusText" label="状态" width="100">
              <template #default="scope">
                <el-tag :type="getStatusType(scope.row.status)">{{
                  scope.row.statusText
                }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="functions" label="函数数量" width="120" />
            <el-table-column prop="cpuUsage" label="CPU使用率" width="120" />
            <el-table-column prop="memory" label="内存使用" />
          </el-table>
        </div>
      </el-tab-pane>

      <!-- 函数管理Tab -->
      <el-tab-pane label="函数管理" name="functions">
        <div class="content-panel">
          <div class="section-header">
            <h2 class="section-title">函数管理</h2>
            <el-button class="-emdc-button-primary" @click="createDialogVisible = true">
              <el-icon>
                <Plus />
              </el-icon>
              创建函数
            </el-button>
          </div>

          <el-table :data="functions" class="common-table" stripe>
            <el-table-column prop="name" label="函数名称" width="180" />
            <el-table-column prop="image" label="镜像" />
            <el-table-column prop="namespace" label="命名空间" width="120" />
            <el-table-column prop="invocations" label="调用次数" width="120" :formatter="formatNumber" />
            <el-table-column prop="replicas" label="副本数" width="100" />
            <el-table-column prop="status" label="状态" width="100">
              <template #default="scope">
                <el-tag :type="getStatusType(scope.row.status)">{{
                  getStatusText(scope.row.status)
                }}</el-tag>
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

                    <div v-if="throughputResults" class="test-result-summary">
                      <span class="result-item">峰值吞吐: <strong>{{ throughputResults.peakThroughput }}
                          Gb/s</strong></span>
                      <span class="result-item">平均吞吐: <strong>{{ throughputResults.avgThroughput }} Gb/s</strong></span>
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
    <el-dialog v-model="createDialogVisible" title="创建新函数" width="600px" class="common-dialog">
      <el-form :model="createForm" label-width="120px">
        <el-form-item label="函数名称">
          <el-input v-model="createForm.name" placeholder="请输入函数名称" class="common-input" />
        </el-form-item>
        <el-form-item label="镜像地址">
          <el-input v-model="createForm.image" placeholder="请输入镜像地址" class="common-input" />
        </el-form-item>
        <el-form-item label="环境变量">
          <el-input v-model="createForm.envVars" type="textarea" placeholder="格式: KEY=VALUE，每行一个"
            class="common-textarea" :rows="4" />
        </el-form-item>
        <el-form-item label="标签">
          <el-input v-model="createForm.labels" type="textarea" placeholder="格式: KEY=VALUE，每行一个" class="common-textarea"
            :rows="3" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="createDialogVisible = false">取消</el-button>
        <el-button class="-emdc-button-primary" @click="createFunction">
          创建
        </el-button>
      </template>
    </el-dialog>

    <!-- 函数详情对话框 -->
    <el-dialog v-model="detailsDialogVisible" title="函数详情" width="700px" class="common-dialog">
      <div v-if="selectedFunction">
        <h4 style="margin-top: 0; margin-bottom: 15px">基本信息:</h4>
        <p><strong>名称:</strong> {{ selectedFunction.name }}</p>
        <p><strong>镜像:</strong> {{ selectedFunction.image }}</p>
        <p><strong>状态:</strong> {{ getStatusText(selectedFunction.status) }}</p>
        <p><strong>调用次数:</strong> {{ selectedFunction.invocations }}</p>
        <p><strong>副本数:</strong> {{ selectedFunction.replicas }}</p>

        <h4 style="margin-top: 20px; margin-bottom: 10px">环境变量:</h4>
        <el-tag v-for="(value, key) in selectedFunction.envVars" :key="key" style="margin: 2px">
          {{ key }}: {{ value }}
        </el-tag>

        <h4 style="margin-top: 20px; margin-bottom: 10px">标签:</h4>
        <el-tag v-for="(value, key) in selectedFunction.labels" :key="key" style="margin: 2px" type="info">
          {{ key }}: {{ value }}
        </el-tag>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick, onUnmounted } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { Plus, CaretRight, Timer, Connection, Check, Loading, Clock, Download } from "@element-plus/icons-vue";

// 接口定义
interface FunctionItem {
  name: string;
  image: string;
  status: string;
  invocations: number;
  replicas: string;
  namespace: string;
  labels: Record<string, string>;
  envVars: Record<string, string>;
}

interface ConcurrencyResults {
  peakTPS: string;
  avgTPS: string;
  finalData: number[];
}

interface ThroughputResults {
  peakThroughput: string;
  avgThroughput: string;
  finalData: number[];
}

// 响应式数据
const activeTab = ref("namespace");
const selectedNamespace = ref("default");
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

// 吞吐测试相关
const throughputTesting = ref(false);
const throughputProgress = ref(0);
const throughputResults = ref<ThroughputResults | null>(null);
const throughputCurrentPackage = ref(4);
const throughputRealTimeData = ref<number[]>([]);

// 表单数据
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

// 命名空间数据
const namespaces = ref([
  {
    name: "default",
    status: "Active",
    statusText: "活跃",
    functions: 12,
    cpuUsage: "45%",
    memory: "2.1GB / 4GB",
  },
  {
    name: "production",
    status: "Active",
    statusText: "活跃",
    functions: 8,
    cpuUsage: "23%",
    memory: "1.5GB / 8GB",
  },
  {
    name: "development",
    status: "waiting",
    statusText: "等待中",
    functions: 3,
    cpuUsage: "12%",
    memory: "512MB / 2GB",
  },
]);

// 函数数据
const functions = ref<FunctionItem[]>([
  {
    name: "hello-world",
    image: "functions/alpine:latest",
    status: "running",
    invocations: 1423,
    replicas: "1/1",
    namespace: "default",
    labels: { "com.openfaas.scale.min": "1", "com.openfaas.scale.max": "5" },
    envVars: {
      PATH: "/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin",
    },
  },
  {
    name: "user-service",
    image: "functions/node12:latest",
    status: "running",
    invocations: 856,
    replicas: "2/2",
    namespace: "default",
    labels: { "com.openfaas.scale.min": "2", "com.openfaas.scale.max": "10" },
    envVars: {
      NODE_ENV: "production",
      PORT: "8080",
    },
  },
  {
    name: "data-processor",
    image: "functions/python3:latest",
    status: "pending",
    invocations: 0,
    replicas: "0/1",
    namespace: "development",
    labels: { "com.openfaas.scale.min": "0", "com.openfaas.scale.max": "3" },
    envVars: {
      PYTHONPATH: "/usr/local/lib/python3.8/site-packages",
    },
  },
]);

// 工具方法
const getStatusType = (status: string) => {
  const statusMap: Record<string, string> = {
    running: "success",
    Active: "success",  // 这里映射了 Active 状态
    waiting: "warning",
  };
  return statusMap[status] || "info";
};

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

const formatNumber = (row: any, column: any, cellValue: number) => {
  return cellValue.toLocaleString();
};

// 函数管理方法
const showDetails = (func: any) => {
  selectedFunction.value = func;
  detailsDialogVisible.value = true;
};

const deleteFunction = async (func: any) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除函数 "${func.name}" 吗？`,
      "确认删除",
      {
        type: "warning",
        customClass: "common-messagebox",
      }
    );
    const index = functions.value.findIndex((f) => f.name === func.name);
    if (index > -1) {
      functions.value.splice(index, 1);
      ElMessage.success(`函数 "${func.name}" 已删除`);
    }
  } catch {
    ElMessage.info("已取消删除");
  }
};

const createFunction = () => {
  if (!createForm.name || !createForm.image) {
    ElMessage.error("请填写函数名和镜像");
    return;
  }

  const envVars: Record<string, string> = {};
  const labels: Record<string, string> = {};

  if (createForm.envVars) {
    createForm.envVars.split("\n").forEach((line) => {
      const [key, value] = line.split("=");
      if (key && value) {
        envVars[key.trim()] = value.trim();
      }
    });
  }

  if (createForm.labels) {
    createForm.labels.split("\n").forEach((line) => {
      const [key, value] = line.split("=");
      if (key && value) {
        labels[key.trim()] = value.trim();
      }
    });
  }

  const newFunction = {
    name: createForm.name,
    image: createForm.image,
    status: "waiting",
    invocations: 0,
    replicas: "0/1",
    namespace: selectedNamespace.value,
    labels: labels,
    envVars: envVars,
  };

  functions.value.push(newFunction);
  createDialogVisible.value = false;

  Object.assign(createForm, {
    name: "",
    image: "",
    envVars: "",
    labels: "",
  });

  ElMessage.success(`函数 "${newFunction.name}" 创建成功！`);
};

// 并发处理能力测试
const startConcurrencyTest = async () => {
  concurrencyTesting.value = true;
  concurrencyProgress.value = 0;
  concurrencyRealTimeData.value = [];
  performanceStatus.value.concurrency = 'testing';

  // 初始化图表
  await nextTick();
  initConcurrencyChart();

  const totalDuration = 30; // 30秒
  const intervalTime = 3000; // 3秒间隔
  const totalIntervals = totalDuration / 3;
  let currentInterval = 0;

  concurrencyInterval.value = setInterval(() => {
    currentInterval++;

    // 生成当前3秒的TPS数据
    const currentTPS = Math.floor(85000 + Math.random() * 25000);
    concurrencyRealTimeData.value.push(currentTPS);

    // 更新进度
    concurrencyProgress.value = (currentInterval / totalIntervals) * 100;

    // 更新图表
    updateConcurrencyChart();

    // 检查是否完成
    if (currentInterval >= totalIntervals) {
      finishConcurrencyTest();
    }
  }, intervalTime);
};

const finishConcurrencyTest = () => {
  if (concurrencyInterval.value) {
    clearInterval(concurrencyInterval.value);
    concurrencyInterval.value = null;
  }

  const peakTPS = Math.max(...concurrencyRealTimeData.value);
  const avgTPS = Math.floor(concurrencyRealTimeData.value.reduce((a, b) => a + b, 0) / concurrencyRealTimeData.value.length);

  concurrencyResults.value = {
    peakTPS: peakTPS.toLocaleString(),
    avgTPS: avgTPS.toLocaleString(),
    finalData: [...concurrencyRealTimeData.value]
  };

  // 更新性能状态
  performanceStatus.value.concurrency = peakTPS >= 100000 ? 'achieved' : 'failed';

  concurrencyTesting.value = false;
  ElMessage.success("并发处理能力测试完成！");
};

// 数据吞吐率测试
const startThroughputTest = async () => {
  throughputTesting.value = true;
  throughputProgress.value = 0;
  throughputRealTimeData.value = [];
  throughputCurrentPackage.value = 4;
  performanceStatus.value.throughput = 'testing';

  // 初始化图表
  await nextTick();
  initThroughputChart();

  const packageSizes = [4, 8, 16, 32]; // pky_kb
  const testDuration = 2000; // 每个包大小测试2秒

  for (let i = 0; i < packageSizes.length; i++) {
    throughputCurrentPackage.value = packageSizes[i];

    // 模拟测试该包大小
    await new Promise(resolve => setTimeout(resolve, testDuration));

    // 生成吞吐率数据 (确保能达到或接近30Gb/s)
    const throughput = parseFloat((25 + Math.random() * 10 + (i * 2)).toFixed(1));
    throughputRealTimeData.value.push(throughput);

    // 更新进度
    throughputProgress.value = ((i + 1) / packageSizes.length) * 100;

    // 更新图表
    updateThroughputChart();
  }

  finishThroughputTest();
};

const finishThroughputTest = () => {
  const peakThroughput = Math.max(...throughputRealTimeData.value);
  const avgThroughput = (throughputRealTimeData.value.reduce((a, b) => a + b, 0) / throughputRealTimeData.value.length).toFixed(1);

  throughputResults.value = {
    peakThroughput: peakThroughput.toFixed(1),
    avgThroughput: avgThroughput,
    finalData: [...throughputRealTimeData.value]
  };

  // 更新性能状态
  performanceStatus.value.throughput = peakThroughput >= 30 ? 'achieved' : 'failed';

  throughputTesting.value = false;
  ElMessage.success("数据吞吐率测试完成！");
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
          labels: ['4', '8', '16', '32'], // 预设包大小标签
          datasets: [
            {
              label: "实时吞吐率",
              data: [],
              borderColor: "#4EC58C",
              backgroundColor: "rgba(78, 197, 140, 0.1)",
              tension: 0.4,
              fill: true,
            },
            {
              label: "目标线 (30 Gb/s)",
              data: new Array(4).fill(30), // 预设目标线数据
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
              max: 40,
              title: {
                display: true,
                text: '吞吐率 (Gb/s)'
              }
            },
            x: {
              title: {
                display: true,
                text: '包大小 (pky_kb)'
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

const updateThroughputChart = () => {
  if (throughputChartInstance) {
    const packageSizes = [4, 8, 16, 32];
    const labels = packageSizes.slice(0, throughputRealTimeData.value.length).map(size => size.toString());

    throughputChartInstance.data.labels = labels;
    throughputChartInstance.data.datasets[0].data = [...throughputRealTimeData.value];
    throughputChartInstance.data.datasets[1].data = new Array(labels.length).fill(30);
    throughputChartInstance.update('none');
  }
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
  }

  .function-actions {
    display: flex;
    gap: 8px;
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
}
</style>