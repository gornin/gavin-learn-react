# React源码

[React源码调试](https://blog.csdn.net/weixin_47431743/article/details/121589419)

[React源码阅读-准备工作](https://juejin.cn/post/6984779312087957512)

[全网最全React源码调试傻瓜式教程](https://zhuanlan.zhihu.com/p/381634693)

`yarn config set electron_mirror https://npm.taobao.org/mirrors/electron/`

v17版本在yarn的时候，会请求electron v9.1.0版本，用taobao源安装时报错，因为淘宝没有这个版本。 https://registry.npmmirror.com/binary.html?path=electron/

切换为tencent源，同时node版本将为v14，可以正常安装。设置的ELECTRON_MIRROR需要删掉，`yarn config delete ELECTRON_MIRROR`

[yarn设置镜像和删除镜像](https://blog.csdn.net/duansamve/article/details/123121100)

React 工程目录的 packages 下包含 35 个包(@17.0.2版本)，其中与web开发相关的核心包共有 4 个, 以这 4 个包为线索进行展开, 深入理解 react 内部作用原理。

打包命令：

`yarn build react react-dom shared scheduler react-reconciler --type=NODE`

```
踩坑记录：Mac系统打包报错，关于java

报错内容：-- PLUGIN_ERROR (scripts/rollup/plugins/closure-plugin) --
Error: java -jar /Users/monkey/Project/React/React_project/React-source/react/node_modules/google-closure-compiler-java/compiler.jar

解决方案：java版本要对，java8 -> 52，java11 -> 55，react 18.3.0 要用java11

安装Java地址：https://www.java.com/zh-CN/
```

建立依赖连接
```bash
# 进入React这个包内部
$ cd build/node_modules/react
# 建立连接
$ yarn link
# cd 到原来的项目路径返回，为了下一次进入react-dom做准备
$ cd build/node_modules/react-dom
$ yarn link
```

连接项目和React库
```bash
# 删除刚刚建立的项目的node_modules中的react和react-dom
# 打开cra创建的React项目
$ yarn link react react-dom
```

修改react源码后，要重新运行打包命令
`yarn build react/index,react/jsx,react-dom/index,scheduler --type=NODE`

---

我们可以从函数调用栈入手，理清react的各个模块的功能和它们调用的顺序，盖房子一样，先搭好架子，对源码有个整体的认识，然后再看每个模块的细节，第一遍的时候切忌纠结每个函数实现的细节，陷入各个函数的深度调用中。

在源码的scheduler中使用了小顶堆 这种数据结构，调度的实现则使用了messageChannel，在render阶段的reconciler中则使用了fiber、update、链表 这些结构，lane模型使用了二进制掩码，diff算法怎样降低对比复杂度。

---

virtualDom 虚拟dom

js对象，真实dom的抽象，描述真实dom，包含一个个节点的关键信息；fiber树存放组件树信息，更新时增量渲染dom

大量的dom操作慢，耗费性能

提升性能，深度优先遍历，批量、异步、最小化更新，

跨平台，中间层，便于在操作真实dom前做处理，在不同环境下渲染

jsx --> ReactElement对象 --> 真实节点

如果组件是ClassComponent则type是class本身，如果组件是FunctionComponent创建的，则type是这个function，源码中用ClassComponent.prototype.isReactComponent来区别二者。注意class或者function创建的组件一定要首字母大写，不然后被当成普通节点，type就是字符串。

---

react启动的模式

react有3种模式进入主体函数的入口，我们可以从 react官方文档 使用 Concurrent 模式（实验性）中对比三种模式：

legacy 模式： `ReactDOM.render(<App />, rootNode)`。这是当前 React app 使用的方式。当前没有计划删除本模式，但是这个模式可能不支持这些新功能。

blocking 模式： `ReactDOM.createBlockingRoot(rootNode).render(<App />)`。目前正在实验中。作为迁移到 concurrent 模式的第一个步骤。

concurrent 模式： `ReactDOM.createRoot(rootNode).render(<App />)`。目前在实验中，未来稳定之后，打算作为 React 的默认开发模式。这个模式开启了所有的新功能。

---

react 运行的主干逻辑

- 输入: 将每一次更新(如: 新增, 删除, 修改节点之后)视为一次更新需求(目的是要更新DOM节点).

- 注册调度任务: react-reconciler收到更新需求之后, 并不会立即构造fiber树, 而是去调度中心scheduler注册一个新任务task, 即把更新需求转换成一个task.

- 执行调度任务(输出): 调度中心scheduler通过任务调度循环来执行task(task的执行过程又回到了react-reconciler包中).
    - fiber构造循环是task的实现环节之一, 循环完成之后会构造出最新的 fiber 树.
    - commitRoot是task的实现环节之二, 把最新的 fiber 树最终渲染到页面上, task完成.

---

react 16之前慢在哪里？

CPU瓶颈

之前的协调过程是同步的，stack reconciler，而js执行是单线程的，更新耗时任务时，就不能及时响应一些高优先级的任务，如用户交互等，造成页面卡顿。

如何解？将任务分割，让任务的执行能够被中断，设置优先级，有高优先级任务时能够让出执行权，执行完后再从之前中断的部分开始异步执行剩余的任务。 （异步 = 不阻塞）

三个概念：Fiber + Scheduler + Lane

IO瓶颈

代数效应，分离副作用，解耦，在不同设备性能和网络状况下，能够表现一致

---

Scheduler（调度器）：排序优先级，让优先级高的任务先进行reconcile

Reconciler（协调器）：找出哪些节点发生了改变，并打上不同的Flags（旧版本react叫Tag）

Renderer（渲染器）：将 Reconciler 中打好标签的节点渲染到视图上

---

jsx是js语言的扩展，react通过babel词法解析，将jsx转换成React.createElement，React.createElement方法返回virtual-dom对象（内存中用来描述dom节点的对象），所有jsx本质上就是React.createElement的语法糖，它能声明式的编写组件呈现出ui效果。

Fiber双缓存是指存在两棵Fiber树，current Fiber树描述了当前呈现的dom树，workInProgress Fiber是正在更新的Fiber树，这两棵Fiber树都是在内存中运行的，在workInProgress Fiber构建完成之后会将它作为current Fiber应用到dom上

以前版本的react，在Scheduler中的每个任务的优先级是使用`过期时间expirationTime`表示的，
如果一个任务的过期时间离现在很近，说明它马上就要过期了，优先级很高，
如果过期时间很长，那它的优先级就低，
没有过期的任务存放在timerQueue中，过期的任务存放在taskQueue中，timerQueue和timerQueue都是小顶堆，
所以peek取出来的都是离现在时间最近也就是优先级最高的那个任务，然后优先执行它。

更加细粒度的优先级表示方法Lane，Lane用二进制位表示优先级，二进制中的1表示位置，同一个二进制数可以有多个相同优先级的位，这就可以表示‘批’的概念，而且二进制方便计算。

饥饿问题，低优先级的任务如果被高优先级的任务一直打断，到了它的过期时间，它也会变成高优先级。

diff算法发生在render阶段的reconcileChildFibers函数中，diff算法分为单节点的diff和多节点的diff（例如一个节点中包含多个子节点就属于多节点的diff），单节点会根据节点的key和type，props等来判断节点是复用还是直接新创建节点，多节点diff会涉及节点的增删和节点位置的变化