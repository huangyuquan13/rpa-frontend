// export default {
//   // 2.1 分页查询用户列表
//   'GET /api/v1/system/users': (req: any, res: any) => {
//     // 获取 URL 上的查询参数 前端向后端request的
//     const { username, pageNum = 1, pageSize = 10 } = req.query;

//     res.send({
//       code: 200,
//       msg: 'success',
//       data: {
//         total: 3, // 总记录数
//         pages: 1, // 总页数
//         size: Number(pageSize),
//         current: Number(pageNum),
//         records: [
//           {
//             id: 1,
//             username: 'zmy',
//             nickname: '郑明月',
//             email: '342@qq.com',
//             phone: '189996136565',
//             roleName: '管理员',
//             status: 1,
//             createTime: '2026-03-16T21:11:55',
//           },
//           {
//             id: 2,
//             username: 'admin',
//             nickname: '系统管理员',
//             email: 'admin@rpa.com',
//             phone: '13800138000',
//             roleName: '管理员',
//             status: 1,
//             createTime: '2026-03-16T21:09:34',
//           },
//           {
//             id: 3,
//             username: 'user01',
//             nickname: '测试用户',
//             email: 'test@rpa.com',
//             phone: '13500000000',
//             roleName: '普通用户',
//             status: 0, // 模拟禁用状态
//             createTime: '2026-03-20T10:00:00',
//           },
//         ],
//       },
//     });
//   },

//   // 2.2 获取用户详情 (通过 ID 查询)
//   'GET /api/v1/system/users/:id': (req: any, res: any) => {
//     res.send({
//       code: 200,
//       msg: 'success',
//       data: {
//         id: req.params.id, // 动态获取路径中的 ID
//         username: 'admin',
//         nickname: '系统管理员',
//         email: 'admin@rpa.com',
//         phone: '13800138000',
//         avatarUrl: null,
//         status: 1,
//         roleName: '管理员',
//         createTime: '2026-03-16T21:09:34',
//       },
//     });
//   },
//   //2.3 创建新用户 POST
//   'POST /api/v1/system/users': (req: any, res: any) => {
//     const { username } = req.body;
//     console.log('正在创建新用户:', username);
//     res.send({
//       code: 200,
//       msg: '用户创建成功',
//       data: { id: Math.floor(Math.random() * 1000) }, // 模拟生成 ID
//     });
//   },
//   //2.4修改用户信息 PUT (路径参数 ID)
//   'PUT /api/v1/system/users/:id': (req: any, res: any) => {
//     const { id } = req.params;
//     console.log(`正在修改 ID 为 ${id} 的用户信息`, req.body);

//     res.send({
//       code: 200,
//       msg: '更新成功',
//       data: null,
//     });
//   },
//   //2.5重置用户密码 PUT
//   'PUT /api/v1/system/users/:id/reset-password': (req: any, res: any) => {
//     const { id } = req.params;
//     console.log(`正在重置 ID 为 ${id} 的用户密码为 123456`);
//     res.send({
//       code: 200,
//       msg: '重置成功',
//       data: null,
//     });
//   },
//   //2.6 删除用户 DELETE
//   'DELETE /api/v1/system/users/:id': (req: any, res: any) => {
//     const { id } = req.params;
//     console.log(`正在删除 ID 为 ${id} 的用户`);
//     res.send({
//       code: 200,
//       msg: '删除成功',
//       data: null,
//     });
//   },

//   // 2.7 修改用户状态 POST
//   'POST /api/v1/system/users/:id/status': (req: any, res: any) => {
//     const { id } = req.params;
//     console.log(`正在切换 ID 为 ${id} 的用户状态`);
//     res.send({
//       code: 200,
//       msg: '状态更新成功',
//       data: null,
//     });
//   },
// };
