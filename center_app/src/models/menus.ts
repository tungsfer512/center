import { message } from 'antd';
// import Service from '@/pages/QuanLyNguoiDung/service';
import { ActionType } from '@ant-design/pro-table';
import { useRef, useState } from 'react';
import menus from '@/services/Menus/menus';
// import baseModel from './baseModel';

export interface IMenuRecord {
    id: string;
    name: string;
    code: string;
    code_parent: string;
}

export default () => {
    const [danhSach, setDanhSach] = useState<IMenuRecord[]>([]);
    const [showDrawer, setShowDrawer] = useState(false);
    const [edit, setEdit] = useState(false);
    const [loading, setLoading] = useState(false);
    const [record, setRecord] = useState<IMenuRecord | {}>({});
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
            const res = await menus.get({
                page,
                limit,
                ...condition,
            });
            if (res.status === 200) {
                setDanhSach(res.data?.data);
                setTotal(res.data?.total);
            }
        } catch (error) {
            message.error(error);
        } finally {
            setLoading(false);
        }
    };

    const add = async (data: any) => {
        try {
            setLoading(true);
            const res = await menus.add(data);
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
            const res = await menus.upd(data);
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
            const res = await menus.del(id);
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
        menus,

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
        del
    };
};
