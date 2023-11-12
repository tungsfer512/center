import { data } from '@/utils/data';
import { avatar } from '@/assets/logo.png';
import { message } from 'antd';
// import Service from '@/pages/QuanLyNguoiDung/service';
import { ActionType } from '@ant-design/pro-table';
import { useRef, useState } from 'react';
import donvi from '@/services/DonVi/donvi';
// import baseModel from './baseModel';

export interface IDashboard {
  device_counts: number,
  monitored_devices_counts: number,
  free_devices_counts: number,
  alert_counts: number,
  reviewed_alert_counts: number,
  pending_alert_counts: number,
  malware_alert_counts: number,
  syscall_alert_counts: number,
  network_alert_counts: number,
  all_ips: {
    ips: Array<object>,
  },
}
export interface IDonViRecord {
  id: string;
  ip: string;
  port: number;
  name: string;
  domain: string;
  protocol: string;
  username: string;
  password: string;
  mac_addr: string;
  status: boolean;
  avatar: string;
  email: string;
  phone: string;
  address: string;
}

export default () => {
  const [danhSach, setDanhSach] = useState<IDonViRecord[]>([]);
  const [showDrawer, setShowDrawer] = useState(false);
  const [edit, setEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [record, setRecord] = useState<IDonViRecord | {}>({});
  const [visibleForm, setVisibleForm] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [filterInfo, setFilterInfo] = useState<any>({});
  const [condition, setCondition] = useState<any>({});
  const [visible, setVisible] = useState<boolean>(false);

  const [dataDashboard, setDataDashboard] = useState();
  const [dataIPS, setDataIPS] = useState();

  const getAllDeviceDonVi = async (payload) => {
    try {
      setLoading(true);
      const data = await donvi.getAllDevices(payload ?? {});
      console.log(data.data?.results);
      setDanhSach(data.data?.results);
      setTotal(data.data?.count);
      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
  }

  const getDataDashboard = async (payload) => {
    setLoading(true);
    const data = await donvi.getDashboard(payload ?? {});
    setDataDashboard(data.data);
    setLoading(false);
  }

  const getIPSData = async (payload) => {
    try {
      setLoading(true);
      const data = await donvi.getIPSDashboard(payload ?? {});
      setDataIPS(data.data);
      setLoading(false);
    } catch (e) {
      setLoading(false);
      setDataIPS([]);
    }
  }

  const getData = async () => {
    try {
      setLoading(true);
      console.log(page, limit, condition);
      const res = await donvi.get({
        page,
        limit,
        ...condition,
      });
      console.log(res);
      if (res.status === 200) {
        setDanhSach(res.data?.results);
        setTotal(res.data?.count);
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
      const res = await donvi.get_by_id(id);
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
      const res = await donvi.add(data);
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
      const res = await donvi.upd(data);
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
      const res = await donvi.del(id);
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

    dataDashboard,
    getDataDashboard,
    dataIPS,
    getIPSData,
    getAllDeviceDonVi,
  };
};
