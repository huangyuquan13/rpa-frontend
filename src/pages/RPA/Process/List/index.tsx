import { PlusOutlined } from '@ant-design/icons';
import {
  ActionType,
  ModalForm,
  ProColumns,
  ProDescriptions,
  ProFormRadio,
  ProFormText,
  ProFormTextArea,
  ProTable,
} from '@ant-design/pro-components';
import { Button, Popconfirm, Space, message } from 'antd';
import { useRef, useState } from 'react';
// 导入接口
import {
  createProcess,
  deleteProcess,
  getProcessDetail,
  getProcessList,
  updateProcess,
} from '@/services/RPA/Processes/Processe';
import ProcessDesignModal from '../ProcessDesignModal';

const ProcessManage = () => {
  const actionRef = useRef<ActionType>(); //跨渲染保持不变
  const [designVisible, setDesignVisible] = useState(false);
  //记录当前行的数据currentRecord?.processCode
  const [currentRecord, setCurrentRecord] = useState<any>(null);

  const columns: ProColumns<any>[] = [
    { title: '序号', dataIndex: 'index', valueType: 'indexBorder', width: 60 },
    {
      title: '流程名称',
      dataIndex: 'processName',
      fieldProps: {
        allowClear: true,
        trim: true,
        placeholder: '请输入流程名称',
      },
      copyable: true,
    },
    {
      title: '流程编码',
      dataIndex: 'processCode',
      fieldProps: {
        allowClear: true,
        trim: true,
        placeholder: '请输入流程编码',
      },
      copyable: true,
    },
    {
      title: '状态',
      dataIndex: 'status',
      valueType: 'select',
      valueEnum: {
        1: { text: '启用', status: 'Success' },
        0: { text: '禁用', status: 'Default' },
      },
    },
    { title: '描述', dataIndex: 'description', hideInSearch: true },
    { title: '步骤数', dataIndex: 'stepCount', hideInSearch: true },
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
          {/* 查看详情：只读模式的弹窗 */}
          <ModalForm
            title="查看流程"
            trigger={<a>查看</a>}
            submitter={false} // 隐藏提交按钮，仅用于展示
          >
            <ProDescriptions
              column={2} // 一行显示两个字段，不再是一行到底
              layout="horizontal" // 字段名和内容水平排列
              bordered
              request={async () => {
                const res = await getProcessDetail(record.processCode);
                return {
                  data: res.data,
                  success: res.code === 200,
                };
              }}
              columns={[
                { title: '流程编码', dataIndex: 'processCode', copyable: true },
                { title: '流程名称', dataIndex: 'processName' },
                {
                  title: '流程描述',
                  dataIndex: 'description',
                  copyable: true,
                },
                {
                  title: '步骤数',
                  dataIndex: 'stepCount',
                },
                {
                  title: '流程状态',
                  dataIndex: 'status',
                  // valueEnum对应接口状态映射带颜色的标签。
                  valueEnum: {
                    1: { text: '启用', status: 'Success' },
                    0: { text: '禁用', status: 'Default' },
                  },
                },
                {
                  title: '创建时间',
                  dataIndex: 'createTime',
                  valueType: 'dateTime',
                },

                {
                  title: '更新时间',
                  dataIndex: 'updateTime',
                  valueType: 'dateTime',
                },
              ]}
            />
          </ModalForm>
          {/* 编辑流程：回显数据并更新 */}
          <ModalForm
            title="编辑流程"
            trigger={<a>编辑</a>}
            initialValues={record} // 回显当前行数据
            onFinish={async (values) => {
              const res = await updateProcess({
                ...values,
                processCode: record.processCode,
              });
              if (res.code === 200) {
                message.success('修改成功');
                actionRef.current?.reload(); // 刷新表格
                return true;
              }
            }}
          >
            {/* 编辑时通常流程编码作为唯一标识，不可修改 */}
            <ProFormText name="processCode" label="流程编码" disabled />
            <ProFormText
              name="processName"
              label="流程名称"
              rules={[{ required: true }]}
            />
            <ProFormTextArea name="description" label="描述" />
            <ProFormRadio.Group
              name="status"
              label="状态"
              options={[
                { label: '启用', value: 1 },
                { label: '禁用', value: 0 },
              ]}
            />
          </ModalForm>
          <a
            key="design"
            onClick={() => {
              setCurrentRecord(record); // 存下当前点击的是哪个流程
              setDesignVisible(true); // 打开弹窗
            }}
          >
            设计
          </a>

          <Popconfirm
            title="确定要删除该流程吗？"
            onConfirm={async () => {
              const res = await deleteProcess(record.processCode);
              if (res.code === 200) {
                message.success('删除成功');
                actionRef.current?.reload();
              }
            }}
          >
            <a style={{ color: '#ff4d4f' }}>删除</a>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    //  request自动实现查询功能 不仅仅是分页
    <>
      <ProTable
        headerTitle="流程列表"
        actionRef={actionRef} //绑定 ref
        rowKey="processCode"
        columns={columns}
        request={async (params) => {
          const res = await getProcessList({
            ...params,
            pageNum: params.current, // 把 ProTable 的 current 转换为后端的 pageNum
          });
          return {
            data: res.data?.records || [], //表格数据
            total: res.data?.total || 0, // 总数
            success: res.code === 200,
          };
        }}
        toolBarRender={() => [
          // 新增流程
          <ModalForm
            key="add"
            title="新增流程"
            trigger={
              <Button type="primary" icon={<PlusOutlined />}>
                新增流程
              </Button>
            }
            initialValues={{ status: 1 }} // 默认状态为启用
            onFinish={async (values: any) => {
              const res = await createProcess(values);
              if (res.code === 200) {
                message.success('新增成功');
                actionRef.current?.reload(); //刷新表格
                return true;
              }
            }}
          >
            <ProFormText
              name="processCode"
              label="流程编码"
              placeholder="如 PROCESS_001"
              rules={[{ required: true }]}
            />
            <ProFormText
              name="processName"
              label="流程名称"
              placeholder="如 税务发票采集流程"
              rules={[{ required: true }]}
            />
            <ProFormTextArea name="description" label="描述" />
            <ProFormRadio.Group
              name="status"
              label="状态"
              options={[
                { label: '启用', value: 1 },
                { label: '禁用', value: 0 },
              ]}
            />
          </ModalForm>,
        ]}
        pagination={{
          showTotal: (total) => `共 ${total} 条`, // 显示总条数
          pageSize: 10,
          showSizeChanger: true, // 允许改变每页条数
          showQuickJumper: true, //允许跳转
        }}
      />
      <ProcessDesignModal
        visible={designVisible}
        processCode={currentRecord?.processCode} // 传递 Code 给子组件查询步骤
        //子组件来触发关闭
        onCancel={() => {
          setDesignVisible(false); // 关闭弹窗
          setCurrentRecord(null); // 清空当前记录
          actionRef.current?.reload(); // 设计完后建议刷新下列表
        }}
      />
    </>
  );
};

export default ProcessManage;
