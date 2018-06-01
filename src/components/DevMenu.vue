<template>
  <div class="menu-content">
    <div class="menu-logo">
      <div>
        <Dropdown placement="bottom" :transfer='true' @on-click="onUserIconClick" style="margin-left: 20px">
          <Avatar type="ghost" :style="{background: userAvatarColor}">{{user.userData.full_name ||
            user.userData.username}}
          </Avatar>
          <DropdownMenu slot="list">
            <DropdownItem>用户操作1</DropdownItem>
            <DropdownItem>用户操作2</DropdownItem>
            <DropdownItem>用户操作3</DropdownItem>
            <DropdownItem divided name="loginout">退出登陆</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    </div>
    <Menu theme="light" :active-name="activeName" :open-names="openName">
      <Submenu name="task">
        <template slot="title">
          <Icon type="ios-paper"></Icon>
          任务
        </template>
        <router-link to="/task/my">
          <MenuItem name="MyTask">我的任务</MenuItem>
        </router-link>
        <router-link to="/task/approval">
          <MenuItem name="MyApproval">我的审批</MenuItem>
        </router-link>
        <router-link to="/task/calendar">
          <MenuItem name="TaskCalendar">任务日历</MenuItem>
        </router-link>
      </Submenu>
      <Submenu name="projects">
        <template slot="title">
          <Icon type="ios-people"></Icon>
          项目
        </template>
        <MenuItem name="project-1">项目1</MenuItem>
        <MenuItem name="project-2">项目2</MenuItem>
      </Submenu>
      <Submenu name="manage">
        <template slot="title">
          <Icon type="stats-bars"></Icon>
          项目管理
        </template>
        <MenuItem name="3-1">新增和启动</MenuItem>
        <MenuItem name="3-2">活跃分析</MenuItem>
        <MenuItem name="3-3">时段分析</MenuItem>
      </Submenu>
    </Menu>
  </div>
</template>

<script>
  import {mapState} from 'vuex'
  import store from '../store'
  import router from '../router'
  import {setToken} from '../assets/axios'

  export default {
    name: 'DevMenu',
    data () {
      return {
        // activeName: 'task-my',
        openName: ['task', 'projects', 'manage'],
        userAvatarColor: '#ffbf00',
        projects: [
          {'name': '项目1', 'alias': 'project1', 'url': ''}
        ]
      }
    },
    computed: {
      ...mapState({
        user: state => state.userData
      }),
      activeName () {
        let routeName = this['$route'].name
        return routeName
      }
    },
    created: function () {
      let self = this
      let vxUser = self.user.userData.id
      try {
        let userStr = sessionStorage.getItem('user')
        let user = JSON.parse(userStr)
        if (user === null || user === undefined) {
          router.push({name: 'Login'})
        } else if (!vxUser) {
          let token = sessionStorage.getItem('token')
          setToken(token)
          store.commit('setUser', user)
        }
      } catch (err) {
        router.push({name: 'Login'})
      }
    },
    mounted: function () {
    },
    methods: {
      onUserIconClick (name) {
        let self = this
        if (name === 'loginout') {
          self.loginOut()
        }
      },
      loginOut () {
        sessionStorage.clear()
        store.commit('setUser', {})
        router.push({name: 'Login'})
      }
    }
  }
</script>

<style scoped>
  a {
    color: #4A505E;
  }

  .menu-content {
    width: 240px;
    border-right: 1px solid #DDDDDD;
  }

  .menu-logo {
    width: 100%;
    height: 80px;
    border-bottom: 1px solid #DDDDDD;
    padding-left: 25px;
    font-size: 20px;
    line-height: 80px;
  }

  .user-avatar-content {
    width: 20px;
  }
</style>
