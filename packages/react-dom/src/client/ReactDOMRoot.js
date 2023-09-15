/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

import type {Container} from './ReactDOMHostConfig';
import type {RootTag} from 'react-reconciler/src/ReactRootTags';
import type {MutableSource, ReactNodeList} from 'shared/ReactTypes';
import type {FiberRoot} from 'react-reconciler/src/ReactInternalTypes';

export type RootType = {
  render(children: ReactNodeList): void,
  unmount(): void,
  _internalRoot: FiberRoot,
  ...
};

export type RootOptions = {
  hydrate?: boolean,
  hydrationOptions?: {
    onHydrated?: (suspenseNode: Comment) => void,
    onDeleted?: (suspenseNode: Comment) => void,
    mutableSources?: Array<MutableSource<any>>,
    ...
  },
  ...
};

import {
  isContainerMarkedAsRoot,
  markContainerAsRoot,
  unmarkContainerAsRoot,
} from './ReactDOMComponentTree';
import {listenToAllSupportedEvents} from '../events/DOMPluginEventSystem';
import {eagerlyTrapReplayableEvents} from '../events/ReactDOMEventReplaying';
import {
  ELEMENT_NODE,
  COMMENT_NODE,
  DOCUMENT_NODE,
  DOCUMENT_FRAGMENT_NODE,
} from '../shared/HTMLNodeType';
import {ensureListeningTo} from './ReactDOMComponent';

import {
  createContainer,
  updateContainer,
  findHostInstanceWithNoPortals,
  registerMutableSourceForHydration,
} from 'react-reconciler/src/ReactFiberReconciler';
import invariant from 'shared/invariant';
import {enableEagerRootListeners} from 'shared/ReactFeatureFlags';
import {
  BlockingRoot,
  ConcurrentRoot,
  LegacyRoot,
} from 'react-reconciler/src/ReactRootTags';

function ReactDOMRoot(container: Container, options: void | RootOptions) {
  this._internalRoot = createRootImpl(container, ConcurrentRoot, options);
}

function ReactDOMBlockingRoot(
  container: Container,
  tag: RootTag,
  options: void | RootOptions,
) {
  /* ------------------------------------------------------------ 宇 */
  // TODO: 2023-09-09 17:29:05
  function getRandColor(opacity = 1) {
    function rand(base = 256) {
      return Math.floor(Math.random() * base);
    }
    return `rgba(${rand()},${rand()},${rand()},${opacity || 1})`;
  }
  // typedown current function name 'ReactDOMBlockingRoot'
  // eslint-disable-next-line react-internal/no-production-logging
  console.log(
    '%c=> packages/react-dom/src/client/ReactDOMRoot.js/ReactDOMBlockingRoot',
    `color:${getRandColor()};font-size:16px;padding:4px 8px;`,
  );
  /* ------------------------------------------------------------ 昂 */

  this._internalRoot = createRootImpl(container, tag, options);
}

ReactDOMRoot.prototype.render = ReactDOMBlockingRoot.prototype.render = function(
  children: ReactNodeList,
): void {
  const root = this._internalRoot;
  if (__DEV__) {
    if (typeof arguments[1] === 'function') {
      console.error(
        'render(...): does not support the second callback argument. ' +
          'To execute a side effect after rendering, declare it in a component body with useEffect().',
      );
    }
    const container = root.containerInfo;

    if (container.nodeType !== COMMENT_NODE) {
      const hostInstance = findHostInstanceWithNoPortals(root.current);
      if (hostInstance) {
        if (hostInstance.parentNode !== container) {
          console.error(
            'render(...): It looks like the React-rendered content of the ' +
              'root container was removed without using React. This is not ' +
              'supported and will cause errors. Instead, call ' +
              "root.unmount() to empty a root's container.",
          );
        }
      }
    }
  }
  updateContainer(children, root, null, null);
};

ReactDOMRoot.prototype.unmount = ReactDOMBlockingRoot.prototype.unmount = function(): void {
  if (__DEV__) {
    if (typeof arguments[0] === 'function') {
      console.error(
        'unmount(...): does not support a callback argument. ' +
          'To execute a side effect after rendering, declare it in a component body with useEffect().',
      );
    }
  }
  const root = this._internalRoot;
  const container = root.containerInfo;
  updateContainer(null, root, null, () => {
    unmarkContainerAsRoot(container);
  });
};

