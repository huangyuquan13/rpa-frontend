import {
  addCollection,
  deleteCollection,
  getCollectionDetail,
  getCollectionList,
} from '@/services/RPA/DataCollection/data';
import { PlusOutlined } from '@ant-design/icons';
import {
  ActionType,
  ModalForm,
  ProColumns,
  ProDescriptions,
  ProFormDigit,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  ProTable,
} from '@ant-design/pro-components';
import { Button, Card, Col, message, Popconfirm, Row, Statistic } from 'antd';
import React, { useRef, useState } from 'react';

const DataCollection: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [statistics, setStatistics] = useState({
    totalCollection: 0,
    success: 0,
    collecting: 0,
    failed: 0,
  });
  const columns: ProColumns<any>[] = [
    { title: '序号', dataIndex: 'index', valueType: 'indexBorder' },
    {
      title: '任务ID',
      dataIndex: 'taskId',
      copyable: true,
      fieldProps: {
        placeholder: '请输入',
        allowClear: true,
        trim: true,
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      valueType: 'select',
      valueEnum: {
        collected: { text: '已采集', status: 'Success' },
        parsing: { text: '解析中', status: 'Processing' },
        parsed: { text: '已解析', status: 'Default' },
        failed: { text: '失败', status: 'Error' },
      },
    },
    {
      title: '纳税人识别号',
      dataIndex: 'taxNo',
      copyable: true,
      fieldProps: {
        placeholder: '纳税人识别号/企业名称',
        allowClear: true,
        trim: true,
      },
      hideInSearch: true,
    },
    {
      title: '关键字',
      dataIndex: 'taxNo',
      fieldProps: {
        placeholder: '纳税人识别号/企业名称',
        allowClear: true,
        trim: true,
      },
      hideInTable: true,
      copyable: true,
    },
    { title: '企业名称', dataIndex: 'enterpriseName', hideInSearch: true },
    { title: '数据来源', dataIndex: 'dataSource', hideInSearch: true },
    {
      title: '采集时间',
      dataIndex: 'collectionTime',
      valueType: 'dateTime',
      hideInSearch: true,
    },
    {
      title: '时间范围',
      dataIndex: 'collectionTimeRange',
      valueType: 'dateTimeRange',
      hideInTable: true,
      hideInSearch: false, // 明确指定在搜索中显示
      search: {
        transform: (v) => ({
          collectionTimeStart: v[0],
          collectionTimeEnd: v[1],
        }),
      },
    },
    {
      title: '操作',
      valueType: 'option',
      render: (_, record) => [
        <ModalForm
          key="view"
          title="采集数据详情"
          trigger={<a>查看</a>}
          submitter={false}
        >
          <ProDescriptions
            column={2}
            bordered
            request={async () => {
              const res = await getCollectionDetail(record.id);
              // debugger;
              return { data: res.data, success: true };
            }}
            columns={[
              { title: '任务ID', dataIndex: 'taskId' },
              { title: '纳税人识别号', dataIndex: 'taxNo' },
              { title: '企业名称', dataIndex: 'enterpriseName' },
              {
                title: '状态',
                dataIndex: 'status',

                valueEnum: {
                  collected: { text: '已采集', status: 'Success' },
                  parsing: { text: '解析中', status: 'Processing' },
                  parsed: { text: '已解析', status: 'Default' },
                  failed: { text: '失败', status: 'Error' },
                },
              },
              { title: '数据来源', dataIndex: 'dataSource' },
              {
                title: '采集时间',
                dataIndex: 'collectionTime',
                valueType: 'dateTime',
              },
              { title: '错误信息', dataIndex: 'errorMessage', span: 2 },
              {
                title: '原始数据',
                dataIndex: 'rawData',
                span: 2,
                // 去掉 jsonCode，改成普通文本或代码块
                // valueType: 'jsonCode',  <-- 删掉这行
                render: (text) =>
                  text ? (
                    <pre
                      style={{
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-all',
                        maxHeight: 300,
                        overflow: 'auto',
                      }}
                    >
                      {text}
                    </pre>
                  ) : (
                    '-'
                  ),
              },
            ]}
          />
        </ModalForm>,
        <Popconfirm
          key="del"
          title="确定删除吗？"
          onConfirm={async () => {
            await deleteCollection(record.id);
            message.success('删除成功');
            actionRef.current?.reload();
          }}
        >
          <a style={{ color: 'red' }}>删除</a>
        </Popconfirm>,
      ],
    },
  ];

  return (
    <>
      {/* 行间距16 底部24 24格栅格系统*/}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic title="总采集数" value={statistics.totalCollection} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="成功"
              value={statistics.success}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="采集中"
              value={statistics.collecting}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="失败"
              value={statistics.failed}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
      </Row>
      <ProTable
        headerTitle="数据采集"
        actionRef={actionRef}
        rowKey="id"
        columns={columns}
        search={{
          labelWidth: 'auto', //  标签宽度自动，节省空间
          defaultCollapsed: false, // 默认不折叠
          collapseRender: false, //  彻底隐藏“展开/收起”按钮
          span: 4, //  24格栅格
          layout: 'horizontal',
        }}
        toolbar={{
          actions: [
            <ModalForm
              key="add"
              title="新增采集记录"
              trigger={
                <Button type="primary" icon={<PlusOutlined />}>
                  新增
                </Button>
              }
              onFinish={async (values) => {
                await addCollection(values);
                message.success('新增成功');
                actionRef.current?.reload();
                return true;
              }}
            >
              <ProFormDigit
                name="taskId"
                label="任务ID"
                placeholder="请输入任务ID"
                rules={[{ required: true }]}
              />
              <ProFormText
                name="taxNo"
                label="纳税人识别号"
                placeholder="请输入纳税人识别号"
              />
              <ProFormText
                name="enterpriseName"
                label="企业名称"
                placeholder="请输入企业名称"
              />
              <ProFormText
                name="dataSource"
                label="数据来源"
                placeholder="请输入数据来源"
              />
              <ProFormSelect
                name="status"
                label="状态"
                initialValue="collected"
                options={[
                  { label: '已采集', value: 'collected' },
                  { label: '解析中', value: 'parsing' },
                  { label: '已解析', value: 'parsed' },
                  { label: '失败', value: 'failed' },
                ]}
              />
              <ProFormTextArea
                name="rawData"
                label="原始数据"
                placeholder="请输入原始数据 (JSON格式)"
              />
              <ProFormTextArea
                name="errorMessage"
                label="错误信息"
                placeholder="请输入错误信息"
              />
            </ModalForm>,
          ],
        }}
        request={async (params) => {
          const res = await getCollectionList({
            ...params,
            pageNum: params.current,
          });
          if (res.data?.statistics) {
            setStatistics(res.data.statistics);
          }
          return {
            data: res.data?.records || [],
            total: res.data?.total || 0,
            success: res.code === 200,
          };
        }}
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

export default DataCollection;
