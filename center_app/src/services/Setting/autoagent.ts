import axios from "@/utils/axios";
import { ip } from "@/utils/ip";

export const get_auto_agent = () => {
  return axios.get(`${ip}/settings/autoupdateagent`);
  // return { data: 3600 };
}

export const get_auto_agent_click = () => {
  return axios.get(`${ip}/settings/manual-update-agent`);
}

export const update_auto_agent = (time: number) => {
  return axios.put(`${ip}/settings/put-autoupdateagent/${time}`);
}

export const stop_auto_agent = () => {
  return axios.get(`${ip}/settings/pause-autoupdateagent`);
}
