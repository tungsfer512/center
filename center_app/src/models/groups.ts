import { message } from 'antd';
// import Service from '@/pages/QuanLyNguoiDung/service';
import { ActionType } from '@ant-design/pro-table';
import { useRef, useState } from 'react';
import groups from '@/services/Groups/groups';
// import baseModel from './baseModel';

export interface IGroupRecord {
  id: string;
  name: string;
  menus: number[];
}

export default () => {
  const [danhSach, setDanhSach] = useState<IGroupRecord[]>([]);
  const [showDrawer, setShowDrawer] = useState(false);
  const [edit, setEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [record, setRecord] = useState<IGroupRecord | {}>({});
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
      const res = await groups.get({
        page,
        limit,
        ...condition,
      });
      if (res.status === 200) {
        setDanhSach(res.data?.data);
        setTotal(res.data?.total);
      }
    } catch (error) {
      setDanhSach([]);
      setTotal(0);
      message.error('Lỗi thực hiện');
    } finally {
      setLoading(false);
    }
  };

  const add = async (data: any) => {
    try {
      setLoading(true);
      const res = await groups.add(data);
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
      const res = await groups.upd(data);
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
      const res = await groups.del(id);
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
    groups,

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
    add,
    upd,
    del,
  };
};
