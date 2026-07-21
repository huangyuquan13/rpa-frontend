# RPA 运营管理系统（前端）

> 基于 Umi Max v4 + React 18 + Ant Design Pro 的企业级 RPA 自动化运营平台

[![React](https://img.shields.io/badge/React-18-blue?logo=react)](https://react.dev/)
[![Umi Max](https://img.shields.io/badge/Umi%20Max-4.x-orange)](https://umijs.org/)
[![Ant Design Pro](https://img.shields.io/badge/Ant%20Design%20Pro-5.x-blue?logo=ant-design)](https://pro.ant.design/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)](https://www.typescriptlang.org/)

---

## 📋 项目简介

这是一个面向金融机构的 **RPA（机器人流程自动化）税务数据自动化运营管理系统** 前端项目，支持任务调度、数据采集、解析、处理与查询等功能模块，覆盖从页面到按钮级的细粒度权限控制。

**核心亮点：**
- 🔐 **真动态路由**: 后端下发菜单树，前端运行时动态生成路由
- 🛡️ **RBAC 双层权限**: 页面级 + 按钮级细粒度权限控制
- 🎨 **Ant Design Pro**: 企业级中后台 UI 组件库
- 📊 **数据可视化**: 统计卡片、任务概览、执行记录追踪

---

## 🛠️ 技术栈

| 类别 | 技术 |
|------|------|
| **框架** | React 18 + Umi Max v4 |
| **UI 组件** | Ant Design 5 + Ant Design Pro Components |
| **语言** | TypeScript 5 |
| **状态管理** | Umi 内置 Model |
| **路由** | Umi 动态路由（后端下发） |
| **请求** | Umi Request（封装 JWT 拦截器） |
| **包管理** | pnpm |
| **代码规范** | ESLint + Stylelint + Prettier |

---

## ✨ 核心特性

### 1️⃣ 真动态路由

后端下发 JSON 菜单树，前端运行时动态生成所有页面路由。

**优势：**
- 非登录页无需在前端写死路由配置
- 新增页面只需在后端资源表里加一条记录即可生效
- 支持菜单层级嵌套、图标配置、排序

**实现原理：**
```typescript
// app.tsx
export async function render(oldRender: Function) {
  const menus = await fetchMenus(); // 获取后端菜单树
  extraRoutes = parseMenusToRoutes(menus); // 解析为路由对象
  oldRender();
}

export function patchClientRoutes({ routes }: any) {
  // 将动态路由注入到 Umi 路由系统
  routes[0].children = [...routes[0].children, ...extraRoutes];
}
```

### 2️⃣ RBAC 双层权限

**页面级权限：**
- 后端只下发当前用户有权访问的菜单节点
- 前端根据菜单树动态生成路由
- 无权限的页面直接 404

**按钮级权限：**
- `resourceType=2` 的按钮权限通过 `resourceCode` 字段控制
- 组件内用 `canButton(code)` 判断显隐

```typescript
// access.ts
export default function access(initialState: any) {
  const { buttonPermissions } = initialState;
  return {
    canButton: (code: string) => buttonPermissions.includes(code),
  };
}

// 页面中使用
{access.canButton('rpa:task:delete') && (
  <Button danger onClick={handleDelete}>删除</Button>
)}
```

### 3️⃣ JWT 认证

- 登录获取 Token，存储到 `localStorage`
- 请求拦截器自动附加 `Authorization: Bearer` 头
- 401 响应自动清空 Token 并踢回登录页

```typescript
// app.tsx
export const request: RequestConfig = {
  requestInterceptors: [
    (config: any) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
  ],
  responseInterceptors: [
    (response: any) => {
      if (response.status === 401) {
        localStorage.removeItem('token');
        history.push('/login');
      }
      return response;
    },
  ],
};
```

---

## 📁 目录结构

```
src/
├── app.tsx                  # 运行时配置：动态路由、权限、请求拦截
├── access.ts                # 权限方法（canButton）
├── services/                # 按业务域拆分的 API 层
│   ├── Authentication/      # 登录、注册、退出
│   ├── RPA/                 # 数据采集、流程、机器人、任务
│   │   ├── DataCollection/  # 数据采集 CRUD
│   │   ├── Processes/       # 流程定义 CRUD
│   │   ├── Robots/          # 机器人管理 CRUD
│   │   └── Tasks/           # 任务 CRUD + 执行
│   └── SYS/                 # 个人信息、用户、角色、资源
│       ├── Person/          # 个人信息、修改密码、动态菜单
│       ├── Resource/        # 资源管理
│       ├── Role/            # 角色管理
│       └── User/            # 用户管理 CRUD
├── pages/                   # 页面组件
│   ├── Login/               # 登录页（layout: false）
│   ├── Home/                # 首页仪表盘
│   ├── RPA/                 # RPA 运营管理
│   │   ├── Data/            # 数据采集/解析/处理/查询
│   │   ├── Process/         # 流程列表 + 流程设计弹窗
│   │   ├── Robot/           # 机器人列表
│   │   └── Task/            # 任务列表 + 详情子页
│   └── SYS/                 # 系统管理
├── components/              # 共享组件
│   ├── AuthButton/          # 权限按钮组件
│   ├── Loader/              # 加载组件
│   └── LoginBackground/     # 登录背景组件
└── models/                  # Umi 全局状态
```

---

## 🚀 快速开始

### 环境要求

- Node.js ≥ 16
- pnpm ≥ 8

### 安装依赖

```bash
pnpm install
```

### 开发环境

```bash
pnpm dev
```

访问 http://localhost:8000

**默认账号：** `admin` / `123456`

### 生产构建

```bash
pnpm build
```

### 代码格式化

```bash
pnpm format
```

---

## 📊 页面一览

| 模块 | 功能 | 路径 |
|------|------|------|
| **登录** | 用户名密码登录，JWT 令牌 | `/login` |
| **首页** | 统计卡片、任务概览、快捷入口 | `/home` |
| **数据管理** | 采集数据 → 解析数据 → 加工数据 → 查询结果 | `/rpa/data/*` |
| **流程管理** | 流程 CRUD、步骤编排（支持 Java/Groovy 代码片段） | `/rpa/process/list` |
| **机器人管理** | 机器人注册、状态监控（在线/离线/工作中） | `/rpa/robot/list` |
| **任务管理** | 任务 CRUD、执行调度、执行记录追踪 | `/rpa/task/list` |
| **系统管理** | 用户管理、角色管理、资源（菜单）管理 | `/sys/*` |

---

## 🔗 关联仓库

- **后端**: [rpa-backend](https://github.com/huangyuquan13/rpa-backend) - Spring Boot + MyBatis + MySQL
- **爬虫代理**: [rpa-backend-proxy](https://github.com/huangyuquan13/rpa-backend-proxy) - Node.js + Express + Playwright

---

## 🎯 技术难点与解决方案

### 1. 动态路由与权限的结合

**问题：** 动态路由需要根据用户权限动态生成，但 Umi 的路由是静态配置的。

**解决方案：**
- 在 `render()` 生命周期中请求菜单树
- 使用 `patchClientRoutes()` 动态注入路由
- 过滤掉按钮权限节点（`resourceType === 2`）

### 2. 按钮级权限控制

**问题：** 同一个页面，不同角色看到的按钮不同。

**解决方案：**
- 后端下发扁平化的按钮权限数组
- 前端封装 `canButton(code)` 方法
- 使用 `<AuthButton>` 组件统一控制按钮显隐

### 3. 401 统一处理

**问题：** Token 过期后，所有请求都会返回 401，需要统一跳转登录页。

**解决方案：**
- 响应拦截器捕获 401 状态码
- 清空 localStorage 中的 token
- 使用 `history.push('/login')` 跳转登录页

---

## 📝 开发规范

### API 层

每个 service 函数调用 `request()`，GET 用 `params`，POST/PUT 用 `data`。

```typescript
export async function getTaskList(params: any) {
  return request('/api/v1/system/tasks', {
    method: 'GET',
    params,
  });
}
```

### 页面层

重度使用 `@ant-design/pro-components`：

- `ProTable` - 表格（自带分页、搜索、valueEnum 状态标签渲染）
- `ModalForm` - 弹窗表单
- `ProFormText` / `ProFormSelect` - 表单项

### 环境切换

通过 `process.env.NODE_ENV === 'production'` 区分：

- 本地：空 baseURL，走 proxy
- 生产：railway.app 直连

---

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 开源协议

[MIT](LICENSE)

---

**如果这个项目对你有帮助，欢迎 ⭐ Star！**
