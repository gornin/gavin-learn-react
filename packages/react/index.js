/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

// Keep in sync with https://github.com/facebook/flow/blob/master/lib/react.js
export type StatelessFunctionalComponent<
  P,
> = React$StatelessFunctionalComponent<P>;
export type ComponentType<-P> = React$ComponentType<P>;
export type AbstractComponent<
  -Config,
  +Instance = mixed,
> = React$AbstractComponent<Config, Instance>;
export type ElementType = React$ElementType;
export type Element<+C> = React$Element<C>;
export type Key = React$Key;
export type Ref<C> = React$Ref<C>;
export type Node = React$Node;
export type Context<T> = React$Context<T>;
export type Portal = React$Portal;
export type ElementProps<C> = React$ElementProps<C>;
export type ElementConfig<C> = React$ElementConfig<C>;
export type ElementRef<C> = React$ElementRef<C>;
export type Config<Props, DefaultProps> = React$Config<Props, DefaultProps>;
export type ChildrenArray<+T> = $ReadOnlyArray<ChildrenArray<T>> | T;
export type Interaction = {
  name: string,
  timestamp: number,
  ...
};

// Export all exports so that they're available in tests.
// We can't use export * from in Flow for some reason.
export {
  Children,
  createRef,
  Component,
  PureComponent,
  createContext,
  forwardRef,
  lazy,
  memo,
  useCallback,
  useContext,
  useEffect,
  useImperativeHandle, // 极重要的，必要的；命令的，强制的；祈使的
  useDebugValue,
  useLayoutEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
  useMutableSource,
  useMutableSource as unstable_useMutableSource, // 不稳定的
  createMutableSource,
  createMutableSource as unstable_createMutableSource,
  Fragment,
  Profiler,
  unstable_DebugTracingMode,
  StrictMode,
  Suspense,
  createElement,
  cloneElement,
  isValidElement,
  version,
  __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,
  createFactory,
  useTransition,
  useTransition as unstable_useTransition,
  startTransition, // 可以让你的UI在一次花费高的状态转变中始终保持响应性
  startTransition as unstable_startTransition,
  useDeferredValue, // 可以让你延迟屏幕上不那么重要的部分的更新
  useDeferredValue as unstable_useDeferredValue,
  SuspenseList, // 可以让你控制loading状态指示器（比如转圈圈）的出现顺序
  SuspenseList as unstable_SuspenseList,
  block,
  block as unstable_block,
  unstable_LegacyHidden,
  unstable_createFundamental,
  unstable_Scope,
  unstable_useOpaqueIdentifier,
} from './src/React';
