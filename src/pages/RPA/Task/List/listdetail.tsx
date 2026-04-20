import { getExecutionList } from '@/services/RPA/Tasks/actRecord';
import { getTaskDetail } from '@/services/RPA/Tasks/task';
import { ProDescriptions } from '@ant-design/pro-components';
import { history, useParams } from '@umijs/max';
import { Card } from 'antd';
const TaskDetail = () => {
  const { taskCode } = useParams();

  return (
    <>
      <a onClick={() => history.push(`/rpa/task/list`)}>返回</a>
      <Card style={{ margin: 24 }}>
        <ProDescriptions
          title="任务基本信息"
          column={2} // 一行显示两个字段，不再是一行到底
          layout="horizontal" // 字段名和内容水平排列
          bordered
          request={async () => {
            const res = await getTaskDetail(taskCode as string);

            return { data: res.data, success: true };
          }}
          columns={[
            { title: '任务编码', dataIndex: 'taskCode', copyable: true },
            { title: '任务名称', dataIndex: 'taskName' },
            {
              title: '纳税人识别号',
              dataIndex: 'taxNo',
              copyable: true,
            },
            {
              title: '企业名称',
              dataIndex: 'enterpriseName',
            },
            {
              title: '流程编码',
              dataIndex: 'processCode',
            },
            {
              title: '机器人编码',
              dataIndex: 'robotCode',
            },
            {
              title: '任务状态',
              dataIndex: 'taskStatus',
              // valueEnum对应接口状态映射带颜色的标签。
              valueEnum: {
                '0': { text: '待执行', status: 'Default' },
                '1': { text: '执行中', status: 'Processing' },
                '2': { text: '已完成', status: 'Success' },
                '3': { text: '失败', status: 'Error' },
              },
            },
            {
              title: '创建时间',
              dataIndex: 'createTime',
              valueType: 'dateTime',
            },
            // {
            //   title: '开始时间',
            //   dataIndex: 'startTime',
            //   valueType: 'dateTime',
            // },
            // { title: '结束时间', dataIndex: 'endTime', valueType: 'dateTime' },
          ]}
        />
      </Card>
      <Card style={{ margin: 24 }}>
        <ProDescriptions
          title="执行记录"
          column={2} // 一行显示两个字段，不再是一行到底
          layout="horizontal" // 字段名和内容水平排列
          bordered
          request={async () => {
            const res = await getExecutionList({
              taskId: taskCode,
            });

            if (res.code === 200 && res.data?.records?.length > 0) {
              // 取记录数组的第一项（最近一次执行记录）返回给组件
              return { data: res.data.records[0], success: true };
            }
            return { data: {}, success: true };
          }}
          columns={[
            {
              title: '开始时间',
              dataIndex: 'startTime',
              valueType: 'dateTime',
            },
            { title: '结束时间', dataIndex: 'endTime', valueType: 'dateTime' },
            { title: '执行时长', dataIndex: 'duration' },
          ]}
        />
      </Card>
    </>
  );
};

export default TaskDetail;
