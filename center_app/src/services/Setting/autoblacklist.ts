import axios from "@/utils/axios";
import { ip } from "@/utils/ip";

export const get_auto_blacklist = () => {
  return axios.get(`${ip}/settings/auto-get-blacklist`);
  // return { data: 3600 };
}

export const get_auto_blacklist_click = () => {
  return axios.get(`${ip}/settings/manual-get-blacklist`);
}

export const get_srcs_blacklist = (params: any) => {
  return axios.get(`${ip}/settings/auto-get-blacklist/srcs`, { params: params });
}
export const get_srcs_blacklist_by_id = (id: string) => {
  return axios.get(`${ip}/settings/auto-get-blacklist/srcs/${id}`);
}
export const post_srcs_blacklist = (data: any) => {
  return axios.post(`${ip}/settings/auto-get-blacklist/srcs`, data);
}
export const update_srcs_blacklist = (payload: { id: string, data: any }) => {
  return axios.put(`${ip}/settings/auto-get-blacklist/srcs/${payload.id}`, payload.data);
}
export const delete_srcs_blacklist = (id: string) => {
  return axios.delete(`${ip}/settings/auto-get-blacklist/srcs/${id}`);
}

export const update_auto_blacklist = (time: number) => {
  return axios.put(`${ip}/settings/auto-get-blacklist/${time}`);
}

export const stop_auto_blacklist = () => {
  return axios.delete(`${ip}/settings/auto-get-blacklist`);
}
