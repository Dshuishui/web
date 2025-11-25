<template>
  <div class="content-panel">
    <div class="performance-header">
      <h2 class="section-title">核心技术指标</h2>
      <p class="performance-subtitle">
        面向边缘服务器的强隔离弹性一致性代数系统
      </p>
    </div>

    <div class="metrics-showcase">
      <div class="metric-card primary-metric">
        <div class="metric-icon">
          <el-icon><Timer /></el-icon>
        </div>
        <div class="metric-content">
          <h3>并发处理能力</h3>
          <div class="metric-value">
            <span class="target-value">≥ 10万</span>
            <span class="unit">TPS</span>
          </div>
          <p class="metric-desc">函数级强隔离弹性一致性调度</p>
          <div class="metric-status" :class="performanceStatus.concurrency">
            <el-icon v-if="performanceStatus.concurrency === 'achieved'"><Check /></el-icon>
            <el-icon v-else-if="performanceStatus.concurrency === 'testing'"><Loading /></el-icon>
            <el-icon v-else><Clock /></el-icon>
            <span>{{ getStatusText(performanceStatus.concurrency) }}</span>
          </div>
        </div>
      </div>

      <div class="metric-card primary-metric">
        <div class="metric-icon">
          <el-icon><Connection /></el-icon>
        </div>
        <div class="metric-content">
          <h3>数据吞吐率</h3>
          <div class="metric-value">
            <span class="target-value">≥ 30</span>
            <span class="unit">Gb/s</span>
          </div>
          <p class="metric-desc">函数间直接通信端到端性能</p>
          <div class="metric-status" :class="performanceStatus.throughput">
            <el-icon v-if="performanceStatus.throughput === 'achieved'"><Check /></el-icon>
            <el-icon v-else-if="performanceStatus.throughput === 'testing'"><Loading /></el-icon>
            <el-icon v-else><Clock /></el-icon>
            <span>{{ getStatusText(performanceStatus.throughput) }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="performance-modules">
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
              <p>
                测试进行中... {{ concurrencyProgress.toFixed(0) }}% ({{
                  Math.floor((concurrencyProgress * 30) / 100)
                }}s / 30s)
              </p>
            </div>
            <div class="test-actions">
              <el-button class="-emdc-button-primary" :loading="concurrencyTesting" @click="startConcurrencyTest">
                <el-icon><CaretRight /></el-icon>
                {{ concurrencyTesting ? "测试中..." : "开始并发测试" }}
              </el-button>
              <div v-if="concurrencyResults" class="test-result-summary">
                <span class="result-item">峰值TPS: <strong>{{ concurrencyResults.peakTPS }}</strong></span>
                <span class="result-item">平均TPS: <strong>{{ concurrencyResults.avgTPS }}</strong></span>
              </div>
            </div>
          </div>
        </div>
      </div>

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
              <p>
                测试进行中... {{ throughputProgress.toFixed(0) }}% ({{
                  throughputCurrentPackage
                }}
                KB包)
              </p>
            </div>
            <div class="test-actions">
              <el-button class="-emdc-button-primary" :loading="throughputTesting" @click="startThroughputTest">
                <el-icon><CaretRight /></el-icon>
                {{ throughputTesting ? "测试中..." : "开始吞吐测试" }}
              </el-button>
              <div v-if="throughputResults" class="test-result-summary">
                <span class="result-item">峰值吞吐: <strong>{{ throughputResults.peakThroughput }} Gb/s</strong></span>
                <span class="result-item">平均吞吐: <strong>{{ throughputResults.avgThroughput }} Gb/s</strong></span>
                <span class="result-item">测试包数: <strong>{{ throughputResults.finalData.length }}</strong></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, onUnmounted } from "vue";
import { ElMessage } from "element-plus";
import {
  CaretRight,
  Timer,
  Connection,
  Check,
  Loading,
  Clock,
} from "@element-plus/icons-vue";

// 接口定义
interface ConcurrencyResults {
  peakTPS: string;
  avgTPS: string;
  finalData: number[];
}

