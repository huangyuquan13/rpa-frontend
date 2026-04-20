// mock/RPA/processe.ts
// 流程管理相关 Mock 数据（7.1 ~ 7.7）

let processList = [
  {
    processCode: 'PROCESS_001',
    processName: '示例流程-仅Java步骤',
    description: '每一步可绑定 Java/Groovy 爬虫代码片段',
    stepCount: 1,
    status: 1,
    createTime: '2026-03-16T21:09:34',
    updateTime: '2026-03-16T21:09:34',
  },
  {
    processCode: '测试流程002',
    processName: '测试流程',
    description: '',
    stepCount: 5,
    status: 0,
    createTime: '2026-03-16T21:12:34',
    updateTime: '2026-03-16T21:12:34',
  },
];

// 流程步骤缓存：processCode -> steps 数组
const processStepsMap: Record<string, any[]> = {
  PROCESS_001: [
    {
      stepOrder: 1,
      stepName: 'Java代码示例',
      stepType: 'Java爬虫代码',
      codeContent: 'return taxNo + "_" + enterpriseName;',
    },
  ],
  测试流程002: [
    {
      stepOrder: 1,
      stepName: '采集(java)',
      stepType: 'Java爬虫代码',
      codeContent: 'return taxNo + "_" + enterpriseName;',
    },
    {
      stepOrder: 2,
      stepName: '解析(java)',
      stepType: 'Java爬虫代码',
      codeContent: '...',
    },
  ],
};

export default {
  // 7.1 查询流程列表
  'GET /api/v1/system/processes/list': (req: any, res: any) => {
    const {
      processName,
      processCode,
      status,
      pageNum = 1,
      pageSize = 10,
    } = req.query;

    let list = [...processList];

    if (processName) {
      list = list.filter((item) => item.processName.includes(processName));
    }
    if (processCode) {
      list = list.filter((item) => item.processCode === processCode);
    }
    if (status !== undefined && status !== '') {
      list = list.filter((item) => String(item.status) === String(status));
    }

    const total = list.length;
    const start = (Number(pageNum) - 1) * Number(pageSize);
    const records = list.slice(start, start + Number(pageSize));

    res.send({
      code: 200,
      message: 'success',
      data: {
        total,
        pages: Math.ceil(total / Number(pageSize)),
        size: Number(pageSize),
        current: Number(pageNum),
        records,
      },
    });
  },

  // 7.2 新增流程
  'POST /api/v1/system/processes/create': (req: any, res: any) => {
    const { processCode, processName, description, status } = req.body;
    processList.unshift({
      processCode,
      processName,
      description: description || '',
      stepCount: 0,
      status: status ?? 0,
      createTime: new Date().toISOString(),
      updateTime: new Date().toISOString(),
    });
    // 初始化空步骤数组
    processStepsMap[processCode] = [];
    res.send({
      code: 200,
      message: 'success',
      data: { processCode },
    });
  },

  // 7.3 编辑流程
  'POST /api/v1/system/processes/update': (req: any, res: any) => {
    const { processCode, processName, description, status } = req.body;
    const index = processList.findIndex(
      (item) => item.processCode === processCode,
    );
    if (index > -1) {
      processList[index] = {
        ...processList[index],
        processName,
        description: description || '',
        status,
        updateTime: new Date().toISOString(),
      };
    }
    res.send({
      code: 200,
      message: 'success',
      data: null,
    });
  },

  // 7.4 查看流程详情
  'GET /api/v1/system/processes/detail/:processCode': (req: any, res: any) => {
    const { processCode } = req.params;
    const process = processList.find(
      (item) => item.processCode === processCode,
    );
    res.send({
      code: 200,
      message: 'success',
      data: process || null,
    });
  },

  // 7.5 查询流程设计步骤
  'GET /api/v1/system/processes/step/list/:processCode': (
    req: any,
    res: any,
  ) => {
    const { processCode } = req.params;
    const steps = processStepsMap[processCode] || [];
    res.send({
      code: 200,
      message: 'success',
      data: steps,
    });
  },

  // 7.6 保存流程步骤（全量覆盖）
  'POST /api/v1/system/processes/step/save': (req: any, res: any) => {
    const { processCode, steps } = req.body;
    processStepsMap[processCode] = steps || [];
    // 同步更新流程的 stepCount
    const index = processList.findIndex(
      (item) => item.processCode === processCode,
    );
    if (index > -1) {
      processList[index].stepCount = (steps || []).length;
      processList[index].updateTime = new Date().toISOString();
    }
    res.send({
      code: 200,
      message: 'success',
      data: null,
    });
  },

  // 7.7 删除流程（关联步骤同步删除）
  'DELETE /api/v1/system/processes/delete/:processCode': (
    req: any,
    res: any,
  ) => {
    const { processCode } = req.params;
    processList = processList.filter(
      (item) => item.processCode !== processCode,
    );
    delete processStepsMap[processCode];
    res.send({
      code: 200,
      message: 'success',
      data: null,
    });
  },
};
