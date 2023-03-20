<template>
    <div>
        <el-container>
            <el-aside style=" width: 200px;">
                <Menu></Menu>
            </el-aside>
            <el-main>
                <h1>权限管理 <span style="color: grey;font-size: xx-small">（本页面仅超管可用！）</span></h1>

                <el-table
                    :data="power_list_data"
                    stripe
                    border
                    style="max-width: 70%;min-height: 100%;overflow-y: auto;float: left"

                >
                    <el-table-column
                        prop="id"
                        label="ID"
                        width="50"
                    >
                    </el-table-column>

                    <el-table-column
                        prop="name"
                        label="名称"
                    >
                    </el-table-column>

                    <el-table-column
                        prop="path"
                        label="监管路由"
                        width="200"
                    >

                    </el-table-column>



                    <el-table-column
                     width="200"
                    >
                        <template slot="header">
                            <el-button @click="add_power">新增权限</el-button>
                        </template>
                        <template slot-scope="scope">
                            <el-button size="mini" type="primary"  @click="open_power(scope.$index)">编辑</el-button>
                            <el-button size="mini" type="danger"  @click="delete_power(scope.row.id)">删除</el-button>
                        </template>
                    </el-table-column>

                </el-table>

                <el-input
                    type="textarea"
                    :rows="30"
                    style="position: fixed;right: 10px;max-width: 25%;box-shadow: 4px 4px 10px gray"
                    v-model="all_paths"
                ></el-input>
            </el-main>
        </el-container>

        <el-dialog title="编辑权限" :visible.sync="dialogFormVisible">
            <el-form :model="form_data">
                <el-form-item label="权限id" label-width="80px">
                    <el-input disabled="" v-model="form_data.id"></el-input>
                </el-form-item>

                <el-form-item label="权限名称" label-width="80px">
                    <el-input v-model="form_data.name"></el-input>
                </el-form-item>

                <el-form-item label="管控path" label-width="80px">
                    <el-input v-model="form_data.path"></el-input>
                </el-form-item>

                <el-form-item label="人员" label-width="80px">

                    <el-select v-model="form_data.users" multiple placeholder="请选择" style="width: 100%">
                        <el-option
                            v-for="i in all_users"
                            :key="i.id"
                            :label="i.id+'-'+i.username+'-'+i.title"
                            :value="i.id+'-'+i.username+'-'+i.title"
                        ></el-option>
                    </el-select>

                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="save_power">保 存</el-button>
              </div>
        </el-dialog>

    </div>
</template>

<script>
    import Menu from '../components/Menu'
    import axios from 'axios'
    export default {
        data(){
          return{
              dialogFormVisible:false,
              power_list_data:[],
              form_data:{
                  id:'',
                  name:'',
                  users:'',
                  path:''
              },
              all_users:[],
              all_paths:'',
            }
        },
        methods:{
             open_power(index){
                 this.form_data = this.power_list_data[index];
                 this.dialogFormVisible = true;
             },
            add_power(){
                 axios.get('http://localhost:8000/add_power/').then(res=>{
                     this.power_list_data = res.data.power_list_data
                 })
            },
            delete_power(id){
                 axios.get('http://localhost:8000/delete_power/',{
                     params:{
                         id : id
                     }
                 }).then(res=>{
                     this.power_list_data = res.data.power_list_data
                 })
            },
            save_power(){
                 axios.post('http://localhost:8000/save_power/',this.form_data).then(res=>{
                      this.power_list_data = res.data.power_list_data;
                      this.dialogFormVisible = false;
                 })
            }
        },
        mounted(){
            axios.get('http://localhost:8000/get_power_list/').then(
                res=>{
                    this.power_list_data = res.data.power_list_data;
                    this.all_users = res.data.all_users;
                    this.all_paths = res.data.all_paths;
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