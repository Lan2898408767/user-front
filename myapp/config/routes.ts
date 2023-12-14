export default [
  {
    path: '/user',
    layout: false,
    routes: [
      //通用url路径匹配到某一组件 (如: Pages下user下的Login)
      { name: '登录', path: '/user/login', component: './user/Login' },
      { name: '注册', path: '/user/register', component: './user/Register' },
      { component: './404' },
    ],
  },
  { path: '/welcome', name: '欢迎', icon: 'smile', component: './Welcome' },
  {
    path: '/admin',
    name: '管理页',
    icon: 'crown',
    //访问权限只能Admin权限 , 具体什么权限查看access.ts文件
    //全局的App文件每次页面发生变化都会查看登录态 , 并将其user对象放到全局中
    // 当前用户存在(登陆过) ,而且账户名为admin才可以访问该路由/组件
    // canAdmin: currentUser && currentUser.userAccount === 'admin',
    access: 'canAdmin',
    routes: [
      { path: '/admin/UserMange', name: '用户管理', icon: 'smile', component: './admin/UserMange' },
      { component: './404' },
    ],
  },
  // { name: '查询表格', icon: 'table', path: '/list', component: './TableList' },

  { path: '/', redirect: '/welcome' },
  { component: './404' },
];
