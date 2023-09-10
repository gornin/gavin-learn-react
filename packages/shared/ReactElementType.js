/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

export type Source = {|
  fileName: string,
  lineNumber: number,
|};

/*
 *在reconciler阶段, 会根据 type 执行不同的逻辑(在 fiber 构建阶段详细解读).
 *如 type 是一个字符串类型, 则直接使用.
 *如 type 是一个ReactComponent类型, 则会调用其 render 方法获取子节点.
 *如 type 是一个function类型,则会调用该方法获取子节点
 */
export type ReactElement = {|
  // 用于辨别ReactElement对象
  $$typeof: any,
  // 内部属性
  type: any, // 表明节点的种类，字符串、函数或 react 内部定义的节点类型 portal,context,fragment
  key: any, // 所有的ReactElement对象都有 key 属性，且其默认值是 null
  ref: any,
  props: any,
  // ReactFiber 记录创建本对象的Fiber节点, 还未与Fiber树关联之前, 该属性为null
  _owner: any,

  // __DEV__ dev环境下的一些额外信息, 如文件路径, 文件名, 行列信息等
  _store: {validated: boolean, ...},
  _self: React$Element<any>,
  _shadowChildren: any,
  _source: Source,
|};
