import axiosClient from '../axiosClient';

export function fetchUsersList(params = {}) {
  return axiosClient.get('/admin/users', { params });
}

export function createUser(data) {
  return axiosClient.post('/admin/users', data);
}

export function updateUser(id, data) {
  return axiosClient.put(`/admin/users/${id}`, data);
}

export function deactivateUser(id) {
  return axiosClient.post(`/admin/users/${id}/deactivate`);
}

export function reactivateUser(id) {
  return axiosClient.post(`/admin/users/${id}/reactivate`);
}