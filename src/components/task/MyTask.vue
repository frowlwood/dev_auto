<template>
  <div class="my-task-content">
    <!--我的任务页面顶部bar-->
    <div class="task-top-bar-content">
      <span>
      <Icon type="speedometer" size="16"></Icon>
        我的任务
      </span>
      <div class="task-bar-order-content">
        <Dropdown trigger="click" @on-click="orderClick" style="margin-left: 20px">
          <a href="javascript:void(0)">
            {{ selectOrder.value }}
            <Icon type="arrow-down-b"></Icon>
          </a>
          <DropdownMenu slot="list">
            <DropdownItem name="priority">按优先级</DropdownItem>
            <DropdownItem name="end_date">按截止日期</DropdownItem>
            <DropdownItem name="write_date">按更新时间</DropdownItem>
            <DropdownItem name="project">按项目</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    </div>
    <!--我的任务页面下部内容页面-->
    <div class="task-body-content">
      <div class="task-add-name-content">
        <div class="task-add-input-content">
          <!--输入框-->
          <input type="text" v-on:keydown="saveTaskName($event)" class="task-add-input"
                 v-model="task.name" placeholder="添加新任务，按回车键（Enter）保存">
        </div>
        <div class="task-add-meta">
          <!--选择时间和责任人的按钮-->
          <!--选择时间的按钮-->
          <!--<Poptip placement="bottom-end" width="400">-->
          <!--<p class="task-add-time-icon" transfer="true">-->
          <!--<Icon size="30" type="ios-calendar-outline"></Icon>-->
          <!--</p>-->
          <!--<div class="api" slot="content">-->
          <!--<Form :model="task" :label-width="80">-->
          <!--<FormItem label="DatePicker">-->
          <!--<Row>-->
          <!--<Col span="11">-->
          <!--<DatePicker type="date" placeholder="选择日期" v-model="task.date"></DatePicker>-->
          <!--</Col>-->
          <!--<Col span="2" style="text-align: center">-->
          <!-- -</Col>-->
          <!--<Col span="11">-->
          <!--<TimePicker type="time" placeholder="选择时间" v-model="task.time"></TimePicker>-->
          <!--</Col>-->
          <!--</Row>-->
          <!--</FormItem>-->
          <!--</Form>-->
          <!--</div>-->
          <!--</Poptip>-->
          <!--选择责任人的按钮-->
          <!--<Poptip placement="bottom-end" width="400">-->
          <!--<div class="user-icon" transfer="false">-->
          <!--方-->
          <!--</div>-->
          <!--<div class="api" slot="content">-->
          <!--wwwww-->
          <!--</div>-->
          <!--</Poptip>-->
        </div>
      </div>
      <div class="task-list-content">
        <Table :columns="tableConf.columns3" :loading="tableConf.loading" @on-row-click="onRowClick" :data="taskList"
               :border="tableConf.border" :show-header="tableConf.showHeader">
        </Table>
        <div class="page-content">
          <Page :total="pageOpts.total" show-sizer :page-size-opts="pageOpts.pageSizeOpts"
                :page-size="pageOpts.pageSize" show-total show-elevator :transfer="true"
                @on-change="onPageChange" @on-page-size-change="onPageSizeChange"
                :current.sync="pageOpts.current"></Page>
        </div>
      </div>
    </div>
    <div>
      <!--点击任务列表中的任务之后弹出任务配置modal-->
      <Modal v-model="taskModalConf.taskModal" :width="taskModalConf.width" :loading="true" @on-cancel="on_modal_cancel"
             :mask-closable="false">
        <div slot="header" class="add-task-modal-title">
          <Icon type="navicon-round"></Icon>
          <span>{{taskDetails.name}}</span>
          <Icon type="arrow-down-b"></Icon>
          <div style="clear: both"></div>
        </div>
        <div>
          <div class="modal_footer_content">
            <Row>
              <i-col span="16">
                <div style="width: 70%;margin-left: 15%">
                  <Form ref="taskDetails" :model="taskDetails" :rules="ruleValidate" label-position="top">
                    <FormItem label="任务名称" prop="name">
                      <Input :disabled="disabledTaskItem" v-model="taskDetails.name" placeholder="输入您的任务名称"></Input>
                    </FormItem>
                    <FormItem label="项目名称" prop="project">
                      <Select :disabled="disabledTaskItem" v-model="taskDetails.project" placeholder="选择项目">
                        <Option v-for="(option, index) in selectConf.projectOptions" :value="option.value" :key="index">
                          {{option.label}}
                        </Option>
                      </Select>
                    </FormItem>
                    <FormItem label="责任人" prop="executor">
                      <Select :disabled="disabledTaskItem" v-model="taskDetails.executor" placeholder="选择责任人">
                        <Option v-for="(option, index) in selectConf.userOptions" :value="option.value" :key="index">
                          {{option.label}}
                        </Option>
                      </Select>
                    </FormItem>
                    <FormItem label="组长" prop="leader">
                      <Select :disabled="disabledTaskItem" v-model="taskDetails.leader" placeholder="选择组长">
                        <Option v-for="(option, index) in selectConf.userOptions" :value="option.value" :key="index">
                          {{option.label}}
                        </Option>
                      </Select>
                    </FormItem>
                    <FormItem label="父任务" prop="parent">
                      <Select :disabled="disabledTaskItem" v-model="taskDetails.parent" placeholder="选择父任务">
                        <Option value="parent1">父任务1</Option>
                        <Option value="parent2">父任务2</Option>
                        <Option value="parent3">父任务3</Option>
                      </Select>
                    </FormItem>
                    <FormItem label="开始时间" prop="start_date">
                      <DatePicker :disabled="disabledTaskItem" type="datetime" placeholder="选择开始时间" style="width: 100%"
                                  v-model="taskDetails.start_date" format="yyyy-MM-dd HH:mm:ss">
                      </DatePicker>
                    </FormItem>
                    <FormItem label="预计结束时间" prop="end_date">
                      <DatePicker type="datetime" placeholder="选择预计结束时间" :disabled="disabledTaskTime"
                                  style="width: 100%" v-model="taskDetails.end_date"
                                  format="yyyy-MM-dd HH:mm:ss">
                      </DatePicker>
                    </FormItem>
                    <FormItem label="难度系数" prop="difficulty">
                      <Rate v-model="taskDetails.difficulty" :disabled="disabledTaskItem"
                            allow-half>
                      </Rate>
                    </FormItem>
                    <FormItem label="优先级" prop="priority">
                      <RadioGroup v-model="taskDetails.priority">
                        <Radio :disabled="disabledTaskItem" :label=3>高</Radio>
                        <Radio :disabled="disabledTaskItem" :label=2>中</Radio>
                        <Radio :disabled="disabledTaskItem" :label=1>低</Radio>
                      </RadioGroup>
                    </FormItem>
                    <FormItem label="任务类型" prop="type">
                      <RadioGroup :disabled="disabledTaskItem" v-model="taskDetails.type">
                        <Radio :disabled="disabledTaskItem" label="new">新需求</Radio>
                        <Radio :disabled="disabledTaskItem" label="bug">Bug</Radio>
                        <Radio :disabled="disabledTaskItem" label="optimization">优化意见</Radio>
                        <Radio :disabled="disabledTaskItem" label="deploy">部署实施</Radio>
                        <Radio :disabled="disabledTaskItem" label="support">现场支持</Radio>
                      </RadioGroup>
                    </FormItem>
                    <FormItem label="任务描述" prop="desc">
                      <Input v-model="taskDetails.desc" type="textarea" :autosize="{minRows: 2,maxRows: 5}"
                             placeholder="输入任务描述" :disabled="disabledTaskTime"></Input>
                    </FormItem>
                  </Form>
                </div>
              </i-col>
              <i-col span="8">
                <div style="padding-right: 15%;margin-top: 35px">
                  <div style="text-align: center">
                    <i-circle :percent=20>
                      <span class="demo-Circle-inner" style="font-size:24px">20%</span>
                    </i-circle>
                    <br>
                    完成进度
                  </div>
                  <div style="padding:50px 0 0 100px">
                    <Steps :current="taskDetails.status" size="small" direction="vertical">
                      <Step title="打开"></Step>
                      <Step title="处理中"></Step>
                      <Step title="待审批"></Step>
                      <Step title="回退待处理"></Step>
                      <Step title="待审批"></Step>
                      <Step title="已解决"></Step>
                      <Step title="已关闭"></Step>
                    </Steps>
                    任务状态
                  </div>
                </div>
              </i-col>
            </Row>
          </div>
        </div>
        <div slot="footer">
          <Button type="primary" v-if="saveTaskIf" :loading="taskModalConf.saveTaskLodaing" @click="saveTask">保存
          </Button>
          <Button type="primary" v-if="saveTaskIf" :loading="taskModalConf.taskSend" @click="sendTask()">保存并发送</Button>
          <Button type="primary" v-if="submitIf" :loading="taskModalConf.submit" @click="submitApproval()">提交审批</Button>
          <Button type="primary" v-if="cancelIf" :loading="taskModalConf.cancel" @click="cancelApproval()">撤销审批</Button>
          <Button type="primary" v-if="updateIf" :loading="taskModalConf.update" @click="updateTaskTime()">修改时间</Button>
          <Button type="primary" v-if="updateIf" :loading="taskModalConf.transfer" @click="transferTask()">转派任务</Button>
        </div>
      </Modal>
      <Modal
        title="转派任务"
        v-model="transferModalConf.modal"
        :loading="transferModalConf.loading"
        @on-ok="transferModalOk"
        :mask-closable="false">
        <Select v-model="transferModalConf.transferUser" placeholder="选择组长">
          <Option v-for="(option, index) in selectConf.userOptions" :value="option.value" :key="index">
            {{option.label}}
          </Option>
        </Select>
      </Modal>
    </div>
  </div>
