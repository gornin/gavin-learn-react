# `scheduler`

This is a package for cooperative scheduling in a browser environment. It is currently used internally by React, but we plan to make it more generic.

The public API for this package is not yet finalized.

调度机制的核心实现, 控制由react-reconciler送入的回调函数的执行时机, 在concurrent模式下可以实现任务分片. 在编写react应用的代码时, 同样几乎不会直接用到此包提供的 api.

- 核心任务就是执行回调(回调函数由 react-reconciler 提供)
- 通过控制回调函数的执行时机, 来达到任务分片的目的, 实现可中断渲染(concurrent模式下才有此特性)

scheduler包, 核心职责只有 1 个, 就是执行回调.
- 把react-reconciler提供的回调函数, 包装到一个任务对象中.
- 在内部维护一个任务队列, 优先级高的排在最前面.
- 循环消费任务队列, 直到队列清空.

### Thanks

The React team thanks [Anton Podviaznikov](https://podviaznikov.com/) for donating the `scheduler` package name.
