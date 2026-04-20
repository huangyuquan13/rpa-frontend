// export default {
//   // 3.1 分页查询角色列表（包含权限列表）
//   'GET /api/v1/system/roles': (req: any, res: any) => {
//     const { roleName, roleCode, pageNum = 1, pageSize = 10 } = req.query;

//     res.send({
//       code: 200,
//       msg: 'success',
//       data: {
//         total: 2,
//         pages: 1,
//         size: Number(pageSize),
//         current: Number(pageNum),
//         records: [
//           {
//             id: 1,
//             roleCode: 'ADMIN',
//             roleName: '系统管理员',
//             description: '拥有所有权限',
//             status: 1,
//             userCount: 2,
//             permissions: [
//               { id: 1, resourceName: '首页' },
//               { id: 2, resourceName: '系统管理' },
//               { id: 3, resourceName: '用户管理' },
//             ],
//             createTime: '2026-03-16T21:09:34',
//           },
//           {
//             id: 2,
//             roleCode: 'USER',
//             roleName: '普通用户',
//             description: '仅拥有查看权限',
//             status: 1,
//             userCount: 15,
//             permissions: [{ id: 1, resourceName: '首页' }],
//             createTime: '2026-03-18T10:00:00',
//           },
//         ],
//       },
//     });
//   },

//   // 3.1.1 查询指定角色的权限列表
//   'GET /api/v1/system/roles/:id/permissions': (req: any, res: any) => {
//     const { id } = req.params;
//     const rolePermissions: Record<string, any[]> = {
//       '1': [
//         { id: 1, resourceName: '首页' },
//         { id: 2, resourceName: '系统管理' },
//         { id: 3, resourceName: '用户管理' },
//         { id: 4, resourceName: '角色管理' },
//       ],
//       '2': [
//         { id: 1, resourceName: '首页' },
//         { id: 10, resourceName: '个人中心' },
//       ],
//     };
//     const data = rolePermissions[id] || rolePermissions['2'];

//     res.send({
//       code: 200,
//       msg: 'success',
//       data: data,
//     });
//   },

//   // 3.2 创建新角色
//   'POST /api/v1/system/roles': (req: any, res: any) => {
//     const { roleName, roleCode } = req.body;
//     console.log('正在创建新角色:', roleName, `(${roleCode})`);

//     res.send({
//       code: 200,
//       msg: '角色创建成功',
//       data: {
//         id: Math.floor(Math.random() * 1000) + 10,
//       },
//     });
//   },

//   // 3.3 修改角色基本信息
//   'PUT /api/v1/system/roles/:id': (req: any, res: any) => {
//     const { id } = req.params;
//     const { roleName, roleCode } = req.body;

//     console.log(`正在修改 ID 为 ${id} 的角色信息:`, roleName, `(${roleCode})`);

//     res.send({
//       code: 200,
//       msg: '修改成功',
//       data: null,
//     });
//   },

//   // 3.4 角色权限分配
//   'POST /api/v1/system/roles/:id/permissions': (req: any, res: any) => {
//     const { id } = req.params;
//     const { resourceIds } = req.body;

//     console.log(`为角色 ${id} 分配权限，资源ID列表:`, resourceIds);

//     res.send({
//       code: 200,
//       msg: '分配成功',
//       data: null,
//     });
//   },

//   // 3.5 删除角色
//   'DELETE /api/v1/system/roles/:id': (req: any, res: any) => {
//     const { id } = req.params;
//     console.log(`删除 ID 为 ${id} 的角色`);

//     res.send({
//       code: 200,
//       msg: '删除成功（若有用户绑定可能提示警告）',
//       data: null,
//     });
//   },

//   // 3.6 获取资源信息
//   'GET /api/v1/system/roles/resources': (req: any, res: any) => {
//     res.send({
//       code: 200,
//       msg: null,
//       data: [
//         {
//           id: 1,
//           resourceCode: 'HOME',
//           resourceName: '首页',
//           resourceType: 1,
//           parentId: 0,
//           path: '/home',
//           icon: 'Home',
//           sortOrder: 1,
//           status: 1,
//           children: [],
//         },
//         {
//           id: 2,
//           resourceCode: 'SYSTEM_MANAGE',
//           resourceName: '系统管理',
//           resourceType: 1,
//           parentId: 0,
//           path: '/system',
//           icon: 'Setting',
//           sortOrder: 2,
//           status: 1,
//           children: [
//             {
//               id: 3,
//               resourceCode: 'USER_MANAGE',
//               resourceName: '用户管理',
//               resourceType: 1,
//               parentId: 2,
//               path: '/system/users',
//               icon: 'User',
//               sortOrder: 1,
//               status: 1,
//               children: [],
//             },
//           ],
//         },
//       ],
//     });
//   },
// };
