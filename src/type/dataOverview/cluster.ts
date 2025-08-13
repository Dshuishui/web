
export interface IClusterNumInfo {
  num: number;
  rate: number;
}
export interface ClusterInfoData {
  total: number;
  mainGpuType: string[];
  used: IClusterNumInfo;
  idle: IClusterNumInfo;
  breakdown: IClusterNumInfo;
  fault: IClusterNumInfo;
  unknown: IClusterNumInfo;
  // apportionment: number;
}
export interface ICluster {
  clusterName: string;
  flops: number;
  unit: 'TFlops' | 'PFlops';
  gpu: number;
  gpuType: string;
  id: string;
  needFetch?: boolean;
  fetchParams?: { link?: string; body?: { [key: string]: any } };
  info: ClusterInfoData;
  sup?: string;
}

export interface ICLusterInfo {
  clusterType: string;
  clusters: ICluster[];
  sup?: string;
  radioHidden?: string[];
}

export interface IGetClusterInfoRes {
  ranks: {
    cluster: string;
    apportionment: number;
  }[];
  gpuTotal: number;
  clusters: { [key: string]: ClusterInfoData };
  statistics: any
}
