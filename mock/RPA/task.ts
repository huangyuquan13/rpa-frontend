let taskList = [
  {
    id: 1,
    taskCode: '2033725144572071170',
    taskName: '异单账单采集任务_1',
    taxNo: '91500000MA5U123456',
    enterpriseName: '重庆某某科技有限公司',
    taskStatus: '3', // 3-失败
    createTime: '2026-03-17T10:00:33',
    priority: 5,
    processCode: '测试流程002',
    robotCode: '机器人-001',
  },
  {
    id: 2,
    taskCode: '2033730187532775426',
    taskName: '异单账单采集任务_2',
    taxNo: '91500000MA5U123456',
    enterpriseName: '重庆某某科技有限公司',
    taskStatus: '2', // 3-失败
    createTime: '2026-03-17T10:00:33',
    priority: 5,
    processCode: 'PROCESS_001',
    robotCode: '机器人-001',
  },
];

export default {
  // 5.1 列表查询
  'GET /api/v1/system/tasks/list': (req: any, res: any) => {
    const {
      taskCodeOrName,
      taskStatus,
      pageNum = 1,
      pageSize = 10,
    } = req.query;
    let filteredList = [...taskList];

    if (taskCodeOrName) {
      filteredList = filteredList.filter(
        (item) =>
          item.taskName.includes(taskCodeOrName) ||
          item.taskCode.includes(taskCodeOrName),
      );
    }
    if (taskStatus) {
      filteredList = filteredList.filter(
        (item) => item.taskStatus === taskStatus,
      );
    }

    res.send({
      code: 200,
      data: {
        total: filteredList.length,
        current: Number(pageNum),
        records: filteredList.slice(
          (pageNum - 1) * pageSize,
          pageNum * pageSize,
        ),
      },
    });
  },

  // 5.2 新建
  'POST /api/v1/system/tasks/create': (req: any, res: any) => {
    const newTask = {
      ...req.body,
      id: Date.now(),
      taskCode: 'TASK_' + Date.now(),
      taskStatus: '0', // 初始待执行
      createTime: new Date().toISOString(),
    };
    taskList.unshift(newTask);
    res.send({ code: 200, data: { taskCode: newTask.taskCode } });
  },

  // 5.3 编辑
  'PUT /api/v1/system/tasks/update': (req: any, res: any) => {
    const index = taskList.findIndex((i) => i.taskCode === req.body.taskCode);
    if (index > -1) taskList[index] = { ...taskList[index], ...req.body };
    res.send({ code: 200, msg: '更新成功' });
  },

  // 5.4 详情
  'GET /api/v1/system/tasks/detail/:taskCode': (req: any, res: any) => {
    const task = taskList.find((i) => i.taskCode === req.params.taskCode);
    res.send({ code: 200, data: task || {} });
  },

  // 5.5 执行
  'POST /api/v1/system/tasks/execute/:taskCode': (req: any, res: any) => {
    res.send({ code: 200, data: { executionId: 'EXEC_' + Date.now() } });
  },

  // 5.6 删除
  'DELETE /api/v1/system/tasks/delete/:taskCode': (req: any, res: any) => {
    taskList = taskList.filter((i) => i.taskCode !== req.params.taskCode);
    res.send({ code: 200, msg: '删除成功' });
  },
};
