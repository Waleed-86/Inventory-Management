import axiosClient from '../axiosClient';

export function fetchDamageReports(params = {}) {
  return axiosClient.get('/damage-reports', { params });
}

// Uses FormData because an image file may be attached — axios sets the
// correct multipart/form-data content-type automatically when given FormData.
export function createDamageReport({ asset_id, description, image }) {
  const formData = new FormData();
  formData.append('asset_id', asset_id);
  formData.append('description', description);
  if (image) {
    formData.append('image', image);
  }

  return axiosClient.post('/damage-reports', formData);
}

export function updateDamageReportStatus(id, status) {
  return axiosClient.patch(`/damage-reports/${id}/status`, { status });
}