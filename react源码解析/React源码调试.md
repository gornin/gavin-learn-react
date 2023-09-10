[React 源码调试](https://blog.csdn.net/weixin_47431743/article/details/121589419)

[React 源码阅读 - 准备工作](https://juejin.cn/post/6984779312087957512)

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