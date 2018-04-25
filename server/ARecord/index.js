const path = require('path')
const process = require('child_process')

let ARecord
module.exports = {
  startRecording: function () {
    let ARecord = process.spawn(
      'arecord',
      [
        '-t',
        'wav',
        '-f',
        'dat',
        '--max-file-time',
        '7200',
        '--use-strftime',
        path.join(__dirname, 'public/recordings/%Y/%m/%d-%H-%M-%v.wav')
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
    ARecord.kill()
  }
}
