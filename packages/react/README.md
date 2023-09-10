# `react`

React is a JavaScript library for creating user interfaces.

React是一个用于创建用户界面的JavaScript库。

The `react` package contains only the functionality necessary to define React components. It is typically used together with a React renderer like `react-dom` for the web, or `react-native` for the native environments.

“react”包只包含定义react组件所需的功能。它通常与React渲染器一起使用，比如针对web的“react-dom”，或者针对本地环境的“react-native”。

**Note:** by default, React will be in development mode. The development version includes extra warnings about common mistakes, whereas the production version includes extra performance optimizations and strips all error messages. Don't forget to use the [production build](https://reactjs.org/docs/optimizing-performance.html#use-the-production-build) when deploying your application.

**注意:** 默认情况下，React将处于开发模式。开发版本包括关于常见错误的额外警告，而生产版本包括额外的性能优化并删除所有错误消息。在部署应用程序时，不要忘记使用[生产构建](https://reactjs.org/docs/optimizing-performance.html#use-the-production-build)。

react 基础包, 只提供定义 react 组件(ReactElement)的必要函数, 一般来说需要和渲染器(react-dom,react-native)一同使用. 在编写react应用的代码时, 大部分都是调用此包的 api.

react包, 平时在开发过程中使用的绝大部分api均来自此包(不是所有). 在react启动之后, 正常可以改变渲染的基本操作有 3 个.

- class 组件中使用setState()
- function 组件里面使用 hook,并发起dispatchAction去改变 hook 对象
- 改变 context(其实也需要setState或dispatchAction的辅助才能改变)

以上setState和dispatchAction都由react包直接暴露. 所以要想 react 工作, 基本上是调用react包的 api 去与其他包进行交互.

## Example Usage

```js
var React = require('react');
```
