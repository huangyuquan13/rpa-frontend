import {
  getExecutionList,
  getExecutionSteps,
} from '@/services/RPA/Tasks/actRecord';
import {
  ActionType,
  ModalForm,
  ProColumns,
  ProDescriptions,
  ProTable,
} from '@ant-design/pro-components';
import { Alert, Divider, Timeline } from 'antd';
import { useRef } from 'react';

const ExecutionRecord = () => {
  const actionRef = useRef<ActionType>();

  const columns: ProColumns<any>[] = [
    { title: '序号', dataIndex: 'index', valueType: 'indexBorder', width: 48 },
    {
      title: '执行ID',
      dataIndex: 'executionId',
      copyable: true,
      fieldProps: {
        allowClear: true,
        trim: true,
      },
    },
    {
      title: '任务编码',
      dataIndex: 'taskCode',
      copyable: true,
      fieldProps: { placeholder: '任务ID', trim: true },
      hideInSearch: true,
    },
    { title: '流程编码', dataIndex: 'processCode', hideInSearch: true },
    { title: '机器人编码', dataIndex: 'robotCode', hideInSearch: true },
    {
      title: '执行状态',
      dataIndex: 'executionStatus',
      valueType: 'select',
      valueEnum: {
        '1': { text: '成功', status: 'Success' },
        '0': { text: '失败', status: 'Error' },
        '2': { text: '执行中', status: 'Processing' },
      },
    },
    {
      title: '执行时间',
      dataIndex: 'executionTime',
      valueType: 'dateTimeRange', // 渲染双日期选择器
      hideInTable: true,
      search: {
        transform: (value) => ({
          executionTimeStart: value[0],
          executionTimeEnd: value[1],
        }),
      },
    },
    {
      title: '开始时间',
      dataIndex: 'startTime',
      valueType: 'dateTime',
      hideInSearch: true,
    },
    {
      title: '结束时间',
      dataIndex: 'endTime',
      valueType: 'dateTime',
      hideInSearch: true,
    },
    { title: '执行时长', dataIndex: 'duration', hideInSearch: true },
    {
      title: '操作',
      valueType: 'option',
      render: (_, record) => [
        <ModalForm
          key="detail"
          title="执行记录详情"
          trigger={<a>查看详情</a>}
          submitter={false}
          width={800}
        >
          <ProDescriptions
            bordered
            column={2}
            size="small"
            dataSource={record} // 基础信息直接用列表传过来的当前行数据即可
            columns={[
              { title: '执行ID', dataIndex: 'executionId', copyable: true },
              { title: '任务编码', dataIndex: 'taskCode' },
              { title: '流程编码', dataIndex: 'processCode' },
              { title: '机器人编码', dataIndex: 'robotCode' },
              {
                title: '执行状态',
                dataIndex: 'executionStatus',
                valueEnum: {
                  '1': { text: '成功', status: 'Success' },
                  '0': { text: '失败', status: 'Error' },
                  '2': { text: '执行中', status: 'Processing' },
                },
              },
              { title: '执行时长', dataIndex: 'duration' },
              {
                title: '开始时间',
                dataIndex: 'startTime',
                valueType: 'dateTime',
              },
              {
                title: '结束时间',
                dataIndex: 'endTime',
                valueType: 'dateTime',
              },
            ]}
          />

          {/*  2. 下半部分：执行步骤（独立请求数据，定制化渲染） */}
          <ProDescriptions
            request={async () => {
              const res = await getExecutionSteps(record.executionId); //
              return { data: { steps: res.data }, success: true };
            }}
            columns={[
              {
                dataIndex: 'steps',
                render: (_, entity) => {
                  const steps = entity.steps || [];

                  // 找到是否有失败的步骤，提取错误信息用于底部展示
                  const failedStep = steps.find((s: any) => s.status === 0);

                  return (
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center', // 让所有子元素水平居中对齐
                        margin: '0 auto',
                        width: '100%',
                      }}
                    >
                      {/* 使用 Timeline 组件实现图二左侧带圆点的效果 */}
                      <Divider style={{ width: '80%', minWidth: '300px' }}>
                        执行步骤
                      </Divider>
                      <div
                        style={{
                          width: 'fit-content',
                          textAlign: 'left',
                          marginBottom: 24,
                        }}
                      >
                        <Timeline
                          items={steps.map((step: any) => ({
                            color: step.status === 1 ? 'green' : 'red',
                            children: (
                              <div style={{ marginBottom: 16 }}>
                                <div
                                  style={{
                                    fontWeight: 'bold',
                                    marginBottom: 4,
                                  }}
                                >
                                  {step.stepName}
                                </div>
                                {step.status === 0 && (
                                  <div
                                    style={{
                                      color: '#ff4d4f',
                                      fontSize: 12,
                                      marginBottom: 4,
                                    }}
                                  >
                                    错误: {step.errorMessage} {/* */}
                                  </div>
                                )}
                                <div style={{ color: '#999', fontSize: 12 }}>
                                  {step.executeTime}
                                </div>
                              </div>
                            ),
                          }))}
                        />
                      </div>

                      {/* 如果有错误信息，像图二底部那样用红色警告框展示出来 */}
                      {failedStep && failedStep.errorMessage && (
                        <>
                          <Divider style={{ width: '80%', minWidth: '300px' }}>
                            错误信息
                          </Divider>
                          <Alert
                            message={failedStep.errorMessage}
                            type="error"
                            style={{
                              width: '80%', // 🌟 保持和分割线一样的宽度
                              backgroundColor: '#fff2f0',
                              border: 'none',
                              textAlign: 'center', // 文字内部居中
                            }}
                          />
                        </>
                      )}
                    </div>
                  );
                },
              },
            ]}
          />
        </ModalForm>,
      ],
    },
  ];

  return (
    <ProTable
      headerTitle="执行记录"
      actionRef={actionRef}
      rowKey="executionId"
      columns={columns}
      request={async (params) => {
        const res = await getExecutionList({
          ...params,
          taskId: params.taskCode, // 映射搜索字段
          pageNum: params.current,
        });
        return {
          data: res.data?.records || [],
          total: res.data?.total || 0,
          success: res.code === 200,
        };
      }}
    />
  );
};

export default ExecutionRecord;
