##RPA 项目遗留的问题 1.关于 Promise 对象方法的模糊 一直以为他的形式参数的 resolve 和失败的 reject 是固定的 结果是形参 得加深掌握之前复习过的 axios 和这里的 Promise 异步方法 (说实话我这里确实没有想到老师会提问 应该我其他的模块还是比较熟悉吧 这里的 3d 动画延迟确实没有看哈哈) 2.大脑的空白与提问的紧张 回过头来想 其实我的错误问题主要来自 原本以为老师是上周的时候一个一个来 然后轮到我 我将所用的项目都启动了 并且还知道怎么和他说部署 结果人太多了 上周没有轮到我 然后昨天再学 three.js 时候老师就突然过来 加上好久没有看项目结构啥的真的有些忘记了。。。 3.然后老师提问我拦截器的相关问题 这里我好像是通过了的 好像是说的请求时候获取浏览器中的 token 然后传递给后端获取相应的数据 响应拦截器就是后端返回数据到渲染之前 这里再判断一下数据的状态 好的才拿过来 然后他就提问

```js
// config.url 是当前请求的路径
const isLoginApi = config.url?.includes('/system/auth/login');

if (data?.code === 401) {
  if (isLoginApi) {
    // 如果是登录接口报 401，我们什么都不做，直接把 response 给页面
    // 页面上的 handleSubmit 会走到 else 逻辑，弹出“用户名或密码错误”
    return response;
  } else {
    // 如果是其他接口（比如个人信息、列表等）报 401，才是真正的 Token 失效
    message.error('登录已过期，请重新登录');
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
    history.replace('/login');
    // 这里可以返回一个 Promise.reject 防止页面继续执行后续逻辑
    return Promise.reject(data);
  }
}

//  2.处理其他非 200 的全局错误
// 不为200且不是登录界面 提示后端返回的错误 没有就默认请求失败
// 以后所有界面只用判断成功的情况
if (data?.code !== 200 && !isLoginApi) {
  message.error(data?.msg || '请求失败');
}

return response;
```

说是我这里逻辑可以优化一下 其实回想一下这里是没有错的啊 因为 401 是登录密码错误和 token 过期的意思 如果状态嘛是 401 是登录界面 直接放去给登录界面中判断 如果是 401 不是登录界面就提示这个已过期 然后他说我这里的 200 情况 因为是全局

```js
 if (res?.code === 200) {
        //存储token 拦截器用
        localStorage.setItem('token', res.data.data.token);
        // 必须转成字符串存储，因为 localStorage 只能存字符串
        localStorage.setItem(
          'userInfo',
          JSON.stringify(res.data.data.userInfo), //转字符串
        );
```

像其他界面就不用写这个了 其实我感觉这是双重保险嘛 但是老师说何必呢?? 4.就是权限分配的问题 比如这里

```
menu: {
      locale: false, //显示routers中name文本
      defaultOpenAll: true, //默认全部打开
      autoClose: false, //切换时候不收起
      //动态菜单
      request: async () => {
        const transformMenu = (list: any[]): any[] => {
          return list
            .filter(
              (item) => item.resourceType !== 2 && !item.path?.includes(':'),
            )
            .map((item) => ({
              name: item.resourceName,
              path: item.path,
              // icon: item.icon || undefined,
              routes: item.children ? transformMenu(item.children) : undefined,
            }));
        };

        // 用 initialState 里的
        return transformMenu(initialState?.menuData || []);
      },
```

他说我这个动态就多此一举了 不用这样来 request 直接 access 中配置然后再 umirc.ts 中配置就可以了 然后我说这里是为了渲染那个 3 级菜单才用的 并且之前问 ai 说是可以将 umirc.ts 这个文件不用写死 然后就可以这样来渲染 然后我和老师就在这里僵持 最后我没有改变什么 还是之前的写法 你要注意我的 umirc.ts 中是配置了这个 才能是 3 级渲染的界面 F:\Ayanjiusuo\react\rpa_check\src\components\BlankLayout\index.tsx 如果要修改这里的化 不要将其他功能修改坏了 5.最后就是这个的权限分配他说为什么我要将按钮拆开

```
  let authorizedPaths: string[] = []; // 定义一个装权限路径的空数组
    let buttonPermissions: string[] = []; //定义一个装按钮的资源编码 判断权限
    let menuData: any[] = []; //所有的菜单数据
    let buttonList: any[] = []; //按钮所有对象数据
```

