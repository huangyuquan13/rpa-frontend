// mock/RPA/robot.ts
// 机器人管理相关 Mock 数据（6.1 ~ 6.5）

let robotList = [
  {
    robotCode: 'ROBOT_001',
    robotName: '机器人-001',
    type: 'thread',
    description: '',
    status: 1,
    currentTaskId: '空闲',
    lastHeartbeat: '2026-03-16T21:09:34',
    updateTime: '2026-03-16T21:09:34',
  },
  {
    robotCode: 'ROBOT_002',
    robotName: '机器人-002',
    type: 'thread',
    description: '',
    status: 0,
    currentTaskId: '空闲',
    lastHeartbeat: '2026-03-16T21:09:34',
    updateTime: '2026-03-16T21:09:34',
  },
  {
    robotCode: '机器人001',
    robotName: '机器人001',
    type: '测试机器人',
    description: '',
    status: 1,
    currentTaskId: '全国',
    lastHeartbeat: '2026-03-16T21:12:20',
    updateTime: '2026-03-16T21:12:29',
  },
];

export default {
  // 6.1 查询机器人列表（含统计）
  'GET /api/v1/system/robots/list': (req: any, res: any) => {
    const {
      robotName,
      robotCode,
      status,
      pageNum = 1,
      pageSize = 10,
    } = req.query;

    let list = [...robotList];

    if (robotName) {
      list = list.filter((item) => item.robotName.includes(robotName));
    }
    if (robotCode) {
      list = list.filter((item) => item.robotCode === robotCode);
    }
    if (status !== undefined && status !== '') {
      list = list.filter((item) => String(item.status) === String(status));
    }

    const total = list.length;
    const start = (Number(pageNum) - 1) * Number(pageSize);
    const records = list.slice(start, start + Number(pageSize));

    const statistics = {
      total: robotList.length,
      online: robotList.filter((i) => i.status === 1).length,
      working: robotList.filter((i) => i.currentTaskId !== '空闲').length,
      offline: robotList.filter((i) => i.status === 0).length,
    };

    res.send({
      code: 200,
      message: 'success',
      data: {
        statistics,
        total,
        pages: Math.ceil(total / Number(pageSize)),
        size: Number(pageSize),
        current: Number(pageNum),
        records,
      },
    });
  },

  // 6.2 新增机器人
  'POST /api/v1/system/robots/create': (req: any, res: any) => {
    const { robotCode, robotName, type, description, status } = req.body;
    robotList.unshift({
      robotCode,
      robotName,
      type: type || 'thread',
      description: description || '',
      status: status ?? 0,
      currentTaskId: '空闲',
      lastHeartbeat: new Date().toISOString(),
      updateTime: new Date().toISOString(),
    });
    res.send({
      code: 200,
      message: 'success',
      data: { robotCode },
    });
  },

  // 6.3 编辑机器人
  'POST /api/v1/system/robots/update': (req: any, res: any) => {
    const { robotCode, robotName, type, description, status } = req.body;
    const index = robotList.findIndex((item) => item.robotCode === robotCode);
    if (index > -1) {
      robotList[index] = {
        ...robotList[index],
        robotName,
        type,
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

  // 6.4 查看机器人详情
  'GET /api/v1/system/robots/detail/:robotCode': (req: any, res: any) => {
    const { robotCode } = req.params;
    const robot = robotList.find((item) => item.robotCode === robotCode);
    res.send({
      code: 200,
      message: 'success',
      data: robot || null,
    });
  },

  // 6.5 删除机器人
  'DELETE /api/v1/system/robots/delete/:robotCode': (req: any, res: any) => {
    const { robotCode } = req.params;
    robotList = robotList.filter((item) => item.robotCode !== robotCode);
    res.send({
      code: 200,
      message: 'success',
      data: null,
    });
  },
};