</template>

<script>
  import {SERVER} from '../../assets/axios'
  import {mapState} from 'vuex'
  // import store from '../../store'

  export default {
    name: 'MyTask',
    data () {
      return {
        theme1: 'light',
        selectOrder: {'key': '-priority', 'value': '按优先级'},
        selectConf: {
          projectLoading: false,
          projectOptions: [],
          userOptions: []
        },
        task: {
          name: null
        },
        tableConf: {
          columns3: [
            {
              // fixed: 'left',
              title: '任务名称',
              key: 'name'
            },
            {
              title: '任务状态',
              key: 'd_status',
              align: 'right'
            },
            {
              title: '截至时间',
              key: 'end_date',
              align: 'right'
            },
            {
              title: '项目名称',
              key: 'd_project',
              align: 'right'
            },
            {
              title: '执行者',
              key: 'd_executor',
              align: 'right'
            },
            {
              title: '审批人',
              key: 'd_leader',
              align: 'right'
            }
            // {
            //   title: '创建人',
            //   key: 'd_create_user',
            //   align: 'right'
            // }
          ],
          showHeader: true,
          border: false,
          loading: true
        },
        taskModalConf: {
          width: 980,
          taskModal: false,
          saveTaskLodaing: false,
          taskSend: false,
          submit: false,
          cancel: false,
          update: false,
          transfer: false
        },
        transferModalConf: {
          modal: false,
          transferUser: null,
          loading: true
        },
        taskList: [],
        taskDetails: {},
        ruleValidate: {
          name: [
            {required: true, message: '任务名称必须输入', trigger: 'blur'}
          ],
          project: [
            {required: true, type: 'number', message: '请选择项目', trigger: 'change'}
          ],
          executor: [
            {required: true, type: 'number', message: '请选择负责人', trigger: 'change'}
          ],
          leader: [
            {required: true, type: 'number', message: '请选择组长1', trigger: 'change'}
          ],
          start_date: [
            {required: true, type: 'date', message: '请选择开始日期', trigger: 'change'}
          ],
          end_date: [
            {required: true, type: 'date', message: '请选择预计结束日期', trigger: 'change'}
          ],
          difficulty: [
            {required: true, type: 'number', message: '请选择难度系数', trigger: 'change'}
          ],
          priority: [
            {required: true, type: 'number', message: '请选择优先级', trigger: 'change'}
          ],
          type: [
            {required: true, message: '请选择任务类型', trigger: 'change'}
          ]
        },
        pageOpts: {
          total: 0,
          pageSize: 10,
          pageSizeOpts: [10, 50, 100],
          current: 1
        }
      }
    },
    computed: {
      ...mapState({
        user: 'userData'
      }),
      disabledTaskItem: function () {
        let disabled = true
        if (this.taskDetails.status === 0) {
          disabled = false
        }
        return disabled
      },
      disabledTaskTime: function () {
        let disabled = this.disabledTaskItem && !this.updateIf
        return disabled
      },
      saveTaskIf: function () {
        /*
         保存和保存并发送按钮只有在状态为打开得时候才能展示出来
         */
        let disabled = false
        if (this.taskDetails.status === 0) {
          disabled = true
        }
        return disabled
      },
      submitIf: function () {
        /*
         当登陆用户跟执行人是同一个人得时候显示提交审核按钮
         */
        let uid = this.user.userData.id
        let submitActive = [1, 3].includes(this.taskDetails.status) && this.taskDetails.executor === uid
        return submitActive
      },
      cancelIf: function () {
        let uid = this.user.userData.id
        let submitActive = [2, 4].includes(this.taskDetails.status) && this.taskDetails.executor === uid
        return submitActive
      },
      updateIf: function () {
        /*
         当任务组状态为处理中、待审批、回退在处理时组长可以更新时间 更新时间
         */
        let uid = this.user.userData.id
        let disabled = [1, 2, 3, 4].includes(this.taskDetails.status) && this.taskDetails.leader === uid
        return disabled
      }
    },
    mounted: function () {
      let self = this
      self.getProcessingTaskList()
      self.setSelectOptions()
    },
    methods: {
      on_modal_cancel () {
        this.taskDetails = {}
      },
      getProcessingTaskList () {
        let self = this
        let params = {
          'ordering': self.selectOrder.key,
          'page': this.pageOpts.current,
          'page_size': this.pageOpts.pageSize
        }
        self.tableConf.loading = true
        SERVER.get('/task/my', {'params': params}).then(function (response) {
          let resData = response.data
          self.taskList = resData.data
          self.pageOpts.total = resData.count
          self.tableConf.loading = false
        }).catch(function (error) {
          if (error.response) {
            console.log(error)
            self.tableConf.loading = false
          }
        })
      },
      orderClick: function (dropdownItem) {
        /*
         右上角过滤条件，通过条件过滤未完成的任务
         */
        let self = this
        let orderDict = {
          'priority': {'key': '-priority', 'value': '按优先级'},
          'end_date': {'key': '-end_date', 'value': '按截止日期'},
          'write_date': {'key': '-write_date', 'value': '按更新时间'},
          // 'complete_time': {'key': 'complete_time', 'value': '按完成时间'},
          'project': {'key': 'project', 'value': '按项目'}
          // 'all': {'key': 'all', 'value': '全部任务'}
        }
        self.selectOrder = orderDict[dropdownItem]
        self.getProcessingTaskList()
      },
      saveTaskName: function (event) {
        /*
         添加任务名称，并保存到vuex和数据库中
         */
        let self = this
        let keyCode = event.keyCode
        if (keyCode === 13) {
          let params = {
            form_data: {
              'name': this.task.name,
              'create_user_id': this.user.userData.id,
              'write_user_id': this.user.userData.id
            }
          }
          self.task.name = null
          //  点击回车按钮添加任务。
          self.tableConf.loading = true
          SERVER.post('/task/my', params).then(function (response) {
            console.log(response)
            self.getProcessingTaskList()
          }).catch(function (error) {
            if (error.response) {
              self.$Message.error(error.response.data.message)
              self.tableConf.loading = false
            }
          })
        }
      },
      onRowClick: function (rowData, index) {
        let self = this
        let url = '/task/my/' + rowData.id
        SERVER.get(url).then(function (response) {
          let resData = response.data
          self.taskDetails = resData
          self.taskModalConf.taskModal = true
        })
      },
      saveTask () {
        /*
         保存任务
         */
        let self = this
        self.taskModalConf.saveTaskLodaing = true
        self.$refs['taskDetails'].validate((valid) => {
          if (valid) {
            let params = {
              'form_data': self.taskDetails,
              'action': 'save'
            }
            let url = '/task/my/' + self.taskDetails.id
            SERVER.put(url, params).then(function (response) {
              self.taskModalConf.taskModal = false
              self.taskModalConf.saveTaskLodaing = false
              self.getProcessingTaskList()
              self.taskDetails = {}
            }).catch(function (error) {
              if (error.response) {
                self.$Message.error(error.response.data.message)
                self.tableConf.loading = false
                self.taskModalConf.saveTaskLodaing = false
              }
            })
          } else {
            self.$Notice.error({
              title: '保存表单出错',
              desc: '请检查必填项是否已填，内容是否符合约束。'
            })
          }
        })
      },
      sendTask () {
        /*
         保存任务并发送
         */
        let self = this
        self.taskModalConf.taskSend = true
        self.$refs['taskDetails'].validate((valid) => {
          if (valid) {
            let params = {
              'form_data': self.taskDetails,
              'action': 'send'
            }
            let url = '/task/my/' + self.taskDetails.id
            SERVER.put(url, params).then(function (response) {
              self.taskModalConf.taskModal = false
              self.taskModalConf.taskSend = false
              self.getProcessingTaskList()
              self.taskDetails = {}
            })
          } else {
            self.$Notice.error({
              title: '保存表单出错',
              desc: '请检查必填项是否已填，内容是否符合约束。'
            })
          }
        })
      },
      submitApproval () {
        let self = this
        self.taskModalConf.submit = true
        let params = {
          'action': 'submit'
        }
        let url = '/task/my/' + self.taskDetails.id
        SERVER.patch(url, params).then(function (response) {
          self.taskModalConf.taskModal = false
          self.taskModalConf.submit = false
          self.getProcessingTaskList()
          self.taskDetails = {}
        }).catch(function (error) {
          if (error.response) {
            self.$Message.error(error.response.data.message)
            self.tableConf.submit = false
          }
        })
      },
      cancelApproval () {
        /*
         撤销审批
         */
        let self = this
        self.taskModalConf.cancel = true
        let params = {
          'form_data': self.taskDetails,
          'action': 'cancel'
        }
        let url = '/task/my/' + self.taskDetails.id
        SERVER.patch(url, params).then(function (response) {
          self.taskModalConf.taskModal = false
          self.taskModalConf.cancel = false
          self.getProcessingTaskList()
          self.taskDetails = {}
        })
      },
      updateTaskTime () {
        let self = this
        self.taskModalConf.update = true
        self.$refs['taskDetails'].validate((valid) => {
          if (valid) {
            let params = {
              'form_data': self.taskDetails,
              'action': 'update'
            }
            let url = '/task/my/' + self.taskDetails.id
            SERVER.patch(url, params).then(function (response) {
              self.taskModalConf.taskModal = false
              self.taskModalConf.update = false
              self.getProcessingTaskList()
              self.taskDetails = {}
            })
          } else {
            self.$Notice.error({
              title: '保存表单出错',
              desc: '请检查必填项是否已填，内容是否符合约束。'
            })
          }
        })
      },
      transferTask () {
        let self = this
        self.transferModalConf.modal = true
      },
      transferModalOk () {
        let self = this
        self.transferModalConf.loading = true
        let params = {
          'action': 'transfer',
          'form_data': {'executor_id': self.transferModalConf.transferUser}
        }
        SERVER.patch('/task/my/' + self.taskDetails.id, params).then(function (response) {
          self.transferModalConf.modal = false
          self.taskModalConf.taskModal = false
          self.getProcessingTaskList()
        }).catch(function (error) {
          if (error.response) {
            self.transferModalConf.modal = false
            self.$Message.error(error.response.data.message)
          }
        })
      },
      setSelectOptions () {
        let self = this
        SERVER.get('/base/select/projects').then(function (response) {
          let resData = response.data
          self.selectConf.projectOptions = resData
        })
        SERVER.get('/base/select/users').then(function (response) {
          let resData = response.data
          self.selectConf.userOptions = resData
        })
      },
      onPageChange (page) {
        this.getProcessingTaskList()
      },
      onPageSizeChange (pageSize) {
        this.pageOpts.pageSize = pageSize
        if (this.pageOpts.current) {
          this.getProcessingTaskList()
        }
      }
    }
  }
