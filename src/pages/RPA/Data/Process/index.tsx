import {
  deleteProcessing,
  getProcessingDetail,
  getProcessingList,
} from '@/services/RPA/DataCollection/data';
import {
  ActionType,
  ModalForm,
  ProColumns,
  ProDescriptions,
  ProTable,
} from '@ant-design/pro-components';
import { Card, Col, message, Popconfirm, Row, Statistic, Tag } from 'antd';
import React, { useRef, useState } from 'react';

const DataProcess: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [statistics, setStatistics] = useState({
    totalProcessing: 0,
    success: 0,
    processing: 0,
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
      title: '解析ID',
      dataIndex: 'parsingId',
      copyable: true,
      hideInSearch: true,
    },
    {
      title: '状态',
      dataIndex: 'status',
      valueType: 'select',
      valueEnum: {
        processed: { text: '已加工', status: 'Success' },
        exported: { text: '已输出', status: 'Success' },
        failed: { text: '失败', status: 'Error' },
      },
    },
    {
      title: '验证结果',
      dataIndex: 'validationResult',
      hideInSearch: true,
      render: (text) => {
        // 根据后端返回的内容判断颜色
        const isError = text === '未通过';
        return (
          <Tag
            color={isError ? 'error' : 'success'}
            style={{
              borderRadius: '4px', // 圆角效果
              padding: '2px 8px', // 增加内边距让它更像胶囊
            }}
          >
            {text}
          </Tag>
        );
      },
    },

    {
      title: '加工时间',
      dataIndex: 'processingTime',
      valueType: 'dateTime',
      hideInSearch: true,
    },
    {
      title: '时间范围',
      dataIndex: 'processingTimeRange',
      valueType: 'dateTimeRange',
      hideInTable: true,
      hideInSearch: false, // 明确指定在搜索中显示
      search: {
        transform: (v) => ({
          processingTimeStart: v[0],
          processingTimeEnd: v[1],
        }),
      },
    },
    {
      title: '操作',
      valueType: 'option',
      render: (_, record) => [
        <ModalForm
          key="view"
          title="加工数据详情"
          trigger={<a>查看</a>}
          submitter={false}
        >
          <ProDescriptions
            column={2}
            bordered
            request={async () => {
              const res = await getProcessingDetail(record.id);
              return { data: res.data, success: true };
            }}
            columns={[
              { title: '任务ID', dataIndex: 'taskId' },
              { title: '解析ID', dataIndex: 'parsingId' },
              { title: '纳税人识别号', dataIndex: 'taxNo' },
              { title: '企业名称', dataIndex: 'enterpriseName' },
              {
                title: '状态',
                dataIndex: 'status',

                valueEnum: {
                  processed: { text: '已加工', status: 'Success' },
                  exported: { text: '已输出', status: 'Success' },
                  failed: { text: '失败', status: 'Error' },
                },
              },

              {
                title: '加工时间',
                dataIndex: 'processingTime',
                valueType: 'dateTime',
              },
              { title: '错误信息', dataIndex: 'errorMessage', span: 2 },
              {
                title: '加工数据',
                dataIndex: 'processedData',
                span: 2,
                valueType: 'jsonCode', // 自动美化 JSON 字符串
              },
              {
                title: '验证结果',
                dataIndex: 'validationResult',
                span: 2,
                valueType: 'jsonCode', // 自动美化 JSON 字符串
              },
            ]}
          />
        </ModalForm>,
        <Popconfirm
          key="del"
          title="确定删除吗？"
          onConfirm={async () => {
            await deleteProcessing(record.id);
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
            <Statistic title="总采集数" value={statistics.totalProcessing} />
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
              value={statistics.processing}
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
        request={async (params) => {
          const res = await getProcessingList({
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

export default DataProcess;
