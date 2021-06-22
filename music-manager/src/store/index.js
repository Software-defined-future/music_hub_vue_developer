const store = {
  state: {
    HOST: 'http://localhost:8888',
    isPlay: false,
    url: 'http://localhost:8888/song/《超级敏感》MV.mp3',
    id: ''
  },
  getters: {
    isPlay: state => state.isPlay,
    url: state => state.url,
    id: state => state.id
  },
  mutations: {
    setIsPlay: (state, isPlay) => { state.isPlay = isPlay },
    setUrl: (state, url) => { state.url = url },
    setId: (state, id) => { state.id = id }
  }
}

export default store
