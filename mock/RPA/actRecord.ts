let executionList = [
  {
    id: 1,
    executionId: '2033789858201284699',
    taskCode: 'TASK_177371283479',
    processCode: '测试流程ee2',
    robotCode: '机器人001',
    executionStatus: '0', // 0-失败
    startTime: '2026-03-17T14:17:43',
    endTime: '2026-03-17T14:17:48',
    duration: '5秒',
  },
  {
    id: 2,
    executionId: '2033740201102225410',
    taskCode: '2033730187532775426',
    processCode: '测试流程ee2',
    robotCode: '机器人001',
    executionStatus: '1', // 1-成功
    startTime: '2026-03-17T11:00:24',
    endTime: '2026-03-17T11:00:28',
    duration: '4秒',
  },
];

// 步骤详情映射表
const executionStepsMap: Record<string, any[]> = {
  '2033740201102225410': [
    {
      stepName: '采集(java)',
      stepType: 'java',
      status: 1,
      errorMessage: null,
      output: '{"collectionId":2033726326860492804}',
      executeTime: '2026-03-17T11:00:24',
    },
    {
      stepName: '解析(java)',
      stepType: 'java',
      status: 1,
      errorMessage: null,
      output: '{"parsingId":5}',
      executeTime: '2026-03-17T11:00:26',
    },
  ],
  '2033789858201284699': [
    {
      stepName: '采集(java)',
      stepType: 'java',
      status: 1,
      errorMessage: null,
      output: '{"collectionId":2033726326860492804}',
      executeTime: '2026-03-17T14:17:43',
    },
    {
      stepName: '加工(java)',
      stepType: 'java',
      status: 0,
      errorMessage:
        'groovy.lang.MissingPropertyException: No such property: xxx',
      output: null,
      executeTime: '2026-03-17T14:17:45',
    },
  ],
};

export default {
  // 8.1 列表查询
  'GET /api/v1/system/executions/list': (req: any, res: any) => {
    const { taskId, executionStatus, pageNum = 1, pageSize = 10 } = req.query;
    let list = [...executionList];

    if (taskId) list = list.filter((i) => i.taskCode === taskId);
    if (executionStatus)
      list = list.filter((i) => i.executionStatus === executionStatus);

    res.send({
      code: 200,
      message: 'success',
      data: {
        total: list.length,
        current: Number(pageNum),
        records: list.slice((pageNum - 1) * pageSize, pageNum * pageSize),
      },
    });
  },

  // 8.2 详情
  'GET /api/v1/system/executions/detail/:executionId': (req: any, res: any) => {
    const detail = executionList.find(
      (i) => i.executionId === req.params.executionId,
    );
    res.send({ code: 200, message: 'success', data: detail || null });
  },

  // 8.21 步骤列表
  'GET /api/v1/system/executions/detail/:executionId/steps': (
    req: any,
    res: any,
  ) => {
    const steps = executionStepsMap[req.params.executionId] || [];
    res.send({ code: 200, message: 'success', data: steps });
  },
};
