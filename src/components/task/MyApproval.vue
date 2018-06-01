<template>
  <div>
    <!--右侧顶部的bar-->
    <div class="task-top-bar-content">
      <span>
      <Icon type="speedometer" size="16"></Icon>
        我的审批
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
            <!--<DropdownItem name="all">全部任务</DropdownItem>-->
          </DropdownMenu>
        </Dropdown>
      </div>
    </div>
    <div class="task-body-content">
      <div class="task-list-content">
        <Table :columns="tableConf.columns3" @on-row-click="onRowClick" :data="taskList" :loading="tableConf.loading"
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
  </div>
</template>

<script>
  import {SERVER} from '../../assets/axios'
  import {mapState} from 'vuex'
  import router from '../../router'

  export default {
    name: 'MyApproval',
    data () {
      return {
        selectOrder: {'key': '-priority', 'value': '按优先级'},
        tableConf: {
          columns3: [
            {
              title: '任务名称',
              key: 'name'
            },
            {
              title: '任务状态',
              key: 'd_status',
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
          ],
          showHeader: true,
          loading: true,
          border: false
        },
        taskList: [],
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
      })
    },
    created: function () {
      // let uid = this.user.userData.id
      // this.taskList = store.getters.getApptovalList(uid)
    },
    mounted: function () {
      let self = this
      self.getApptovalList()
    },
    methods: {
      getApptovalList () {
        let self = this
        let params = {
          'ordering': self.selectOrder.key,
          'page': this.pageOpts.current,
          'page_size': this.pageOpts.pageSize
        }
        self.tableConf.loading = true
        SERVER.get('/task/approval', {'params': params}).then(function (response) {
          let resData = response.data
          self.taskList = resData.data
          self.pageOpts.total = resData.count
          self.tableConf.loading = false
        }).catch(function (error) {
          console.log(error)
        })
      },
      orderClick (dropdownItem) {
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
        self.getApptovalList()
      },
      onRowClick (rowData, index) {
        // 跳转到审批任务详情页面
        router.push({name: 'ApprovalTask', params: {task_id: rowData.id}})
      },
      onPageChange (page) {
        this.getApptovalList()
      },
      onPageSizeChange (pageSize) {
        this.pageOpts.pageSize = pageSize
        if (this.pageOpts.current) {
          this.getApptovalList()
        }
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

  .task-bar-order-content {
    float: right;
    padding-right: 20px;
    font-size: 14px;
  }

  .task-body-content {
    padding: 10px 15px 0;
    cursor: pointer;
  }

  .task-list-content {
    background-color: #ffffff;
    margin-top: 10px;
  }

  .page-content {
    text-align: right;
    padding: 20px 0 20px 0
  }

</style>
