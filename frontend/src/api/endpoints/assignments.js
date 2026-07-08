import axiosClient from '../axiosClient';

export function fetchUsers(params = {}) {
  return axiosClient.get('/admin/users', { params });
}

export function fetchAssignments(params = {}) {
  return axiosClient.get('/admin/assignments', { params });
}

export function createAssignment(data) {
  return axiosClient.post('/admin/assignments', data);
}

export function returnAssignment(id) {
  return axiosClient.post(`/admin/assignments/${id}/return`);
}