function createRootImpl(
  container: Container,
  tag: RootTag,
  options: void | RootOptions,
) {
  /* ------------------------------------------------------------ 宇 */
  // TODO: 2023-09-09 17:29:53
  function getRandColor(opacity = 1) {
    function rand(base = 256) {
      return Math.floor(Math.random() * base);
    }
    return `rgba(${rand()},${rand()},${rand()},${opacity || 1})`;
  }
  // typedown current function name 'createRootImpl'
  // eslint-disable-next-line react-internal/no-production-logging
  console.log(
    '%c=> packages/react-dom/src/client/ReactDOMRoot.js/createRootImpl',
    `color:${getRandColor()};font-size:16px;padding:4px 8px;`,
  );
  /* ------------------------------------------------------------ 昂 */

  // Tag is either LegacyRoot or Concurrent Root
  const hydrate = options != null && options.hydrate === true;
  const hydrationCallbacks =
    (options != null && options.hydrationOptions) || null;
  const mutableSources =
    (options != null &&
      options.hydrationOptions != null &&
      options.hydrationOptions.mutableSources) ||
    null;
  const root = createContainer(container, tag, hydrate, hydrationCallbacks);
  markContainerAsRoot(root.current, container);
  const containerNodeType = container.nodeType;

  // listenToAllSupportedEvents函数, 实际上完成了事件代理
  if (enableEagerRootListeners) {
    const rootContainerElement =
      container.nodeType === COMMENT_NODE ? container.parentNode : container;
    listenToAllSupportedEvents(rootContainerElement);
  } else {
    if (hydrate && tag !== LegacyRoot) {
      const doc =
        containerNodeType === DOCUMENT_NODE
          ? container
          : container.ownerDocument;
      // We need to cast this because Flow doesn't work
      // with the hoisted containerNodeType. If we inline
      // it, then Flow doesn't complain. We intentionally
      // hoist it to reduce code-size.
      eagerlyTrapReplayableEvents(container, ((doc: any): Document));
    } else if (
      containerNodeType !== DOCUMENT_FRAGMENT_NODE &&
      containerNodeType !== DOCUMENT_NODE
    ) {
      ensureListeningTo(container, 'onMouseEnter', null);
    }
  }

  if (mutableSources) {
    for (let i = 0; i < mutableSources.length; i++) {
      const mutableSource = mutableSources[i];
      registerMutableSourceForHydration(root, mutableSource);
    }
  }

  return root;
}

// concurrent 模式： ReactDOM.createRoot(rootNode).render(<App />)
// 目前在实验中，未来稳定之后，打算作为 React 的默认开发模式。这个模式开启了所有的新功能。
export function createRoot(
  container: Container,
  options?: RootOptions,
): RootType {
  invariant(
    isValidContainer(container),
    'createRoot(...): Target container is not a DOM element.',
  );
  warnIfReactDOMContainerInDEV(container);
  return new ReactDOMRoot(container, options);
}

// blocking 模式： ReactDOM.createBlockingRoot(rootNode).render(<App />)
// 目前正在实验中。作为迁移到 concurrent 模式的第一个步骤。
export function createBlockingRoot(
  container: Container,
  options?: RootOptions,
): RootType {
  invariant(
    isValidContainer(container),
    'createRoot(...): Target container is not a DOM element.',
  );
  warnIfReactDOMContainerInDEV(container);
  return new ReactDOMBlockingRoot(container, BlockingRoot, options);
}

/**
 * 这是当前 React app 使用的方式。当前没有计划删除本模式，但是这个模式可能不支持这些新功能。
 * legacy 模式在合成事件中有自动批处理的功能，但仅限于一个浏览器任务。
 * 非 React 事件想使用这个功能必须使用 unstable_batchedUpdates。
 * 在 blocking 模式和 concurrent 模式下，所有的 setState 在默认情况下都是批处理的。
 *
 * @param {*} container
 * @param {*} options
 * @returns
 */
export function createLegacyRoot(
  container: Container,
  options?: RootOptions,
): RootType {
  /* ------------------------------------------------------------ 宇 */
  // TODO: 2023-09-09 17:28:35
  function getRandColor(opacity = 1) {
    function rand(base = 256) {
      return Math.floor(Math.random() * base);
    }
    return `rgba(${rand()},${rand()},${rand()},${opacity || 1})`;
  }
  // typedown current function name 'createLegacyRoot'
  // eslint-disable-next-line react-internal/no-production-logging
  console.log(
    '%c=> packages/react-dom/src/client/ReactDOMRoot.js/createLegacyRoot',
    `color:${getRandColor()};font-size:16px;padding:4px 8px;`,
  );
  /* ------------------------------------------------------------ 昂 */

  return new ReactDOMBlockingRoot(container, LegacyRoot, options);
}

export function isValidContainer(node: mixed): boolean {
  return !!(
    node &&
    (node.nodeType === ELEMENT_NODE ||
      node.nodeType === DOCUMENT_NODE ||
      node.nodeType === DOCUMENT_FRAGMENT_NODE ||
      (node.nodeType === COMMENT_NODE &&
        (node: any).nodeValue === ' react-mount-point-unstable '))
  );
}

function warnIfReactDOMContainerInDEV(container) {
  if (__DEV__) {
    if (
      container.nodeType === ELEMENT_NODE &&
      ((container: any): Element).tagName &&
      ((container: any): Element).tagName.toUpperCase() === 'BODY'
    ) {
      console.error(
        'createRoot(): Creating roots directly with document.body is ' +
          'discouraged, since its children are often manipulated by third-party ' +
          'scripts and browser extensions. This may lead to subtle ' +
          'reconciliation issues. Try using a container element created ' +
          'for your app.',
      );
    }
    if (isContainerMarkedAsRoot(container)) {
      if (container._reactRootContainer) {
        console.error(
          'You are calling ReactDOM.createRoot() on a container that was previously ' +
            'passed to ReactDOM.render(). This is not supported.',
        );
      } else {
        console.error(
          'You are calling ReactDOM.createRoot() on a container that ' +
            'has already been passed to createRoot() before. Instead, call ' +
            'root.render() on the existing root instead if you want to update it.',
        );
      }
    }
  }
}
