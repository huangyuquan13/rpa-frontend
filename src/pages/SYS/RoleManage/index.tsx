import { getResourceList } from '@/services/SYS/Resource/Resource'; // 引入获取完整资源树的接口
import {
  assignRolePermissions,
  createRole,
  deleteRole,
  getRoleList,
  updateRole,
} from '@/services/SYS/Role/role';
import { PlusOutlined } from '@ant-design/icons';
import {
  ActionType,
  ModalForm,
  ProColumns,
  ProFormRadio,
  ProFormText,
  ProFormTextArea,
  ProFormTreeSelect,
  ProTable,
} from '@ant-design/pro-components';
import { useAccess, useModel } from '@umijs/max';
import { Button, message, Popconfirm, Space, Tag } from 'antd';
import { useRef } from 'react';
const RoleManage = () => {
  // ActionType 引用类型 手动控制表格
  const tableRef = useRef<ActionType>();
  //全局状态的定义 刷新全局的初始状态
  const { refresh, initialState } = useModel('@@initialState');
  const { canButton } = useAccess();
  //缓存树结构
  const treeDataRef = useRef<any[]>([]);

  const columns: ProColumns<any>[] = [
    { title: '序号', dataIndex: 'index', valueType: 'indexBorder', width: 48 },
    { title: '角色编码', dataIndex: 'roleCode', copyable: true },
    { title: '角色名称', dataIndex: 'roleName', copyable: true },
    { title: '描述', dataIndex: 'description', hideInSearch: true },
    {
      title: '权限',
      dataIndex: 'permissions',
      hideInSearch: true,
      render: (_, record) => {
        //判断有无字段
        if (!record.permissions || record.permissions.length === 0)
          return '无权限';
        //Typography排班 ellipsis省略配置 允许展开 默认占两行
        //水平0 纵向4
        return (
          <Space size={[0, 4]} wrap>
            {record.permissions.map((p: any) => (
              <Tag color="blue" key={p.id}>
                {p.resourceName}
              </Tag>
            ))}
          </Space>
        );
      },
    },
    { title: '用户数', dataIndex: 'userCount', hideInSearch: true },
    {
      title: '状态',
      dataIndex: 'status',
      valueType: 'select',
      valueEnum: {
        1: { text: '启用', status: 'Success' },
        0: { text: '禁用', status: 'Default' },
      },
      hideInSearch: true,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      valueType: 'dateTime',
      hideInSearch: true,
    },
    {
      title: '操作',
      valueType: 'option',
      render: (_, record) => (
        <Space size="middle">
          {/* 编辑基本信息 */}
          <ModalForm
            title="编辑角色"
           trigger={canButton('BIANJIQUANXIAN') ? <a>编辑角色</a> : undefined}
            initialValues={record} //全部拿出
            onFinish={async (values) => {
              const res = await updateRole(record.id, values);
              if (res.code === 200) {
                message.success('修改成功');
                tableRef.current?.reload();
                return true;
              }
            }}
          >
            <ProFormText
              name="roleCode"
              label="角色编码"
              rules={[{ required: true }]}
            />
            <ProFormText
              name="roleName"
              label="角色名称"
              rules={[{ required: true }]}
            />
            <ProFormText name="description" label="角色描述" />
            <ProFormRadio.Group
              name="status"
              label="状态"
              options={[
                { label: '启用', value: 1 },
                { label: '禁用', value: 0 },
              ]}
            />
          </ModalForm>

          {/* 分配权限：使用 TreeSelect 简化操作 */}
          <ModalForm
            title={`分配权限 - ${record.roleName}`}
            trigger={canButton('ROLE') ? <a>分配权限</a> : undefined}
            modalProps={{ destroyOnClose: true }} // 关闭弹窗时销毁表单，避免取消后再次打开保留脏数据
            // 核心：回显当前角色已有的权限 ID
            request={async () => {
              const res = await getResourceList({ tree: true });
              const treeData = res.data || [];
              treeDataRef.current = treeData; //存到 ref，跨函数共享！

              // 获取当前权限ID 将对象数组转换为严格模式的值对象 [{value: 2121, label: '新增角色'}]
              const resourceIds = record.permissions
                ?.filter((p: any) => p && p.id !== undefined && p.id !== null)
                ?.map((p: any) => ({
                  value: p.id,
                  label: p.resourceName,
                })) || [];
              //数据回显
              return {
                resourceIds,
              };
            }}
            onFinish={async (values: any) => {
              // 严格模式下 value 是对象数组，提取纯 ID [{value: 2121, label: '新增角色'}]
              const selectedIds = (values.resourceIds || []).map((item: any) =>
                typeof item === 'object' ? item.value : item,
              );
              // 提交时直接使用用户选中的节点
              const res = await assignRolePermissions(record.id, {
                resourceIds: selectedIds,
              });
              if (res.code === 200) {
                message.success('权限分配成功');
                tableRef.current?.reload();
                //重新请求当前权限 重新执行getInitialState()
                await refresh();
                // 2. 核心：强制刷新页面，让 app.tsx 重新走一遍 patchClientRoutes 注入新路由
                window.location.reload(); 
                return true;
              }
            }}
          >
            {/* 提交时候是resourceIds包裹的数组 */}
            <ProFormTreeSelect
              name="resourceIds"
              label="选择菜单"
              request={async () => {
                // 构建带按钮的完整树，视觉区分菜单和按钮
                const buildTree = (list: any[]): any[] => {
                  return list.map((item) => ({
                    ...item,
                    // 视觉标记：按钮缩进+图标，菜单用文件夹图标
                    resourceName:
                      item.resourceType === 2
                        ? `    🔘 ${item.resourceName}` // 按钮：缩进4空格+单选框图标
                        : `📁 ${item.resourceName}`, // 菜单：文件夹图标
                    children: item.children?.length
                      ? buildTree(item.children)
                      : [],
                  }));
                };
                //将后端的数组再次整合 加入图标区分
                const treeData = buildTree(treeDataRef.current || []);
                return [
                  { id: 0, resourceName: '🏠 根节点', children: treeData },
                ];
              }}
              // 数据结构映射
              fieldProps={{
                multiple: true, // 开启多选
                treeCheckable: true, // 开启复选框 勾选父 子自动勾选
                treeCheckStrictly: true, //子勾选不勾选父亲
                showCheckedStrategy: 'SHOW_ALL', //输入框只显示父节点
                fieldNames: {
                  label: 'resourceName',
                  value: 'id',
                  children: 'children', //数据结构映射 我的是id 和 resourceName
                },
                dropdownStyle: { maxHeight: 400, overflow: 'auto' }, //滚动条
              }}
            />
          </ModalForm>
          {canButton('DELETE_ROLE') ? (
            <Popconfirm
              title="确定删除吗？"
              onConfirm={async () => {
                const res = await deleteRole(record.id);
                if (res.code === 200) {
                  message.success('删除成功');
                  tableRef.current?.reload();
                }
              }}
            >
              <a style={{ color: '#ff4d4f' }}>删除</a>
            </Popconfirm>
          ) : null}
        </Space>
      ),
    },
  ];

  return (
    <ProTable
      headerTitle="角色管理"
      actionRef={tableRef} //绑定引用数据
      rowKey="id"
      columns={columns}
      //默认自动请求一次
      request={async (params) => {
        //告诉后端当前是多少页
        const res = await getRoleList({ ...params, pageNum: params.current });
        //表格数据回显 以及 分页功能
        return { data: res.data.records, total: res.data.total, success: true };
      }}
      toolBarRender={() =>
        [
          // 1. 直接使用 canButton 判断是否渲染整个 ModalForm
          canButton('ROLE_BUTTON') ? (
            <ModalForm
              key="add_role" // 在数组中渲染建议加上 key
              title="新增角色"
              trigger={
                // 2. 这里的 trigger 直接就是 Button，没有任何包裹，点击 100% 正常
                <Button type="primary" icon={<PlusOutlined />}>
                  新增角色
                </Button>
              }
              onFinish={async (values: any) => {
                const res = await createRole(values);
                if (res.code === 200) {
                  message.success('创建成功');
                  tableRef.current?.reload();
                  return true;
                }
              }}
            >
              <ProFormText
                name="roleCode"
                label="角色编码"
                rules={[{ required: true }]}
              />
              <ProFormText
                name="roleName"
                label="角色名称"
                rules={[{ required: true }]}
              />
              <ProFormTextArea
                name="description"
                label="角色描述"
                valueType="textarea"
                fieldProps={{
                  rows: 4,
                  autoSize: { minRows: 3, maxRows: 6 },
                  maxLength: 200,
                  showCount: true,
                }}
              />
            </ModalForm>
          ) : null, // 3. 没权限时返回 null
        ].filter(Boolean) as React.ReactNode[]
      } // 4. 过滤掉 null 确保类型正确
    />
  );
};

export default RoleManage;
