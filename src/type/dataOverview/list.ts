export interface IGetTQZonesParam {
  Authorization: string;
}

export type IGetTQZonesRes = string[];

export interface IGetJobLIstParam {
  Authorization: string;
  'Tq-Zone': string;
}
export type JobStatus =
  | 'running'
  | 'finished'
  | 'error'
  | 'updating'
  | 'stopped';
export interface IJob {
  name: string;
  status: JobStatus;
  statusMsg: string;
  creator: string;
  createDate: string;
  lastOpDate: string;
  type: string;
  algorithmUuid: string;
  algorithm: {
    type: string;
  };
  resource: {
    gpuNodeName: string;
    gpuNum: number;
    workerNum: number;
    gpuTypeName: string;
  };
}

export type IGetJobLIstRes = IJob[];
