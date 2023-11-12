import axios from "@/utils/axios";
import { ip } from "@/utils/ip";

export const get = () => {
  return axios.get(`${ip}/settings/email-sms`);
  // return { data: 3600 };
}

export const update = (data: any) => {
  return axios.put(`${ip}/settings/email-sms`, data);
}
