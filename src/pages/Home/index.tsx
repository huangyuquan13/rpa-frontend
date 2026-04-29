import {
  ClusterOutlined,
  DatabaseOutlined,
  FileTextOutlined,
  PlusOutlined,
  RightOutlined,
  RobotOutlined,
} from '@ant-design/icons';
import { useModel, useNavigate } from '@umijs/max'; // Umi 框架的路由跳转
import {
  Button,
  Card,
  Col,
  Descriptions,
  List,
  Row,
  Spin,
  Statistic,
  Table,
  Tag,
  Typography,
} from 'antd';
import React, { useEffect, useState } from 'react';
import { getCollectionList } from '@/services/RPA/DataCollection/data';
import { getProcessList } from '@/services/RPA/Processes/Processe';
import { getRobotList } from '@/services/RPA/Robots/robot';
import { getTaskList } from '@/services/RPA/Tasks/task';

const { Text, Title } = Typography;

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { initialState } = useModel('@@initialState');
  const { authorizedPaths = [] } = initialState || {};
  
  // 统计数据状态
  const [statistics, setStatistics] = useState({
    taskTotal: 0,
    robotTotal: 0,
    robotOnline: 0,
    processTotal: 0,
    processEnabled: 0,
    dataTotal: 0,
    dataToday: 0,
  });
  
  // 任务状态统计
  const [taskStatusStats, setTaskStatusStats] = useState({
    running: 0,
    pending: 0,
    completed: 0,
    failed: 0,
  });
  
  // 最近任务列表
  const [recentTasks, setRecentTasks] = useState<any[]>([]);
  
  // 加载状态
  const [loading, setLoading] = useState(true);

  // 获取当前日期时间
  const getCurrentDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const weekDays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
    const weekDay = weekDays[now.getDay()];
    return `${year}年${month}月${day}日 ${weekDay}`;
  };

  // 加载所有统计数据
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        
        // 并行请求所有接口
        const [taskRes, robotRes, processRes, collectionRes] = await Promise.all([
          getTaskList({ pageNum: 1, pageSize: 1 }),
          getRobotList({ pageNum: 1, pageSize: 1 }),
          getProcessList({ pageNum: 1, pageSize: 1 }),
          getCollectionList({ pageNum: 1, pageSize: 1 }),
        ]);

        // 更新统计数据
        setStatistics({
          taskTotal: taskRes?.data?.total || 0,
          robotTotal: robotRes?.data?.statistics?.total || 0,
          robotOnline: robotRes?.data?.statistics?.online || 0,
          processTotal: processRes?.data?.total || 0,
          processEnabled: processRes?.data?.records?.filter((p: any) => p.status === 1).length || 0,
          dataTotal: collectionRes?.data?.statistics?.totalCollection || 0,
          dataToday: collectionRes?.data?.statistics?.success || 0,
        });

        // 获取任务状态统计（需要分别查询不同状态的任务数）
        const [runningRes, pendingRes, completedRes, failedRes] = await Promise.all([
          getTaskList({ taskStatus: '1', pageNum: 1, pageSize: 1 }), // 执行中
          getTaskList({ taskStatus: '0', pageNum: 1, pageSize: 1 }), // 待执行
          getTaskList({ taskStatus: '2', pageNum: 1, pageSize: 1 }), // 已完成
          getTaskList({ taskStatus: '3', pageNum: 1, pageSize: 1 }), // 失败
        ]);

        setTaskStatusStats({
          running: runningRes?.data?.total || 0,
          pending: pendingRes?.data?.total || 0,
          completed: completedRes?.data?.total || 0,
          failed: failedRes?.data?.total || 0,
        });

        // 获取最近5条任务
        const recentTasksRes = await getTaskList({ pageNum: 1, pageSize: 5 });
        const tasks = recentTasksRes?.data?.records || [];
        
        // 转换任务数据格式以适配表格
        const formattedTasks = tasks.map((task: any) => ({
          id: task.id,
          code: task.taskCode,
          name: task.taskName,
          status: getTaskStatusText(task.taskStatus),
          time: formatDateTime(task.createTime),
        }));
        
        setRecentTasks(formattedTasks);
      } catch (error) {
        console.error('加载首页数据失败:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  // 任务状态文本映射
  const getTaskStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      '0': '待执行',
      '1': '执行中',
      '2': '已完成',
      '3': '失败',
    };
    return statusMap[status] || '未知';
  };

  // 格式化日期时间
  const formatDateTime = (dateTime: string) => {
    if (!dateTime) return '-';
    return dateTime.replace('T', ' ').substring(0, 19);
  };

  return (
    <Spin spinning={loading}>
      <div
        style={{ padding: 24, backgroundColor: '#f0f2f5', minHeight: '100vh' }}
      >
        {/* 第一部分：欢迎横幅 */}
        <Card
          style={{
            marginBottom: 24,
            background: 'linear-gradient(90deg, #6b4eb3 0%, #875fc0 100%)',
            color: 'white',
            borderRadius: 8,
          }}
          styles={{
            body: {
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }
          }}
        >
          <div>
            <Title level={3} style={{ color: 'white', marginTop: 0 }}>
              欢迎回来，{initialState?.currentUser?.nickname || '系统管理员'}！
            </Title>
            <Text style={{ color: 'rgba(255,255,255,0.8)' }}>
              今天是 {getCurrentDateTime()}，系统运行正常
            </Text>
          </div>
          <Button
            type="primary"
            ghost
            style={{ color: 'white', borderColor: 'white' }}
            onClick={() => navigate('/rpa/task/list')}
          >
            <PlusOutlined /> 创建任务
          </Button>
        </Card>

        {/* 第二部分：四大数据统计卡片 */}
        <Row gutter={24} style={{ marginBottom: 24 }}>
          {[
            {
              title: '总任务数',
              value: statistics.taskTotal,
              sub: `今日新增 ${statistics.dataToday}`,
              icon: <FileTextOutlined />,
              color: '#6b4eb3',
              path: '/rpa/task/list',
            },
            {
              title: '机器人总数',
              value: statistics.robotTotal,
              sub: `在线 ${statistics.robotOnline}`,
              icon: <RobotOutlined />,
              color: '#e83e8c',
              path: '/rpa/robot/list',
            },
            {
              title: '流程总数',
              value: statistics.processTotal,
              sub: `已启用 ${statistics.processEnabled}`,
              icon: <ClusterOutlined />,
              color: '#17a2b8',
              path: '/rpa/process/list',
            },
            {
              title: '数据总量',
              value: statistics.dataTotal,
              sub: `今日采集 ${statistics.dataToday}`,
              icon: <DatabaseOutlined />,
              color: '#28a745',
              path: '/rpa/data/collect',
            },
          ].map((item, index) => {
            const hasAccess = authorizedPaths.includes(item.path);
            return (
              <Col span={6} key={index}>
                <Card
                  hoverable={hasAccess} // 只有有权限时才增加悬浮效果
                  onClick={() => hasAccess && navigate(item.path)} // 只有有权限时才允许跳转
                  styles={{
                    body: {
                      display: 'flex',
                      alignItems: 'center',
                      padding: '20px 24px',
                      cursor: hasAccess ? 'pointer' : 'default', // 没权限显示默认指针
                      opacity: hasAccess ? 1 : 0.8, // 没权限略微变淡
                    }
                  }}
                >
                  <div
                    style={{
                      backgroundColor: item.color,
                      padding: 12,
                      borderRadius: 8,
                      marginRight: 16,
                    }}
                  >
                    {React.cloneElement(item.icon as React.ReactElement, {
                      style: { fontSize: 24, color: 'white' },
                    })}
                  </div>
                  <div>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      {item.title}
                    </Text>
                    <div style={{ display: 'flex', alignItems: 'baseline' }}>
                      <Title level={3} style={{ margin: '4px 0' }}>
                        {item.value}
                      </Title>
                    </div>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      {item.sub}
                    </Text>
                  </div>
                </Card>
              </Col>
            );
          })}
        </Row>

        {/* 🌟 第三部分：左右分栏布局 */}
        <Row gutter={24}>
          {/* 左侧区域：占 16 格 (约 2/3 宽度) */}
          <Col span={16}>
            {/* 任务状态概览 */}
            <Card
              title="任务状态概览"
              extra={
                authorizedPaths.includes('/rpa/task/list') && (
                  <a onClick={() => navigate('/rpa/task/list')}>查看详情 &gt;</a>
                )
              }
              style={{ marginBottom: 24 }}
            >
              <Row>
                <Col span={6}>
                  <Statistic
                    title="执行中"
                    value={taskStatusStats.running}
                    valueStyle={{ color: '#faad14' }}
                  />
                </Col>
                <Col span={6}>
                  <Statistic
                    title="待执行"
                    value={taskStatusStats.pending}
                    valueStyle={{ color: '#1890ff' }}
                  />
                </Col>
                <Col span={6}>
                  <Statistic
                    title="已完成"
                    value={taskStatusStats.completed}
                    valueStyle={{ color: '#52c41a' }}
                  />
                </Col>
                <Col span={6}>
                  <Statistic
                    title="失败"
                    value={taskStatusStats.failed}
                    valueStyle={{ color: '#ff4d4f' }}
                  />
                </Col>
              </Row>
            </Card>

            {/* 最近任务表格 */}
            <Card
              title="最近任务"
              extra={
                authorizedPaths.includes('/rpa/task/list') && (
                  <a onClick={() => navigate('/rpa/task/list')}>查看全部 &gt;</a>
                )
              }
            >
              <Table
                dataSource={recentTasks}
                rowKey="id"
                pagination={false} // 首页通常不展示分页
                columns={[
                  {
                    title: '任务编码',
                    dataIndex: 'code',
                    render: (text) => (
                      authorizedPaths.includes('/rpa/task/list') ? (
                        <a onClick={() => navigate('/rpa/task/list')}>{text}</a>
                      ) : (
                        <span>{text}</span>
                      )
                    ),
                  },
                  { title: '流程名称', dataIndex: 'name' },
                  {
                    title: '状态',
                    dataIndex: 'status',
                    render: (status) => (
                      <Tag
                        color={
                          status === '已完成'
                            ? 'success'
                            : status === '失败'
                            ? 'error'
                            : status === '执行中'
                            ? 'processing'
                            : 'default'
                        }
                      >
                        {status}
                      </Tag>
                    ),
                  },
                  { title: '创建时间', dataIndex: 'time' },
                ]}
              />
            </Card>
          </Col>

          {/* 右侧区域：占 8 格 (约 1/3 宽度) */}
          <Col span={8}>
            {/* 快捷入口 */}
            <Card title="快捷入口" style={{ marginBottom: 24 }}>
              <List
                itemLayout="horizontal"
                dataSource={[
                  {
                    title: '创建任务',
                    desc: '快速创建新的 RPA 任务',
                    path: '/rpa/task/list',
                  },
                  {
                    title: '流程定义',
                    desc: '定义和管理 RPA 流程',
                    path: '/rpa/process/list',
                  },
                  {
                    title: '机器人列表',
                    desc: '查看和管理机器人',
                    path: '/rpa/robot/list',
                  },
                  {
                    title: '数据查询',
                    desc: '查询已处理的数据',
                    path: '/rpa/data/query',
                  },
                ].filter(item => authorizedPaths.includes(item.path))} // 核心过滤逻辑
                renderItem={(item) => (
                  <List.Item
                    style={{ cursor: 'pointer', padding: '12px 0' }}
                    onClick={() => navigate(item.path)} // 绑定跳转逻辑
                    actions={[<RightOutlined style={{ color: '#bfbfbf' }} />]} // 右侧箭头
                  >
                    <List.Item.Meta title={item.title} description={item.desc} />
                  </List.Item>
                )}
              />
            </Card>

            {/* 🌟 系统信息 (使用 Descriptions 还原图二边框效果) */}
            <Card title="系统信息">
              <Descriptions column={1} bordered size="small">
                <Descriptions.Item label="系统版本">v1.0.0</Descriptions.Item>
                <Descriptions.Item label="运行时间">15天 8小时</Descriptions.Item>
                <Descriptions.Item label="数据源">东方财富网</Descriptions.Item>
                <Descriptions.Item label="最后更新">
                  {new Date().toLocaleString('zh-CN')}
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </Col>
        </Row>
      </div>
    </Spin>
  );
};

export default Dashboard;
