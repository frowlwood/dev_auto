<template>
  <div class="login-content">
    <div style="height: 80vh">
    <Form ref="LoginForm" :model="LoginForm" :rules="ruleUserValidate">
      <FormItem prop="username">
        <Input type="text" v-model="LoginForm.username" size="large" placeholder="用户名"></Input>
      </FormItem>
      <FormItem prop="password">
        <Input type="password" v-model="LoginForm.password" size="large" placeholder="密码"></Input>
      </FormItem>
      <FormItem>
        <span>忘记密码？立即找回</span>
      </FormItem>
      <FormItem>
        <Button type="success" @click="login('LoginForm')" long size="large">登陆</Button>
      </FormItem>
    </Form>
    </div>
  </div>
</template>

<script>
  import {SERVER, setToken} from '../assets/axios'
  import router from '../router'
  // import store from '../store'

  export default {
    name: 'login',
    data () {
      return {
        LoginForm: {
          username: '',
          password: ''
        },
        ruleUserValidate: {
          username: [
            {required: true, message: '请输入用户名！', trigger: 'blur'}
          ],
          password: [
            {required: true, message: '请输入密码！', trigger: 'blur'}
            // {type: 'string', min: 6, message: '密码最小长度为6位！', trigger: 'blur'}
          ]
        }
      }
    },
    mounted: function () {
    },
    methods: {
      login (name) {
        let self = this
        self.$refs[name].validate((valid) => {
          if (valid) {
            let params = {
              'username': self.LoginForm.username,
              'password': self.LoginForm.password
            }
            SERVER.post('/base/login', params).then(function (response) {
              let resData = response.data
              if (resData.success === true) {
                let userDetails = resData.details
                let authToken = resData.token
                sessionStorage.setItem('user', JSON.stringify(userDetails))
                sessionStorage.setItem('token', authToken)
                setToken(authToken)
                router.push({name: 'MyTask'})
                console.log(resData)
              } else {
                self.$Message.error('登陆失败！')
              }
            })
          } else {
            this.$Message.error('请填写完整再提交！')
          }
        })
      }
    }
  }

</script>

<style scoped>
  .login-content {
    margin: auto;
    width: 300px;
    padding-top: 200px;
  }
</style>
