import {
    get_mail_alert_by_id,
    put_mail_alert_by_id,
    get_sms_alert_by_id,
    put_sms_alert_by_id,
} from '@/services/Alerts/alerts_send';
import { message } from 'antd';
import { useState } from 'react';

export interface IAlerts {
    id: string;
    network: boolean;
    malware: boolean;
    syscall: boolean;
    log: boolean;
    ips: boolean;
    device: number;
}

export default () => {
    const [mailAlert, setMailAlert] = useState<IAlerts | {}>({})
    const [smsAlert, setSmsAlert] = useState<IAlerts | {}>({})
    const [loading, setLoading] = useState<boolean[]>(new Array(2).fill(false))

    const getMailAlert = async (device_id: string) => {
        try {
            setLoading([true, false])
            const res = await get_mail_alert_by_id(device_id)
            setMailAlert(res.data?.data)
            // console.log(res.data?.data);
            setLoading([false, false])
        } catch (error) {
            message.error('Lỗi thực hiện')
            setLoading([false, false])
        }
    }

    const putMailAlert = async (data: any) => {
        console.log(data);
        try {
            setLoading([true, false])
            const res = await put_mail_alert_by_id(data)
            if (res.status === 200) {
                message.success('Cập nhật thành công')
            }
            setLoading([false, false])
        } catch (error) {
            message.error('Lỗi thực hiện')
            setLoading([false, false])
        }
    }

    const getSmsAlert = async (device_id: string) => {
        try {
            setLoading([true, false])
            const res = await get_sms_alert_by_id(device_id)
            setSmsAlert(res.data?.data)
            console.log(res.data?.data);
            setLoading([false, false])
        }
        catch (error) {
            message.error('Lỗi thực hiện')
            setLoading([false, false])
        }
    }

    const putSmsAlert = async (data: any) => {
        try {
            setLoading([false, true])
            const res = await put_sms_alert_by_id(data)
            if (res.status === 200) {
                message.success('Cập nhật thành công')
            }
            setLoading([false, false])
        } catch (error) {
            message.error('Lỗi thực hiện')
            setLoading([false, false])
        }
    }

    return {
        mailAlert,
        smsAlert,
        loading,
        getMailAlert,
        putMailAlert,
        getSmsAlert,
        putSmsAlert,
        setMailAlert,
        setSmsAlert,
    }
}