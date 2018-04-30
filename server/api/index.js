const ARecord = require('../ARecord')
const express = require('express')
const router = express.Router()
const path = require('path')
const fs = require('fs')
const moment = require('moment')
const WebsocketManager = require('../WebSocketService')
const initRFIDReader = require('../NFCReader')
const ws = new WebsocketManager()

function onTagDetected(tagId) {
  const msg = {
    destination: 'review',
    subject: 'tagRead',
    payload: tagId
  }
  ws.send(JSON.stringify(msg))
}
function onTagRemoved(tagId) {
  const msg = {
    destination: 'review',
    subject: 'tagRemoved',
    payload: tagId
  }
  ws.send(JSON.stringify(msg))
}

initRFIDReader(onTagDetected, onTagRemoved)

router.get('/mostRecentRecordingName', function (req, res) {
  let mostrecentTimestamp = 0
  let mostRecentRecording
  const recordingsPath = path.join(__dirname, '../../public', 'recordings')
  const files = fs.readdirSync(recordingsPath)
  for (let i = 0; i < files.length; i++) {
    let file = files[i]
    if (file !== 'placeholder.wav') {
      let timestamp = moment(file, 'YYYY/MM/DD HH-mm-ss').valueOf()
      if (mostrecentTimestamp < timestamp) {
        mostrecentTimestamp = timestamp
        mostRecentRecording = file
      }
    }
  }
  res.send(mostRecentRecording)
})
router.put('/startRecording', function (req, res) {
  console.log('starting recording with arecord')
  // todo: uncomment next line
  ARecord.startRecording()
  res.end()
})
router.put('/stopRecording', function (req, res) {
  console.log('stopping recording with arecord')
  // todo: uncomment next line
  ARecord.stopRecording()
  res.end()
})

router.get('/debug/tagRead/:tagId', function (req, res) {
  onTagDetected(req.params.tagId)
  res.end()
})
router.get('/debug/tagRemoved/:tagId', function (req, res) {
  onTagRemoved(req.params.tagId)
  res.end()
})

module.exports = router
