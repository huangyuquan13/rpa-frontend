import { getRoleList } from '@/services/SYS/Role/role';
import {
  createUser,
  deleteUser,
  getUserDetail,
  getUserList,
  resetUserPassword,
  updateUser,
  updateUserStatus,
} from '@/services/SYS/User/user';
import { PlusOutlined } from '@ant-design/icons';
import {
  ActionType,
  ModalForm,
  ProColumns,
  ProFormRadio,
  ProFormSelect,
  ProFormText,
  ProTable,
} from '@ant-design/pro-components';
import { useAccess } from '@umijs/max';
import { Button, message, Popconfirm, Space } from 'antd';
import { useRef } from 'react';
/**
 * ProTable
 * 搜索表单、表格展示、分页器、工具栏全部整合
 * 自动请求 调用函数 request不用写useEffect加载
 */
/**
 * ActionType 引用类型 手动控制表格
 * reload(): 重新加载数据（比如新增用户后刷新）；reset(): 重置搜索框。
 */
/**
 * ProColumns
 * 定义列
 */

/**
 * 1.分页功能
 *                  当前页码  每页条数   数据总数
 * ProTable :      current  pageSize
 * 后端:            pageNum pageSize  total
 * pagination分页器:current pageSize  total
 */
const UserList = () => {
  // tableRef 用于手动触发刷新表格（比如新增成功后）
  //tableRef.current?.reload() 刷新表格
  const tableRef = useRef<ActionType>();
  const { canButton } = useAccess();
  //  1. 定义表格列和搜索表单
  const columns: ProColumns<any>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      valueType: 'indexBorder', // 自动生成带边框的序号列
      width: 48,
    },
    {
      title: '用户名',
      dataIndex: 'username',
      fieldProps: {
        allowClear: true,
        trim: true,
        placeholder: '请输入用户名',
      },
      copyable: true,
    },
    {
      title: '姓名',
      dataIndex: 'nickname',
      fieldProps: {
        allowClear: true, // 开启一键清除功能
        trim: true,
        placeholder: '请输入用户名',
      },
      copyable: true,
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      hideInSearch: true, //不出现在搜索框里
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      hideInSearch: true,
    },
    {
      title: '角色',
      dataIndex: 'roleName',
      valueType: 'select', // 选择框类型
      request: async () => {
        const res = await getRoleList({ pageNum: 1, pageSize: 1000 });

        return res.data.records.map((item: any) => ({
          label: item.roleName,
          value: item.id,
        }));
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      valueType: 'select',
      valueEnum: {
        1: { text: '启用', status: 'Success' }, // Success 是绿色的 Tag
        0: { text: '禁用', status: 'Default' }, // Default 是灰色的 Tag
      },
      hideInSearch: true,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      valueType: 'dateTime', // 自动格式化时间
      hideInSearch: true,
    },
    {
      title: '操作',
      valueType: 'option', // 这是专门放操作按钮的列
      render: (_, record) => [
        // record 是当前行的数据
        // 使用 Space 组件让按钮并排显示 (不写也行)
        <Space size="middle">
          {/* 编辑 */}
          <ModalForm
            key="edit_modal"
            title="修改用户信息"
            trigger={<a>编辑</a>} //触发器 点击打开弹窗
            params={{ id: record.id }} //监听id变化
            request={async () => {
              //id变化执行 打开弹窗默认执行一次
              const res = await getUserDetail(record.id);
              return res.data; // 填充name对应的字段
            }}
            onFinish={async (values) => {
              const success = await updateUser(record.id, values);
              if (success) {
                message.success('保存成功');
                tableRef.current?.reload(); // 成功后刷新表格 记忆功能不重置条件
                return true; // 返回 true 自动关闭弹窗
              }
              return false;
            }}
            modalProps={{ destroyOnClose: true }} //关闭时候销毁
          >
            <ProFormText name="username" label="用户名" disabled />
            <ProFormText
              name="nickname"
              label="姓名"
              rules={[{ required: true, message: '请输入姓名' }]}
            />
            <ProFormText
              name="email"
              label="邮箱"
              rules={[
                {
                  required: true,
                  type: 'email',
                  message: '请输入正确的邮箱格式',
                },
              ]}
            />
            <ProFormText
              name="phone"
              label="手机号"
              rules={[
                {
                  required: true,
                  pattern: /^1\d{10}$/,
                  message: '请输入正确的手机号',
                },
              ]}
            />
            <ProFormSelect
              name="roleName"
              label="角色"
              request={async () => {
                const res = await getRoleList({ pageNum: 1, pageSize: 1000 });

                return res.data.records.map((item: any) => ({
                  label: item.roleName,
                  value: item.id,
                }));
              }}
              rules={[{ required: true }]}
            />
            {/* 一组互斥选项 */}
            <ProFormRadio.Group
              name="status"
              label="状态"
              options={[
                { label: '启用', value: 1 },
                { label: '禁用', value: 0 },
              ]}
            />
          </ModalForm>
          {/* 重置密码 */}
          <Popconfirm
            title="重置密码"
            description="确定将该用户密码重置为 123456 吗？"
            onConfirm={async () => {
              const res = await resetUserPassword(record.id); // 调用 PUT 接口
              if (res.code === 200) message.success('重置成功'); // 提示成功
            }}
          >
            <a key="reset" style={{ color: '#faad14' }}>
              重置密码
            </a>
          </Popconfirm>
          {/* 修改启用 */}
          <Popconfirm
            title={record.status === 1 ? '禁用用户' : '启用用户'} // 根据当前状态动态显示文字
            onConfirm={async () => {
              const res = await updateUserStatus(record.id);
              if (res.code === 200) {
                message.success('操作成功');
                tableRef.current?.reload();
              }
            }}
          >
            {/* 动态显示文字颜色 */}
            <a
              key="status"
              style={{ color: record.status === 1 ? '#ff4d4f' : '#52c41a' }}
            >
              {record.status === 1 ? '禁用' : '启用'}
            </a>
          </Popconfirm>
          {/*  删除用户 */}
          <Popconfirm
            title="彻底删除"
            description="删除后不可恢复，确定吗？"
            okButtonProps={{ danger: true }} // 确认按钮设为红色警示
            onConfirm={async () => {
              const res = await deleteUser(record.id);
              if (res.code === 200) {
                message.success('删除成功');
                tableRef.current?.reload(); //刷新表格
              }
            }}
          >
            <a key="delete" style={{ color: '#ff4d4f' }}>
              删除
            </a>
          </Popconfirm>
        </Space>,
      ],
    },
  ];

  return (
    <>
      {/* request自动实现查询功能 不仅仅是分页 */}
      <ProTable
        headerTitle="用户管理"
        actionRef={tableRef} // 绑定 ref，以后可以通过 tableRef.current.reload() 刷新
        rowKey="id" // 告诉表格每行数据的唯一标识是 id
        columns={columns}
        //  绑定网络请求
        request={async (params) => {
          // params 里包含了 ProTable 自动生成的分页参数（current, pageSize）和搜索参数
          const res = await getUserList({
            ...params,
            pageNum: params.current, // 把 ProTable 的 current 转换为后端的 pageNum
          });

          //后端数据渲染ProTable
          return {
            data: res.data.records, // 表格的数据数组
            success: res.code === 200,
            total: res.data.total, // 总数
          };
        }}
        //  右上角上角的工具栏（新增按钮）
        toolBarRender={() =>
          [
            // 1. 直接判断权限，有权限才渲染整个 ModalForm
            canButton('USER_ADD') ? (
              <ModalForm
                key="add_user_modal"
                title="新增用户"
                // 2. 让 trigger 直接指向原始的 Button，确保事件注入成功
                trigger={
                  <Button icon={<PlusOutlined />} type="primary">
                    新增用户
                  </Button>
                }
                initialValues={{
                  status: 1,
                  // 注意：roleName 这里如果 request 返回的是 id，
                  // 初始值可能需要对应 id 的值，或者保持默认文本
                  roleName: '普通用户',
                }}
                modalProps={{ destroyOnClose: true }}
                onFinish={async (values) => {
                  const res = await createUser(values);
                  if (res.code === 200) {
                    message.success('创建成功');
                    tableRef.current?.reload();
                    return true;
                  }
                  return false;
                }}
              >
                <ProFormText
                  name="username"
                  label="用户名"
                  placeholder="请输入登录账号"
                  rules={[{ required: true, message: '用户名必填' }]}
                />

                <ProFormText
                  name="nickname"
                  label="姓名"
                  placeholder="请输入用户昵称"
                  rules={[{ required: true, message: '姓名必填' }]}
                />

                <ProFormText.Password
                  name="password"
                  label="初始密码"
                  placeholder="请输入初始登录密码"
                  rules={[{ required: true, min: 6, message: '密码至少6位' }]}
                />

                <ProFormText
                  name="email"
                  label="邮箱"
                  rules={[{ type: 'email', message: '邮箱格式不正确' }]}
                />

                <ProFormText
                  name="phone"
                  label="手机号"
                  rules={[
                    { pattern: /^1\d{10}$/, message: '手机号格式不正确' },
                  ]}
                />

                <ProFormSelect
                  name="roleName"
                  label="角色"
                  request={async () => {
                    const res = await getRoleList({
                      pageNum: 1,
                      pageSize: 1000,
                    });
                    return res.data.records.map((item: any) => ({
                      label: item.roleName,
                      value: item.id,
                    }));
                  }}
                  rules={[{ required: true }]}
                />

                <ProFormRadio.Group
                  name="status"
                  label="状态"
                  options={[
                    { label: '启用', value: 1 },
                    { label: '禁用', value: 0 },
                  ]}
                />
              </ModalForm>
            ) : null, // 3. 没权限返回 null
          ].filter(Boolean) as React.ReactNode[]
        } // 4. 过滤空值并处理 TS 类型
        //  分页器配置
        pagination={{
          showTotal: (total) => `共 ${total} 条`, // 显示总条数
          pageSize: 10,
          showSizeChanger: true, // 允许改变每页条数
          showQuickJumper: true, //允许跳转
        }}
      />
    </>
  );
};

export default UserList;
