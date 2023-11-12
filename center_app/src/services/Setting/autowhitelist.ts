import axios from "@/utils/axios";
import { ip } from "@/utils/ip";

export const get_auto_whitelist = () => {
  return axios.get(`${ip}/settings/auto-get-whitelist`);
  // return { data: 3600 };
}

export const get_auto_whitelist_click = () => {
  return axios.get(`${ip}/settings/manual-get-whitelist`);
}

export const get_srcs_whitelist = (params: any) => {
  return axios.get(`${ip}/settings/auto-get-whitelist/srcs`, { params: params });
}
export const get_srcs_whitelist_by_id = (id: string) => {
  return axios.get(`${ip}/settings/auto-get-whitelist/srcs/${id}`);
}
export const post_srcs_whitelist = (data: any) => {
  return axios.post(`${ip}/settings/auto-get-whitelist/srcs`, data);
}
export const update_srcs_whitelist = (payload: { id: string, data: any }) => {
  return axios.put(`${ip}/settings/auto-get-whitelist/srcs/${payload.id}`, payload.data);
}
export const delete_srcs_whitelist = (id: string) => {
  return axios.delete(`${ip}/settings/auto-get-whitelist/srcs/${id}`);
}

export const update_auto_whitelist = (time: number) => {
  return axios.put(`${ip}/settings/auto-get-whitelist/${time}`);
}

export const stop_auto_whitelist = () => {
  return axios.delete(`${ip}/settings/auto-get-whitelist`);
}
