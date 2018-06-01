<template>
  <div>
    <!--顶部标题-->
    <div class="task-top-bar-content">
      <span>
      <Icon type="speedometer" size="16"></Icon>
        {{taskDetails.name}}
      </span>
    </div>
    <Row>
      <i-col span="18">
        <div class="task-body-content">
          <!--中间任务基本信息-->
          <div class="task-table-label">
            任务基本信息
          </div>
          <div>
            <Table border :columns="taskBaseTableConf.taskDetailsColumns" size="small" :data="taskBaseTable"></Table>
          </div>
          <!--中间下部任务管理信息-->
          <div class="task-table-label">
            任务管理信息
          </div>
          <div>
            <div style="padding-left: 5px;border: solid 1px #E9EAEC;padding: 16px">
              <!--开发质量和是否引起重大问题得表单-->
              <Form ref="taskAppraisal" :model="taskAppraisal" :rules="ruleValidate" label-position="top">
                <Row>
                  <i-col span="12">
                    <FormItem label="开发质量" prop="name">
                      <Rate :disabled="!taskBackIf" v-model="taskAppraisal.taskQuality" allow-half></Rate>
                    </FormItem>
                  </i-col>
                  <i-col span="12">
                    <FormItem label="引起重大问题">
                      <i-switch v-model="taskAppraisal.isBug" size="large" :disabled="!taskBackIf">
                        <span slot="open">是</span>
                        <span slot="close">否</span>
                      </i-switch>
                    </FormItem>
                  </i-col>
                </Row>
              </Form>
              <!--可以对任务得操作-->
              <Button type="success" v-if="taskBackIf" icon="checkmark-round" @click="taskSuccess">完成任务</Button>
              <Button type="error" v-if="taskBackIf" icon="arrow-left-c" @click="taskBack">回退任务</Button>
              <Button type="warning" v-if="taskCloseIf" icon="close-round" @click="taskClose">关闭任务</Button>
            </div>
          </div>
        </div>
      </i-col>
      <i-col span="6">
        <!--右侧任务日志-->
        <div>
          <div class="task-body-content">
            <div class="time-line-title">
              任务日志
            </div>
            <!--任务日志时间轴-->
            <div class="time-line-content">
              <Timeline>
                <TimelineItem v-for="lineItem in taskFlowList" :key="lineItem.id">
                  <p class="time">{{lineItem.create_date}}</p>
                  <p class="content">{{lineItem.d_user}}做了{{lineItem.operating}}的操作</p>
                </TimelineItem>
              </Timeline>
            </div>
          </div>
        </div>
      </i-col>
    </Row>
    <div>
      <Modal v-model="modalConf.shown" :title="modalConf.title" :loading="modalConf.loading" @on-ok="saveTaskNote">
        <div>
          <Input v-model="modalConf.taskNote" type="textarea" :autosize="{minRows: 5,maxRows: 10}"
                 placeholder="请输入处理意见"></Input>
        </div>
      </Modal>
    </div>
  </div>
</template>

