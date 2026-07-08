import axiosClient from '../axiosClient';

export function fetchAssets(params = {}) {
  return axiosClient.get('/assets', { params });
}

export function fetchAsset(id) {
  return axiosClient.get(`/assets/${id}`);
}

export function createAsset(data) {
  return axiosClient.post('/assets', data);
}

export function updateAsset(id, data) {
  return axiosClient.put(`/assets/${id}`, data);
}

export function deleteAsset(id) {
  return axiosClient.delete(`/assets/${id}`);
}

export function fetchCategories() {
  return axiosClient.get('/admin/categories');
}