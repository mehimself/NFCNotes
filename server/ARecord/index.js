const path = require('path')
const process = require('child_process')
const sudo = require('sudo')
let ARecord
module.exports = {
  startRecording: function () {
   ARecord = sudo(
      [
		'arecord',
        '--device=plughw:1,0',
        '-t',
        'wav',
        '-f',
        'cd',
        '--use-strftime',
		'./public/recordings/%Y-%m-%d %H-%M-%S.wav'
      ]
    )
    ARecord.stderr.on('data', function (data) {
      console.error('arecord error: ' + data)
    })
    ARecord.on('close', function (code) {
      if (code) {
        console.warn('arecord child process exited with code ' + code)
      } else {
        console.log('arecord child process exited with code ' + code)
      }
    })
    ARecord.stdin.pause() // todo: test: allow node to progress
  },
  stopRecording: function () {
	if (ARecord) {
		const killProcess = sudo([
		  'pkill',
		  '-f',
		  'arecord'
		])
	}
  }
}
