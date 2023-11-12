// https://umijs.org/config/
import { defineConfig } from 'umi';
import defaultSettings from './defaultSettings';
import proxy from './proxy';
const { REACT_APP_ENV } = process.env;
export default defineConfig({
  hash: true,
  antd: {
    dark: true,
  },
  dva: {
    hmr: true,
  },
  layout: {
    // https://umijs.org/zh-CN/plugins/plugin-layout
    locale: true,
    siderWidth: 240,
    ...defaultSettings,
  },
  // https://umijs.org/zh-CN/plugins/plugin-locale
  locale: {
    // enable: true,
    default: 'vi-VN',
    antd: true,
    // default true, when it is true, will use `navigator.language` overwrite default
    baseNavigator: false,
    // baseSeparator: '_',
  },
  dynamicImport: {
    loading: '@ant-design/pro-layout/es/PageLoading',
  },
  targets: {
    ie: 11,
  },
  // umi routes: https://umijs.org/docs/routing
  routes: [
    {
      path: '/admin/login',
      layout: false,
      hideInMenu: true,
      name: 'login',
      component: './user/Login/adminlogin',
    },
    {
      path: '/user',
      layout: false,
      routes: [
        {
          path: '/user/login',
          layout: false,
          name: 'login',
          // component: './auth',
          component: './auth',
        },

        {
          path: '/user',
          redirect: '/user/login',
        },
        {
          name: 'register',
          icon: 'smile',
          path: '/user/register',
          component: './user/register',
        },
        {
          component: '404',
        },
      ],
    },
    {
      hideInMenu: true,
      name: 'account',
      icon: 'user',
      path: '/account',
      routes: [
        {
          name: 'center',
          icon: 'smile',
          path: '/account/center',
          component: './account/center',
        },
      ],
    },
    {
      path: `/dashboard`,
      // target: '_blank',
      name: 'Dashboard',
      icon: 'dashboard',
      component: './DashboardGrafana',
      maChucNang: 'DASHBOARD',
      access: 'permisionMenu',
    },
    {
      path: './don-vi',
      name: 'danhsachdonvi',
      // maChucNang: 'MENU',
      icon: 'UnorderedListOutlined',
      component: './QuanLyDonVi',
      maChucNang: 'QUAN_LI_DON_VI',
      access: 'permisionMenu',
    },
    {
      hideInMenu: false,
      layout: true,
      name: 'snort',
      path: '/snort',
      icon: 'AntCloudOutlined',
      component: './snort',
      maChucNang: 'SNORT',
      access: 'permisionMenu',
    },
    {
      path: '/black-white-list',
      name: 'danhsachkiemsoatip',
      icon: 'WifiOutlined',
      maChucNang: 'QUAN_LI_IP',
      access: 'permisionMenu',
      routes: [
        {
          path: './black-list',
          name: 'blacklistip',
          component: './QuanLyDanhSachIp/BlackListIp',
        },
        {
          path: './white-list',
          name: 'whitelistip',
          component: './QuanLyDanhSachIp/WhiteListIp',
        },
      ]
    },
    {
      path: './don-vi/:id',
      name: 'chitietdonvi',
      // maChucNang: 'MENU',
      icon: 'UnorderedListOutlined',
      component: './QuanLyDonVi/ChiTietDonVi.tsx',
      hideInMenu: true,
    },
    // {
    //   path: './tac-tu',
    //   name: 'danhsachtactu',
    //   // maChucNang: 'MENU',
    //   icon: 'UnorderedListOutlined',
    //   // component: './TacTu',
    // },
    {
      path: '/alert',
      name: 'alert',
      icon: 'ExclamationCircleOutlined',
      maChucNang: 'CANH_BAO',
      access: 'permisionMenu',
      component: './AlertLists/CanhBaoTanCongMang/index.tsx',
    },
    {
      path: '/users',
      name: 'quanlinguoidung',
      maChucNang: 'QUAN_LY_NGUOI_DUNG',
      access: 'permisionMenu',
      icon: 'UnorderedListOutlined',
      routes: [
        {
          path: './danh-sach-nguoi-dung',
          name: 'danhsachnguoidung',
          icon: 'UnorderedListOutlined',
          // maChucNang: 'DANH_SACH_NGUOI_DUNG',
          component: './QuanLyNguoiDung',
          access: 'adminVaStaff',
        },
        {
          path: './danh-sach-nhom-nguoi-dung',
          name: 'danhsachnhomnguoidung',
          icon: 'UnorderedListOutlined',
          // maChucNang: 'DANH_SACH_NHOM_NGUOI_DUNG',
          component: './QuanLyNhomNguoiDung',
          access: 'admin',
        },
        {
          path: './bang-menu',
          name: 'Menu',
          // maChucNang: 'MENU',
          icon: 'UnorderedListOutlined',
          component: './QuanLyMenu',
          access: 'admin',
        },

      ],
    },
    {
      path: '/setting',
      name: 'setting',
      icon: 'SettingOutlined',
      maChucNang: 'CAI_DAT',
      access: 'permisionMenu',
      routes: [
        // {
        //   path: './setting-agent',
        //   name: 'Tự động cập nhập Agent',
        //   component: './Setting/SettingAgent.tsx',
        // },
        // {
        //   path: './setting-black-list',
        //   name: 'settingblacklist',
        //   component: './Setting/SettingBlackList.tsx',
        // },
        // {
        //   path: './setting-white-list',
        //   name: 'settingwhitelist',
        //   component: './Setting/SettingWhiteList.tsx',
        // },
        {
          path: './setting-distributed',
          name: 'setting-distributed',
          component: './Setting/SettingDistributed.tsx',
          // access: 'permisionMenu',
        },
      ],
    },
    {
      layout: false,
      path: '/kichhoattaikhoan',
      component: './KichHoatTaiKhoan',
      hideInMenu: true,
      access: 'thiSinhChuaKichHoat',
    },
    {
      layout: false,
      path: '/verifycccd',
      component: './VerifyCCCD',
      hideInMenu: true,
      access: 'thiSinhChuaKichHoat',
    },

    {
      path: '/',
      redirect: '/user/login',
    },
    {
      component: '404',
    },
  ],
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    'primary-color': defaultSettings.primaryColor,
  },
  // esbuild is father build tools
  // https://umijs.org/plugins/plugin-esbuild
  esbuild: {},
  title: false,
  ignoreMomentLocale: true,
  proxy: proxy[REACT_APP_ENV || 'dev'],
  manifest: {
    basePath: '/',
  },
  // Fast Refresh 热更新
  fastRefresh: {},

  nodeModulesTransform: {
    type: 'none',
  },
  // mfsu: {},
  webpack5: {},
  exportStatic: {},
});
