const ARecord = require('../ARecord')
const express = require('express')
const router = express.Router()

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
