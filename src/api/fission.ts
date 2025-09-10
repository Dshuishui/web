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

// 性能测试相关接口
export const startPerformanceTest = () => {
  return request({
    url: 'http://127.0.0.1:30085/topic3-pro-kp-receiver',
    method: 'get',
    timeout: 60000, // 设置60秒超时，因为测试可能需要较长时间
  });
};

export const sendPerformanceTest = () => {
  return request({
    url: 'http://127.0.0.1:30085/topic3-pro-kp-sender',
    method: 'get',
    timeout: 60000, // 设置60秒超时，因为sender会阻塞等待结果
  });
};

export const startThroughputPerformanceTest = async () => {
  try {
    console.log('开始数据吞吐率测试，同时调用两个服务...');
    
    // 并发调用两个API
    const [receiverResponse, senderResponse] = await Promise.all([
      request({
        url: 'http://127.0.0.1:30085/topic3-pro-kp-receiver',
        method: 'get',
        timeout: 60000,
      }),
      request({
        url: 'http://127.0.0.1:30085/topic3-pro-kp-sender',
        method: 'get', 
        timeout: 60000,
      })
    ]);

    console.log('Receiver 响应:', receiverResponse);
    console.log('Sender 响应:', senderResponse);

    return {
      receiver: receiverResponse,
      sender: senderResponse
    };
  } catch (error) {
    console.error('数据吞吐率测试失败:', error);
    throw error;
  }
};
