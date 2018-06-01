import Vue from 'vue'
import Vuex from 'vuex'
import {userData} from './modules/user'
import {taskList} from './modules/task'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    userData,
    taskList
  }
})
