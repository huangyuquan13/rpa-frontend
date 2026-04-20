// export default {
//   // 4.1 查询资源列表（支持树形结构）
//   'GET /api/v1/system/resources': (req: any, res: any) => {
//     const { tree = 'false' } = req.query;

//     const baseResources = [
//       {
//         id: 10,
//         parentId: 0,
//         resourceName: '系统管理',
//         resourceCode: 'SYS_MANAGE',
//         resourceType: 1, // 1: 菜单
//         path: '/sys',
//         icon: 'Setting',
//         sortOrder: 1,
//         status: 1,
//         children: [
//           {
//             id: 11,
//             parentId: 10,
//             resourceName: '个人信息',
//             resourceCode: 'PERSON_INFO',
//             resourceType: 1,
//             path: '/sys/manager/information',
//             icon: 'User',
//             sortOrder: 1,
//             status: 1,
//             children: [],
//           },
//           {
//             id: 12,
//             parentId: 10,
//             resourceName: '用户管理',
//             resourceCode: 'USER_MANAGE',
//             resourceType: 1,
//             path: '/sys/manager/userManage',
//             icon: 'Team',
//             sortOrder: 2,
//             status: 1,
//             children: [],
//           },
//           {
//             id: 13,
//             parentId: 10,
//             resourceName: '角色管理',
//             resourceCode: 'ROLE_MANAGE',
//             resourceType: 1,
//             path: '/sys/manager/roleManage',
//             icon: 'Solution',
//             sortOrder: 3,
//             status: 1,
//             children: [
//               // 🌟 虽然菜单看不见，但按钮权限依然定义在这里，供“角色授权”时勾选
//               {
//                 id: 121,
//                 parentId: 12,
//                 resourceName: '新增用户',
//                 resourceCode: 'USER_ADD',
//                 resourceType: 2,
//                 path: null,
//                 icon: null,
//                 sortOrder: 1,
//                 status: 1,
//                 children: [],
//               },
//             ],
//           },
//           {
//             id: 14,
//             parentId: 10,
//             resourceName: '资源管理',
//             resourceCode: 'RESOURCE_MANAGE',
//             resourceType: 1,
//             path: '/sys/manager/resourceManage',
//             icon: 'Bars',
//             sortOrder: 4,
//             status: 1,
//             children: [],
//           },
//         ],
//       },
//     ];

//     res.send({
//       code: 200,
//       msg: 'success',
//       data:
//         tree === 'true'
//           ? baseResources
//           : baseResources.flatMap((item) => [item, ...item.children]),
//     });
//   },

//   // 4.2 新增资源
//   'POST /api/v1/system/resources': (req: any, res: any) => {
//     const { resourceCode, resourceName, resourceType, parentId } = req.body;
//     console.log('新增资源:', {
//       resourceCode,
//       resourceName,
//       resourceType,
//       parentId,
//     });

//     res.send({
//       code: 200,
//       msg: '资源创建成功',
//       data: {
//         id: Math.floor(Math.random() * 1000) + 10, // 模拟生成新ID
//       },
//     });
//   },

//   // 4.3 编辑资源
//   'PUT /api/v1/system/resources/:id': (req: any, res: any) => {
//     const { id } = req.params;
//     const { resourceName, resourceCode, path, icon } = req.body;
//     console.log(`修改ID为${id}的资源:`, {
//       resourceName,
//       resourceCode,
//       path,
//       icon,
//     });

//     res.send({
//       code: 200,
//       msg: '更新成功',
//       data: null,
//     });
//   },

//   // 4.4 删除资源
//   'DELETE /api/v1/system/resources/:id': (req: any, res: any) => {
//     const { id } = req.params;
//     console.log(`删除ID为${id}的资源`);

//     res.send({
//       code: 200,
//       msg: '删除成功（若有子资源或被角色引用可能返回警告）',
//       data: null,
//     });
//   },
// };
