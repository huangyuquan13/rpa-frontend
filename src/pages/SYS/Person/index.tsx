import {
  getProfile,
  updatePassword,
  updateProfile,
} from '@/services/SYS/Person/profile';
import {
  Avatar,
  Button,
  Card,
  Col,
  Descriptions,
  Form,
  Input,
  message,
  Row,
  Tabs,
  Tag,
} from 'antd';

import { useModel } from '@umijs/max';
import { useEffect, useState } from 'react';
const PersonInfo = () => {
  const [form] = Form.useForm(); // 右边基本信息表单实例
  const [pwdForm] = Form.useForm(); // 右边修改密码表单实例
  const [user, setUser] = useState<any>({}); // 存储用户信息
  const [avatarUrl, setAvatarUrl] = useState<string>(''); // 单独管理头像 URL
  const { refresh } = useModel('@@initialState'); //获取修改的全局变量
  // 初始化加载数据
  const loadData = async () => {
    const res = await getProfile();
    const userData = res.data;
    // debugger;
    if (res.code === 200) {
      //统一默认头像
      const defaultUrl =
        userData.avatarUrl ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(
          userData.nickname || userData.username,
        )}&background=0D8ABC&color=fff`;
      //存用户的信息 读取到左侧
      setUser(userData);
      setAvatarUrl(defaultUrl);
      // 将数据同步到表单 右边的基本信息
      //对应后端响应数据=Form.Item name 就填充
      form.setFieldsValue(userData);
    }
  };
  //当第二个参数为空数组时候 只会在页面加载时执行一次 后面不执行
  useEffect(() => {
    loadData();
  }, []);
  // 提交基本信息修改
  const onUpdateInfo = async (values: any) => {
    const res = await updateProfile(values);
    if (res.code === 200) {
      message.success('基本信息更新成功');
      // 将存储到浏览器中的数据先拿出来 localStorage
      const oldInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
      //存值
      localStorage.setItem(
        'userInfo',
        JSON.stringify({ ...oldInfo, ...values }), //展开旧的数据 并覆盖或者添加新的表单的字段
      );
      await refresh(); //刷新全局
      loadData(); // 刷新界面
    }
  };
  // 提交密码修改
  const onUpdatePwd = async (values: any) => {
    const res = await updatePassword(values);
    if (res.code === 200) {
      message.success('密码修改成功');
      pwdForm.resetFields(); // 重置密码表单
    }
  };

  // 右侧 Tab 的内容配置
  const tabItems = [
    {
      key: 'base',
      label: '基本信息',
      children: (
        <Form form={form} layout="horizontal" onFinish={onUpdateInfo}>
          <Form.Item name="nickname" label="姓名" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="邮箱"
            rules={[{ required: true }, { type: 'email' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="phone" label="手机号" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          {/* name 属性对应的值打包成一个values对象 */}
          <Button type="primary" htmlType="submit">
            保存
          </Button>
          <Button style={{ marginLeft: 8 }} onClick={() => form.resetFields()}>
            重置
          </Button>
        </Form>
      ),
    },
    {
      key: 'password',
      label: '修改密码',
      children: (
        <Form form={pwdForm} layout="horizontal" onFinish={onUpdatePwd}>
          <Form.Item
            name="oldPassword"
            label="原密码"
            rules={[{ required: true }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            name="newPassword"
            label="新密码"
            rules={[
              //规则校验从上到下
              { required: true, message: '请输入新密码！' },
              ({ getFieldValue }) => ({
                // 自定义校验规则
                validator(_, value) {
                  //value 当前的值 getFieldValue('oldPassword')原密码框的值
                  // 如果新密码存在 且 等于原密码框里的值，报错
                  if (value && value === getFieldValue('oldPassword')) {
                    return Promise.reject(
                      new Error('新密码不能与原密码相同！'),
                    );
                  }
                  return Promise.resolve();
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            label="确认密码"
            dependencies={['newPassword']} // 依赖新密码字段
            rules={[
              //空值交给第一个rule 有值交给validator
              { required: true, message: '请再次输入密码！' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  // 如果没有输入内容 或者 新密码和确认密码相同放行
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('两次输入的密码不一致！'));
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Button type="primary" htmlType="submit">
            修改密码
          </Button>
          <Button
            style={{ marginLeft: 8 }}
            onClick={() => pwdForm.resetFields()}
          >
            重置
          </Button>
        </Form>
      ),
    },
  ];
  return (
    <>
      <div
        style={{
          padding: '24px',
          backgroundColor: '#f5f5f5',
          minHeight: '100vh',
        }}
      >
        <Row gutter={24}>
          {/* 列（Col）能水平排列 24px间隔 */}
          {/* 左侧：基本信息展示卡片  24 栅格系统*/}
          <Col span={8}>
            <Card title="基本信息" bordered={false}>
              <div style={{ textAlign: 'center' }}>
                <Avatar size={100} src={avatarUrl} />
                <div style={{ marginTop: 16 }}>
                  <Button
                    type="link"
                    onClick={() =>
                      message.info('头像上传功能开发中，敬请期待...')
                    }
                  >
                    更换头像
                  </Button>
                </div>
              </div>
              {/* 只读  加上边框  最紧凑 */}
              <Descriptions column={1} bordered size="small">
                <Descriptions.Item label="用户名">
                  {user.username}
                </Descriptions.Item>
                <Descriptions.Item label="姓名">
                  {user.nickname}
                </Descriptions.Item>
                <Descriptions.Item label="邮箱">{user.email}</Descriptions.Item>
                <Descriptions.Item label="手机号">
                  {user.phone}
                </Descriptions.Item>
                <Descriptions.Item label="角色">
                  <Tag color="error">{user.roleName}</Tag>
                </Descriptions.Item>
                <Descriptions.Item label="创建时间">
                  {user.createTime}
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </Col>
          {/* 右侧：修改信息操作卡片 */}
          <Col span={16}>
            <Card title="修改信息" bordered={false}>
              <Tabs defaultActiveKey="base" items={tabItems} />
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
};
export default PersonInfo;