然后我说是因为在角色界面中也就是 F:\Ayanjiusuo\react\rpa_check\src\pages\SYS\RoleManage\index.tsx 在分配权限的时候来回显角色的权限 后面老师有事我仔细研究了一遍 原来是之前我是暴力破解让按钮和菜单分开走 然后在这里的分配权限的界面中就将按钮全部破解开 然后后面老师来说不能然后这个界面中我就改了回去 没想到这里多写了。。。 6.我仔细思考了一下这里的的请求 token 啥的 请问先开始是登录的时候请求拦截器这里就不拦截 然后相应了数据里面有 token 然后以后的每个请求都得带 token?也就是请求拦截器和响应拦截器才会起作用?

7.最后我反思了一下老师面试的问题 说实话有些我确实没有理解老师的意思 然后我的思维太跳跃了 比如当时老师将那个编辑器界面中 F:\Ayanjiusuo\react\rpa_check\src\pages\RPA\Process\ProcessDesignModal.tsx 这个文件

```js
Editor
                        height="100%"
                        language="java" // 对应你的 Groovy/Java 需求
                        theme="vs-dark"
                        options={{ minimap: { enabled: false }, fontSize: 13 }} //禁止缩写小地图
                        //实时触发 更新codeContent数据
                        onChange={(value) => {
                          //获取由对象构成的数组 {stepName: "采集数据",stepType:"",codeContent:""}
                          const steps = form.getFieldValue('steps');
                          steps[name].codeContent = value;
                          //修改后整改最新数据
                          form.setFieldsValue({ steps });
                        }}
                        // 初始值加载
                        //表单数据.steps[name].codeContent数组取值
                        value={form.getFieldValue([
                          'steps',
                          name,
                          'codeContent',
                        ])}
```

他说我这里这个不支持 node 的语法 无法切换 然后我居然理解的是因为是用 grovy 来调用我 node 然后就不用切换呗 因为要么就全 java 要么就 java 掉用我的 node 不就是一样的嘛 然后就没有说了。。。

然后还是这个界面 他说这个也是一个亮点

```
 {(fields, { add, remove }) => (
```

这个编辑框的数据是怎么渲染的 如何实习你在这里输入后保存也加到后端的数据库中 这里我说对了

```js
 onChange={(value) => {
                          //获取由对象构成的数组 {stepName: "采集数据",stepType:"",codeContent:""}
                          const steps = form.getFieldValue('steps');
                          steps[name].codeContent = value;
                          //修改后整改最新数据
                          form.setFieldsValue({ steps });
                        }}
                        // 初始值加载
                        //表单数据.steps[name].codeContent数组取值
                        value={form.getFieldValue([
                          'steps',
                          name,
                          'codeContent',
                        ])}
```

8.然后老师问了全局变量的问题 以及 refresh 和 getinistate 以及更爱 这里我一遍过 后面老师喊我总结一下对于 ai 的看法 确实感觉最近发布的大模型太多了像 gpt5.5 gemini3.1pro 以及 claude 4.6 以及其他的 ai agent 助手 cursor codex 以及 antigravite 我当时都没有说 也没有让老师看我项目上线的的问题感觉可惜 也不可惜 我不想将我的这些技术暴露出来 我就说的 比起之前直接 cv 复制 我更加学会了让 ai 来代理干活啥的 哈哈 然后最小化代码啥的

9.总结这次的不足 大致上是我源码近期没有看 想不起来 但是看了就会想起来了 其实是我思维太跳跃了 (也不算跳跃是之前修改后没有将 app 那里的修改 然后忘记了) 幸好我录音了 然后总结确实比较厉害 请帮我修改一下 F:\Ayanjiusuo\react\rpa_check\src\app.tsx(权限分配) F:\Ayanjiusuo\react\rpa_check\src\pages\SYS\RoleManage\index.tsx(分配权限应该直接拿去后端返回的树结构 然后点击是获取当前行的角色的权限回显这个树结构中的菜单或者按钮 这里的化应该也是严格模式否则他选某个界面后没有按钮权限就直接点父级就勾选按钮了) 其他的问题我感觉都是小 bug 看你思路 如果要修改得给我说明
