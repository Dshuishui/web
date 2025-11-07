<template>
  <div class="serverless-container">
    <!-- 统一的页面介绍区域 -->
    <div class="page-intro">
      <div class="intro-header">
        <h1>服务器无感框架和协同调度平台</h1>
        <!-- <p class="subtitle">面向边缘微小型数据中心的高性能函数计算服务</p> -->
      </div>

      <div class="intro-divider"></div>

      <div class="research-section">
        <h2>课题进展与核心成果</h2>
        <div class="research-content">
          <p>
            <strong>课题名称：</strong>服务器无感框架和协同调度
          </p>
          <p>
            本课题聚焦轻量化服务器无感资源管理调度框架与强隔离一致性协同演进计算系统研究，已完成中期考核全部指标。成功构建面向WebAssembly的高并发轻量化沙箱运行时技术，实现函数多维度资源配置模型与弹性启动部署；建立强隔离弹性一致性代数系统，节点并发处理能力达10万TPS；开发函数间直接通信框架，端到端数据吞吐率超30Gb/s。
          </p>
          <p>
            <strong>核心技术突破：</strong>①提出非侵入式微服务时空画像方法，实现异构计算环境拓扑表征；②构建函数级协同编排的微小型混合服务优化体系；③研发基于异构拓扑表征的演进计算框架。项目成果获TPDS
            2024年度全球唯一最佳论文奖，已发表高水平论文7篇、申请发明专利4项，培养博士4名、硕士6名。
          </p>
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

          <!-- 函数表格 - 自适应宽度版本 -->
          <el-table :data="functions" class="common-table function-table" stripe v-loading="functionsLoading"
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
            <p class="performance-subtitle">
              面向边缘服务器的强隔离弹性一致性代数系统
            </p>
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
                  <span>{{
                    getStatusText(performanceStatus.concurrency)
                  }}</span>
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
                    <p>
                      测试进行中... {{ concurrencyProgress.toFixed(0) }}% ({{
                        Math.floor((concurrencyProgress * 30) / 100)
                      }}s / 30s)
                    </p>
                  </div>

                  <div class="test-actions">
                    <el-button class="-emdc-button-primary" :loading="concurrencyTesting" @click="startConcurrencyTest">
                      <el-icon>
                        <CaretRight />
                      </el-icon>
                      {{ concurrencyTesting ? "测试中..." : "开始并发测试" }}
                    </el-button>

                    <div v-if="concurrencyResults" class="test-result-summary">
                      <span class="result-item">峰值TPS:
                        <strong>{{ concurrencyResults.peakTPS }}</strong></span>
                      <span class="result-item">平均TPS:
                        <strong>{{ concurrencyResults.avgTPS }}</strong></span>
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
                    <p>
                      测试进行中... {{ throughputProgress.toFixed(0) }}% ({{
                        throughputCurrentPackage
                      }}
                      KB包)
                    </p>
                  </div>

                  <div class="test-actions">
                    <el-button class="-emdc-button-primary" :loading="throughputTesting" @click="startThroughputTest">
                      <el-icon>
                        <CaretRight />
                      </el-icon>
                      {{ throughputTesting ? "测试中..." : "开始吞吐测试" }}
                    </el-button>

                    <div v-if="throughputResults" class="test-result-summary">
                      <span class="result-item">峰值吞吐:
                        <strong>{{ throughputResults.peakThroughput }} Gb/s</strong></span>
                      <span class="result-item">平均吞吐:
                        <strong>{{ throughputResults.avgThroughput }} Gb/s</strong></span>
                      <span class="result-item">测试包数:
                        <strong>{{
                          throughputResults.finalData.length
                        }}</strong></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-tab-pane>
      <!-- 项目成果Tab -->
      <el-tab-pane label="项目成果" name="achievements">
        <div class="content-panel achievements-panel">
          <div class="section-header">
            <h2 class="section-title">项目成果</h2>
          </div>

          <div class="achievements-grid">
            <!-- 左侧：论文和专利 -->
            <div class="papers-patents-section">
              <!-- 论文成果 -->
              <div class="achievement-section">
                <h3 class="achievement-title">论文成果</h3>
                <div class="compact-achievement-list">
                  <div class="compact-item">
                    <span class="item-number">1</span>
                    <div class="item-content">
                      <div class="item-header">
                        <div class="item-title">Demystifying the Cost of Serverless Computing: Towards a Win-Win Deal
                        </div>
                        <div class="item-authors">Fangming Liu, Yipei Niu</div>
                        <div class="item-venue">IEEE TPDS, 35(1), 2024</div>
                      </div>
                      <span class="award-badge">🏆 TPDS 2024最佳论文奖</span>
                    </div>
                  </div>

                  <div class="compact-item">
                    <span class="item-number">2</span>
                    <div class="item-content">
                      <div class="item-header">
                        <div class="item-title">λGrapher: A Resource-Efficient Serverless System for GNN Serving through
                          Graph
                          Sharing</div>
                        <div class="item-authors">Haichuan Hu, et al.</div>
                        <div class="item-venue">ACM Web Conference, 2024</div>
                      </div>
                    </div>
                  </div>

                  <div class="compact-item">
                    <span class="item-number">3</span>
                    <div class="item-content">
                      <div class="item-header">
                        <div class="item-title">ComboFunc: Joint Resource Combination and Container Placement for
                          Serverless
                          Function Scaling</div>
                        <div class="item-authors">Zhaojie Wen, et al.</div>
                        <div class="item-venue">IEEE TPDS, 35(11), 2024</div>
                      </div>
                    </div>
                  </div>

                  <div class="compact-item">
                    <span class="item-number">4</span>
                    <div class="item-content">
                      <div class="item-header">
                        <div class="item-title">AsyFunc: A High-Performance Serverless Inference System via Asymmetric
                          Functions</div>
                        <div class="item-authors">Qiangyu Pei, et al.</div>
                        <div class="item-venue">ACM SoCC, 2023</div>
                      </div>
                    </div>
                  </div>

                  <div class="compact-item">
                    <span class="item-number">5</span>
                    <div class="item-content">
                      <div class="item-header">
                        <div class="item-title">Hydis: A Hybrid Consistent KVS with Effective Sync Among Replicas</div>
                        <div class="item-authors">Junsheng Lou, Zichen Xu</div>
                        <div class="item-venue">APPT, 2023</div>
                      </div>
                    </div>
                  </div>

                  <div class="compact-item">
                    <span class="item-number">6</span>
                    <div class="item-content">
                      <div class="item-header">
                        <div class="item-title">Edge AI-driven Neural Network Predictions for Replica Sync Optimization
                        </div>
                        <div class="item-authors">Zichen Xu, et al.</div>
                        <div class="item-venue">Applied Soft Computing, 165, 2024</div>
                      </div>
                    </div>
                  </div>

                  <div class="compact-item">
                    <span class="item-number">7</span>
                    <div class="item-content">
                      <div class="item-header">
                        <div class="item-title">Exploring nonintrusive measurements of spatio-temporal portrait of
                          microservices</div>
                        <div class="item-authors">Tao Zeng, et al.</div>
                        <div class="item-venue">SPE, 54(10), 2024</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 专利成果 -->
              <div class="achievement-section">
                <h3 class="achievement-title">专利成果</h3>
                <div class="compact-achievement-list">
                  <div class="compact-item">
                    <span class="item-number">1</span>
                    <div class="item-content">
                      <div class="item-header">
                        <div class="item-title">基于异质容器组合的无服务器函数弹性调度方法及系统</div>
                        <div class="item-authors">温兆捷, 刘方明, 等</div>
                        <div class="item-venue">专利号: 2024109687817</div>
                      </div>
                    </div>
                  </div>

                  <div class="compact-item">
                    <span class="item-number">2</span>
                    <div class="item-content">
                      <div class="item-header">
                        <div class="item-title">服务器无感框架的冷启动优化方法、系统、设备及介质</div>
                        <div class="item-authors">傅妍, 徐子晨, 等</div>
                        <div class="item-venue">专利号: 202410116318</div>
                      </div>
                    </div>
                  </div>

                  <div class="compact-item">
                    <span class="item-number">3</span>
                    <div class="item-content">
                      <div class="item-header">
                        <div class="item-title">服务器无感框架的函数资源管理方法、系统、设备及介质</div>
                        <div class="item-authors">徐子晨, 孙珍龄, 等</div>
                        <div class="item-venue">专利号: 202410115981</div>
                      </div>
                    </div>
                  </div>

                  <div class="compact-item">
                    <span class="item-number">4</span>
                    <div class="item-content">
                      <div class="item-header">
                        <div class="item-title">一种具备动态优化复制策略的混合一致性方法及系统</div>
                        <div class="item-authors">徐子晨, 娄俊升, 董余聪</div>
                        <div class="item-venue">专利号: 2024100809132</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 右侧：人才培养 -->
            <div class="talent-section">
              <div class="achievement-section">
                <h3 class="achievement-title">人才培养</h3>

                <div class="talent-cards">
                  <div class="talent-card">
                    <div class="talent-header">
                      <span class="talent-degree">硕士研究生</span>
                      <span class="talent-count">6名</span>
                    </div>
                    <div class="talent-names">
                      <span class="name-tag">宋振</span>
                      <span class="name-tag">袁永杰</span>
                      <span class="name-tag">胡海川</span>
                      <span class="name-tag">娄俊升</span>
                      <span class="name-tag">许可</span>
                      <span class="name-tag">孙珍龄</span>
                    </div>
                  </div>

                  <div class="talent-card">
                    <div class="talent-header">
                      <span class="talent-degree">博士研究生</span>
                      <span class="talent-count">4名</span>
                    </div>
                    <div class="talent-names">
                      <span class="name-tag">牛轶佩</span>
                      <span class="name-tag">温兆捷</span>
                      <span class="name-tag">裴强宇</span>
                      <span class="name-tag">傅妍</span>
                    </div>
                  </div>
                </div>

                <!-- 统计信息 -->
                <div class="achievement-stats">
                  <div class="stat-item">
                    <div class="stat-number">7</div>
                    <div class="stat-label">篇论文</div>
                  </div>
                  <div class="stat-item">
                    <div class="stat-number">4</div>
                    <div class="stat-label">项专利</div>
                  </div>
                  <div class="stat-item">
                    <div class="stat-number">10</div>
                    <div class="stat-label">名学生</div>
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
        <p>
          <strong>命名空间:</strong> {{ selectedFunction.metadata.namespace }}
        </p>
        <p>
          <strong>创建时间:</strong>
          {{ selectedFunction.metadata.creationTimestamp }}
        </p>
        <p><strong>版本:</strong> {{ selectedFunction.metadata.generation }}</p>
        <p>
          <strong>状态:</strong> {{ getFunctionStatusText(selectedFunction) }}
        </p>
        <p><strong>并发数:</strong> {{ selectedFunction.spec.concurrency }}</p>
        <p>
          <strong>超时时间:</strong>
          {{ selectedFunction.spec.functionTimeout }}s
        </p>
        <p>
          <strong>空闲超时:</strong> {{ selectedFunction.spec.idletimeout }}s
        </p>
        <p>
          <strong>每Pod请求数:</strong>
          {{ selectedFunction.spec.requestsPerPod }}
        </p>

        <h4 style="margin-top: 20px; margin-bottom: 10px">环境信息:</h4>
        <p>
          <strong>环境名称:</strong>
          {{ selectedFunction.spec.environment.name }}
        </p>
        <p>
          <strong>环境命名空间:</strong>
          {{ selectedFunction.spec.environment.namespace }}
        </p>

        <h4 style="margin-top: 20px; margin-bottom: 10px">包信息:</h4>
        <p>
          <strong>函数名:</strong>
          {{ selectedFunction.spec.package.functionName }}
        </p>
        <p>
          <strong>包引用:</strong>
          {{ selectedFunction.spec.package.packageref.name }}
        </p>

        <h4 style="margin-top: 20px; margin-bottom: 10px">伸缩策略:</h4>
        <p>
          <strong>策略类型:</strong>
          {{ selectedFunction.spec.InvokeStrategy.StrategyType }}
        </p>
        <p>
          <strong>执行器类型:</strong>
          {{
            selectedFunction.spec.InvokeStrategy.ExecutionStrategy.ExecutorType
          }}
        </p>
        <p>
          <strong>最小副本:</strong>
          {{ selectedFunction.spec.InvokeStrategy.ExecutionStrategy.MinScale }}
        </p>
        <p>
          <strong>最大副本:</strong>
          {{ selectedFunction.spec.InvokeStrategy.ExecutionStrategy.MaxScale }}
        </p>
        <p>
          <strong>专业化超时:</strong>
          {{
            selectedFunction.spec.InvokeStrategy.ExecutionStrategy
              .SpecializationTimeout
          }}s
        </p>
        <p>
          <strong>目标CPU百分比:</strong>
          {{
            selectedFunction.spec.InvokeStrategy.ExecutionStrategy
              .TargetCPUPercent
          }}%
        </p>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick, onUnmounted } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import {
  Plus,
  CaretRight,
  Timer,
  Connection,
  Check,
  Loading,
  Clock,
  Download,
} from "@element-plus/icons-vue";

