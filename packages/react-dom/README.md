# `react-dom`

This package serves as the entry point to the DOM and server renderers for React. It is intended to be paired with the generic React package, which is shipped as `react` to npm.

react 渲染器之一, 是 react 与 web 平台连接的桥梁(可以在浏览器和 nodejs 环境中使用), 将react-reconciler中的运行结果输出到 web 界面上. 在编写react应用的代码时,大多数场景下, 能用到此包的就是一个入口函数ReactDOM.render(<App/>, document.getElementById('root')), 其余使用的 api, 基本是react包提供的.

react-dom包, 有 2 个核心职责:
- 引导react应用的启动(通过ReactDOM.render).
- 实现HostConfig协议(源码在 ReactDOMHostConfig.js 中), 能够将react-reconciler包构造出来的fiber树表现出来, 生成 dom 节点(浏览器中), 生成字符串(ssr).

## Installation

```sh
npm install react react-dom
```

## Usage

### In the browser

```js
var React = require('react');
var ReactDOM = require('react-dom');

class MyComponent extends React.Component {
  render() {
    return <div>Hello World</div>;
  }
}

ReactDOM.render(<MyComponent />, node);
```

### On the server

```js
var React = require('react');
var ReactDOMServer = require('react-dom/server');

class MyComponent extends React.Component {
  render() {
    return <div>Hello World</div>;
  }
}

ReactDOMServer.renderToString(<MyComponent />);
```

## API

### `react-dom`

- `findDOMNode`
- `render`
- `unmountComponentAtNode`

### `react-dom/server`

- `renderToString`
- `renderToStaticMarkup`
