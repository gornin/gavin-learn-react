人人都能读懂的 react 源码解析

react17

## React 设计理念

- 异步可中断

**cpu 的瓶颈问题**

react 15 慢在哪？怎么重构？

协调过程是同步的，对于单线程的 js 来说，更新耗时任务，就会卡顿

react 16 的解决方案：任务分解，更新能被中断，出让执行权，等将来重获执行权时接着执行，不过为什么是异步的呢？

> 同步与异步 阻塞与非阻塞

利用浏览器的空闲时间执行这些分解后的待更新任务，需要浏览器的调度，仿 requestIdleCallback

> requestIdleCallback 存在着浏览器的兼容性和触发不稳定的问题

Lane 用于细粒度的管理各个任务的优先级

React 16 三个概念：Fiber Scheduler Lane

- 代数效应 Algebraic Effects

**副作用的问题，运行应用时表现一致**

> 函数副作用是指当调用函数时，除了返回函数值之外，还对主调用函数产生附加的影响。

需要 react 有分离副作用的能力，解耦

async 有传染性

个人理解，副作用的问题即执行权的稳定可靠流转问题，可预期

暂停执行，交出执行权 -- 获取执行权，执行副作用 -- 得到结果交回执行权

## React 源码架构

以上帝视角看 React

`UI = fn(state)`

- Scheduler 调度器：排序优先级，让优先级高的任务先进行 reconcile
- Reconciler 协调器：找出哪些节点发生了改变，并打上不同的 flags
- Renderer 渲染器：将协调器打好标记的节点渲染到视图上

![](./imgs/**react源码3**.1.png)

- render 阶段发生在内存中，主要是 Scheduler、Reconciler 的工作
- commit 阶段主要是 Renderer 在工作

render 阶段：batchUpdates()
commit 阶段：commitRoot()

### JSX

babel 转化 jsx 的插件：`@babel/preset-react` ???

所有 jsx 本质上就是 React.createElement 的语法糖，React.createElement 方法返回 virtual-dom 对象，

Fiber 作为一种数据结构，一个任务单元，包含很多信息

- 节点的属性、类型、dom
- child、sibling、return
- updateQueue
- update
- sideEffects

### Fiber 双缓存

是指存在两颗 Fiber 树，`current Fiber`树描述了当前呈现的 dom 树，`workInProgress Fiber`是正在更新的 Fiber 树，这两颗 Fiber 树都是在内存中运行的，在 workInProgress Fiber 构建完成之后会将它作为 current Fiber 应用到 dom 上

> 在 mount 时（首次渲染），会根据 jsx 对象（Class Component 的 render 函数或者 Function Component 的返回值），构建 Fiber 对象，形成 Fiber 树，
> 然后这颗 Fiber 树会作为 current Fiber 应用到真实 dom 上，
> 在 update（状态更新时如 setState）的时候，会根据状态变更后的 jsx 对象和 current Fiber 做对比形成新的 workInProgress Fiber，
> 然后 workInProgress Fiber 切换成 current Fiber 应用到真实 dom 就达到了更新的目的，
> 而这一切都是在内存中发生的，从而减少了对 dom 的操作。

### scheduler

要实现异步可中断的更新，需要浏览器指定一个时间，如果没有时间剩余了就需要暂停任务。react17 中采用 MessageChannel 来实现，requestIdleCallback 存在兼容和触发不稳定的问题。

> 在 Scheduler 中的每的每个任务的优先级使用过期时间表示的，如果一个任务的过期时间离现在很近，说明它马上就要过期了，优先级很高，
> 如果过期时间很长，那它的优先级就低，没有过期的任务存放在 timerQueue 中，过期的任务存放在 taskQueue 中，
> timerQueue 和 taskQueue 都是小顶堆，所以 peek 取出来的都是离现在时间最近也就是优先级最高的那个任务，然后优先执行它。

### Lane 模型

更加细粒度的优先级表示方法，取代 expirationTime

> Lane 用二进制位表示优先级，二进制中的 1 表示位置，同一个二进制数可以有多个相同优先级的位，这就可以表示‘批’的概念，而且二进制方便计算

react 中就是抢优先级高的 Lane

react 中的饥饿问题，低优先级的任务如果被高优先级的任务一直打断，到了它的过期时间，它也会变成高优先级

Lane 的二进制位如下，1 的 bits 越多，优先级越低

### reconciler （render phase）

Reconciler 发生在 render 阶段，render 阶段会分别为节点执行 beginWork 和 completeWork，或者计算 state，对比节点的差异，为节点赋值相应的 effectFlags

> 在 mount 的时候会根据 jsx 生成 Fiber 对象，在 update 的时候会根据最新的 state 形成的 jsx 对象和 current Fiber 树对比构建 workInProgress Fiber 树，这个对比的过程就是 diff 算法。

> diff 算法发生在 render 阶段的 reconcileChildFibers 函数中，diff 算法分为单节点的 diff 和多节点的 diff（例如一个节点中包含多个子节点就属于多节点的 diff），
> 单节点会根据节点的 key 和 type，props 等来判断节点是复用还是直接新创建节点，
> 多节点 diff 会涉及节点的增删和节点位置的变化

reconcile 时会在这些 Fiber 上打上 Flags 标签，在 commit 阶段把这些标签应用到真实 dom 上

```js
//ReactFiberFlags.js
export const Placement = /*             */ 0b0000000000010;
export const Update = /*                */ 0b0000000000100;
export const PlacementAndUpdate = /*    */ 0b0000000000110;
export const Deletion = /*              */ 0b0000000001000;
```

completeWork 函数里形成一条 effectList 的链表，该链表是被标记了更新的节点形成的链表

深度优先遍历过程类似事件冒泡机制，一路向下，到底后冒泡向上，向下的过程一直在 beginWork，向上的过程是 completeWork

fiberRoot 是整个项目的根节点，只存在一个，rootFiber 是应用的根节点，可能存在多个

### renderer（commit phase）

commit 阶段遍历 effectList 执行对应的 dom 操作或部分生命周期，不同平台对应的 Renderer 不同

commit 阶段发生在 commitRoot 函数中，该函数主要遍历 effectList，分别用三个函数来处理 effectList 上的节点，这三个函数是 commitBeforeMutationEffects、commitMutationEffects、commitLayoutEffects

![react源码10.1.png](./imgs/react源码10.1.png)

### concurrent mode

一般浏览器的 fps 是 60Hz，也就是每 16.6ms 会刷新一次，而 `js 执行线程和 GUI 也就是浏览器的绘制是互斥的，因为 js 可以操作 dom，影响最后呈现的结果`，所以如果 js 执行的时间过长，会导致浏览器没时间绘制 dom，造成卡顿。
react17 会在每一帧分配一个时间（时间片）给 js 执行，如果在这个时间内 js 还没执行完，那就要暂停它的执行，等下一帧继续执行，把执行权交回给浏览器去绘制。

开启 concurrent mode 之后，构建 Fiber 的任务的执行不会一直处于阻塞状态，而是分成了一个个的 task

