// mock/auth.ts
export default {
  'POST /api/v1/system/auth/login': (req: any, res: any) => {
    const { username, password } = req.body;
    console.log('收到登录请求:', username, password); // 可以在终端看到是否触发
    if (username === 'admin' && password === '123456') {
      res.send({
        code: 200,
        msg: '登录成功',
        // 多包一层 data，对齐你前端的 res.data.data
        data: {
          data: {
            token: 'eyJhbGciOiJIUzI1Ni...',
            expiresIn: 86400,
            userInfo: {
              id: 1,
              username: 'admin',
              nickname: '超级管理员',
              avatarUrl: '', // 故意给空，测试你的默认头像生成逻辑
              roleName: '管理员',
            },
          },
        },
      });
    } else {
      res.status(200).send({
        code: 401,
        msg: '用户名或密码错误',
        data: null,
      });
    }
  },
  'POST /api/v1/system/auth/logout': {
    code: 200,
    msg: '退出成功',
    data: null,
  },
  // 2. 注册接口 (新增：匹配文档返回)
  'POST /api/v1/system/auth/register': (req: any, res: any) => {
    res.send({
      code: 200,
      msg: '注册成功',
      data: {
        userId: 5,
        username: 'newuser2026',
      },
    });
  },
};
