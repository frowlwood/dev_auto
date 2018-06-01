const taskList = {
  state: {
    taskList: [
      {
        taskName: '组员自己填写的第一个任务',
        project: 'project1',
        taskStatus: 0,
        completePercent: 1,
        startDate: '2016-12-24 09:30:00',
        expectedEndDate: '2016-12-27 18:30:00',
        degreeOfDifficulty: 2.5,
        taskType: '0',
        executor: '2',
        createUser: '2',
        leader: '1',
        priority: 'medium',
        id: 1
      },
      {
        taskName: '组长填写的组员的任务',
        project: 'project1',
        taskStatus: 0,
        completePercent: 1,
        startDate: '2016-12-24 09:30:00',
        expectedEndDate: '2016-12-27 18:30:00',
        degreeOfDifficulty: 2.5,
        taskType: '0',
        executor: '2',
        createUser: '1',
        leader: '1',
        priority: 'medium',
        id: 2
      },
      {
        taskName: '组长填写的组长的任务',
        project: 'project1',
        taskStatus: 0,
        completePercent: 1,
        startDate: '2016-12-24 09:30:00',
        expectedEndDate: '2016-12-27 18:30:00',
        degreeOfDifficulty: 2.5,
        taskType: '0',
        createUser: '1',
        executor: '1',
        leader: '1',
        priority: 'medium',
        id: 3
      }
    ],
    taskLog: {}
  },
  mutations: {
    addTask (state, taskDetails) {
      state.taskList.unshift(taskDetails)
    },
    updateTask (state, taskList) {
      state.taskList = taskList
    },
    generateTaskLog (state, taskId, taskLog) {
      if (taskId in state.taskLog) {
        state.taskLog[taskId].push(taskLog)
      } else {
        state.taskLog[taskId] = [taskLog]
      }
    }
  },
  actions: {},
  getters: {
    getTaskList: (state) => (uid) => {
      return state.taskList.filter(todo => todo.executor === uid || todo.createUser === uid || todo.leader === uid)
    },
    getApptovalList: (state) => (uid) => {
      return state.taskList.filter(todo => todo.leader === uid)
    },
    getApprovalDetails: (state) => (id) => {
      return state.taskList.find(todo => todo.id === id)
    },
    getTaskLogs: (state) => (taskId) => {
      return state.taskLog[taskId]
    }
  }
}
export {
  taskList
}
