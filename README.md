# RPA 运营管理系统（前端）

基于 **Umi Max v4**（React 18 + Ant Design Pro）构建的 RPA 税务数据自动化运营管理平台前端。

## 技术栈

- React 18 + TypeScript
- Umi Max v4（路由、请求、权限）
- Ant Design Pro（UI 组件库）
- pnpm（包管理器）

## 快速开始

```bash
pnpm install
pnpm dev        # 启动开发服务器，/api 代理到 localhost:8080
pnpm build      # 生产构建
```

## 核心特性

### 真动态路由

后端下发 JSON 菜单树，前端运行时动态生成所有页面路由。非登录页无需在前端写死路由配置——新增页面只需在后端资源表里加一条记录即可生效。

### RBAC 双层权限

- **页面级**：后端只下发当前用户有权访问的菜单节点
- **按钮级**：`resourceType=2` 的按钮权限通过 `resourceCode` 字段控制，组件内用 `canButton(code)` 判断显隐

### JWT 认证

登录获取 Token，请求拦截器自动附加 `Authorization: Bearer` 头。401 响应自动清空 Token 并踢回登录页。

## 目录结构

```
src/
├── app.tsx                  # 运行时配置：动态路由、权限、请求拦截
├── access.ts                # 权限方法（canButton）
├── services/                # 按业务域拆分的 API 层
│   ├── Authentication/      # 登录、注册、退出
│   ├── RPA/                 # 数据采集、流程、机器人、任务
│   └── SYS/                 # 个人信息、用户、角色、资源
├── pages/                   # 页面组件
│   ├── Login/               # 登录页
│   ├── Home/                # 首页仪表盘
│   ├── RPA/                 # RPA 运营管理
│   └── SYS/                 # 系统管理
└── components/              # 共享组件
```

## 页面一览

| 模块       | 功能                                             |
| ---------- | ------------------------------------------------ |
| 登录       | 用户名密码登录，JWT 令牌                         |
| 首页       | 统计卡片、任务概览、快捷入口                     |
| 数据管理   | 采集数据 → 解析数据 → 加工数据 → 查询结果        |
| 流程管理   | 流程 CRUD、步骤编排（支持 Java/Groovy 代码片段） |
| 机器人管理 | 机器人注册、状态监控（在线/离线/工作中）         |
| 任务管理   | 任务 CRUD、执行调度、执行记录追踪                |
| 系统管理   | 用户管理、角色管理、资源（菜单）管理             |

## 关联仓库

- 后端：https://github.com/huangyuquan13/rpa-backend
- 爬虫代理：https://github.com/huangyuquan13/rpa-backend-proxy
