import * as types from './mutation-types'
import axios from 'axios'
const tagClipDuration = 10000
const pulseDuration = 2000
let pulseTimeout = null

const actions = {
  [types.SET_RECORDING]({commit, dispatch}, value) {
    const starting = value
    let promise
    if (starting) {
      promise = axios.put('/api/startRecording')
    } else {
      promise = axios.put('/api/stopRecording')
    }
    promise.then(function () {
      dispatch(types.SET_TAGS, [])
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
  [types.SET_TAGS]({state, commit}, value) {
    localStorage.setItem('tags', JSON.stringify(value))
    commit(types.SET_TAGS, value)
  },
  [types.POST_TAG]({commit}, tagId) {
    const newTag = {
      start: Date.now(),
      end: Date.now() + tagClipDuration,
      id: tagId
    }
    let LSTags = JSON.parse(localStorage.getItem('tags')) || []
    LSTags.push(newTag)
    localStorage.setItem('tags', JSON.stringify(LSTags))
    commit(types.POST_TAG, newTag)
  },
  [types.DELETE_TAG]({state, commit}, tagId) {
    const LSTags = JSON.parse(localStorage.getItem('tags')) || []
    LSTags.splice(LSTags.findIndex(tag => tag.id === tagId), 1)
    commit(types.DELETE_TAG, tagId)
  },
  [types.PUT_TAG]({commit}, update) {
    const LSTags = JSON.parse(localStorage.getItem('tags')) || []
    LSTags.splice(LSTags.findIndex(tag => tag.id === update.id), 1, update)
    localStorage.setItem('tags', JSON.stringify(LSTags))
    console.log('action LS tag', LSTags)
    commit(types.PUT_TAG, update)
  }

  // localStorage.setItem('access_token', response.data.token)
}

export default actions
