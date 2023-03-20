<template>
    <div>
        <el-container>
            <el-aside style=" width: 200px;">
                <Menu></Menu>
            </el-aside>
            <el-main>
                <h1>环境管理 <span style="color: grey;font-size: xx-small">（此页面请不要随意删除环境）</span></h1>

                <el-table
                    :data="env_list_data"
                    stripe
                    border
                    style="min-width: 100%;min-height: 100%;overflow-y: auto"
                >
                    <el-table-column
                        prop="id"
                        label="ID"
                        width="100"
                    >
                    </el-table-column>

                    <el-table-column
                        prop="type"
                        label="标签"
                        width="200"
                    >
                        <template slot-scope="scope">
                            <el-tag>{{ scope.row.type }}</el-tag>
                        </template>
                    </el-table-column>

                    <el-table-column
                        prop="host"
                        label="域名"
                        width="300"
                    >

                    </el-table-column>

                    <el-table-column
                        prop="des"
                        label="描述"
                    >

                    </el-table-column>

                    <el-table-column>
                        <template slot="header">
                            <el-button @click="dialogFormVisible=true">新增环境</el-button>
                        </template>
                        <template slot-scope="scope">
                            <el-button size="mini" type="danger"  @click="Delete_env(scope.row.id)">删除</el-button>
                        </template>
                    </el-table-column>

                </el-table>
            </el-main>
        </el-container>

        <el-dialog title="创建环境" :visible.sync="dialogFormVisible">
            <el-form :model="form">
                <el-form-item label="环境host" label-width="80px">
                    <el-input v-model="form_data.host"></el-input>
                </el-form-item>

                <el-form-item label="描述" label-width="80px">
                    <el-input v-model="form_data.des"></el-input>
                </el-form-item>

                <el-form-item label="标签" label-width="80px">
                    <el-input v-model="form_data.type"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="Add_env()">创 建</el-button>
              </div>
        </el-dialog>

    </div>
</template>

<script>
    import Menu from '../components/Menu'
    import axios from 'axios'
    export default {
        name: "Env_list",
        data(){
          return{
              dialogFormVisible:false,
              env_list_data:[],
              form_data:{
                  host:'http://',
                  type:'',
                  des:''
              }

            }
        },
        methods:{
          Add_env(){
              this.dialogFormVisible = false;
              axios.post('http://localhost:8000/add_env/',this.form_data).then(res=>{
                  this.env_list_data = res.data
                  this.$message({
                      message:"创建成功",
                      type:'success'
                  })
              })
          },
            Delete_env(env_id){
              axios.get('http://localhost:8000/delete_env/',{
                  params:{
                      env_id : env_id
                  }
              }).then(res=>{
                  this.env_list_data = res.data;
              })
            }
        },
        mounted(){
            axios.get('http://localhost:8000/get_env_list/').then(
                res=>{
                    this.env_list_data = res.data;
                }
            )
        },
        components:{
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