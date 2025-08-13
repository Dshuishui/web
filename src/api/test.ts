import request from '../utils/request';

export const listByPageApi = (data?: any) => {
  return request({
    ...data,
    url: '/apis/test/listByPage',
    method: 'post',
  });
};