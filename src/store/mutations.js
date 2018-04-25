import * as types from './mutation-types'

const mutations = {
  [types.SET_RECORDING](state, value) {
    state.recording = value
  },
  [types.SET_TAGREADPULSE](state, value) {
    state.tagReadPulse = value
  },
  [types.SET_TAGS](state, value) {
    state.tags = value
  },
  [types.DELETE_TAG](state, tagId) {
    state.tags.splice(state.tags.findIndex(tag => tag.id === tagId), 1)
  },
  [types.POST_TAG](state, value) {
    state.tags.push(value)
  },
  [types.PUT_TAG](state, update) {
    let tagIndex = state.tags.findIndex(tag => tag.id === update.id)
    state.tags[tagIndex] = update
  }
}

export default mutations
