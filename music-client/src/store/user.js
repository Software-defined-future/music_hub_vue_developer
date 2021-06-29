const user = {
  state: {
    userId: '',
    username: '',
    avator: '',
    usedMemory: -1
  },
  getters: {
    userId: state => {
      let userId = state.userId
      if (!userId) {
        userId = JSON.parse(window.localStorage.getItem('userId') || null)
      }
      return userId
    },
    username: state => {
      let username = state.username
      if (!username) {
        username = JSON.parse(window.localStorage.getItem('username') || null)
      }
      return username
    },
    avator: state => {
      let avator = state.avator
      if (!avator) {
        avator = JSON.parse(window.localStorage.getItem('avator') || null)
      }
      return avator
    },
    usedMemory: state =>{
      let usedMemory = state.usedMemory
      if (usedMemory=== -1) {
        usedMemory = JSON.parse(window.localStorage.getItem('usedMemory') || -1)
      }
      return usedMemory
    }
  },
  mutations: {
    setUserId: (state, userId) => {
      state.userId = userId
      window.localStorage.setItem('userId', JSON.stringify(userId))
    },
    setUsername: (state, username) => {
      state.username = username
      window.localStorage.setItem('username', JSON.stringify(username))
    },
    setAvator: (state, avator) => {
      state.avator = avator
      window.localStorage.setItem('avator', JSON.stringify(avator))
    },
    setUsedMemory: (state,usedMemory) =>{
      state.usedMemory = usedMemory
      window.localStorage.setItem('usedMemory', JSON.stringify(usedMemory))
    }
  },
  actions: {}
}

export default user
