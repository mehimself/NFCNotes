import path from 'path'
import process from 'child_process'

let ARecord
function startRecording() {
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
  ARecord.stdin.pause() // todo: test: allow node to progress
}
function endRecording() {
  ARecord.kill()
}
ARecord.stderr.on('data', function (data) {
  console.error('arecord error: ' + data)
})
ARecord.on('close', function (code) {
  console.log('arecord child process exited with code ' + code);
});
export const startRecording
export const stopRecording
