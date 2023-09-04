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