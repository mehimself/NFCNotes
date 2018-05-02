const getters = {
  getTags: state => {
    let tags = state.tags
    localStorage.setItem('tags', JSON.stringify(tags))
    return tags
  }
}

export default getters
