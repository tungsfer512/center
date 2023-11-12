import { message } from 'antd';
import { useState } from 'react';
import blacklistip from '@/services/BlackListIp/blacklistip';

export interface IBlackListIpRecord {
  ip: string;
  url: string
}

export default () => {
  const [danhSach, setDanhSach] = useState<IBlackListIpRecord[]>([]);
  const [showDrawer, setShowDrawer] = useState(false);
  const [edit, setEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [record, setRecord] = useState<IBlackListIpRecord | {}>({});
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
      const res = await blacklistip.get({
        page,
        limit,
        ...condition,
      });
      if (res.status === 200) {
        setDanhSach(res.data?.results);
        setTotal(res.data?.count);
      }
    } catch (error) {
      message.error(error);
      setDanhSach([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  const addBlackDevice = async (data: any) => {
    try {
      setLoading(true);
      const res = await blacklistip.add(data);
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

  const upd = async (data: any) => {
    try {
      setLoading(true);
      const res = await blacklistip.upd(data);
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
      const res = await blacklistip.del(id);
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

  const del_all = async () => {
    try {
      setLoading(true);
      const res = await blacklistip.del_all();
      if (res.status === 200) {
        message.success('Xóa thành công');
        const res2 = await blacklistip.get({
          page: 1,
          limit: 10,
          ...condition,
        });
        if (res2.status === 200) {
          setDanhSach(res.data?.results);
          setTotal(res.data?.count);
        }
      }
    } catch (error) {
      message.error('Lỗi thực hiện');
    } finally {
      setLoading(false);
    }
  };

  return {
    blacklistip,

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

    getData,
    addBlackDevice,
    upd,
    del,
    del_all,
  };
};
