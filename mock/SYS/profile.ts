// mock/SYS/profile.ts
export default {
  // 1.1 获取个人信息
  'GET /api/v1/system/profile': (req: any, res: any) => {
    res.send({
      code: 200,
      msg: 'success',
      data: {
        id: 2,
        username: 'admin',
        nickname: '系统管理员',
        email: 'admin@rpa.com',
        phone: '13800138000',
        avatarUrl:
          'https://ui-avatars.com/api/?name=Admin&background=0D8ABC&color=fff',
        roleName: '管理员',
        roleCodes: 'ADMIN',
        createTime: '2026-03-16T21:09:34',
      },
    });
  },

  // 1.2 更新个人信息
  'PUT /api/v1/system/profile': (req: any, res: any) => {
    const { nickname, avatarUrl } = req.body;
    console.log('正在更新个人信息:', { nickname, avatarUrl });

    res.send({
      code: 200,
      msg: '个人信息更新成功',
      data: null,
    });
  },

  // 1.3 修改密码
  'PUT /api/v1/system/profile/password': (req: any, res: any) => {
    const { oldPassword, newPassword } = req.body;

    if (oldPassword === '123456') {
      res.send({
        code: 200,
        msg: '密码修改成功',
        data: null,
      });
    } else {
      res.status(200).send({
        code: 400,
        msg: '旧密码验证失败',
        data: null,
      });
    }
  },

  // 1.4 获取当前用户的动态菜单树（包含所有 RPA 及系统管理路由，与 .umirc.ts 对应）
  'GET /api/v1/system/profile/menus': (req: any, res: any) => {
    res.send({
      code: 200,
      msg: 'success',
      data: [
        {
          id: 1,
          resourceName: '首页',
          path: '/home',
          children: [],
        },
        // --- RPA 运营管理模块 ---
        {
          id: 10,
          resourceName: 'RPA运营管理',
          path: '/rpa',
          children: [
            {
              id: 11,
              resourceName: '任务管理',
              path: '/rpa/task',
              children: [
                {
                  id: 111,
                  resourceName: '任务列表',
                  path: '/rpa/task/list',
                  children: [],
                },
                {
                  id: 113, // 随便给个不重复的 ID
                  resourceName: '任务详情',
                  path: '/rpa/task/list/:taskCode',
                  children: [],
                },
                {
                  id: 112,
                  resourceName: '执行记录',
                  path: '/rpa/task/record',
                  children: [],
                },
              ],
            },
            {
              id: 12,
              resourceName: '机器人管理',
              path: '/rpa/robot',
              children: [
                {
                  id: 121,
                  resourceName: '机器人列表',
                  path: '/rpa/robot/list',
                  children: [],
                },
              ],
            },
            {
              id: 13,
              resourceName: '流程管理',
              path: '/rpa/process',
              children: [
                {
                  id: 131,
                  resourceName: '流程列表',
                  path: '/rpa/process/list',
                  children: [],
                },
              ],
            },
            {
              id: 14,
              resourceName: '数据管理',
              path: '/rpa/data',
              children: [
                {
                  id: 141,
                  resourceName: '数据采集',
                  path: '/rpa/data/collect',
                  children: [],
                },
                {
                  id: 142,
                  resourceName: '数据解析',
                  path: '/rpa/data/parse',
                  children: [],
                },
                {
                  id: 143,
                  resourceName: '数据加工',
                  path: '/rpa/data/process',
                  children: [],
                },
                {
                  id: 144,
                  resourceName: '数据查询',
                  path: '/rpa/data/query',
                  children: [],
                },
              ],
            },
          ],
        },
        // --- 系统管理模块 ---
        {
          id: 20,
          resourceName: '系统管理',
          path: '/sys',
          children: [
            {
              id: 21,
              resourceName: '系统管理目录',
              path: '/sys/manager',
              children: [
                {
                  id: 211,
                  resourceName: '个人信息',
                  path: '/sys/manager/information',
                  children: [],
                },
                {
                  id: 212,
                  resourceName: '用户管理',
                  path: '/sys/manager/userManage',
                  children: [],
                },
                {
                  id: 213,
                  resourceName: '角色管理',
                  path: '/sys/manager/roleManage',
                  children: [],
                },
                {
                  id: 214,
                  resourceName: '资源管理',
                  path: '/sys/manager/resourceManage',
                  children: [],
                },
              ],
            },
          ],
        },
      ],
    });
  },
};
