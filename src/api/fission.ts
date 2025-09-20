// 获取认证头
const getAuthHeaders = () => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  const accessToken = localStorage.getItem('accessToken');
  if (accessToken) {
    headers['Authorization'] = accessToken;
  }
  
  const xPortalId = localStorage.getItem('X-PortalID');
  if (xPortalId) {
    headers['X-PortalID'] = xPortalId;
  }
  
  return headers;
};

// 获取指定命名空间下的所有函数
export const getFunctionsByNamespace = async (namespace: string) => {
  const url = `/api/fission/v1/namespaces/${namespace}/functions`;
  console.log('发起请求:', url);
  
  const response = await fetch(url, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  
  console.log('响应状态:', response.status, response.statusText);
  console.log('响应URL:', response.url);
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return response.json();
};

// 获取所有命名空间（这里需要根据实际API调整）
export const getAllNamespaces = async () => {
  const response = await fetch('/api/fission/v1/namespaces', {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return response.json();
};

// 创建环境
export const createEnvironment = async (namespace: string, data: any) => {
  const response = await fetch(`/api/fission/v1/namespaces/${namespace}/environments`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return response.json();
};

// 创建包
export const createPackage = async (namespace: string, data: any) => {
  const response = await fetch(`/api/fission/v1/namespaces/${namespace}/packages`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return response.json();
};

// 创建函数
export const createFunction = async (namespace: string, data: any) => {
  const response = await fetch(`/api/fission/v1/namespaces/${namespace}/functions`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return response.json();
};

// 性能测试相关接口
export const startPerformanceTest = async () => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 60000);
  
  try {
    const response = await fetch('http://127.0.0.1:30085/topic3-pro-kp-receiver', {
      method: 'GET',
      headers: getAuthHeaders(),
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
};

export const sendPerformanceTest = async () => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 60000);
  
  try {
    const response = await fetch('http://127.0.0.1:30085/topic3-pro-kp-sender', {
      method: 'GET',
      headers: getAuthHeaders(),
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
};
