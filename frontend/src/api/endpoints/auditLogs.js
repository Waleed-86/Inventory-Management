import axiosClient from '../axiosClient';

export function fetchAuditLogs(params = {}) {
  return axiosClient.get('/admin/audit-logs', { params });
}