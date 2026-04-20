import {
  deleteParsing,
  getParsingDetail,
  getParsingList,
} from '@/services/RPA/DataCollection/data';
import {
  ActionType,
  ModalForm,
  ProColumns,
  ProDescriptions,
  ProTable,
} from '@ant-design/pro-components';
import { Card, Col, message, Popconfirm, Row, Statistic } from 'antd';
import React, { useRef, useState } from 'react';

const DataParse: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [statistics, setStatistics] = useState({
    totalParsing: 0,
    success: 0,
    parsing: 0,
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
        parsed: { text: '已解析', status: 'Success' },
        processing: { text: '加工中', status: 'Processing' },
        failed: { text: '失败', status: 'Error' },
      },
    },
    {
      title: '采集ID',
      dataIndex: 'collectionId',
      copyable: true,
      fieldProps: {
        placeholder: '纳税人识别号/企业名称',
        allowClear: true,
        trim: true,
      },
      hideInSearch: true,
    },

    { title: '提取字段数', dataIndex: 'extractFieldCount', hideInSearch: true },
    { title: '解析规则', dataIndex: 'parseRule', hideInSearch: true },
    {
      title: '解析时间',
      dataIndex: 'parsingTime',
      valueType: 'dateTime',
      hideInSearch: true,
    },
    {
      title: '时间范围',
      dataIndex: 'parsingTimeRange',
      valueType: 'dateTimeRange',
      hideInTable: true,
      hideInSearch: false, // 明确指定在搜索中显示
      search: {
        transform: (v) => ({
          parsingTimeStart: v[0],
          parsingTimeEnd: v[1],
        }),
      },
    },
    {
      title: '操作',
      valueType: 'option',
      render: (_, record) => [
        <ModalForm
          key="view"
          title="解析数据详情"
          trigger={<a>查看</a>}
          submitter={false}
        >
          <ProDescriptions
            column={2}
            bordered
            request={async () => {
              const parseRes = await getParsingDetail(record.id);
              let detailData = parseRes.data || {};

              return { data: detailData, success: true };
            }}
            columns={[
              { title: '任务ID', dataIndex: 'taskId' },
              { title: '采集ID', dataIndex: 'collectionId' },
              { title: '纳税人识别号', dataIndex: 'taxNo' },
              { title: '企业名称', dataIndex: 'enterpriseName' },
              {
                title: '状态',
                dataIndex: 'status',

                valueEnum: {
                  parsed: { text: '已解析', status: 'Success' },
                  processing: { text: '加工中', status: 'Processing' },
                  failed: { text: '失败', status: 'Error' },
                },
              },

              {
                title: '解析时间',
                dataIndex: 'parsingTime',
                valueType: 'dateTime',
              },
              { title: '错误信息', dataIndex: 'errorMessage', span: 2 },
              {
                title: '解析数据',
                dataIndex: 'parsedData',
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
            await deleteParsing(record.id);
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
            <Statistic title="总解析数" value={statistics.totalParsing} />
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
              title="解析中"
              value={statistics.parsing}
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
          const res = await getParsingList({
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

export default DataParse;
