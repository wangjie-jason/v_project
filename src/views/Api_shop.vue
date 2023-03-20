<template>
    <div>
        <el-container>
            <el-aside style=" width: 200px;">
                <Menu></Menu>
            </el-aside>
            <el-main>
                <h1>接口商店 <span style="color: grey;font-size: xx-small">（点击下载即可把接口下载到自己的项目中）</span></h1>

                <el-table
                    :data="api_shop_list"
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
                        prop="label"
                        label="名称"
                        width="100"
                    >
                    </el-table-column>

                    <el-table-column
                        prop="des"
                        label="描述"
                        width="200"
                    >

                    </el-table-column>

                    <el-table-column
                        prop="path"
                        label="路径"
                        width="300"
                    >

                    </el-table-column>

                    <el-table-column>
                        <template slot="header">
                            <el-button @click="open_detail_new">新增接口</el-button>
                        </template>
                        <template slot-scope="scope">
                            <el-button size="mini" type="primary"  @click="open_detail_old(scope.$index)">编辑</el-button>
                            <el-button size="mini" type="success"  @click="open_project_list(scope.row.id)">下载</el-button>
                            <el-button size="mini" type="danger"  @click="delete_api_shop(scope.row.id)">删除</el-button>
                        </template>
                    </el-table-column>

                </el-table>
            </el-main>
        </el-container>
        <el-dialog title="创建/保存接口" :visible.sync="dialogFormVisible">
            <el-form :model="form_data">
                <el-form-item label="接口名称" label-width="80px">
                    <el-input v-model="form_data.label"></el-input>
                </el-form-item>
                <el-form-item label="接口描述" label-width="80px">
                    <el-input v-model="form_data.des"></el-input>
                </el-form-item>
                <el-form-item label="host域名" label-width="80px">
                    <el-input v-model="form_data.host"></el-input>
                </el-form-item>
                <el-form-item label="path路径" label-width="80px">
                    <el-input v-model="form_data.path"></el-input>
                </el-form-item>
                <el-form-item label="请求方式" label-width="80px">
                    <el-radio-group v-model="form_data.method">
                        <el-radio label="post">post</el-radio>
                        <el-radio label="get">get</el-radio>
                        <el-radio label="delete">delete</el-radio>
                        <el-radio label="put">put</el-radio>
                    </el-radio-group>
                </el-form-item>

                <el-form-item label="Headers" label-width="80px">
                                        <el-input v-model="form_data.headers"></el-input>
                </el-form-item>

                <el-form-item label="Params" label-width="80px">
                                        <el-input v-model="form_data.params"></el-input>
                </el-form-item>

                <el-form-item label="payload_method" label-width="120px">
                                        <el-input type="textarea" :rows="3" v-model="form_data.payload_method"></el-input>
                </el-form-item>

                <el-form-item label="payload_fd" label-width="120px">
                                        <el-input type="textarea" :rows="3" v-model="form_data.payload_fd"></el-input>
                </el-form-item>

                <el-form-item label="payload_xwfu" label-width="120px">
                                        <el-input type="textarea" :rows="3" v-model="form_data.payload_xwfu"></el-input>
                </el-form-item>
                <el-form-item label="payload_raw_method" label-width="120px">
                                        <el-input type="textarea" :rows="3" v-model="form_data.payload_raw_method"></el-input>
                </el-form-item>
                <el-form-item label="payload_raw" label-width="120px">
                                        <el-input type="textarea" :rows="3" v-model="form_data.payload_raw"></el-input>
                </el-form-item>
                <el-form-item label="payload_GQL_q" label-width="120px">
                                        <el-input type="textarea" :rows="3" v-model="form_data.payload_GQL_q"></el-input>
                </el-form-item>
                <el-form-item label="payload_GQL_g" label-width="120px">
                                        <el-input type="textarea" :rows="3" v-model="form_data.payload_GQL_g"></el-input>
                </el-form-item>
                <el-form-item label="payload_binary" label-width="120px">
                                        <el-input type="textarea" :rows="3" v-model="form_data.payload_binary"></el-input>
                </el-form-item>


            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="save_api_shop">保 存</el-button>
              </div>
        </el-dialog>
        <el-dialog title="选择任意项目来接收该接口" :visible.sync="dialogFormVisible2">
            <el-table :data="project_list_data" style="width: 100%">
                <el-table-column label-width="100">
                    <template slot-scope="scope">
                        <el-button size="mini" type="success" @click="download_api(scope.row.id)" >下载</el-button>
                    </template>
                </el-table-column>

                <el-table-column label="项目id" label-width="100">
                    <template slot-scope="scope">
                        <span>{{ scope.row.id }}</span>
                    </template>
                </el-table-column>

                 <el-table-column label="创建者" label-width="100">
                     <template slot-scope="scope">
                        <span>{{ scope.row.creater_name }}</span>
                    </template>
                </el-table-column>

                 <el-table-column label="项目名称" label-width="100">
                     <template slot-scope="scope">
                        <span>{{ scope.row.name }}</span>
                    </template>
                </el-table-column>

            </el-table>
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
              setting_api_id:'',
              dialogFormVisible:false,
             dialogFormVisible2:false,
             api_shop_list:[],
              form_data:{

              },
              project_list_data:[],

            }
        },
        methods:{
            open_detail_new(){
                this.dialogFormVisible = true
                this.form_data = {
                    params:'[{"key":"","value":"","des":""}]',
                    headers:'[{"key":"","value":"","des":""}]',
                    payload_fd:'[{"key":"","value":"","des":""}]',
                    payload_xwfu:'[{"key":"","value":"","des":""}]',
              }
            },
            open_detail_old(index){
                this.dialogFormVisible = true;
                this.form_data = this.api_shop_list[index]
            },
            save_api_shop(){
                axios.post('http://localhost:8000/save_api_shop/',this.form_data).then(res=>{
                    this.api_shop_list = res.data;
                    this.dialogFormVisible = false;
                })
            },
            delete_api_shop(api_id){
                axios.get('http://localhost:8000/delete_api_shop/',{
                    params:{
                        api_id:api_id
                    }
                }).then(res=>{
                    this.api_shop_list = res.data
                })
            },
            open_project_list(api_id){
                this.setting_api_id = api_id;
                this.dialogFormVisible2 = true;
                axios.get('http://localhost:8000/get_project_list/').then(res=>{
                    this.project_list_data = res.data
                })
            },
            download_api(project_id){
                axios.get('http://localhost:8000/download_api/',{
                    params:{
                        project_id : project_id,
                        api_id : this.setting_api_id,
                    }
                }).then(
                    this.$message({
                        message:"下载成功",
                        type:'success',
                    })
                )
            },
        },
        mounted(){
            axios.get('http://localhost:8000/get_api_shop_list/').then(
                res=>{
                    this.api_shop_list = res.data;
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