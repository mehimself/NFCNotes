const getters = {
  getTags: state => {
    let LSTags = localStorage.getItem('tags')
    let tags = state.tags
    if (!state.tags.length && LSTags !== null) {
      tags = LSTags
    }
    if (tags.length === 0) { // todo: remove this clause
      console.warn('test tags')
      const starts = [
        Date.now() - Math.round(Math.random() * 1000000),
        Date.now() - Math.round(Math.random() * 1000000),
        Date.now() - Math.round(Math.random() * 1000000),
        Date.now() - Math.round(Math.random() * 1000000),
        Date.now() - Math.round(Math.random() * 1000000),
        Date.now() - Math.round(Math.random() * 1000000),
        Date.now() - Math.round(Math.random() * 1000000),
        Date.now() - Math.round(Math.random() * 1000000),
        Date.now() - Math.round(Math.random() * 1000000),
        Date.now() - Math.round(Math.random() * 1000000),
        Date.now() - Math.round(Math.random() * 1000000),
        Date.now() - Math.round(Math.random() * 1000000),
        Date.now() - Math.round(Math.random() * 1000000),
        Date.now() - Math.round(Math.random() * 1000000),
        Date.now() - Math.round(Math.random() * 1000000),
        Date.now() - Math.round(Math.random() * 1000000),
        Date.now() - Math.round(Math.random() * 1000000),
        Date.now() - Math.round(Math.random() * 1000000),
        Date.now() - Math.round(Math.random() * 1000000),
        Date.now() - Math.round(Math.random() * 1000000),
        Date.now() - Math.round(Math.random() * 1000000),
        Date.now() - Math.round(Math.random() * 1000000),
        Date.now() - Math.round(Math.random() * 1000000),
        Date.now() - Math.round(Math.random() * 1000000),
        Date.now() - Math.round(Math.random() * 1000000),
        Date.now() - Math.round(Math.random() * 1000000),
        Date.now() - Math.round(Math.random() * 1000000),
        Date.now() - Math.round(Math.random() * 1000000),
        Date.now() - Math.round(Math.random() * 1000000),
        Date.now() - Math.round(Math.random() * 1000000),
        Date.now() - Math.round(Math.random() * 1000000)
      ]
      tags = []
      const charcodeOffset = 'a'.charCodeAt(0)
      for (let i = 0; i < starts.length; i++) {
        tags.push({
          start: starts[i],
          end: starts[i] + Math.round(Math.random() * 60000),
          id: Date.now() + String.fromCharCode(charcodeOffset + i)
        })
      }
    }
    tags.sort((a, b) => a.start - b.start)
    return tags
  },
  isNewTag: (state, tagId) => state.tags.findIndex(tag => tag.id === tagId) < 0
}

export default getters
