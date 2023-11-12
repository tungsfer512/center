import { Settings as LayoutSettings } from '@ant-design/pro-layout';

const Settings: LayoutSettings & {
  pwa?: boolean;
  logo?: string;
} = {
  navTheme: 'light',
  primaryColor: '#CC0D00',
  layout: 'top',
  contentWidth: 'Fluid',
  fixedHeader: true,
  fixSiderbar: true,
  colorWeak: false,
  headerTheme: 'light',
  title: 'Tấn công mạng',
  pwa: false,
  logo: './favicon.ico',
  iconfontUrl: '',
};

export default Settings;
