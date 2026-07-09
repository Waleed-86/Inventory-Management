import axiosClient from '../axiosClient';

export function fetchRequisitions(params = {}) {
  return axiosClient.get('/requests', { params });
}

export function createRequisition(data) {
  return axiosClient.post('/requests', data);
}

export function approveRequisition(id, data = {}) {
  return axiosClient.post(`/requests/${id}/approve`, data);
}

export function rejectRequisition(id, data) {
  return axiosClient.post(`/requests/${id}/reject`, data);
}

export function dispatchRequisition(id) {
  return axiosClient.post(`/requests/${id}/dispatch`);
}