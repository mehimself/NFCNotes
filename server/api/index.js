const ARecord = require('../ARecord')
const express = require('express')
const router = express.Router()
const path = require('path')
const fs = require('fs')
const moment = require('moment')

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
  console.log('starting recording')
  // ARecord.startRecording()
  res.end()
})
router.put('/stopRecording', function (req, res) {
  console.log('stopping recording')
  // ARecord.stopRecording()
  res.end()
})

module.exports = router