// 接口定义 - 从useNamespace导入
import { useNamespace, type FunctionItem } from "./hooks/useNamespace";
import {
  createEnvironment,
  createPackage,
  createFunction as createFunctionAPI,
  startPerformanceTest,
  sendPerformanceTest,
} from "@/api/fission";

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
  concurrency: "pending", // pending, testing, achieved, failed
  throughput: "pending",
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
const throughputCurrentPackage = ref<string | number>(""); // 支持字符串和数字类型
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
      // 创建环境
      const envData = {
        apiVersion: "fission.io/v1",
        kind: "Environment",
        metadata: {
          name: envForm.name,
        },
        spec: {
          version: envForm.version,
          poolsize: envForm.poolsize,
          runtime: {
            image: envForm.image,
          },
        },
      };

      // 调用创建环境的API
      await createEnvironment(selectedNamespace.value, envData);
      console.log("创建环境:", envData);

      // 更新包表单中的环境名称
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
      // 创建包
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

      // 调用创建包的API
      await createPackage(selectedNamespace.value, pkgData);
      console.log("创建包:", pkgData);

      // 更新函数表单中的包名称
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
      }
    );
    const index = functions.value.findIndex(
      (f) => f.metadata.name === func.metadata.name
    );
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

    // 调用创建函数的API
    await createFunctionAPI(selectedNamespace.value, fnData);
    console.log("创建函数:", fnData);

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
    const response = await fetch("/api/kv/kvstore", {
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

    // 检查响应是否支持流式读取
    if (!response.body) {
      throw new Error("ReadableStream not supported in this browser.");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    // 设置超时定时器，防止测试卡住
    const timeoutId = setTimeout(() => {
      reader.cancel();
      finishConcurrencyTest();
      ElMessage.error("测试超时，已自动结束");
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
      let lines = buffer.split("\n");
      buffer = lines.pop() || ""; // 保留最后一个可能不完整的行

      for (let line of lines) {
        // 去除前缀 "data: " 并解析JSON
        if (line.startsWith("data: ")) {
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
                concurrencyProgress.value = Math.min(
                  (currentDataPoints / expectedDataPoints) * 100,
                  100
                );

                // 更新图表
                updateConcurrencyChart();

                // 输出调试信息
                console.log(
                  `接收到TPS数据: ${tpsValue}, 进度: ${concurrencyProgress.value.toFixed(
                    1
                  )}%`
                );

                // 检查是否已接收足够的数据点或者时间已到
                const elapsedTime = (Date.now() - startTime) / 1000;
                if (
                  currentDataPoints >= expectedDataPoints ||
                  elapsedTime >= totalDuration
                ) {
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

    // 测试完成
    finishConcurrencyTest();
  } catch (error) {
    console.error("并发测试失败:", error);

    // 错误处理
    concurrencyTesting.value = false;
    performanceStatus.value.concurrency = "failed";

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
    ElMessage.error("未接收到有效的测试数据");
    concurrencyTesting.value = false;
    performanceStatus.value.concurrency = "failed";
    return;
  }

  // 计算峰值和平均TPS
  const peakTPS = Math.max(...concurrencyRealTimeData.value);
  const avgTPS = Math.floor(
    concurrencyRealTimeData.value.reduce((a, b) => a + b, 0) /
    concurrencyRealTimeData.value.length
  );

  // 设置测试结果
  concurrencyResults.value = {
    peakTPS: peakTPS.toLocaleString(),
    avgTPS: avgTPS.toLocaleString(),
    finalData: [...concurrencyRealTimeData.value],
  };

  // 更新性能状态（目标是10万TPS）
  performanceStatus.value.concurrency =
    peakTPS >= 100000 ? "achieved" : "failed";

  // 设置测试完成状态
  concurrencyTesting.value = false;
  concurrencyProgress.value = 100;

  // 显示完成消息
  ElMessage.success(
    `并发处理能力测试完成！峰值TPS: ${peakTPS.toLocaleString()}`
  );

  // 输出详细结果到控制台
  console.log("测试结果详情:", {
    dataPoints: concurrencyRealTimeData.value.length,
    peakTPS: peakTPS,
    avgTPS: avgTPS,
    allData: concurrencyRealTimeData.value,
    achieved: peakTPS >= 100000,
  });
};
const startThroughputTest = async () => {
  throughputTesting.value = true;
  throughputProgress.value = 0;
  throughputRealTimeData.value = [];
  throughputCurrentPackage.value = "";
  performanceStatus.value.throughput = "testing";

  // 初始化图表
  await nextTick();
  initThroughputChart();

  try {
    ElMessage.info("开始数据吞吐率测试...");
    throughputProgress.value = 10;

    console.log("正在启动 sender 和 receiver 端点...");
    const senderPromise = fetch("/api/throughput/topic3-pro-kp-sender");
    const receiverPromise = fetch("/api/throughput/topic3-pro-kp-receiver");

    const [senderResponse, receiverResponse] = await Promise.all([
      senderPromise,
      receiverPromise,
    ]);

    // 检查两个端点的响应是否成功
    if (!senderResponse.ok) {
      throw new Error(`Sender 端点启动失败! 状态: ${senderResponse.status}`);
    }
    if (!receiverResponse.ok) {
      throw new Error(
        `Receiver 端点启动失败! 状态: ${receiverResponse.status}`
      );
    }

    console.log("Sender 和 Receiver 端点已成功启动，开始性能测试...");

    const [senderData, receiverData] = await Promise.all([
      senderResponse.json(),
      receiverResponse.json(),
    ]);

    throughputProgress.value = 70;

    console.log("Sender 数据:", senderData);
    console.log("Receiver 数据:", receiverData);

    // 选择数据源
    let data = senderData;
    if (!Array.isArray(senderData) || senderData.length === 0) {
      if (Array.isArray(receiverData) && receiverData.length > 0) {
        data = receiverData;
        console.log("使用 receiver 数据作为主要数据源");
      } else {
        throw new Error("两个端点都没有返回有效数据");
      }
    } else {
      console.log("使用 sender 数据作为主要数据源");
    }

    if (!Array.isArray(data) || data.length === 0) {
      throw new Error("未接收到有效的测试数据");
    }

    // 处理测试数据
    const processedData = data
      .filter((item) => {
        return (
          item &&
          typeof item.pkt_kb === "number" &&
          typeof item.throughput_gbps === "number" &&
          !isNaN(item.pkt_kb) &&
          !isNaN(item.throughput_gbps)
        );
      })
      .map((item) => ({
        pkt_kb: item.pkt_kb,
        throughput_gbps: parseFloat(item.throughput_gbps.toFixed(2)),
        packets_per_sec: item.packets_per_sec,
        duration_sec: item.duration_sec,
      }))
      .sort((a, b) => a.pkt_kb - b.pkt_kb);

    if (processedData.length === 0) {
      throw new Error("没有有效的测试数据");
    }

    // 更新状态数据
    throughputRealTimeData.value = processedData.map(
      (item) => item.throughput_gbps
    );

    // 计算统计结果
    const throughputValues = processedData.map((item) => item.throughput_gbps);
    const peakThroughput = Math.max(...throughputValues);
    const avgThroughput = (
      throughputValues.reduce((a, b) => a + b, 0) / throughputValues.length
    ).toFixed(1);

    // 设置测试结果
    throughputResults.value = {
      peakThroughput: peakThroughput.toFixed(1),
      avgThroughput: avgThroughput,
      finalData: [...throughputValues],
      detailedData: processedData,
    };

    // 更新图表 - 关键步骤
    updateThroughputChart(processedData);

    throughputProgress.value = 100;

    // 更新性能状态
    performanceStatus.value.throughput =
      peakThroughput >= 30 ? "achieved" : "failed";
    throughputTesting.value = false;

    // 显示完成消息
    const statusText = peakThroughput >= 30 ? "达标" : "未达标";
    ElMessage.success(
      `数据吞吐率测试完成！峰值: ${peakThroughput.toFixed(
        1
      )} Gb/s (${statusText})`
    );

    console.log("吞吐率测试结果详情:", {
      dataPoints: processedData.length,
      peakThroughput: peakThroughput,
      avgThroughput: parseFloat(avgThroughput),
      achieved: peakThroughput >= 30,
      detailedData: processedData,
    });
  } catch (error) {
    console.error("数据吞吐率测试失败:", error);

    throughputTesting.value = false;
    performanceStatus.value.throughput = "failed";
    throughputProgress.value = 0;
  }
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
          labels: [
            "0s",
            "3s",
            "6s",
            "9s",
            "12s",
            "15s",
            "18s",
            "21s",
            "24s",
            "27s",
            "30s",
          ], // 预设时间标签
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
              position: "top",
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              max: 120000,
              title: {
                display: true,
                text: "TPS (每秒事务数)",
              },
            },
            x: {
              title: {
                display: true,
                text: "测试时间",
              },
            },
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
    const labels = Array.from(
      { length: concurrencyRealTimeData.value.length },
      (_, i) => `${i * 3}s`
    );

    concurrencyChartInstance.data.labels = labels;
    concurrencyChartInstance.data.datasets[0].data = [
      ...concurrencyRealTimeData.value,
    ];
    concurrencyChartInstance.data.datasets[1].data = new Array(
      labels.length
    ).fill(100000);
    concurrencyChartInstance.update("none");
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
          labels: ["4", "8", "16", "32"], // 包大小标签 (pkt_kb)
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
              position: "top",
            },
            tooltip: {
              callbacks: {
                label: function (context) {
                  if (context.datasetIndex === 0) {
                    return `吞吐率: ${context.parsed.y.toFixed(2)} Gb/s`;
                  }
                  return context.dataset.label;
                },
              },
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              // 移除固定的 max: 40，让图表根据数据自动计算最大值
              title: {
                display: true,
                text: "吞吐率 (Gb/s)",
              },
              // 添加自适应配置
              suggestedMax: 200, // 建议最大值，但会根据数据调整
            },
            x: {
              title: {
                display: true,
                text: "包大小 (KB)",
              },
            },
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
    console.warn("图表实例不存在，无法更新");
    return;
  }

  let labels, throughputData;

  if (processedData && Array.isArray(processedData)) {
    // 新版本：使用传入的 processedData
    labels = processedData.map((item: ProcessedTestItem) =>
      item.pkt_kb.toString()
    );
    throughputData = processedData.map(
      (item: ProcessedTestItem) => item.throughput_gbps
    );
  } else {
    // 旧版本：使用 throughputRealTimeData 和固定的包大小
    const packageSizes = [4, 8, 16, 32];
    labels = packageSizes
      .slice(0, throughputRealTimeData.value.length)
      .map((size) => size.toString());
    throughputData = [...throughputRealTimeData.value];
  }

  // 计算动态Y轴最大值
  const maxValue = Math.max(...throughputData);
  const dynamicMax = Math.max(40, Math.ceil((maxValue * 1.1) / 10) * 10); // 至少40，向上取整到10的倍数，并增加10%空间

  // 更新图表数据
  throughputChartInstance.data.labels = labels;
  throughputChartInstance.data.datasets[0].data = throughputData;

  // 更新目标线数据，保持30 Gb/s在所有数据点
  throughputChartInstance.data.datasets[1].data = new Array(labels.length).fill(
    30
  );

  // 动态更新Y轴最大值
  throughputChartInstance.options.scales.y.max = dynamicMax;

  throughputChartInstance.update("none");

  console.log("图表更新完成:", {
    labels: labels,
    data: throughputData,
    dynamicMax: dynamicMax,
    maxValue: maxValue,
  });
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

  // 项目成果样式
  .achievements-panel {
    padding: 20px;
  }

  .achievements-grid {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 25px;
  }

  .papers-patents-section {
    .achievement-section {
      margin-bottom: 20px;

      &:last-child {
        margin-bottom: 0;
      }
    }
  }

  .achievement-title {
    font-size: 16px;
    color: #2c3e50;
    margin-bottom: 12px;
    padding-bottom: 6px;
    border-bottom: 2px solid var(--emdc-color-primary);
    display: inline-block;
  }

  .compact-achievement-list {
    .compact-item {
      display: flex;
      gap: 10px;
      margin-bottom: 10px;
      padding: 8px 12px;
      background: #f8f9fa;
      border-radius: 4px;
      border-left: 3px solid transparent;
      transition: all 0.2s;

      &:hover {
        background: #e9ecef;
        border-left-color: var(--emdc-color-primary);
        transform: translateX(3px);
      }
    }

    .item-number {
      font-weight: 700;
      color: var(--emdc-color-primary);
      font-size: 14px;
      min-width: 18px;
      flex-shrink: 0;
    }

    .item-content {
      flex: 1;
      min-width: 0;

      .item-header {
        display: flex;
        align-items: center;
        gap: 15px;
      }

      .item-title {
        color: #2c3e50;
        font-weight: 500;
        font-size: 13px;
        line-height: 1.4;
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .item-authors {
        color: #606266;
        font-size: 12px;
        line-height: 1.4;
        flex-shrink: 0;
        white-space: nowrap;
      }

      .item-venue {
        color: #0C8357;
        font-size: 12px;
        line-height: 1.4;
        font-weight: 500;
        flex-shrink: 0;
        white-space: nowrap;
      }

      .award-badge {
        display: inline-block;
        margin-top: 4px;
        padding: 2px 8px;
        background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
        color: #8b4513;
        border-radius: 3px;
        font-size: 11px;
        font-weight: 600;
      }
    }
  }

  .talent-section {
    .achievement-section {
      padding-top: 0;
    }
  }

  .talent-cards {
    margin-bottom: 15px;

    .talent-card {
      background: #f8f9fa;
      border-radius: 6px;
      padding: 12px;
      margin-bottom: 12px;

      .talent-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;
        padding-bottom: 6px;
        border-bottom: 1px solid #e4e7ed;

        .talent-degree {
          font-size: 14px;
          font-weight: 600;
          color: var(--emdc-color-primary);
        }

        .talent-count {
          font-size: 12px;
          color: #909399;
          background: white;
          padding: 2px 8px;
          border-radius: 10px;
        }
      }

      .talent-names {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;

        .name-tag {
          padding: 4px 10px;
          background: white;
          border: 1px solid #dcdfe6;
          border-radius: 3px;
          font-size: 12px;
          color: #606266;
          transition: all 0.2s;

          &:hover {
            border-color: var(--emdc-color-primary);
            color: var(--emdc-color-primary);
            transform: translateY(-1px);
            box-shadow: 0 2px 4px rgba(12, 131, 87, 0.15);
          }
        }
      }
    }
  }

  .achievement-stats {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
    padding: 12px;
    background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
    border-radius: 6px;
    border: 1px solid #e4e7ed;

    .stat-item {
      text-align: center;
      padding: 8px;
      background: white;
      border-radius: 4px;

      .stat-number {
        font-size: 24px;
        font-weight: 700;
        color: var(--emdc-color-primary);
        margin-bottom: 2px;
        line-height: 1;
      }

      .stat-label {
        font-size: 11px;
        color: #909399;
      }
    }
  }

  @media (max-width: 1200px) {
    .achievements-grid {
      grid-template-columns: 1fr;
    }
  }
}
</style>
