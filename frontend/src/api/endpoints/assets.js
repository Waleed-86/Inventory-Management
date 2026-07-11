import axiosClient from '../axiosClient';

export function fetchAssets(params = {}) {
  return axiosClient.get('/admin/assets', { params });
}

export function fetchAsset(id) {
  return axiosClient.get(`/admin/assets/${id}`);
}

export function createAsset(data) {
  return axiosClient.post('/admin/assets', data);
}

export function updateAsset(id, data) {
  return axiosClient.put(`/admin/assets/${id}`, data);
}

export function deleteAsset(id) {
  return axiosClient.delete(`/admin/assets/${id}`);
}

export function fetchCategories() {
  return axiosClient.get('/admin/categories');
}