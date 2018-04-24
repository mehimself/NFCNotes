import path from 'path'
function RFIDReader(onTagDetected, onTagRemoved) {
  /*
   *  smoothes tag detection events
   *  implements tag removal detection
   *  calls tagHandler functions on tag detection and removal
   */
  function tagHasExpired(tagReadTimestamp) {
    const maxAge = scanInterval + 10
    return (new Date()).getTime() - maxAge > tagReadTimestamp
  }

  function triggerTagRemoved() {
    onTagRemoved(lastTagId)
    lastTagId = 0
    tagExpiresTimeout = null
    tagRemovedTimestamp = (new Date()).getTime()
  }

  function resetTagExpirationTimeout() {
    if (tagExpiresTimeout) {
      clearTimeout(tagExpiresTimeout)
    }
    tagReadTimestamp = (new Date()).getTime()
    tagExpiresTimeout = setTimeout(triggerTagRemoved, scanInterval)
  }

  const process = require('child_process')
  const RFIDFeed = process.spawn(
    'python',
    [
      path.join(__dirname, '/MFRC522-python/readOnce.py')
    ]
  )
  let lastTagId,
    tagExpiresTimeout = null,
    tagRemovedTimestamp = 0,
    tagRemovedCooloff = 600,
    scanInterval = 200,
    tagReadTimestamp = 0
  RFIDFeed.stdout.on('data', function (data) {
    let now = (new Date()).getTime()
    if (now - tagRemovedTimestamp > tagRemovedCooloff) {
      const tagId = data.toString().trim()
      const isSameTag = tagId === lastTagId
      const isNewTag = !isSameTag || tagHasExpired(tagReadTimestamp)
      if (isSameTag && !tagHasExpired(tagReadTimestamp)) {
        resetTagExpirationTimeout()
      }
      if (isNewTag) {
        onTagDetected(tagId)
        lastTagId = tagId
        resetTagExpirationTimeout()
      }
    }
  })
  RFIDFeed.stderr.on('data', function (data) {
    console.log('stderr: ' + data)
  })
  RFIDFeed.on('close', function (code) {
    console.log('child process exited with code ' + code)
  })
}

const http = require('http')
module.exports = function LoopTagHandler() {
  /*
   *  relays tag movement to server
   *  todo: set domain
   */
  const domain = 'http://139.59.136.193:3000'
  // todo: websocket for store synchronization https://www.npmjs.com/package/vue-native-websocket

  function onTagDetected(tagId) {
    console.log('tag read', tagId)
    openUrl(domain + '/loops/' + tagId)
  }

  function onTagRemoveDetected(tagId) {
    console.log('tag removed', tagId)
    openUrl(domain + '/removed/' + tagId)
  }

  const tagReader = new RFIDReader(onTagDetected, onTagRemoveDetected)
}
