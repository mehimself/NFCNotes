import * as types from './mutation-types'
import axios from 'axios'

const tagClipDuration = 10000

const actions = {
  [types.START_RECORDING]({commit, dispatch}) {
    const tags = []
    commit(types.SET_TAGS, tags)
    axios.put('/api/startRecording').then(function () {
      dispatch(types.SET_TAGS, [])
      commit(types.START_RECORDING, Date.now())
    })
  },
  [types.STOP_RECORDING]({commit}) {
    axios.put('/api/stopRecording').then(function () {
      commit(types.STOP_RECORDING)
    })
  },
  [types.SET_TAGS]({state, commit}, value) {
    commit(types.SET_TAGS, value)
  },
  [types.SET_ACTIVETAG]({state, commit}, value) {
    commit(types.SET_ACTIVETAG, value)
    commit(types.SET_ACTIVETAGPULSE, value)
  },
  [types.POST_TAG]({commit}, tag) {
    commit(types.POST_TAG, tag)
  },
  [types.DELETE_TAG]({state, commit}, tagId) {
    const LSTags = JSON.parse(localStorage.getItem('tags')) || []
    LSTags.splice(LSTags.findIndex(tag => tag.id === tagId), 1)
    commit(types.DELETE_TAG, tagId)
  },
  [types.HANDLE_WS_TAGREAD]({state, commit, dispatch}, tagId) {
    let tag = state.tags.find(tag => tag.id === tagId)
    const isNewTag = !tag
    if (state.recording && isNewTag) {
      const startOffset = Date.now() - state.recording
      tag = {
        id: tagId,
        start: startOffset,
        end: startOffset + tagClipDuration,
        note: ''
      }
      commit(types.POST_TAG, tag)
    }
    commit(types.SET_ACTIVETAG, tag)
  },
  [types.HANDLE_WS_TAGREMOVED]({state, commit}) {
    commit(types.SET_ACTIVETAG, null)
  }
}

export default actions
