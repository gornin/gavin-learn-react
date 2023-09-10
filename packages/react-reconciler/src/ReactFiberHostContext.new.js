/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

import type {Fiber} from './ReactInternalTypes';
import type {StackCursor} from './ReactFiberStack.new';
import type {Container, HostContext} from './ReactFiberHostConfig';

import invariant from 'shared/invariant';

import {getChildHostContext, getRootHostContext} from './ReactFiberHostConfig';
import {createCursor, push, pop} from './ReactFiberStack.new';

declare class NoContextT {}
const NO_CONTEXT: NoContextT = ({}: any);

const contextStackCursor: StackCursor<HostContext | NoContextT> = createCursor(
  NO_CONTEXT,
);
const contextFiberStackCursor: StackCursor<Fiber | NoContextT> = createCursor(
  NO_CONTEXT,
);
const rootInstanceStackCursor: StackCursor<
  Container | NoContextT,
> = createCursor(NO_CONTEXT);

function requiredContext<Value>(c: Value | NoContextT): Value {
  invariant(
    c !== NO_CONTEXT,
    'Expected host context to exist. This error is likely caused by a bug ' +
      'in React. Please file an issue.',
  );
  return (c: any);
}

function getRootHostContainer(): Container {
  const rootInstance = requiredContext(rootInstanceStackCursor.current);
  return rootInstance;
}

function pushHostContainer(fiber: Fiber, nextRootInstance: Container) {
  /* ------------------------------------------------------------ 宇 */
  // TODO: 2023-09-10 14:44:27
  function getRandColor(opacity = 1) {
    function rand(base = 256) {
      return Math.floor(Math.random() * base);
    }
    return `rgba(${rand()},${rand()},${rand()},${opacity||1})`;
  }
  // typedown current function name 'pushHostContainer'
  // eslint-disable-next-line react-internal/no-production-logging
  console.log('%c=> packages/react-reconciler/src/ReactFiberHostContext.new.js/pushHostContainer',`color:${getRandColor()};font-size:16px;padding:4px 8px;`)
  // eslint-disable-next-line react-internal/no-production-logging
  console.log('');
  /* ------------------------------------------------------------ 昂 */
  
  // Push current root instance onto the stack;
  // This allows us to reset root when portals are popped.
  push(rootInstanceStackCursor, nextRootInstance, fiber);
  // Track the context and the Fiber that provided it.
  // This enables us to pop only Fibers that provide unique contexts.
  push(contextFiberStackCursor, fiber, fiber);

  // Finally, we need to push the host context to the stack.
  // However, we can't just call getRootHostContext() and push it because
  // we'd have a different number of entries on the stack depending on
  // whether getRootHostContext() throws somewhere in renderer code or not.
  // So we push an empty value first. This lets us safely unwind on errors.
  push(contextStackCursor, NO_CONTEXT, fiber);
  const nextRootContext = getRootHostContext(nextRootInstance);
  // Now that we know this function doesn't throw, replace it.
  pop(contextStackCursor, fiber);
  push(contextStackCursor, nextRootContext, fiber);
}

function popHostContainer(fiber: Fiber) {
  pop(contextStackCursor, fiber);
  pop(contextFiberStackCursor, fiber);
  pop(rootInstanceStackCursor, fiber);
}

function getHostContext(): HostContext {
  const context = requiredContext(contextStackCursor.current);
  return context;
}

function pushHostContext(fiber: Fiber): void {
  /* ------------------------------------------------------------ 宇 */
  // TODO: 2023-09-10 14:50:59
  function getRandColor(opacity = 1) {
    function rand(base = 256) {
      return Math.floor(Math.random() * base);
    }
    return `rgba(${rand()},${rand()},${rand()},${opacity||1})`;
  }
  // typedown current function name 'pushHostContext'
  // eslint-disable-next-line react-internal/no-production-logging
  console.log('%c=> packages/react-reconciler/src/ReactFiberHostContext.new.js/pushHostContext',`color:${getRandColor()};font-size:16px;padding:4px 8px;`)
  // eslint-disable-next-line react-internal/no-production-logging
  console.log('');
  /* ------------------------------------------------------------ 昂 */
  
  const rootInstance: Container = requiredContext(
    rootInstanceStackCursor.current,
  );
  const context: HostContext = requiredContext(contextStackCursor.current);
  const nextContext = getChildHostContext(context, fiber.type, rootInstance);

  // Don't push this Fiber's context unless it's unique.
  if (context === nextContext) {
    return;
  }

  // Track the context and the Fiber that provided it.
  // This enables us to pop only Fibers that provide unique contexts.
  push(contextFiberStackCursor, fiber, fiber);
  push(contextStackCursor, nextContext, fiber);
}

function popHostContext(fiber: Fiber): void {
  // Do not pop unless this Fiber provided the current context.
  // pushHostContext() only pushes Fibers that provide unique contexts.
  if (contextFiberStackCursor.current !== fiber) {
    return;
  }

  pop(contextStackCursor, fiber);
  pop(contextFiberStackCursor, fiber);
}

export {
  getHostContext,
  getRootHostContainer,
  popHostContainer,
  popHostContext,
  pushHostContainer,
  pushHostContext,
};
