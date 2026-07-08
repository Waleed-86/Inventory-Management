import axiosClient from '../axiosClient';

export function fetchCategoriesList(params = {}) {
  return axiosClient.get('/admin/categories', { params });
}

export function fetchCategory(id) {
  return axiosClient.get(`/admin/categories/${id}`);
}

export function createCategory(data) {
  return axiosClient.post('/admin/categories', data);
}

export function updateCategory(id, data) {
  return axiosClient.put(`/admin/categories/${id}`, data);
}

export function deleteCategory(id) {
  return axiosClient.delete(`/admin/categories/${id}`);
}