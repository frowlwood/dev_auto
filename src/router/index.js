import Vue from 'vue'
import Router from 'vue-router'

import Index from '@/components/Index'
import MyTask from '@/components/task/MyTask'
import MyApproval from '@/components/task/MyApproval'
import TaskCalendar from '@/components/task/TaskCalendar'
import ApprovalTask from '@/components/task/ApprovalTask'
import Login from '@/components/Login'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      redirect: '/task/my'
    },
    {
      path: '/task',
      name: 'Index',
      component: Index,
      redirect: '/task/my',
      children: [
        {
          path: '/task/my',
          name: 'MyTask',
          component: MyTask
        },
        {
          path: '/task/approval',
          name: 'MyApproval',
          component: MyApproval
        },
        {
          path: '/task/approval/:task_id',
          name: 'ApprovalTask',
          component: ApprovalTask
        },
        {
          path: '/task/calendar',
          name: 'TaskCalendar',
          component: TaskCalendar
        }
      ]
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    }
  ]
})
