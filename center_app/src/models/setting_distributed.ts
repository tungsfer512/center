import { useState } from "react";
import {
  get,
  update,
} from "@/services/Setting/distributed";

import { message } from "antd";

export default () => {
  const [loading, setLoading] = useState<boolean[]>(
    new Array(1).fill(false)
  );

  const [data, setData] = useState<any>({
    sender_email: "",
    sender_app_password: "",
    sender_phone_prefix: "",
    sender_phone: "",
    receiver_phone_frefix: "",
    twilio_account_sid: "",
    twilio_auth_token: ""
  });

  const getData = async () => {
    setLoading([true]);
    const res = await get();
    if (res.status === 200) {
      setData(res.data);
    }
    setLoading([false]);
  };

  const updateData = async (data: any) => {
    setLoading([true]);
    const res = await update(data);
    if (res.status === 200) {
      message.success("Cập nhật thành công");
    }
    setLoading([false]);
  };

  return {
    loading,
    data,
    getData,
    updateData,
  };
}
