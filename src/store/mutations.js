import * as types from './mutation-types'

const mutations = {
  [types.COUNT_INCREMENT](state) {
    state.count += 1
  },
  [types.COUNT_DECREMENT](state) {
    state.count -= 1
  },
  [types.SET_RECORDING](state, value) {
    state.recording = value
  }
}

export default mutations
