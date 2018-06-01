const userData = {
  state: {
    userData: {}
  },
  mutations: {
    setUser (state, user) {
      state.userData = user
    },
    getUser (state) {
      return state.userData
    }
  },
  actions: {},
  getters: {
    // doneTodos: state => {
    //   return state.todos.filter(todo => todo.done)
    // }
  }
}
export {
  userData
}
