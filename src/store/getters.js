import moment from 'moment'
const getters = {
  getTags: state => {
    let LSTags = JSON.parse(localStorage.getItem('tags'))
    let tags = state.tags
    if (!state.tags.length && LSTags !== null) {
      tags = LSTags
    }
    if (tags.length === 0) { // todo: remove this clause
      tags = []
      const charcodeOffset = 'a'.charCodeAt(0)
      for (let i = 0; i < 2; i++) {
        const start = moment.duration(0).add(Math.round(Math.random() * (i + 1) * 6), 'seconds').valueOf()
        tags.push({
          start: start,
          end: start + 10000,
          id: Date.now() + String.fromCharCode(charcodeOffset + i)
        })
        console.log(tags[i])
      }
    }
    tags.sort((a, b) => a.start - b.start)
    localStorage.setItem('tags', JSON.stringify(tags))
    return tags
  },
  isNewTag: (state, tagId) => state.tags.findIndex(tag => tag.id === tagId) < 0
}

export default getters
