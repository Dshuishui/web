import axios, { AxiosRequestConfig } from 'axios';

const instance = axios.create({
  baseURL: '/',
  timeout: 50000,
});

//请求拦截器
instance.interceptors.request.use(
  (config) => {
    const accessToken = window.localStorage.getItem('accessToken');
    console.log(accessToken);
    if (accessToken) {
      config.headers['Authorization'] = accessToken;
    }
    const xPortalId = window.localStorage.getItem('X-PortalID');
    if (xPortalId) {
      config.headers['X-PortalID'] = xPortalId;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

//响应拦截器
instance.interceptors.response.use((response) => {
  // TODO accessToken失效跳转到sso认证页
  return response;
});

export default <T = any>(config: AxiosRequestConfig, needAllData?: boolean) => {
  return instance(config).then((res) => {
    if (needAllData) {
      return res as T;
    }
    if (typeof res == 'string') {
      return res as T;
    } else {
      return res.data as T;
    }
  });
};
