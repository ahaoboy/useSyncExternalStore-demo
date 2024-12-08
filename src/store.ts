import { defineStore } from "./easy-store";

type State = {
  count: number
}
const initState: State = {
  count: 1
}
const store = defineStore({
  state: initState,
  reducers: {
    inc(state: State, n: number) {
      return {
        count: state.count + n
      }
    }
  }
})

export const { useStore, useSelector, dispatch } = store