</script>

<style scoped>
  .my-task-content {
  }

  .task-bar-order-content {
    float: right;
    padding-right: 20px;
    font-size: 14px;
  }

  .task-top-bar-content {
    width: 100%;
    height: 50px;
    padding: 0 15px;
    line-height: 50px;
    font-size: 16px;
    background-color: #ffffffff;
  }

  .task-body-content {
    padding: 15px 15px 0;
  }

  .task-add-name-content {
    height: 50px;
    background-color: #ffffff;
    display: -webkit-flex;
    display: -moz-flex;
    display: -o-flex;
    display: -ms-flex;
    display: flex;
  }

  .task-list-content {
    background-color: #ffffff;
    margin-top: 10px;
  }

  .task-add-input-content {
    /*border: 1px salmon solid;*/
    height: 50px;
    flex: 1;
  }

  .task-add-input {
    width: 100%;
    height: 50px;
    border: none;
    outline: none;
    margin-left: 15px;
  }

  .task-add-input::-webkit-input-placeholder {
    font-size: 14px;
    color: #EEEEEE;
    font-weight: bold;
  }

  .task-add-meta {
    /*border: 1px solid seagreen;*/
    height: 50px;
    padding: 10px 15px;
    /*line-height: 50px;*/
  }

  .task-add-time-icon {
    float: left;
    min-width: 50px;
    height: 30px;
    color: #ABABAB;
    cursor: pointer;
  }

  .user-icon {
    width: 30px;
    height: 30px;
    border-radius: 15px;
    background-color: #61B767;
    text-align: center;
    line-height: 30px;
    color: #ffffff;
    float: right;
    cursor: pointer;
  }

  .add-task-modal-title {
    font-size: 14px;
    cursor: pointer;
  }

  .modal_footer_content {
    text-align: left;
  }

  .formRowContent {
    height: 48px;
    line-height: 48px;
  }

  .page-content {
    text-align: right;
    padding: 20px 0 20px 0
  }
</style>