interface ThroughputResults {
  peakThroughput: string;
  avgThroughput: string;
  finalData: number[];
  detailedData?: any[];
}

interface ProcessedTestItem {
  pkt_kb: number;
  throughput_gbps: number;
  packets_per_sec: number;
  duration_sec: number;
}

// 性能状态
const performanceStatus = ref({
  concurrency: "pending", // pending, testing, achieved, failed
  throughput: "pending",
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
const throughputCurrentPackage = ref<string | number>("");
const throughputRealTimeData = ref<number[]>([]);

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

// 并发处理能力测试 - 真实API实现
const startConcurrencyTest = async () => {
  concurrencyTesting.value = true;
  concurrencyProgress.value = 0;
  concurrencyRealTimeData.value = [];
  performanceStatus.value.concurrency = "testing";

  // 初始化图表
  await nextTick();
  initConcurrencyChart();

  const totalDuration = 30; // 30秒测试时长
  const expectedDataPoints = 10; // 预期获得10个数据点（每3秒一个）
  let currentDataPoints = 0;
  let startTime = Date.now();

  try {
    // 发送POST请求启动性能测试
    const response = await fetch("http://127.0.0.1:30360/kvstore", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        servers: ["10.15.16.40:3088", "10.15.16.141:3088", "10.15.17.215:3088"],
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    if (!response.body) {
      throw new Error("ReadableStream not supported in this browser.");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    const timeoutId = setTimeout(() => {
      reader.cancel();
      finishConcurrencyTest();
      ElMessage.error("测试超时，已自动结束");
    }, 35000);

    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        clearTimeout(timeoutId);
        break;
      }

      buffer += decoder.decode(value, { stream: true });
      let lines = buffer.split("\n");
      buffer = lines.pop() || "";

      for (let line of lines) {
        if (line.startsWith("data: ")) {
          try {
            const jsonStr = line.substring(6);
            const data = JSON.parse(jsonStr);

            if (data.success && data.results && data.results.tps) {
              const tpsValue = parseFloat(data.results.tps);
              if (!isNaN(tpsValue)) {
                concurrencyRealTimeData.value.push(tpsValue);
                currentDataPoints++;
                concurrencyProgress.value = Math.min((currentDataPoints / expectedDataPoints) * 100, 100);
                updateConcurrencyChart();

                const elapsedTime = (Date.now() - startTime) / 1000;
                if (currentDataPoints >= expectedDataPoints || elapsedTime >= totalDuration) {
                  clearTimeout(timeoutId);
                  reader.cancel();
                  break;
                }
              }
            }
          } catch (parseError) {
            console.warn("解析数据行失败:", line, parseError);
          }
        }
      }
    }
    finishConcurrencyTest();
  } catch (error) {
    console.error("并发测试失败:", error);
    concurrencyTesting.value = false;
    performanceStatus.value.concurrency = "failed";
    ElMessage.error(`测试执行失败: ${error instanceof Error ? error.message : "未知错误"}`);
  }
};

// 完成并发测试的处理函数
const finishConcurrencyTest = () => {
  if (concurrencyInterval.value) {
    clearInterval(concurrencyInterval.value);
    concurrencyInterval.value = null;
  }

  if (concurrencyRealTimeData.value.length === 0) {
    ElMessage.error("未接收到有效的测试数据");
    concurrencyTesting.value = false;
    performanceStatus.value.concurrency = "failed";
    return;
  }

  const peakTPS = Math.max(...concurrencyRealTimeData.value);
  const avgTPS = Math.floor(
    concurrencyRealTimeData.value.reduce((a, b) => a + b, 0) /
    concurrencyRealTimeData.value.length
  );

  concurrencyResults.value = {
    peakTPS: peakTPS.toLocaleString(),
    avgTPS: avgTPS.toLocaleString(),
    finalData: [...concurrencyRealTimeData.value],
  };

  performanceStatus.value.concurrency = peakTPS >= 100000 ? "achieved" : "failed";
  concurrencyTesting.value = false;
  concurrencyProgress.value = 100;
  ElMessage.success(`并发处理能力测试完成！峰值TPS: ${peakTPS.toLocaleString()}`);
};

const startThroughputTest = async () => {
  throughputTesting.value = true;
  throughputProgress.value = 0;
  throughputRealTimeData.value = [];
  throughputCurrentPackage.value = "";
  performanceStatus.value.throughput = "testing";

  await nextTick();
  initThroughputChart();

  try {
    ElMessage.info("开始数据吞吐率测试...");
    throughputProgress.value = 10;

    const senderPromise = fetch("/api/throughput/topic3-pro-kp-sender");
    const receiverPromise = fetch("/api/throughput/topic3-pro-kp-receiver");

    const [senderResponse, receiverResponse] = await Promise.all([
      senderPromise,
      receiverPromise,
    ]);

    if (!senderResponse.ok) throw new Error(`Sender 端点启动失败! 状态: ${senderResponse.status}`);
    if (!receiverResponse.ok) throw new Error(`Receiver 端点启动失败! 状态: ${receiverResponse.status}`);

    const [senderData, receiverData] = await Promise.all([
      senderResponse.json(),
      receiverResponse.json(),
    ]);
    throughputProgress.value = 70;

    let data = (Array.isArray(senderData) && senderData.length > 0) ? senderData : receiverData;
    if (!Array.isArray(data) || data.length === 0) {
      throw new Error("两个端点都没有返回有效数据");
    }

    const processedData = data
      .filter(item =>
        item &&
        typeof item.pkt_kb === "number" &&
        typeof item.throughput_gbps === "number" &&
        !isNaN(item.pkt_kb) &&
        !isNaN(item.throughput_gbps)
      )
      .map(item => ({
        ...item,
        throughput_gbps: parseFloat(item.throughput_gbps.toFixed(2)),
      }))
      .sort((a, b) => a.pkt_kb - b.pkt_kb);

    if (processedData.length === 0) throw new Error("没有有效的测试数据");

    throughputRealTimeData.value = processedData.map(item => item.throughput_gbps);
    const throughputValues = processedData.map(item => item.throughput_gbps);
    const peakThroughput = Math.max(...throughputValues);
    const avgThroughput = (throughputValues.reduce((a, b) => a + b, 0) / throughputValues.length).toFixed(1);

    throughputResults.value = {
      peakThroughput: peakThroughput.toFixed(1),
      avgThroughput: avgThroughput,
      finalData: [...throughputValues],
      detailedData: processedData,
    };

    updateThroughputChart(processedData);
    throughputProgress.value = 100;
    performanceStatus.value.throughput = peakThroughput >= 30 ? "achieved" : "failed";
    throughputTesting.value = false;
    const statusText = peakThroughput >= 30 ? "达标" : "未达标";
    ElMessage.success(`数据吞吐率测试完成！峰值: ${peakThroughput.toFixed(1)} Gb/s (${statusText})`);
  } catch (error) {
    console.error("数据吞吐率测试失败:", error);
    throughputTesting.value = false;
    performanceStatus.value.throughput = "failed";
    throughputProgress.value = 0;
    ElMessage.error(`测试执行失败: ${error instanceof Error ? error.message : "未知错误"}`);
  }
};

// 图表初始化和更新方法
const initConcurrencyChart = async () => {
  try {
    const Chart = (await import("chart.js/auto")).default;
    if (concurrencyChart.value) {
      if (concurrencyChartInstance) concurrencyChartInstance.destroy();
      concurrencyChartInstance = new Chart(concurrencyChart.value, {
        type: "line",
        data: {
          labels: ["0s", "3s", "6s", "9s", "12s", "15s", "18s", "21s", "24s", "27s", "30s"],
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
              data: new Array(11).fill(100000),
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
          scales: {
            y: { beginAtZero: true, max: 120000, title: { display: true, text: "TPS (每秒事务数)" }},
            x: { title: { display: true, text: "测试时间" }},
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
    concurrencyChartInstance.update("none");
  }
};

const initThroughputChart = async () => {
  try {
    const Chart = (await import("chart.js/auto")).default;
    if (throughputChart.value) {
      if (throughputChartInstance) throughputChartInstance.destroy();
      throughputChartInstance = new Chart(throughputChart.value, {
        type: "line",
        data: {
          labels: ["4", "8", "16", "32"],
          datasets: [
            {
              label: "吞吐率 (Gb/s)",
              data: [],
              borderColor: "#4EC58C",
              backgroundColor: "rgba(78, 197, 140, 0.1)",
              tension: 0.4,
              fill: true,
            },
            {
              label: "目标线 (30 Gb/s)",
              data: new Array(4).fill(30),
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
          scales: {
            y: { beginAtZero: true, title: { display: true, text: "吞吐率 (Gb/s)" }, suggestedMax: 200 },
            x: { title: { display: true, text: "包大小 (KB)" }},
          },
        },
      });
    }
  } catch (error) {
    console.error("吞吐图表初始化失败:", error);
  }
};

const updateThroughputChart = (processedData?: ProcessedTestItem[]) => {
  if (!throughputChartInstance) return;
  let labels, throughputData;

  if (processedData && Array.isArray(processedData)) {
    labels = processedData.map(item => item.pkt_kb.toString());
    throughputData = processedData.map(item => item.throughput_gbps);
  } else {
    const packageSizes = [4, 8, 16, 32];
    labels = packageSizes.slice(0, throughputRealTimeData.value.length).map(size => size.toString());
    throughputData = [...throughputRealTimeData.value];
  }

  const maxValue = Math.max(...throughputData);
  const dynamicMax = Math.max(40, Math.ceil((maxValue * 1.1) / 10) * 10);
  throughputChartInstance.data.labels = labels;
  throughputChartInstance.data.datasets[0].data = throughputData;
  throughputChartInstance.data.datasets[1].data = new Array(labels.length).fill(30);
  throughputChartInstance.options.scales.y.max = dynamicMax;
  throughputChartInstance.update("none");
};

// 清理函数
const cleanup = () => {
  if (concurrencyInterval.value) clearInterval(concurrencyInterval.value);
  if (concurrencyChartInstance) concurrencyChartInstance.destroy();
  if (throughputChartInstance) throughputChartInstance.destroy();
};

onMounted(async () => {
  await nextTick();
  initConcurrencyChart();
  initThroughputChart();
});

onUnmounted(() => {
  cleanup();
});
</script>

<style lang="less" scoped>
/* 性能评估专用样式 */
.content-panel {
  background: #ffffff;
  border: 1px solid #e6e6e6;
  border-radius: 8px;
  padding: 25px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

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
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg,
        var(--emdc-color-primary) 0%,
        var(--emdc-hover-color-primary) 100%);
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(12, 131, 87, 0.15);
    border-color: var(--emdc-color-primary);
  }

  .metric-icon {
    width: 60px;
    height: 60px;
    background: linear-gradient(135deg,
        var(--emdc-color-primary) 0%,
        var(--emdc-hover-color-primary) 100%);
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

      &.pending { color: var(--emdc-text-color-secondary); }
      &.testing { color: var(--emdc-color-warning); }
      &.achieved { color: var(--emdc-color-success); }
      &.failed { color: var(--emdc-color-danger); }
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
    h3 { font-size: 18px; font-weight: 600; color: var(--emdc-text-color-primary); margin: 0 0 8px 0; }
    p { font-size: 14px; color: var(--emdc-text-color-secondary); margin: 0; line-height: 1.5; }
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
        p { font-size: 14px; color: var(--emdc-text-color-regular); margin: 8px 0 0 0; text-align: center; }
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
            strong { color: var(--emdc-color-primary); font-weight: 600; }
          }
        }
      }
    }
  }
}
</style>