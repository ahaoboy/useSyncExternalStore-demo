import { useSyncExternalStore } from "react"

type StoreOption<S, A extends Record<string, (state: S, payload: any) => S>> = {
  state: S
  reducers: {
    [k in keyof A]: A[k] extends (state: S, payload: infer P) => any
      ? (state: S, payload: P) => S
      : A[k]
  }
}

type Result<S, A extends Record<string, (state: S, payload: any) => S>> = {
  state: S
} & {
  // action: A;
} & {
  dispatch: {
    [k in keyof A]: A[k] extends (state: S, payload: infer P) => S
      ? (payload: P) => S
      : any
  }
} & {
  subscribe: (onStoreChange: () => void) => () => void
  getSnapshot: () => S
}
export function defineStore<
  A extends Record<string, (state: S, payload: any) => S>,
  S,
>(store: StoreOption<S, A>) {
  let state = store.state

  const notifyListeners = new Set<() => void>()

  const subscribeListener = (cb: () => void) => {
    notifyListeners.add(cb)
    console.log('subscribeListener',notifyListeners.size)
    // console.log("subscribe", cb, notifyListeners)
    return () => {
      // console.log("unsubscribe", cb, notifyListeners)
      console.log('delete',notifyListeners.size)
      notifyListeners.delete(cb)
    }
  }

  const storeListeners = new Set<(state: S) => void>()

  const notify = () => {
    for (const i of notifyListeners) {
      i()
    }

    // for (const i of storeListeners) {
    //   i(state)
    // }
  }

  const subscribe = (cb: (s: S) => void) => {
    storeListeners.add(cb)
  }

  const getSnapshot = () => {
    return state
  }

  const dispatch = {} as Result<S, StoreOption<S, A>["reducers"]>["dispatch"]
  function useStore() {
    return useSyncExternalStore(subscribeListener, getSnapshot)
  }

  for (const i in store.reducers) {
    // @ts-ignore
    dispatch[i] = (payload: any) => {
      // console.log("====payload1", i, JSON.stringify(state), payload)
      state = store.reducers[i](state, payload)
      // console.log("====payload2", i, JSON.stringify(state), payload)
      notify()
    }
  }

  function useSelector<R>(cb: (s: S) => R): R {
    return cb(useStore())
  }

  function setStore(s: S) {
    state = s
  }
  return {
    dispatch,
    useStore,
    getSnapshot,
    subscribe,
    useSelector,
    setStore,
  }
}
