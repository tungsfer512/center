import { ip3, ip } from '@/utils/ip';
import axios from 'axios';

export async function uploadFile(payload: { file: string | Blob; filename: string; public: any }) {
  const form = new FormData();
  form.append('file', payload?.file);
  form.append('filename', payload?.filename);
  form.append('public', payload?.public);
  return axios.post(`${ip3}/file/data/single`, form);
}

export async function uploadFileCsv(payload: { formData: FormData }) {
  const formData = payload?.formData;
  console.log(formData);
  return axios.post(`${ip}/snorts`, formData);
}

export const load_snort_rules = async () => {
  return axios.get(`${ip}/snorts`);
}

export const download_snort_rules = async () => {
  return axios.get(`${ip}/snorts`).then(res => {
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement('a');

    link.href = url;
    link.setAttribute('download', 'snort.rules');
    document.body.appendChild(link);
    link.click();
    link.remove();
  });
}

export const image_snort_rules = async () => {
  return axios.get(`${ip}/snorts/images`);
}