<script>
  import {SERVER} from '../../assets/axios'
  import {mapState} from 'vuex'
  // import store from '../../store'

  export default {
    name: 'ApprovalTask',
    data () {
      return {
        modalConf: {
          title: '',
          shown: false,
          loading: true,
          taskNote: null,
          updateAction: null
        },
        taskDetails: {},
        taskDetailsColumns: [],
        taskBaseTableConf: {
          taskDetailsColumns: [
            {
              title: '字段名',
              key: 'field1',
              width: '15%'
            },
            {
              title: '值',
              key: 'value1',
              ellipsis: true
            },
            {
              title: '字段名',
              key: 'field2',
              width: '15%'
            },
            {
              title: '值',
              key: 'value2',
              ellipsis: true
            }
          ],
          taskDate: []
        },
        taskAppraisal: {
          'taskQuality': 2.5,
          'isBug': false
        },
        ruleValidate: {
          taskQuality: [
            {required: true, type: 'number', message: '请选择任务难度', trigger: 'change'}
          ],
          isBug: [
            {required: true, type: 'boolean', message: '请选择是否重大问题', trigger: 'change'}
          ]
        },
        lineList: []
      }
    },
    computed: {
      ...mapState({
        user: 'userData'
      }),
      taskBaseTable: function () {
        let taskField = {
          'name': '任务名称',
          'type': '任务类型',
          'status': '任务状态',
          'leader': '组长',
          'priority': '优先级',
          'project': '项目名',
          'start_date': '开始时间',
          'end_date': '预计结束时间',
          'create_user': '创建人',
          'parent': '父任务',
          'difficulty': '难度系数',
          'executor': '责任人'
        }
        let taskDetails = this.taskDetails
        let taskData = []
        if (taskDetails !== undefined) {
          let showFields = [['name', 'project'], ['type', 'status'], ['start_date', 'end_date'],
            ['parent', 'create_user'], ['executor', 'difficulty']
          ]
          let field, value
          showFields.forEach(function (fieldNames) {
            let rowData = {}
            fieldNames.forEach(function (key, index) {
              if (index !== 0) {
                field = 'field2'
                value = 'value2'
              } else {
                field = 'field1'
                value = 'value1'
              }
              rowData[field] = taskField[key]
              rowData[value] = taskDetails['d_' + key] || taskDetails[key]
            })
            taskData.push(rowData)
          })
        }
        return taskData
      },
      taskBackIf: function () {
        // 当任务状态为待审批装态时返回true
        let status = this.taskDetails.status
        let uid = this.user.userData.id
        let disabled = false
        if ([2, 4].includes(status) && this.taskDetails.leader === uid) {
          disabled = true
        }
        return disabled
      },
      taskCloseIf: function () {
        let status = this.taskDetails.status
        let uid = this.user.userData.id
        let disabled = false
        if (status === 5 && this.taskDetails.leader === uid) {
          disabled = true
        }
        return disabled
      },
      taskFlowList: function () {
        let self = this
        let taskFlow = []
        // let new_item
        self.lineList.forEach(function (item) {
          taskFlow.push({
            'create_date': item.create_date.substring(0, 19),
            'd_user': item.d_user,
            'operating': item.operating
          })
        })

        return taskFlow
      }
    },
    mounted: function () {
      let self = this
      self.getDetails()
    },
    methods: {
      getDetails () {
        let self = this
        let taskId = this['$route'].params.task_id
        SERVER.get('/task/approval/' + taskId).then(function (response) {
          let resData = response.data
          self.taskDetails = resData.task
          self.lineList = resData.flow
        }).catch(function (error) {
          if (error.response) {
            self.$Message.error(error.response.data.message)
          }
        })
      },
      taskSuccess () {
        let self = this
        self.modalConf.title = '是否设置完成任务'
        self.modalConf.updateAction = 'success'
        self.modalConf.shown = true
      },
      taskBack () {
        let self = this
        self.modalConf.title = '是否回退该任务'
        self.modalConf.updateAction = 'back'
        self.modalConf.shown = true
      },
      taskClose () {
        let self = this
        self.modalConf.title = '是否关闭该任务'
        self.modalConf.updateAction = 'close'
        self.modalConf.shown = true
      },
      saveTaskNote () {
        /*
         设置保存任务note改变任务状态
         */
        let self = this
        let taskId = this['$route'].params.task_id
        let params = {
          'action': self.modalConf.updateAction,
          'notes': self.modalConf.taskNote
        }
        SERVER.patch('task/approval/' + taskId, params).then(function (response) {
          console.log(response)
          self.getDetails()
          self.modalConf.shown = false
          self.modalConf.taskNote = null
        }).catch(function (error) {
          self.modalConf.taskNote = null
          if (error.response) {
            self.getDetails()
            self.modalConf.loading = false
          } else if (error.request) {
            console.log(error.request)
          } else {
            console.log('Error', error.message)
          }
        })
      }
    }
  }

</script>

<style scoped>
  .task-top-bar-content {
    width: 100%;
    height: 50px;
    padding: 0 15px;
    line-height: 50px;
    font-size: 16px;
    background-color: #ffffffff;
  }

  .task-body-content {
    padding: 10px;
    background-color: #ffffff;
    margin: 10px;
    cursor: pointer;
  }

  .time-line-title {
    font-size: 16px;
    padding-left: 15%;
    margin: 10px;
    height: 30px;
  }

  .time-line-content {
    padding-left: 20%;
  }

  .task-table-label {
    height: 40px;
    font-size: 16px;
    line-height: 40px;
  }
</style>
