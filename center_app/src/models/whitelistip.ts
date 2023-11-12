import { message } from 'antd';
import { useState } from 'react';
import whitelistip from '@/services/WhiteListIp/whitelistip';

export interface IWhiteListIpRecord {
    ip: string;
    url: string
}

export default () => {
    const [danhSach, setDanhSach] = useState<IWhiteListIpRecord[]>([]);
    const [showDrawer, setShowDrawer] = useState(false);
    const [edit, setEdit] = useState(false);
    const [loading, setLoading] = useState(false);
    const [record, setRecord] = useState<IWhiteListIpRecord | {}>({});
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
            const res = await whitelistip.get({
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

    const addWhiteDevice = async (data: any) => {
        try {
            setLoading(true);
            const res = await whitelistip.add(data);
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
            const res = await whitelistip.upd(data);
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
            const res = await whitelistip.del(id);
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
            const res = await whitelistip.del_all();
            if (res.status === 200) {
                message.success('Xóa thành công');
                const res2 = await whitelistip.get({
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
        whitelistip,

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
        addWhiteDevice,
        upd,
        del,
        del_all,
    };
};
