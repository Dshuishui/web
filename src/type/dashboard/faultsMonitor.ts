export interface ISumByLevelParam {
  date: string;
}

export interface ISumByTypeParam {
  begin: string;
  end: string;
  gap: string;
}

export interface ITrendByLevelParam {
  begin: string;
  end: string;
}

export interface ITrendByTypeParam {
  begin: string;
  end: string;
}

export interface IAlarm {
  id: number;
  source: string;
  type: number;
  level: string;
  description: string;
  related: string;
  submitTime: string;
}

export interface IAlarmListDataParam {
  pageNumber: number;
  pageSize: number;
  searchStr?: string;
  level?: string;
  source?: string;
}

