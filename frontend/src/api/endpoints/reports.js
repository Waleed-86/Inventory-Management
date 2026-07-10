import axiosClient from '../axiosClient';

/**
 * Downloads a file from an authenticated endpoint and triggers the browser's
 * save dialog. Needed because our auth uses Bearer tokens (not cookies), so
 * a plain <a href="..."> link can't carry the Authorization header —
 * axios must fetch the file as a blob first.
 */
async function downloadFile(url, filename) {
  const response = await axiosClient.get(url, { responseType: 'blob' });

  const blobUrl = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = blobUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(blobUrl);
}

export function downloadAssetsPdf() {
  const date = new Date().toISOString().slice(0, 10);
  return downloadFile('/admin/reports/assets/pdf', `asset-inventory-${date}.pdf`);
}

export function downloadAssetsCsv() {
  const date = new Date().toISOString().slice(0, 10);
  return downloadFile('/admin/reports/assets/csv', `asset-inventory-${date}.csv`);
}