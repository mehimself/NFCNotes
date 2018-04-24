import * as types from './mutation-types'
import axios from 'axios'

const pulseDuration = 2000
let pulseTimeout = null

const actions = {
  countIncrement({commit}) {
    commit(types.COUNT_INCREMENT)
  },
  countDecrement({commit}) {
    commit(types.COUNT_DECREMENT)
  },
  [types.SET_RECORDING]({commit}, value) {
    const starting = value
    let promise
    if (starting) {
      promise = axios.put('/startRecording')
    } else {
      promise = axios.put('/stopRecording')
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
  }
  // localStorage.setItem('access_token', response.data.token)
}

export default actions
