import Loader from '@/components/Loader';
import LoginBackground from '@/components/LoginBackground';
import { login, register } from '@/services/Authentication/login';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import {
  LoginForm,
  ModalForm,
  ProFormCheckbox,
  ProFormText,
} from '@ant-design/pro-components';
import { history, useModel } from '@umijs/max';
import { message } from 'antd';
import { useEffect, useState } from 'react';
/**
 * 自动绑定实例
 * 异步请求 防止重复提交
 * 样式统一
 */
const Login = () => {
  // 使用 antd 的 App 静态方法或者 message 钩子
  const [messageApi, contextHolder] = message.useMessage();
  //全局共享状态
  const { setInitialState, refresh } = useModel('@@initialState');
  //定义加载状态
  const [loading, setLoading] = useState(false);
  //读出字符串变为对象
  const savedAccount = JSON.parse(
    localStorage.getItem('remember_account') || '{}',
  );
  //防止重复登录 页面加载执行一次
  useEffect(() => {
    const token = localStorage.getItem('token');
    //登录过直接踢回首页
    if (token) {
      history.replace('/home');
      return;
    }
    //没有token输入的地址栏 没有执行退出
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
    setInitialState((s: any) => ({ ...s, currentUser: undefined }));
    console.log('请先登录');
  }, []);
  // 处理注册提交
  const handleRegister = async (values: any) => {
    const { confirmPassword: _confirmPwd, ...registerData } = values;
    void _confirmPwd;
    const res = await register(registerData);
    if (res.code === 200) {
      messageApi.success('注册成功！');
      return true; // 返回 true 自动关闭弹窗
    }
    messageApi.error(res.msg);
    return false;
  };
  //登录执行
  const handleSubmit = async (values: any) => {
    setLoading(true); //执行时候显示
    // 定义一个等待函数（单位：毫秒）
    const sleep = (ms: number) =>
      new Promise<void>((resolve) => {
        setTimeout(resolve, ms);
      });
    try {
      //请求
      const res = await login(values);
      // debugger;
      //配置到拦截器中
      if (res?.code === 200) {
        //存储token 拦截器用
        localStorage.setItem('token', res.data.data.token);
        // 必须转成字符串存储，因为 localStorage 只能存字符串
        localStorage.setItem(
          'userInfo',
          JSON.stringify(res.data.data.userInfo), //转字符串
        );
        //点击记住我 格外存入数据 否则不用记录
        //表单的name
        if (values.autoLogin) {
          localStorage.setItem(
            'remember_account',
            JSON.stringify({
              username: values.username,
              password: values.password, // 注意：实际项目中存明文密码有风险，Demo 演示没问题
              autoLogin: true,
            }),
          );
        } else {
          localStorage.removeItem('remember_account');
        }

        //塞入用户信息 有头像
        await setInitialState((s: any) => ({
          ...s,
          currentUser: res.data.data.userInfo, // 直接存入后端的 userInfo 对象
        }));
        await refresh(); //刷新权限
        await sleep(3000); //强制等待3s
        messageApi.success('登录成功！');
        // 真动态路由模式下，登录后必须完全刷新页面以触发 app.tsx 的 render 重新获取路由
        window.location.replace('/home');
      } else {
        messageApi.error(res?.msg || '登录失败');
      }
    } catch (error) {
      messageApi.error('网络请求异常');
    } finally {
      setLoading(false); //隐藏
    }
  };

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <LoginBackground />
      {contextHolder}
      {/* 5. 条件渲染：如果正在加载，显示全屏遮罩和 Loader */}{' '}
      {loading && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
            zIndex: 9999,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backdropFilter: 'blur(4px)',
          }}
        >
          <Loader />
        </div>
      )}
      {/* 登录表单 表单初始值(数据回填)initialValues*/}
      <LoginForm
        title="Umi Max RPA管理后台"
        subTitle="最快的前端开发框架"
        initialValues={savedAccount}
        onFinish={handleSubmit}
        submitter={{ submitButtonProps: { loading: loading } }} // 如果 loading 为 true，可以禁用表单交互
      >
        {/* 输入框 */}
        <ProFormText
          name="username"
          fieldProps={{
            size: 'large',
            prefix: <UserOutlined />,
          }}
          placeholder="用户名: admin"
          rules={[{ required: true, message: '请输入用户名!' }]}
        />
        <ProFormText.Password
          name="password"
          fieldProps={{
            size: 'large',
            prefix: <LockOutlined />,
          }}
          placeholder="密码: 123456"
          rules={[{ required: true, message: '请输入密码!' }]}
        />
        <div style={{ marginBottom: 24 }}>
          {/* 复选框 */}
          <ProFormCheckbox noStyle name="autoLogin">
            记住我
          </ProFormCheckbox>
          {/* 弹窗表单 trigger触发器 点击自动打开弹窗 关闭时候自动销毁*/}
          <ModalForm
            title="用户注册"
            trigger={<a style={{ float: 'right' }}>无账号？请注册</a>}
            onFinish={handleRegister}
            modalProps={{ destroyOnHidden: true }} //隐藏时销毁
          >
            <ProFormText
              name="username"
              label="用户名"
              rules={[{ required: true }]}
            />
            <ProFormText.Password
              name="password"
              label="密码"
              rules={[{ required: true, message: '请输入密码！' }]}
            />

            {/* 2. 确认密码：增加依赖和自定义校验 */}
            <ProFormText.Password
              name="confirmPassword"
              label="确认密码"
              dependencies={['password']} // 声明依赖于 'password' 字段
              rules={[
                { required: true, message: '请再次输入密码！' },
                ({ getFieldValue }) => ({
                  // 自定义校验逻辑
                  validator(_, value) {
                    // 如果没填，或者填的值和 password 一样，就通过
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    // 否则抛出错误文字
                    return Promise.reject(new Error('两次输入的密码不一致！'));
                  },
                }),
              ]}
            />
            <ProFormText
              name="nickname"
              label="昵称"
              rules={[{ required: true }]}
            />
            <ProFormText
              name="email"
              label="邮箱"
              rules={[{ type: 'email' }]}
            />
            <ProFormText name="phone" label="手机号" />
          </ModalForm>
        </div>
      </LoginForm>
    </div>
  );
};

export default Login;
