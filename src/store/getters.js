import moment from 'moment'
const getters = {
  getTags: state => {
    let tags = state.tags
    /* if (tags.length === 0) { // todo: remove this clause
      tags = []
      const charcodeOffset = 'a'.charCodeAt(0)
      for (let i = 0; i < 24; i++) {
        const start = moment.duration(0).add(Math.round(Math.random() * (i + 1) * 6), 'seconds').valueOf()
        tags.push({
          start: start,
          end: start + 10000,
          id: Date.now() + String.fromCharCode(charcodeOffset + i)
        })
      }
    } */
    localStorage.setItem('tags', JSON.stringify(tags))
    return tags
  },
  isNewTag: (state, tagId) => state.tags.findIndex(tag => tag.id === tagId) < 0,
  getTag: (state, tagId) => {
    let LSTags = JSON.parse(localStorage.getItem('tags'))
    let tag = state.tags.find(tag => tag.id === tagId)
    if (!state.tags.length && LSTags !== null) {
      tag = LSTags.find(tag => tag.id === tagId)
    }
    return tag
  }
}

export default getters
