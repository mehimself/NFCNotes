const express = require('express')
const router = express.Router()
const loops = require('.loops')

router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' })
})

module.exports = router
