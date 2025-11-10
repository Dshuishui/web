<template>
  <div class="serverless-container">
    <div class="page-intro">
      <div class="intro-header">
        <h1>服务器无感框架和协同调度平台</h1>
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

    <router-view />

    </div>
</template>

<script setup lang="ts">
// 4. 所有的 script 内容都已迁移到子组件中
// 这个父组件现在是一个纯粹的布局，不需要特定的 script 逻辑
</script>

<style lang="less" scoped>
/* 5. 只保留这个父组件和 intro 区域所需的样式 */
/* (所有特定于 tab 的样式都已移至子组件) */

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

  /* 删除了 .main-tabs, .content-panel, .section-header 等
    因为它们现在属于子组件 
  */
  
  // 响应式设计
  @media (max-width: 768px) {
    padding: 15px;
  }
}
</style>