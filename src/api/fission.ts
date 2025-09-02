import request from '../utils/request';

// 获取指定命名空间下的所有函数
export const getFunctionsByNamespace = (namespace: string) => {
  return request({
    url: `/api/fission/v1/namespaces/${namespace}/functions`,
    method: 'get',
  });
};

// 获取所有命名空间（这里需要根据实际API调整）
export const getAllNamespaces = () => {
  return request({
    url: '/api/fission/v1/namespaces',
    method: 'get',
  });
};

// 创建环境
export const createEnvironment = (namespace: string, data: any) => {
  return request({
    url: `/api/fission/v1/namespaces/${namespace}/environments`,
    method: 'post',
    data,
  });
};

// 创建包
export const createPackage = (namespace: string, data: any) => {
  return request({
    url: `/api/fission/v1/namespaces/${namespace}/packages`,
    method: 'post',
    data,
  });
};

// 创建函数
export const createFunction = (namespace: string, data: any) => {
  return request({
    url: `/api/fission/v1/namespaces/${namespace}/functions`,
    method: 'post',
    data,
  });
};
