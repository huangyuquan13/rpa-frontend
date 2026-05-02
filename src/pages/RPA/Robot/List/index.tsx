import {
  createRobot,
  deleteRobot,
  getRobotDetail,
  getRobotList,
  updateRobot,
} from '@/services/RPA/Robots/robot';
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
import {
  Button,
  Card,
  Col,
  message,
  Popconfirm,
  Row,
  Space,
  Statistic,
  Tag,
} from 'antd';
import { useRef, useState } from 'react';

const RobotList = () => {
  // 表格 ref，用于手动刷新
  const tableRef = useRef<ActionType>();
  // 顶部统计卡片数据状态，与表格共用 getRobotList 接口返回的 statistics
  const [statistics, setStatistics] = useState({
    total: 0,
    online: 0,
    working: 0,
    offline: 0,
  });

  // 表格列定义
  const columns: ProColumns<any>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      valueType: 'indexBorder',
      width: 48,
    },
    {
      title: '机器人编码',
      dataIndex: 'robotCode',
      copyable: true,
      fieldProps: {
        placeholder: '请输入',
        allowClear: true,
        trim: true,
      },
    },
    {
      title: '机器人名称',
      dataIndex: 'robotName',
      copyable: true,
      fieldProps: {
        placeholder: '请输入',
        allowClear: true,
        trim: true,
      },
    },
    {
      title: '类型',
      dataIndex: 'type',
      hideInSearch: true,
    },
    {
      title: '状态',
      dataIndex: 'status',
      valueType: 'select',
      valueEnum: {
        0: { text: '离线', status: 'Default' },
        1: { text: '在线', status: 'Success' },
        2: { text: '故障', status: 'Error' },
      },
      render: (_, record) => {
        const statusMap: Record<number, { text: string; color: string }> = {
          0: { text: '离线', color: 'default' },
          1: { text: '在线', color: 'success' },
          2: { text: '故障', color: 'error' },
        };
        const s = statusMap[record.status] || {
          text: '未知',
          color: 'default',
        };
        return <Tag color={s.color}>{s.text}</Tag>;
      },
    },
    {
      title: '当前任务ID',
      dataIndex: 'currentTaskId',
      hideInSearch: true,
    },
    {
      title: '最后心跳',
      dataIndex: 'lastHeartbeat',
      valueType: 'dateTime',
      hideInSearch: true,
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      valueType: 'dateTime',
      hideInSearch: true,
    },
    {
      title: '操作',
      valueType: 'option',
      render: (_, record) => [
        <Space size="middle" key="action">
          {/* 查看：点击后弹出 message 提示即可 */}
          <ModalForm
            title="查看机器人"
            trigger={<a>查看</a>}
            submitter={false} // 隐藏提交按钮，仅用于展示
          >
            <ProDescriptions
              column={2} // 一行显示两个字段，不再是一行到底
              layout="horizontal" // 字段名和内容水平排列
              bordered
              request={async () => {
                const res = await getRobotDetail(record.robotCode);
                return {
                  data: res.data,
                  success: res.code === 200,
                };
              }}
              columns={[
                { title: '机器人编码', dataIndex: 'robotCode', copyable: true },
                { title: '机器人名称', dataIndex: 'robotName' },
                {
                  title: '流程描述',
                  dataIndex: 'description',
                  copyable: true,
                },
                {
                  title: '类型',
                  dataIndex: 'type',
                },
                {
                  title: '状态',
                  dataIndex: 'status',
                  // valueEnum对应接口状态映射带颜色的标签。
                  valueEnum: {
                    0: { text: '离线', status: 'Default' },
                    1: { text: '在线', status: 'Success' },
                    2: { text: '故障', status: 'Error' },
                  },
                },
                {
                  title: '当前任务ID',
                  dataIndex: 'currentTaskId',
                  hideInSearch: true,
                },
                {
                  title: '最后心跳时间',
                  dataIndex: 'lastHeartbeat',
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

          {/* 编辑弹窗 */}
          <ModalForm
            key="edit_modal"
            title="编辑机器人"
            trigger={<a>编辑</a>}
            initialValues={record} // 回显当前行数据
            onFinish={async (values) => {
              const res = await updateRobot({
                ...values,
                robotCode: record.robotCode,
              });
              if (res.code === 200) {
                message.success('编辑成功');
                tableRef.current?.reload();
                return true;
              }
              return false;
            }}
            modalProps={{ destroyOnClose: true }}
          >
            <ProFormText name="robotCode" label="机器人编码" disabled />
            <ProFormText
              name="robotName"
              label="机器人名称"
              rules={[{ required: true, message: '请输入机器人名称' }]}
            />
            <ProFormText
              name="type"
              label="类型"
              fieldProps={{
                placeholder: '可选：用于区分不同用途的机器人',
              }}
            />
            <ProFormTextArea
              name="description"
              label="描述"
              fieldProps={{
                rows: 3,
                placeholder: '请输入描述',
              }}
            />
            <ProFormRadio.Group
              name="status"
              label="状态"
              options={[
                { label: '在线', value: 1 },
                { label: '离线', value: 0 },
              ]}
            />
          </ModalForm>

          {/* 删除确认 */}
          <Popconfirm
            title="确定删除吗？"
            onConfirm={async () => {
              const res = await deleteRobot(record.robotCode);
              if (res.code === 200) {
                message.success('删除成功');
                tableRef.current?.reload();
              }
            }}
          >
            <a style={{ color: '#ff4d4f' }}>删除</a>
          </Popconfirm>
        </Space>,
      ],
    },
  ];

  return (
    <>
      {/* ================= 顶部统计卡片区域（数据来自 getRobotList 返回的 statistics） ================= */}
      {/* 行间距16 底部24 24格栅格系统*/}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic title="总机器人数" value={statistics.total} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="在线"
              value={statistics.online}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="工作中"
              value={statistics.working}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="离线"
              value={statistics.offline}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
      </Row>

      {/* ================= 表格区域 ================= */}
      <ProTable
        headerTitle="机器人列表"
        actionRef={tableRef}
        rowKey="robotCode"
        columns={columns}
        request={async (params) => {
          const res = await getRobotList({
            ...params,
            pageNum: params.current,
          });
          // 同步更新顶部统计卡片（与表格共用同一个接口）
          if (res.data?.statistics) {
            setStatistics(res.data.statistics);
          }
          return {
            data: res.data?.records || [],
            total: res.data?.total || 0,
            success: res.code === 200,
          };
        }}
        toolBarRender={() =>
          [
            <ModalForm
              key="add_robot_modal"
              title="新增机器人"
              trigger={
                <Button type="primary" icon={<PlusOutlined />}>
                  新增机器人
                </Button>
              }
              onFinish={async (values) => {
                const res = await createRobot(values as any);
                if (res.code === 200) {
                  message.success('新增成功');
                  tableRef.current?.reload();
                  return true;
                }
                return false;
              }}
              modalProps={{ destroyOnClose: true }}
            >
              <ProFormText
                name="robotCode"
                label="机器人编码"
                rules={[{ required: true, message: '请输入机器人编码' }]}
              />
              <ProFormText
                name="robotName"
                label="机器人名称"
                rules={[{ required: true, message: '请输入机器人名称' }]}
              />
              <ProFormText
                name="type"
                label="类型"
                fieldProps={{
                  placeholder: '可选：用于区分不同用途的机器人',
                }}
              />
              <ProFormTextArea
                name="description"
                label="描述"
                fieldProps={{
                  rows: 3,
                  placeholder: '请输入描述',
                }}
              />
              <ProFormRadio.Group
                name="status"
                label="状态"
                initialValue={0}
                options={[
                  { label: '在线', value: 1 },
                  { label: '离线', value: 0 },
                ]}
              />
            </ModalForm>,
          ].filter(Boolean) as React.ReactNode[]
        }
        pagination={{
          showTotal: (total) => `共 ${total} 条`,
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
        }}
      />
    </>
  );
};

export default RobotList;
