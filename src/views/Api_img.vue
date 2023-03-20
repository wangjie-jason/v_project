<template>
    <div>
        <el-container>
            <el-aside style="width: 200px">
                <Menu></Menu>
            </el-aside>
            <el-container>
                <el-header>
                    <h1>图片提取导入 <span style="color:grey;font-size: xx-small">（先上传截图，然后点击解析，解析结果手动修改，点击对应项目导入按钮即可）</span> </h1>
                </el-header>
                <el-main>
                    <el-card shadow="hover" style="width: 48%;float: left">
                        <el-button id="jx_btn" style="float: right" @click="jx" icon="el-icon-help">解析</el-button>
                        <el-upload
                            class="upload-demo"
                            :action="get_action()"
                            :limit="1"
                            name='img_file'
                            :on-success="save_img_file_name"
                            >
                            <el-button >上传图片</el-button>
                        </el-upload>

                        <br>


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
                                                    <el-input  v-model="form_data.payload_method"></el-input>
                            </el-form-item>

                            <el-form-item label="payload_fd" label-width="120px">
                                                    <el-input type="textarea" :rows="3" v-model="form_data.payload_fd"></el-input>
                            </el-form-item>

                            <el-form-item label="payload_xwfu" label-width="120px">
                                                    <el-input type="textarea" :rows="3" v-model="form_data.payload_xwfu"></el-input>
                            </el-form-item>
                            <el-form-item label="payload_raw_method" label-width="150px">
                                                    <el-input  v-model="form_data.payload_raw_method"></el-input>
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




                    </el-card>
                    <el-card shadow="hover" style="width: 50%;float: right">
                        <el-table :data="project_list_data">
                            <el-table-column label-width="100">
                                <template slot-scope="scope">
                                    <el-button size="mini" type="success" @click="import_api_ad(scope.row.id)">导入到此项目</el-button>
                                </template>
                            </el-table-column>

                            <el-table-column label="项目id" label-width="100">
                                <template slot-scope="scope">
                                    <span>{{scope.row.id}}</span>
                                </template>
                            </el-table-column>

                            <el-table-column label="项目名字" label-width="100">
                                <template slot-scope="scope">
                                    <span>{{scope.row.name}}</span>
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
        data(){
            return{
                project_list_data:[],
                file_name:'',
                form_data:{}
            }
        },
        mounted(){
          axios.get('/get_project_list/').then(res=>{
              this.project_list_data = res.data
          })
        },
        methods:{
            jx(){
                document.getElementById('jx_btn').innerText = '解析中...'
                axios.get('/jx_img/',{
                    params:{
                        file_name : this.file_name
                    }
                }).then(res=>{
                    this.form_data = res.data
                     document.getElementById('jx_btn').innerText = '解析'
                })
            },
            save_img_file_name(res,file){
              this.file_name = file.raw.name
            },
            get_action(){
              return process.env.VUE_APP_BASE_URL + '/upload_img_file/'
            },

          import_api_ad(project_id){
                axios.post('/import_api_ad/',this.form_data,{
                    params:{
                        project_id:project_id
                    }
                }).then(res=>{
                    this.$message({
                        message:"导入成功！",
                        type:'success'
                    })
                })
            },

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