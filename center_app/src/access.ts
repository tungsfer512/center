import type { Login } from './services/ant-design-pro/typings';
import { ESystemRole } from './utils/constants';
import { handlePhanNhom } from './utils/utils';

/**
 * @see https://umijs.org/zh-CN/plugins/plugin-access
 * */
export default function access(initialState: {
  currentUser: Login.Profile;
  phanNhom: {
    userId: string;
    danhSachPhanNhom: {
      mucDo: string;
      nhomVaiTroId: {
        _id: string;
        danhSachChucNang: string[];
      };
    }[];
    vaiTro: string;
  };
}) {
  // const verifiedCCCD = initialState?.currentUser?.cmtCccd !== undefined;
  // const verifiedEmail = initialState?.currentUser?.emailVerify?.verified ?? false;
  const vaiTro = initialState?.currentUser?.systemRole;
  const menus = initialState?.currentUser?.menus;
  const token = localStorage.getItem('token');
  return {
    // thiSinhChuaKichHoat: token && vaiTro === ESystemRole.ThiSinh,
    // user: token && vaiTro && verifiedEmail && verifiedCCCD && vaiTro === ESystemRole.User,
    admin: (token && vaiTro) && (vaiTro === ESystemRole.Admin),
    user: (token && vaiTro) && (vaiTro === ESystemRole.User),
    staff: (token && vaiTro) && (vaiTro === ESystemRole.Staff),
    permisionMenu: (route: any) => {
      let a = menus;
      let flag = false;
      menus?.map((item) => {
        if (item?.code === route.maChucNang) {
          flag = true;
        }
      });
      return flag;
    },
    adminVaStaff:
      (token && vaiTro) && (vaiTro === ESystemRole.Admin || vaiTro === ESystemRole.Staff),
    routeFilter: (route: any) => {
      console.log('route', route);

      return handlePhanNhom(initialState, route);
    },
  };
}
