import { data } from '@/utils/data';
/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/naming-convention */
import axios from '@/utils/axios';
import { ip } from '@/utils/ip';


export interface IPayload {
  page: number,
  limit: number,
  cond: object,
}

class Devices<T> {
  name: string;
  url: string;

  constructor({ name, url }: { name: string; url: string }) {
    this.name = name;
    this.url = url || name;
  }

  del = async (id: string) => {
    return axios.delete(`${ip}/${this.url}/${id}/`);
  };

  get = async (payload: IPayload) => {
    // console.log(payload);
    return axios.get(`${ip}/${this.url}/`, { params: payload });
  };

  get_by_id = async (id: string) => {
    // console.log(payload);
    return axios.get(`${ip}/${this.url}/${id}/`);
  };

  add = async (payload: T) => {
    return axios.post(`${ip}/${this.url}/`, payload);
  };

  add2 = async (payload: T) => {
    Object.keys(payload).forEach((key) => {
      // payload[key] = payload[key];
      payload[key] = payload[key];
    });
    return axios.post(`${ip}/${this.url}/`, payload);
  };

  upd = async (payload: T & { id: string | undefined, data: FormData }) => {
    const { id } = payload;
    payload.id = undefined;
    return axios.put(`${ip}/${this.url}/${id}/`, payload.data);
  };

  getDashboard = async (payload: T & { id: string | undefined, data: any }) => {
    return axios.get(`${ip}/IoTAnalyzerDevices/dashboard/stat/${payload.id}`, { params: payload.data });
  }

  getIPSDashboard = async (payload: T & { id: string | undefined, data: any }) => {
    return axios.get(`${ip}/IoTAnalyzerDevices/IpsTracking/stat_ips/${payload.id}`, { params: payload.data });
  }

  getAllDevices = async (payload: T & { id: string | undefined, data: any }) => {
    return axios.get(`${ip}/IoTAnalyzerDevices/devices/${payload.id}`, { params: payload.data });
  }

  getDistribution = async () => {
    return axios.get(`${ip}/IoTAnalyzerDevices/distribtutions/graph`);
  }

}

const devices = new Devices({ name: 'IoTAnalyzerDevices', url: 'IoTAnalyzerDevices' });

export default devices;
