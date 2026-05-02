// src/pages/SYS/ResourceManage/index.tsx
import {
  createResource,
  deleteResource,
  getResourceList,
  updateResource,
} from '@/services/SYS/Resource/Resource'; // 引入你写好的请求接口
import { PlusOutlined } from '@ant-design/icons';
import {
  ActionType,
  ModalForm,
  ProColumns,
  ProFormDependency,
  ProFormDigit,
  ProFormRadio,
  ProFormSelect,
  ProFormText,
  ProFormTreeSelect,
  ProTable,
} from '@ant-design/pro-components';
import { useAccess, useModel } from '@umijs/max';
import { Button, message, Popconfirm, Space } from 'antd';
import { useRef } from 'react';
const ResourceManage = () => {
  // 定义表格的引用，用于手动刷新数据
  const tableRef = useRef<ActionType>();
  const { refresh } = useModel('@@initialState'); //获取修改的全局变量
  const { canButton } = useAccess(); // 按钮权限控制

  // 1. 定义表格的列配置
  const columns: ProColumns<any>[] = [
    {
      title: '资源名称', // 表头名称
      dataIndex: 'resourceName', // 对应后端的字段名
      fieldProps: {
        allowClear: true,
        trim: true,
        placeholder: '仅能查根节点第一级内容',
      },
    },
    {
      title: '资源编码',
      dataIndex: 'resourceCode',
      hideInSearch: true, // 不在顶部的搜索表单中显示
    },
    {
      title: '资源类型',
      dataIndex: 'resourceType',
      valueType: 'select', // 渲染为选择框，自带彩色 Tag 效果
      valueEnum: {
        1: { text: '菜单', status: 'Processing' }, // Processing 是蓝色 Tag
        2: { text: '按钮', status: 'Success' }, // Success 是绿色 Tag
      },
      fieldProps: {
        placeholder: '仅能查根节点第一级内容',
      },
    },
    {
      title: '路径/URL',
      dataIndex: 'path',
      hideInSearch: true, // 隐藏
    },
    {
      title: '图标',
      dataIndex: 'icon',
      hideInSearch: true,
    },
    {
      title: '排序',
      dataIndex: 'sortOrder',
      hideInSearch: true,
    },
    {
      title: '状态',
      dataIndex: 'status',
      valueType: 'select',
      valueEnum: {
        1: { text: '启用', status: 'Success' }, // 启用为绿色
        0: { text: '禁用', status: 'Error' }, // 禁用为红色，匹配你的截图
      },
      hideInSearch: true,
    },
    {
      title: '操作',
      valueType: 'option', // 专门用于操作按钮的列
      render: (_, record) => (
        <Space size="middle">
          {/* 编辑资源弹窗 */}
          {canButton('EDIT_RESOURCE') ? (
            <ModalForm
              key="edit"
              title="编辑资源"
              trigger={<a>编辑</a>}
              initialValues={record} // 回显当前行数据
              onFinish={async (values) => {
                const res = await updateResource(record.id, values);
                if (res.code === 200) {
                  message.success('更新成功');
                  await refresh();
                  tableRef.current?.reload();
                  return true;
                }
                return false;
              }}
              modalProps={{ destroyOnClose: true }}
            >
              {/* 表单树  */}
              <ProFormTreeSelect
                name="parentId" //提交给后端的爸爸id
                label="父级资源"
                request={async () => {
                  const res = await getResourceList({ tree: true }); //获取树结构
                  //递归函数抽象遍历 禁用自己和所有的儿子
                  //两个return只会走一个
                  //第一个 return 会等儿子递归全部跑完，才返回结果
                  const disableSelfAndChildren = (
                    nodes: any[], //当前行列表
                    isParentDisabled = false, //父级是否禁用
                  ): any[] => {
                    return nodes.map((node) => {
                      // 父亲已被禁用 或者 我就是当前行的id 存起来 禁用自己
                      const shouldDisable =
                        isParentDisabled || node.id === record.id;

                      if (shouldDisable) {
                        return {
                          ...node, // 保留原来的属性
                          disabled: true, // 禁用自己
                          //添加属性 如果自己有儿子再次调用 没有就传递空数组
                          children: disableSelfAndChildren(
                            node.children || [],
                            true,
                          ),
                        };
                      }

                      //不是自己且没有并禁用
                      //有儿子就递归调用 没有就空数组
                      return {
                        ...node,
                        children: node.children
                          ? disableSelfAndChildren(node.children, false)
                          : [],
                      };
                    });
                  };

                  const treeData = disableSelfAndChildren(res.data);
                  return [
                    { id: 0, resourceName: '根节点', children: treeData },
                  ]; //默认返回根节点以及资源
                }}
                fieldProps={{
                  fieldNames: { label: 'resourceName', value: 'id' }, //显示后端传回来的 resourceName  传递选中的id给后端
                }}
              />

              {/* 2.  资源编码：编辑时禁用 */}
              <ProFormText
                name="resourceCode"
                label="资源编码"
                disabled // 禁止修改编码，保证权限暗号稳定
                rules={[{ required: true }]}
              />

              <ProFormText
                name="resourceName"
                label="资源名称"
                rules={[{ required: true }]}
              />

              {/* 3. 补全资源类型 */}
              <ProFormSelect
                name="resourceType"
                label="资源类型"
                options={[
                  { label: '菜单', value: 1 },
                  { label: '按钮', value: 2 },
                ]}
              />
              {/*动态渲染绑定的表单项目 */}
              <ProFormDependency name={['resourceType']}>
                {/* 标记儿子属性 动态响应式监听*/}
                {({ resourceType }) => {
                  const isButton = resourceType === 2;
                  return (
                    <ProFormText
                      name="path"
                      label="路径/URL"
                      placeholder={
                        isButton
                          ? '按钮类型无需填写路径'
                          : '菜单必填，如 /sys/user'
                      }
                      disabled={isButton} // 如果是按钮，直接禁用输入框
                      // 如果是按钮，自动将值设为 null 或空，防止误填残留数据
                      fieldProps={{
                        value: isButton ? undefined : undefined,
                      }}
                    />
                  );
                }}
              </ProFormDependency>
              <ProFormText name="icon" label="图标" />

              {/* 4. 补全排序 */}
              <ProFormDigit name="sortOrder" label="排序" min={0} />

              <ProFormRadio.Group
                name="status"
                label="状态"
                options={[
                  { label: '启用', value: 1 },
                  { label: '禁用', value: 0 },
                ]}
              />
            </ModalForm>
          ) : null}

          {canButton('DELETE_RESOURCE') ? (
            <Popconfirm
              title="确定要删除这个资源吗？"
              description="如果包含子节点，请先删除子节点。"
              okButtonProps={{ danger: true }} // 确定按钮变红
              onConfirm={async () => {
                const res = await deleteResource(record.id); // 调用删除接口
                // debugger;
                if (res.code === 200) {
                  if (res.msg?.includes('警告')) {
                    // 如果有警告，用警告色（黄色）弹出后端给的具体消息
                    message.warning(res.msg);
                  } else {
                    // 正常的删除成功提示
                    message.success('删除成功');
                  }
                  await refresh();
                  tableRef.current?.reload(); // 刷新表格
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
      headerTitle="资源管理" // 左上角表格标题
      actionRef={tableRef} // 绑定操作引用
      rowKey="id" // 树形表格必须指定唯一主键，否则无法展开
      columns={columns} // 传入列定义
      // 关闭分页：因为树形结构分页会把父子节点打乱，通常资源菜单是一次性获取全量树
      pagination={false}
      // 自动发请求获取数据
      request={async (params) => {
        // 核心：强制传 tree: true 给后端，告诉后端“我要带 children 的树形数据”
        const res = await getResourceList({ ...params, tree: true });
        // debugger;
        // const treeWithButtons = attachButtonsToTree(
        //   res.data,
        //   initialState?.buttonList || [], // 👈 把按钮挂进去
        // );
        return {
          data: res.data, // 只要这里返回的数据里有 children，ProTable 就会自动变成折叠树
          success: res.code === 200,
        };
      }}
      // 左上角的工具栏，放新增按钮
      toolBarRender={() => [
        canButton('SOURCE') ? (
          <ModalForm
            key="add"
            title="新增资源"
            trigger={
              <Button type="primary" icon={<PlusOutlined />}>
                新增资源
              </Button>
            }
            initialValues={{ status: 1, resourceType: 1, parentId: 0 }} // 默认启用，默认菜单，默认根节点
            onFinish={async (values: any) => {
              const res = await createResource(values); // 调用新增接口
              if (res.code === 200) {
                message.success('新增成功');
                await refresh(); //刷新全局
                tableRef.current?.reload(); // 刷新表格显示新数据
                return true; // 关闭弹窗
              }
              return false;
            }}
            modalProps={{ destroyOnClose: true }}
          >
            {/* 表单树*/}
            <ProFormTreeSelect
              name="parentId"
              label="父级资源"
              placeholder="请选择父级资源"
              request={async () => {
                const res = await getResourceList({ tree: true });
                // 这里的 value 是 id，label 是名称
                return [{ id: 0, resourceName: '根节点', children: res.data }];
              }}
              fieldProps={{
                fieldNames: { label: 'resourceName', value: 'id' },
              }}
            />

            <ProFormText
              name="resourceCode"
              label="资源编码"
              rules={[{ required: true }]}
            />
            <ProFormText
              name="resourceName"
              label="资源名称"
              rules={[{ required: true }]}
            />

            <ProFormSelect
              name="resourceType"
              label="资源类型"
              options={[
                { label: '菜单', value: 1 },
                { label: '按钮', value: 2 },
              ]}
            />
            <ProFormDependency name={['resourceType']}>
              {/* 标记儿子属性 */}
              {({ resourceType }) => {
                const isButton = resourceType === 2;
                return (
                  <ProFormText
                    name="path"
                    label="路径/URL"
                    placeholder={
                      isButton
                        ? '按钮类型无需填写路径'
                        : '菜单必填，如 /sys/user'
                    }
                    disabled={isButton} // 如果是按钮，直接禁用输入框
                    // 如果是按钮，自动将值设为 null 或空，防止误填残留数据
                    fieldProps={{
                      value: isButton ? undefined : undefined,
                    }}
                  />
                );
              }}
            </ProFormDependency>

            <ProFormText name="icon" label="图标" placeholder="随便写" />

            {/* 2. 排序：用数字组件 */}
            <ProFormDigit
              name="sortOrder"
              label="排序"
              min={0}
              initialValue={0}
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
        ) : null,
      ]}
    />
  );
};

export default ResourceManage;
