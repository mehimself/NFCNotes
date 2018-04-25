import * as types from './mutation-types'
import axios from 'axios'
const tagClipDuration = 10000
const pulseDuration = 2000
let pulseTimeout = null

const actions = {
  [types.SET_RECORDING]({commit}, value) {
    const starting = value
    let promise
    if (starting) {
      promise = axios.put('/api/startRecording')
    } else {
      promise = axios.put('/api/stopRecording')
    }
    promise.then(function () {
      commit(types.SET_RECORDING, value)
    })
  },
  [types.SET_TAGREADPULSE]({commit}) {
    // create pulse
    if (pulseTimeout) {
      clearTimeout(pulseTimeout)
    }
    pulseTimeout = setTimeout(function () {
      commit(types.SET_TAGREADPULSE, false)
    }, pulseDuration)
    commit(types.SET_TAGREADPULSE, true)
  },
  [types.SET_TAGS]({state, commit}) {
    const LSTags = localStorage.getItem('tags')
    if (LSTags.length && !state.tags.length) {
      commit(types.SET_TAGS, LSTags)
    }
  },
  [types.POST_TAG]({commit}, tagId) {
    const newTag = {
      start: Date.now(),
      end: Date.now() + tagClipDuration,
      id: tagId
    }
    let LSTags = localStorage.getItem('tags') || []
    LSTags.push(newTag)
    localStorage.setItem('tags', LSTags)
    commit(types.POST_TAG, newTag)
  },
  [types.DELETE_TAG]({state, commit}, tagId) {
    const LSTags = localStorage.getItem('tags') || []
    LSTags.splice(LSTags.findIndex(tag => tag.id === tagId))
    commit(types.DELETE_TAG, tagId)
  }

  // localStorage.setItem('access_token', response.data.token)
}

export default actions
