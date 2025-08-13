export interface INodeMetric {
  node : string,
}

export interface IGPUStatus {
  uuid: string;
  class: string;
  rate: number;
  hoverClass?: string;
  used: string;
  alert? : string;
  visible?: boolean,
}

export interface INodeStatusResponse {
  metric : INodeMetric,
  value: (number | string)[],
  hoverClass?: string,
  class?: string,
  alert?: string, 
  cards: IGPUStatus[],
}

export interface IGPUStatusMetric {
  __name__: string,
  container: string,
  endpoint: string,
  hostname: string,
  id: string,
  instance: string,
  job: string,
  namespace: string,
  node: string,
  pod: string,
  service: string,
  type: string,
  uuid: string
}

export interface IGPUStatusResponse {
  metric : IGPUStatusMetric,
  value: (number | string)[],
}

export interface IGPUUsedRate {
  Hostname: string;
  UUID: string;
  __name__: string;
  container: string;
  device: string;
  endpoint: string;
  gpu: string;
  instance: string;
  job: string;
  modelName: string;
  namespace: string;
  pod: string;
  service: string;
}

export interface IGPUUsedRateResponse {
  metric : IGPUUsedRate,
  value: (number | string)[],
}

/** 集群资源页面图表部分接口定义 */
export interface IGpuService {
  total: number,
  normalTotal: number,
  normal: number,
  normalCannt: number,
  faultTotal: number,
  faultCan: number,
  fault: number,
  normalPercentage: number,
  faultPercentage: number
}

export interface IGpuUsedOverview {
  total: number,
  detected: number, // 系统可检测到的卡数
  unused: number,
  used: number,
  error: number,
  unusedPercentage: string,
  usedPercentage: string,
  errorPercentage: string
}

export interface IGpuUsedLine {
  total: number, // 总共的卡数
  xdata: string[],
  used: number[], // 已使用
  breakdown: number[], // 离线
  idle: number[] // 空闲
}

export interface IGpuUsedRateLine {
  xdata: string[],
  average: number[]
}

export interface INetworkBandWidthService {
  xdata: string[],
  bond_out: number[],
  eth2_out: number[],
  ymax: number
}

export interface INetworkBandAreaService {
  xdata: string[],
  ymax: number,
  cur: number[], // 当前值
  deviation: number[], // 偏差值
  base: number[], // 最上面红线值
}