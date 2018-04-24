import {startRecording, stopRecording} from '../ARecord'
const express = require('express')
const router = express.Router()

router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' })
})

router.put('/startRecording', function (req, res) {
  startRecording()
  res.end()
})
router.put('/stopRecording', function (req, res) {
  stopRecording()
  res.end()
})


module.exports = router
