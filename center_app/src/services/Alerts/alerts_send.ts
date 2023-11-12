import { ip } from "@/utils/ip";
import axios from "@/utils/axios";

export const get_mail_alert_by_id = async (device_id: string) => {
    const res = await axios.get(`${ip}/IoTAnalyzerDevices/mail/${device_id}`);
    return res;
};

export const put_mail_alert_by_id = async (data: any) => {
    const res = await axios.put(`${ip}/IoTAnalyzerDevices/mail/edit`, data);
    return res;
};

export const get_sms_alert_by_id = async (device_id: string) => {
    const res = await axios.get(`${ip}/IoTAnalyzerDevices/sms/${device_id}`);
    return res;
};

export const put_sms_alert_by_id = async (data: any) => {
    const res = await axios.put(`${ip}/IoTAnalyzerDevices/sms/edit`, data);
    return res;
};