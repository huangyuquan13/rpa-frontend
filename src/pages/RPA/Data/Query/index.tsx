import {
  deleteResult,
  getResultDetail,
  getResultList,
} from '@/services/RPA/DataCollection/data';
import {
  ActionType,
  ModalForm,
  ProColumns,
  ProDescriptions,
  ProTable,
} from '@ant-design/pro-components';
import { message, Popconfirm } from 'antd';
import React, { useRef } from 'react';

const DataQuery: React.FC = () => {
  const actionRef = useRef<ActionType>();

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
      title: '纳税人识别号',
      dataIndex: 'taxNo',
      copyable: true,
      hideInSearch: true,
    },
    {
      title: '关键字',
      dataIndex: 'taxNo',
      fieldProps: {
        placeholder: '请输入纳税人识别号',
        allowClear: true,
        trim: true,
      },
      hideInTable: true,
    },
    { title: '企业名称', dataIndex: 'enterpriseName', hideInSearch: true },
    {
      title: '税务区域ID',
      dataIndex: 'taxAreaId',
      copyable: true,
      fieldProps: {
        placeholder: '请输入',
        allowClear: true,
        trim: true,
      },
    },
    {
      title: '数据状态',
      dataIndex: 'dataStatus',
      valueType: 'select',
      valueEnum: {
        available: { text: '可用', status: 'Success' },
        archived: { text: '已归档', status: 'Success' },
      },
    },

    {
      title: '创建时间',
      dataIndex: 'createTime',
      valueType: 'dateTime',
      hideInSearch: true,
    },
    {
      title: '时间范围',
      dataIndex: 'creatingTimeRange',
      valueType: 'dateTimeRange',
      hideInTable: true,
      hideInSearch: false, // 明确指定在搜索中显示
      search: {
        transform: (v) => ({
          createTimeStart: v[0],
          createTimeEnd: v[1],
        }),
      },
    },
    {
      title: '操作',
      valueType: 'option',
      render: (_, record) => [
        <ModalForm
          key="view"
          title="查询数据详情"
          trigger={<a>查看</a>}
          submitter={false}
        >
          <ProDescriptions
            column={2}
            bordered
            request={async () => {
              const res = await getResultDetail(record.id);
              return { data: res.data, success: true };
            }}
            columns={[
              { title: '任务ID', dataIndex: 'taskId' },
              { title: '税务区域ID', dataIndex: 'taxAreaId' },
              { title: '纳税人识别号', dataIndex: 'taxNo' },
              { title: '企业名称', dataIndex: 'enterpriseName' },
              {
                title: '数据状态',
                dataIndex: 'dataStatus',

                valueEnum: {
                  available: { text: '可用', status: 'Success' },
                  archived: { text: '已归档', status: 'Success' },
                },
              },

              {
                title: '创建时间',
                dataIndex: 'createTime',
                valueType: 'dateTime',
              },

              {
                title: '业务数据',
                dataIndex: 'businessData',
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
            await deleteResult(record.id);
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
      <ProTable
        headerTitle="数据采集"
        actionRef={actionRef}
        rowKey="id"
        columns={columns}
        request={async (params) => {
          const res = await getResultList({
            ...params,
            pageNum: params.current,
          });

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

export default DataQuery;
