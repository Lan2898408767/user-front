import Footer from '@/components/Footer';
import RightContent from '@/components/RightContent';
import { BookOutlined, LinkOutlined } from '@ant-design/icons';
import type { Settings as LayoutSettings } from '@ant-design/pro-components';
import type { RunTimeLayoutConfig } from 'umi';
import { history, Link } from 'umi';
import defaultSettings from '../config/defaultSettings';
import { currentUser as queryCurrentUser } from './services/ant-design-pro/api';
import {PageLoading, SettingDrawer} from "@ant-design/pro-components";

const isDev = process.env.NODE_ENV === 'development';
const loginPath = '/user/login';
const NO_NEED_LOGIN_WHITE_LIST = [loginPath, "/user/register"]
/** 获取用户信息比较慢的时候会展示一个 loading */
export const initialStateConfig = {
  loading: <PageLoading />,
};



//每次刷新页面 , 都会执行此方法 , 获取登录态
//异步函数 获取session状态 (通过cookie) , 登录过的用户后台可以用cookie找到自己的那份session
export async function getInitialState(): Promise<{
    settings?: Partial<LayoutSettings>; // 可选的布局设置对象
    currentUser?: API.CurrentUser; // 可选的当前用户对象
    loading?: boolean;  // 可选的加载状态布尔值
    fetchUserInfo?: () => Promise<API.Result | undefined>; // 可选的获取用户信息函数
}> {

    // 定义一个异步函数，用于获取用户登录态(session)
    const fetchUserInfo = async () => {
        try {
            // 调用queryCurrentUser函数获取当前用户信息
            // return await queryCurrentUser();
            const res = await queryCurrentUser();
            return res.data ;
        } catch (error) {
            history.push(loginPath);  // 如果发生错误，将用户重定向到登录页面
        }
        return undefined;
    };

    // 如果是登录页面或注册页面，不需要登录态
    if (NO_NEED_LOGIN_WHITE_LIST.includes(history.location.pathname)) {
        // 如果是登录页面或注册页面，则返回包含fetchUserInfo和默认设置的对象
        return {
            fetchUserInfo,
            settings: defaultSettings,
        };
    }
    //非登陆注册页面 ,调用fetchUserInfo函数获取用户状态
    const res = await fetchUserInfo();
    const currentUser  = res.data;
    return {
        fetchUserInfo,
        currentUser,
        settings: defaultSettings,
    };
}


//每次刷新页面 , 都会执行此方法 , 判断登录态是否存在 , 登录注册页面组件不拦截 , 其它页面组件不存在重定向登录页面
export const layout: RunTimeLayoutConfig = ({ initialState, setInitialState }) => {
    // 返回一个对象，包含以下属性：
    return {
        // 右侧内容渲染函数
    rightContentRender: () => <RightContent />,
        // 是否禁用内容边距
    disableContentMargin: false,
        // 水印属性，显示当前用户的用户名
    waterMarkProps: {
      content: initialState?.currentUser?.username,
    },
    footerRender: () => <Footer />,
        //页面变化时的处理函数 , 非登录页面又无登录态者不允许访问
    onPageChange: () => {
        // 获取当前页面的 location 对象
      const { location } = history;
         //如果访问的登录注册页面 , 页面不做任何变化
      if(NO_NEED_LOGIN_WHITE_LIST.includes(location.pathname)){
        return ;
      }
      // 如果不是登录注册页面，又没有登录态 , 重定向到 login页面
      if (!initialState?.currentUser && !NO_NEED_LOGIN_WHITE_LIST.includes(location.pathname) )  {
        history.push(loginPath);
      }
    },
    links: isDev
      ? [
          <Link key="openapi" to="/umi/plugin/openapi" target="_blank">
            <LinkOutlined />
            <span>OpenAPI 文档</span>
          </Link>,
          <Link to="/~docs" key="docs">
            <BookOutlined />
            <span>业务组件文档</span>
          </Link>,
        ]
      : [],
    menuHeaderRender: undefined,
    // 自定义 403 页面
    unAccessible: <div>unAccessible</div>,
    // 增加一个 loading 的状态
    childrenRender: (children: any, props: { location: { pathname: string | string[]; }; }) => {
      // if (initialState?.loading) return <Page Loading />;
      return (
        <>
          {children}
          {!props.location?.pathname?.includes('/login') && (
            <SettingDrawer
              disableUrlParams
              enableDarkTheme
              settings={initialState?.settings}
              onSettingChange={(settings: any) => {
                setInitialState((preInitialState) => ({
                  ...preInitialState,
                  settings,
                }));
              }}
            />
          )}
        </>
      );
    },
        // 合并初始状态中的设置到返回的对象中
    ...initialState?.settings,
  };
};
