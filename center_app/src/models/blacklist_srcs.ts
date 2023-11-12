import { data } from '@/utils/data';
import { avatar } from '@/assets/logo.png';
import { message } from 'antd';
// import Service from '@/pages/QuanLyNguoiDung/service';
import { ActionType } from '@ant-design/pro-table';
import {
  get_srcs_blacklist,
  get_srcs_blacklist_by_id,
  post_srcs_blacklist,
  update_srcs_blacklist,
  delete_srcs_blacklist,
} from "@/services/Setting/autoblacklist";
import { useRef, useState } from 'react';
import donvi from '@/services/DonVi/donvi';
// import baseModel from './baseModel';

export interface ISrc {
  id: number;
  url: string;
  src_type: string;
  file_type: string;
}


export default () => {
  const [danhSach, setDanhSach] = useState<ISrc[]>([]);
  const [showDrawer, setShowDrawer] = useState(false);
  const [edit, setEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [record, setRecord] = useState<ISrc | {}>({});
  const [visibleForm, setVisibleForm] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [filterInfo, setFilterInfo] = useState<any>({});
  const [condition, setCondition] = useState<any>({});
  const [visible, setVisible] = useState<boolean>(false);

  const getData = async () => {
    try {
      setLoading(true);
      console.log(page, limit, condition);
      const res = await get_srcs_blacklist({
        page,
        limit,
        ...condition,
      });
      console.log(res);
      if (res.status === 200) {
        setDanhSach(res.data?.data);
        setTotal(res.data?.data?.length);
      }
    } catch (error) {
      setDanhSach([]);
      setTotal(0);
      message.error('Lỗi thực hiện');
    } finally {
      setLoading(false);
    }
  };

  const getDataById = async (id: string) => {
    try {
      setLoading(true);
      const res = await get_srcs_blacklist_by_id(id);
      console.log(res);
      if (res.status === 200) {
        setRecord(res.data);
      }
    } catch (error) {
      setRecord({});
      message.error('Lỗi thực hiện');
    } finally {
      setLoading(false);
    }
  };

  const add = async (data: any) => {
    try {
      setLoading(true);
      const res = await post_srcs_blacklist(data);
      if (res.status === 201) {
        message.success('Thêm mới thành công');
        setVisibleForm(false);
        getData();
      }
    } catch (error) {
      message.error('Lỗi thực hiện');
    } finally {
      setLoading(false);
    }
  };

  const upd = async (payload: { id: string, data: any }) => {
    try {
      setLoading(true);
      const res = await update_srcs_blacklist(payload);
      if (res.status === 200) {
        message.success('Cập nhật thành công');
        setVisibleForm(false);
        getData();
      }
    } catch (error) {
      message.error('Lỗi thực hiện');
    } finally {
      setLoading(false);
    }
  };

  const del = async (id: string) => {
    try {
      setLoading(true);
      const res = await delete_srcs_blacklist(id);
      if (res.status === 200) {
        message.success('Xóa thành công');
        getData();
      }
    } catch (error) {
      message.error('Lỗi thực hiện');
    } finally {
      setLoading(false);
    }
  };

  return {
    donvi,

    condition,
    danhSach,
    edit,
    filterInfo,
    loading,
    limit,
    total,
    page,
    record,
    visible,
    visibleForm,
    showDrawer,

    setCondition,
    setDanhSach,
    setEdit,
    setFilterInfo,
    setLimit,
    setTotal,
    setPage,
    setRecord,
    setVisible,
    setVisibleForm,
    setShowDrawer,

    getDataById,

    getData,
    add,
    upd,
    del,
  };
};
