import * as types from './mutation-types'

const actions = {
  countIncrement({commit}) {
    commit(types.COUNT_INCREMENT)
  },
  countDecrement({commit}) {
    commit(types.COUNT_DECREMENT)
  },
  [types.SET_RECORDING]({commit, value}) {
    commit(types.SET_RECORDING, value)
  }
  // localStorage.setItem('access_token', response.data.token)
}

export default actions
