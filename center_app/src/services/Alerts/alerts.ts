import { ip } from '@/utils/ip';
import { request } from 'umi';

export async function getAlerts(payload: any) {
  return request(`${ip}/alerts/`, { params: payload, method: 'GET' });
}

export async function getAlertsDashboard(payload: any) {
  return request(`${ip}/alerts/search_alert/`, { params: payload, method: 'PATCH' });
}

export async function deleteAlerts(id: number) {
  return request(`${ip}/alerts/${id}/`, { method: 'DELETE' });
}

export async function exportDataExcel(payload: any) {
  return request(`${ip}/alerts/export-xls/url`, { params: payload, method: 'GET' });
}

export async function exportDataPDF(payload: any) {
  return request(`${ip}/alerts/export/url`, { params: payload, method: 'GET' });
}
