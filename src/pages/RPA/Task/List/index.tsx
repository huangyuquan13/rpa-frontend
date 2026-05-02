import {
  ActionType,
  ModalForm,
  ProColumns, //描述框
  ProFormDigit,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  ProTable,
} from '@ant-design/pro-components';
import { Button, message, Popconfirm, Space } from 'antd';
import { useRef, useState } from 'react';
// 导入之前定义好的任务相关接口
import { getProcessList } from '@/services/RPA/Processes/Processe';
import { getRobotList } from '@/services/RPA/Robots/robot';
import {
  createTask,
  deleteTask,
  executeTask,
  getTaskDetail,
  getTaskList,
  updateTask,
} from '@/services/RPA/Tasks/task';
import { history } from '@umijs/max';
const TaskList = () => {
  const actionRef = useRef<ActionType>();
  const [isCreatingAndExecuting, setIsCreatingAndExecuting] = useState(false);

  const columns: ProColumns<any>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      valueType: 'indexBorder',
      width: 48,
    },
    {
      title: '任务编码',
      dataIndex: 'taskCode',
      copyable: true, // 开启复制功能
      fieldProps: {
        placeholder: '任务编码或名称',
        allowClear: true,
        trim: true,
      }, // 对应截图左侧搜索项
    },
    {
      title: '任务名称',
      dataIndex: 'taskName',
      hideInSearch: true, // 截图显示搜索项是编码/名称合并，所以这里隐藏
    },
    {
      title: '纳税人识别号',
      dataIndex: 'taxNo',
      hideInSearch: true,
      copyable: true,
    },
    {
      title: '企业名称',
      dataIndex: 'enterpriseName',
      hideInSearch: true,
    },
    {
      title: '任务状态',
      dataIndex: 'taskStatus',
      valueType: 'select',
      // valueEnum对应接口状态映射带颜色的标签。
      valueEnum: {
        '0': { text: '待执行', status: 'Default' },
        '1': { text: '执行中', status: 'Processing' },
        '2': { text: '已完成', status: 'Success' },
        '3': { text: '失败', status: 'Error' },
      },
    },
    {
      title: '开始时间',
      dataIndex: 'startTime',
      valueType: 'dateTimeRange', // 双日期时间选择组件
      hideInTable: true, // 仅用于搜索
      search: {
        //数组数据转为后端的时间对象
        transform: (value) => ({
          startTimeStart: value[0],
          startTimeEnd: value[1],
        }),
      },
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
        <Space size="small">
          <a onClick={() => history.push(`/rpa/task/list/${record.taskCode}`)}>
            查看详情
          </a>
          <ModalForm
            title="编辑任务"
            trigger={<a>编辑</a>}
            params={{ taskCode: record.taskCode }}
            request={async (params) => {
              const res = await getTaskDetail(params.taskCode);
              return res.data; // 返回接口中的 data 对象，ProForm 会自动匹配 name 进行回显
            }}
            onFinish={async (values) => {
              const res = await updateTask({
                ...values,
                taskCode: record.taskCode,
              });

              if (res.code === 200) {
                message.success('修改成功');
                actionRef.current?.reload();
                return true;
              }
            }}
          >
            <ProFormText name="taskCode" label="任务编码" disabled />
            <ProFormText
              name="taskName"
              label="任务名称"
              rules={[{ required: true }]}
            />
            <ProFormSelect
              name="processCode"
              label="绑定流程"
              request={async () => {
                const res = await getProcessList({
                  pageNum: 1,
                  pageSize: 1000,
                });
                return res.data.records.map((item: any) => ({
                  label: `${item.processName} (${item.processCode})`,
                  value: item.processCode,
                }));
              }}
            />
            <ProFormSelect
              name="robotCode"
              label="绑定机器人"
              request={async () => {
                const res = await getRobotList({ pageNum: 1, pageSize: 1000 });
                return res.data.records.map((item: any) => ({
                  label: `${item.robotName} (${item.robotCode})`,
                  value: item.robotCode,
                }));
              }}
            />
            <ProFormText name="taxNo" label="纳税人识别号" />
            <ProFormText name="enterpriseName" label="企业名称" />
            <ProFormDigit name="priority" label="优先级" initialValue={5} />
            <ProFormTextArea name="remark" label="备注" />
          </ModalForm>
          {/* 执行按钮：调用执行接口 */}
          <a
            style={{ color: '#52c41a' }}
            onClick={async () => {
              const res = await executeTask(record.taskCode);
              if (res.code === 200) {
                message.success('任务开始执行');
                actionRef.current?.reload();
              }
            }}
          >
            执行
          </a>
          <Popconfirm
            title="确定删除吗？"
            onConfirm={async () => {
              const res = await deleteTask(record.taskCode);
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
    <ProTable
      headerTitle="任务列表"
      actionRef={actionRef}
      rowKey="taskCode"
      columns={columns}
      request={async (params) => {
        const res = await getTaskList({
          ...params,
          taskCodeOrName: params.taskCode, // 将编码搜索项映射到接口参数
          pageNum: params.current,
        });
        return {
          data: res.data?.records || [],
          total: res.data?.total || 0,
          success: res.code === 200,
        };
      }}
      toolBarRender={() => [
        <ModalForm
          key="create-task"
          title="新建任务"
          trigger={<Button type="primary">新建任务</Button>}
          // 自定义底部按钮，增加“创建并执行”
          submitter={{
            render: (props, defaultDoms) => [
              ...defaultDoms, //展开保留默认的取消和提交按钮
              <Button
                key="execute"
                type="primary"
                style={{ backgroundColor: '#52c41a' }}
                onClick={async () => {
                  setIsCreatingAndExecuting(true); // 设置标志位
                  const values = await props.form?.validateFields();
                  const res = await createTask(values); // 1. 先调用创建接口
                  if (res.code === 200) {
                    await executeTask(res.data.taskCode); // 2. 紧接着调用执行接口
                    message.success('任务已创建并开始执行');
                    actionRef.current?.reload(); // 3. 手动刷新列表
                    props.submit(); // 4. 调用onfinish回调 true关闭弹窗
                  } else {
                    setIsCreatingAndExecuting(false); // 失败时重置标志位
                  }
                }}
              >
                创建并执行
              </Button>,
            ],
          }}
          onFinish={async (values) => {
            // 如果是"创建并执行"，跳过
            if (isCreatingAndExecuting) {
              setIsCreatingAndExecuting(false); // 重置标志位
              return true;
            }

            const res = await createTask(values); // 普通创建逻辑
            if (res.code === 200) {
              message.success('创建成功');
              actionRef.current?.reload();
              return true;
            }
          }}
        >
          <ProFormText
            name="taskName"
            label="任务名称"
            rules={[{ required: true }]}
          />
          {/* 联动选择流程与机器人 */}
          <ProFormSelect
            name="processCode"
            label="绑定流程"
            request={async () => {
              const res = await getProcessList({ pageNum: 1, pageSize: 1000 });
              return res.data.records.map((item: any) => ({
                label: `${item.processName} (${item.processCode})`,
                value: item.processCode,
              }));
            }}
          />
          <ProFormSelect
            name="robotCode"
            label="绑定机器人"
            request={async () => {
              const res = await getRobotList({ pageNum: 1, pageSize: 1000 });
              return res.data.records.map((item: any) => ({
                label: `${item.robotName} (${item.robotCode})`,
                value: item.robotCode,
              }));
            }}
          />
          <ProFormText name="taxNo" label="纳税人识别号" />
          <ProFormText name="enterpriseName" label="企业名称" />
          <ProFormDigit name="priority" label="优先级" initialValue={5} />
          <ProFormTextArea name="remark" label="备注" />
        </ModalForm>,
      ]}
      pagination={{
        showTotal: (total) => `共 ${total} 条`, // 显示总条数
        pageSize: 10,
        showSizeChanger: true, // 允许改变每页条数
        showQuickJumper: true, //允许跳转
      }}
    />
  );
};

export default TaskList;
