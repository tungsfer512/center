import axios from '@/utils/axios';
import { ip } from '@/utils/ip';
import { Login } from './typings';

export const login = async (payload: { username: string; password: string }) => {
  console.log(payload);
  const res = await axios.post(`${ip}/auth/token/login/`, payload);
  console.log(res);
  return res;
};

export async function getInfo() {
  return axios.get(`${ip}/users/get-current-info/`);
}

export async function getInfoAdmin() {
  return axios.get(`${ip}/users/get-current-info/`);
}
