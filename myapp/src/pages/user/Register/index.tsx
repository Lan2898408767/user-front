import Footer from '@/components/Footer';
import { register} from '@/services/ant-design-pro/api';
import {
  LockOutlined,
  UserOutlined,
} from '@ant-design/icons';
import {
  LoginForm,
  ProFormText,
} from '@ant-design/pro-components';
import {  message, Tabs } from 'antd';
import React, { useState } from 'react';

import styles from './index.less';
import {Link , history} from "umi";



//React函数组件
const Register: React.FC = () => {

  const [type, setType] = useState<string>('account');

  //注册表单校验函数 , 点击注册按钮时触发
  const handleSubmit = async (values: API.RegisterParams) => {

    //自定义校验 (检验两个密码是否一致)
    const { userPassword , checkPassword} =values ;
    if(userPassword !== checkPassword){
      message.error('两次密码不一致');
      return ;
    }

    try {
      // 调用注册API方法 , 向后端发送请求 , 后端返回新添加用户的id
      const result = await register({
        ...values,
        type,
      });

      //如果id存在 ,则代表注册成功
      //如果返回code码为1 , 代表后端注册成功
      if ( result.code === 1  ) {
        //提示登录成功
        message.success('注册成功！');

        //页面重定向 , 未登录时访问的是A页面 , 登录成功/注册成功就重定向到A页面给用户
        if (!history) return;
        const { query } = history.location;
        //登陆成功跳转到login页面 , 或重定向到未登录之前所访问的页面
        history.push( {
          pathname : '/user/login',
          query
        });
        return;
      }

    } catch (error) {
      message.error('注册失败，请重试！');
    }
  };






  //React函数组件，用于渲染注册页面
  return (
    //注册页直接复用登录表单组件即可
    //文案修改需要添加  submitter  searchConfig submitText
    <div className={styles.container}>
      <div className={styles.content}>
        <LoginForm
          //直接去掉LOGO
          // logo={<img alt="logo" src= {SYSTEM_LOGO} />}
          title="用户中心"
          subTitle={''}
          initialValues={{
            autoLogin:  true,
          }}
          submitter={{
            searchConfig: {
              //默认文案为登录
              submitText: "注册",
            },
          }}



          //调用handleSubmit表单检验函数
          onFinish={async (values) => {
            await handleSubmit(values as API.RegisterParams);
          }}
        >

          <Tabs activeKey={type} onChange={setType}>
            <Tabs.TabPane key="account" tab={'账户密码注册'} />
          </Tabs>



          {type === 'account' && (
            <>
              <ProFormText
                name="userAccount"
                fieldProps={{
                  size: 'large',
                  prefix: <UserOutlined className={styles.prefixIcon} />,
                }}
                placeholder={'请输入用户名'}
                rules={[
                  {
                    required: true,
                    message: '用户名是必填项！',
                  },
                ]}
              />
              <ProFormText.Password
                name="userPassword"
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined className={styles.prefixIcon} />,
                }}
                placeholder={'请输入密码'}
                rules={[
                  {
                    required: true,
                    message: '密码是必填项！',
                  },
                  {
                    min:8,
                    type:'string',
                    message:'长度不能小于8',
                  },
                ]}
              />
              <ProFormText.Password
                name="checkPassword"
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined className={styles.prefixIcon} />,
                }}
                placeholder={'请确认密码'}
                rules={[
                  {
                    required: true,
                    message: '确认密码是必填项！',
                  },
                  {
                    min:8,
                    type:'string',
                    message:'长度不能小于8',
                  },
                ]}
              />
            </>
          )}

          {/*跳转到登录界面*/}
          <div>
            <a
              style={{
                float: 'right',
                marginBottom: 24,
              }}
              // href={""}
              target="_blank"
            >
              {/*跳转到Login组件   /user/login  返回登录  */}
              <Link to="login">返回登录</Link>
            </a>
          </div>


        </LoginForm>
      </div>
      <Footer />
    </div>
  );
};


//导出组件
export default Register;
