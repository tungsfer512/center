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

class WhiteListIp<T> {
    name: string;
    url: string;

    constructor({ name, url }: { name: string; url: string }) {
        this.name = name;
        this.url = url || name;
    }

    del = async (id: string) => {
        return axios.delete(`${ip}/${this.url}/${id}/`);
    };

    del_all = async () => {
        return axios.get(`${ip}/${this.url}/clear`);
    };

    get = async (payload: IPayload) => {
        // console.log(payload);
        return axios.get(`${ip}/${this.url}/`, { params: payload });
    };

    add = async (payload: T) => {
        Object.keys(payload).forEach((key) => {
            // payload[key] = payload[key];
            payload[key] = payload[key];
        });
        return axios.post(`${ip}/${this.url}/`, payload);
    };

    add2 = async (payload: T) => {
        Object.keys(payload).forEach((key) => {
            // payload[key] = payload[key];
            payload[key] = payload[key];
        });
        return axios.post(`${ip}/${this.url}/`, payload);
    };

    upd = async (payload: T & { id: string | undefined }) => {
        const { id } = payload;
        payload.id = undefined;
        Object.keys(payload).forEach((key) => {
            payload[key] = payload[key];
        });
        return axios.put(`${ip}/${this.url}/${id}`, payload);
    };
}

const whitelistip = new WhiteListIp({ name: 'whitelistip', url: 'WhiteListIP' });

export default whitelistip;
