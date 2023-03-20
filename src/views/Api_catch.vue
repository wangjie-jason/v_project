<template>
  <div>
    <el-container>
      <el-aside style="width: 200px">
        <Menu></Menu>
      </el-aside>
      <el-container>
        <el-header>
          <h1>在线抓包导入 <span style="color:grey;font-size: xx-small">（手机挂上代理和端口，触发的请求都会自动导入到打开开关的项目中）</span></h1>
        </el-header>
        <el-main>

          <el-card shadow="hover" style="width: 48%;float: left">
            <h1 style="float: left">手机挂此代理: <span style="color: green;" v-text="get_host()"></span></h1> <br> &#12288;&#12288;
            <el-button @click="open_catch" type="primary" size="mini">开启抓包</el-button>&nbsp;
            <el-button @click="close_catch" type="info" size="mini">关闭抓包</el-button>

          </el-card>

          <el-card shadow="hover" style="width: 50%;float: right">
            <el-table :data="project_list_data">
              <el-table-column label-width="100">
                <template slot-scope="scope">
                  <el-button size="mini" type="success" @click="change_catch_status(scope.row.id)">开关</el-button>
                </template>
              </el-table-column>
              <el-table-column label="当前可接收状态" label-width="100">
                <template slot-scope="scope">
                  <span :style="{color:getColor(scope.row.catch_status)}">{{ scope.row.catch_status }}</span>
                </template>
              </el-table-column>


              <el-table-column label="项目id" label-width="100">
                <template slot-scope="scope">
                  <span>{{ scope.row.id }}</span>
                </template>
              </el-table-column>

              <el-table-column label="项目名字" label-width="100">
                <template slot-scope="scope">
                  <span>{{ scope.row.name }}</span>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import Menu from '../components/Menu'
import axios from 'axios'

export default {
  data() {
    return {
      project_list_data: [],
      switch_kg: false,
      switch_status: 'false',
    }
  },
  mounted() {
    axios.get('/get_project_list/').then(res => {
      this.project_list_data = res.data
    })
  },
  methods: {
    close_catch() {
      axios.get('/close_catch/').then(res => {
        this.$message({
          message: "关闭成功",
          type: "success"
        })
      })
    },
    open_catch() {
      axios.get('/open_catch/').then(res => {
        this.$message({
          message: "开启成功",
          type: "success"
        })
      })
    },
    get_host() {
      return process.env.VUE_APP_BASE_URL.split('://')[1].split(':')[0] + ' : 8889'
    },
    change_catch_status(id) {
      axios.get('/change_catch_status/', {
        params: {
          project_id: id
        }
      }).then(res => {
        this.project_list_data = res.data
      })
    },
    getColor(result) {
      if (result.toString() == 'true') {
        return 'green'
      } else {
        return 'red'
      }
    }
  },
  components: {
    Menu
  }
}
</script>

<style scoped>
.el-aside {
  background-color: #D3DCE6;
  color: #333;
  text-align: center;

}

.el-main {
  background-color: white;
  color: #333;
}
</style>