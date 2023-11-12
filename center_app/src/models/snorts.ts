import { uploadFileCsv, download_snort_rules, load_snort_rules, image_snort_rules } from '@/services/uploadFile';
import { ip } from '@/utils/ip';
import { useState } from "react";

export default () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const [image, setImage] = useState<Object>({
    src: "",
    data: '',
  });

  const up = async (payload: { formData: FormData }) => {
    try {
      setLoading(true);
      const res = await uploadFileCsv(payload);
      console.log(res);
      setData(res.data?.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setData([]);
    }
  };

  const dowload = async () => {
    try {
      setLoading(true);
      const res = await download_snort_rules();
      console.log(res);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setData([]);
    }
  };

  const getData = async () => {
    try {
      setLoading(true);
      const res = await load_snort_rules();
      console.log(res);
      const data = String(res.data).split('\n');
      console.log(data);
      setData(data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setData([]);
    }
  };

  const getImage = async () => {
    try {
      setLoading(true);
      setImage({
        src: "",
        data: '',
      });
      const res = await image_snort_rules();
      console.log(res);
      setImage({
        src: `${ip}/snorts/images`,
        data: res.data,
      });
      setLoading(false);
      return res;
    } catch (error) {
      setLoading(false);
      setData([]);
    }
  };

  return {
    loading,
    setLoading,
    data,
    setData,
    image,


    up,
    dowload,
    getData,
    getImage,
  };
};
