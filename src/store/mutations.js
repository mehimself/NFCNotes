import * as types from './mutation-types'

let pulseResetTimeout = null
const pulseDuration = 2000

const mutations = {
  [types.START_RECORDING](state, value) {
    state.recording = value
  },
  [types.STOP_RECORDING](state) {
    state.recording = false
  },
  [types.SETACTIVETAGPULSE](state, value) {
    if (pulseResetTimeout) {
      clearTimeout(pulseResetTimeout)
    }
    if (value) {
      pulseResetTimeout = setTimeout( // auto-off after pulseDuration
        mutations[types.SET_ACTIVETAGPULSE],
        pulseDuration,
        false)
    }
    state.activeTagPulse = value
  },
  [types.SET_ACTIVETAG](state, value) {
    state.activeTag = value
  },
  [types.SET_TAGS](state, value) {
    state.tags = value
    state.tags.sort((a, b) => a.start - b.start)
    localStorage.setItem('tags', JSON.stringify(state.tags))
  },
  [types.DELETE_TAG](state, tagId) {
    state.tags.splice(state.tags.findIndex(tag => tag.id === tagId), 1)
    localStorage.setItem('tags', JSON.stringify(state.tags))
  },
  [types.POST_TAG](state, value) {
    console.log(state.tags[0])
    state.tags.push(value)
    state.tags.sort((a, b) => a.start - b.start)
    localStorage.setItem('tags', JSON.stringify(state.tags))
    console.log(state.tags[0])
  },
  [types.PUT_ACTIVETAG](state, update) {
    if (update.start !== undefined) state.activeTag.start = update.start
    if (update.end !== undefined) state.activeTag.end = update.end
    if (update.note !== undefined) state.activeTag.note = update.note
    state.tags.sort((a, b) => a.start - b.start)
    localStorage.setItem('tags', JSON.stringify(state.tags))
  },
  SOCKET_ONOPEN(state, event) {
    state.socket.isConnected = true
  },
  SOCKET_ONCLOSE(state, event) {
    state.socket.isConnected = false
  },
  SOCKET_ONERROR(state, event) {
    console.error(state, event)
  },
  SOCKET_ONMESSAGE(state, message) {
    state.message = message
  },
  SOCKET_RECONNECT(state, count) {
    console.info(state, count)
  },
  SOCKET_RECONNECT_ERROR(state) {
    state.socket.reconnectError = true
  }
}

export default mutations
