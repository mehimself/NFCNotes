const getters = {
  getCount: state => state.count,
  isNewTag: (state, tagId) => state.tags.findIndex(tag => tag.id === tagId) < 0
}

export default getters
