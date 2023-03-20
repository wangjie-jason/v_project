<template>
    <div>
        <el-card id="right_div" style="float: right;width: -webkit-calc(100% - 322px)">
            <div v-if="right_api">
                <el-button @click="save_api" size="mini" type="primary">Save</el-button>
                <el-button @click="send_api" size="mini" type="success">Send</el-button>
                <el-button @click="up_api" size="mini" type="text">up</el-button>
                <el-button @click="down_api" size="mini" type="text">down</el-button>
                &#12288;<span style="font-size: xx-small;color:grey">使用变量请用占位符 {%变量名%} ,可用在请求头、params、请求体的值中</span>
                &#12288;<span style="float: right">接口ID: {{seting_api.id}}</span>
                <br><br>
                <el-form ref="form" label-width="80px" label-position="left">
                    <el-form-item label="名称/描述">
                        <el-input v-model="seting_api.label" style="width: 50%;" placeholder="名字"></el-input>
                        <el-input v-model="seting_api.des" style="width: 50%;" placeholder="描述"></el-input>
                    </el-form-item>
                    <el-form-item label="HOST">
<!--                        <el-input v-model="seting_api.host"></el-input>-->

                           <el-autocomplete
                              class="inline-input"
                              v-model="seting_api.host"
                              :fetch-suggestions="querySearch"
                              placeholder="输入域名"
                              @select="handleSelect"
                              :trigger-on-focus="true"
                              style="float: left;width: 100%"
                            >
                                <template slot-scope="{ item }">
                                    <div style="color: #0a2d8f"><strong>{{item.host}}</strong></div>
                                    <span style="color: gray;font-size: xx-small">【标签: {{item.type}}】</span>
                                    <span style="color: gray;font-size: xx-small">【描述: {{item.des}}】</span>
                                    <el-divider></el-divider>
                                </template>
                           </el-autocomplete>


                    </el-form-item>
                    <el-form-item label="方式/路径">
                        <el-select v-model="seting_api.method" style="width: 100px" placeholder="请求方式">
                            <el-option label="POST" value="POST"></el-option>
                            <el-option label="GET" value="GET"></el-option>
                        </el-select>
                        &nbsp;
                        <el-input v-model="seting_api.path" style="width:-webkit-calc(100% - 112px)"></el-input>
                    </el-form-item>
                    <el-tabs type="border-card" v-model="chose_tab_pane">
                        <el-tab-pane label="Params">
                           <el-table
                            :data="seting_api.params"
                            border
                            style="width: 100%"
                             size="mini">

                               <el-table-column label="参数名" width="180">
                                   <template slot-scope="scope">
                                       <el-input v-model="scope.row.key"></el-input>
                                   </template>
                               </el-table-column>

                               <el-table-column label="参数值" width="180">
                                   <template slot-scope="scope">
                                       <el-input v-model="scope.row.value"></el-input>
                                   </template>
                               </el-table-column>

                               <el-table-column label="参数描述" width="180">
                                   <template slot-scope="scope">
                                       <el-input v-model="scope.row.des"></el-input>
                                   </template>
                               </el-table-column>

                               <el-table-column>
                                   <template slot="header">
                                       <el-button @click="add_params">新增参数</el-button>
                                   </template>
                                   <template slot-scope="scope">
                                       <el-button size="mini" type="danger" @click="del_params(scope.$index)">删除</el-button>
                                   </template>
                               </el-table-column>


                          </el-table>

                        </el-tab-pane>
                        <el-tab-pane label="Headers">
                            <el-table
                            :data="seting_api.headers"
                            border
                            style="width: 100%"
                             size="mini">
                               <el-table-column label="参数名" width="180">
                                   <template slot-scope="scope">
                                       <el-input v-model="scope.row.key"></el-input>
                                   </template>
                               </el-table-column>

                               <el-table-column label="参数值" width="180">
                                   <template slot-scope="scope">
                                       <el-input v-model="scope.row.value"></el-input>
                                   </template>
                               </el-table-column>

                               <el-table-column label="参数描述" width="180">
                                   <template slot-scope="scope">
                                       <el-input v-model="scope.row.des"></el-input>
                                   </template>
                               </el-table-column>

                               <el-table-column>
                                   <template slot="header">
                                       <el-button @click="add_headers">新增参数</el-button>
                                   </template>
                                   <template slot-scope="scope">
                                       <el-button size="mini" type="danger" @click="del_headers(scope.$index)">删除</el-button>
                                   </template>
                               </el-table-column>
                          </el-table>


                        </el-tab-pane>
                        <el-tab-pane label="Body">
                              <el-tabs v-model="seting_api.payload_method" @tab-click="handleClick">
                                <el-tab-pane label="none" name="none"><h2 style="text-align: center;color: darkgray;">不传任何参数</h2></el-tab-pane>
                                <el-tab-pane label="form-data" name="form-data">
                                    <el-table
                                        :data="seting_api.payload_fd"
                                        border
                                        style="width: 100%"
                                         size="mini">
                                           <el-table-column label="参数名" width="150">
                                               <template slot-scope="scope">
                                                   <el-input v-model="scope.row.key"></el-input>
                                               </template>
                                           </el-table-column>
                                           <el-table-column label="参数值" width="150">
                                               <template slot-scope="scope">
                                                   <el-input :id="'fd_value_input_'+scope.$index" v-model="scope.row.value"></el-input>
                                               </template>
                                           </el-table-column>
                                            <el-table-column label="文件" width="150">
                                                <template slot-scope="scope">
                                                    <el-upload
                                                    class="upload-demo"
                                                    :action=" 'http://localhost:8000/upload_fd_file/?ApiID=' + seting_api.id"
                                                    :limit="1"
                                                    name = 'fd_file'
                                                    :on-success="up_fd_file"
                                                    >
                                                        <el-button @click="set_fd_index(scope.$index)" size="small" type="primary">FILE</el-button>
                                                    </el-upload>
                                                </template>
                                            </el-table-column>
                                           <el-table-column label="参数描述" width="150">
                                               <template slot-scope="scope">
                                                   <el-input v-model="scope.row.des"></el-input>
                                               </template>
                                           </el-table-column>
                                           <el-table-column>
                                               <template slot="header">
                                                   <el-button @click="add_payload_fd">新增参数</el-button>
                                               </template>
                                               <template slot-scope="scope">
                                                   <el-button size="mini" type="danger" @click="del_payload_fd(scope.$index)">删除</el-button>
                                               </template>
                                           </el-table-column>
                                      </el-table>
                                </el-tab-pane>
                                <el-tab-pane label="x-www-form-urlencoded" name="x-www-form-urlencoded">

                                    <el-table
                                        :data="seting_api.payload_xwfu"
                                        border
                                        style="width: 100%"
                                         size="mini">


                                           <el-table-column label="参数名" width="180">
                                               <template slot-scope="scope">
                                                   <el-input v-model="scope.row.key"></el-input>
                                               </template>
                                           </el-table-column>

                                           <el-table-column label="参数值" width="180">
                                               <template slot-scope="scope">
                                                   <el-input v-model="scope.row.value"></el-input>
                                               </template>
                                           </el-table-column>

                                           <el-table-column label="参数描述" width="180">
                                               <template slot-scope="scope">
                                                   <el-input v-model="scope.row.des"></el-input>
                                               </template>
                                           </el-table-column>

                                           <el-table-column>
                                               <template slot="header">
                                                   <el-button @click="add_payload_xwfu">新增参数</el-button>
                                               </template>
                                               <template slot-scope="scope">
                                                   <el-button size="mini" type="danger" @click="del_payload_xwfu(scope.$index)">删除</el-button>
                                               </template>
                                           </el-table-column>


                                      </el-table>

                                </el-tab-pane>
                                <el-tab-pane label="raw" name="raw">
                                    <el-select v-model="seting_api.payload_raw_method" style="z-index: 999;width: 120px;position: fixed;right: 57px;" placeholder="请选择">
                                        <el-option label="Text" value="Text"></el-option>
                                        <el-option label="JavaScript" value="JavaScript"></el-option>
                                        <el-option label="JSON" value="JSON"></el-option>
                                        <el-option label="XML" value="XML"></el-option>
                                        <el-option label="HTML" value="HTML"></el-option>
                                    </el-select>
                                    <el-input v-model="seting_api.payload_raw" type="textarea" :rows="6"></el-input>
                                </el-tab-pane>
                                <el-tab-pane label="binary" name="binary">
                                    <el-upload
                                      class="upload-demo"
                                      drag
                                      :action=" get_action() "
                                      :limit="1"
                                      name = 'binary_file'
                                      :on-success="upload_binary_file"
                                        >
                                      <i class="el-icon-upload"></i>
                                      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                                    </el-upload>
                                </el-tab-pane>
                                <el-tab-pane label="GraphQL" name="GraphQL">
                                    <el-input v-model="seting_api.payload_GQL_q" type="textarea" :rows="6" style="width: 70%" placeholder="QUERY"></el-input>
                                    <el-input v-model="seting_api.payload_GQL_g" type="textarea" :rows="6" style="width: 30%" placeholder="GRAPHQL VARIABLES"></el-input>
                                </el-tab-pane>
                              </el-tabs>
                        </el-tab-pane>
                        <el-tab-pane name="Response" label="Response">
                            <json-viewer :value="get_json()"></json-viewer>
                        </el-tab-pane>
                        <el-tab-pane label="ResponseData"><el-input v-model="response_data.RD" type="textarea" :rows="9"></el-input></el-tab-pane>
                        <el-tab-pane label="ConfigureResult"><el-input v-model="response_data.CR" type="textarea" :rows="9"></el-input></el-tab-pane>
                    </el-tabs>
                </el-form>
            </div>
            <div v-else-if="right_configure">
                    <!--    配置详情页      -->
                    <el-button @click="save_configure" size="mini" type="primary">Save</el-button>
                    <el-button @click="up_configure" size="mini" type="text">up</el-button>
                    <el-button @click="down_configure" size="mini" type="text">down</el-button>
                     <span style="float: right;">配置ID:{{seting_configure.id}}</span>
                <br>
                    执行时机：
                    <el-select v-model="seting_configure.do_time" placeholder="请选择" style="width:90px">
                        <el-option label="before" value="before"></el-option>
                        <el-option label="after" value="after"></el-option>
                    </el-select>
                    &#12288;配置名称：
                    <el-input style="width:-webkit-calc(100% - 285px)" v-model="seting_configure.label"></el-input>
                <br><br>
                <el-tabs v-model="seting_configure.method" @tab-click="chose_configure_method" tab-position="left" style="height: 100%">
                     <el-tab-pane name="断言" label="断言">
                        <el-select v-model="seting_configure.select" style="width: 120px;margin: 10px">
                            <el-option label="全值检索" value="全值检索"></el-option>
                            <el-option label="正则匹配" value="正则匹配"></el-option>
                            <el-option label="路径匹配" value="路径匹配"></el-option>
                            <el-option label="sql断言" value="sql断言"></el-option>
                        </el-select>
                        <el-input v-model="seting_configure.value" placeholder="请输入表达式、sql语句等" style="width: -webkit-calc(100% - 168px)"></el-input>
                        <br>
                        <p>帮助：</p>
                        <p>1.全值检索：在整个返回值当中，是否存在目标字符串。（.find()） </p>
                        <p>2.正则匹配：需要用户写左边界右边界和匹配正则表达式。也是只检索字符串。</p>
                        <p>3.路径匹配：用户写路径和目标的类型和值。 （只能是json返回值才可用）</p>
                        <p>4.sql断言：用户写sql原生语句和目标值。</p>
                        <p>例子：{"errorCode":200,"data":[{"name":"lisi"},{"name":"zhangsan"},{"name":"wang"}]}</p>
                        <p>全值检索：zhangsan</p>
                        <p>正则匹配：name":"(.*?)"}==zhangsan</p>
                        <p>路径匹配：["data"][1]["name"]=="zhangsan"</p>
                         <p>sql断言：用户必须在语句后写英文分号;</p>
                        <p>sql断言：select name from 表 where id=5;  == "zhangsan" (只取第一行第一个单元格数据作验证)</p>
                        <p>sql断言：select name from 表 where name='zhangsan';  (结果是否为空)</p>


                    </el-tab-pane>
                     <el-tab-pane name="提取" label="提取">

                         <el-select v-model="seting_configure.select" style="width: 120px;margin: 10px">
                            <el-option label="路径提取" value="路径提取"></el-option>
                            <el-option label="正则提取" value="正则提取"></el-option>
                            <el-option label="sql提取" value="sql提取"></el-option>
                        </el-select>
                        <el-input v-model="seting_configure.value" placeholder="请输入表达式、sql查询语句等" style="width: -webkit-calc(100% - 168px)"></el-input>
                        <br>
                        <p>帮助：</p>
                          <p>1.路径提取：用户写变量名=路径。仅限json</p>
                          <p>2.正则提取：用户写变量名=左边界(.*?)右边界</p>
                          <p>3.sql提取：用户写变量名=sql select 查询语句（只取第一行第一个单元格数据进行赋值）</p>
                     </el-tab-pane>
                     <el-tab-pane name="sql增删改" label="sql增删改">
                         <el-input v-model="seting_configure.value" placeholder="请输入需要执行的sql语句" ></el-input>
                        <br>
                        <p>帮助：</p>
                         <p>一般用来执行某个特殊需求，如修改，增加，删除等。用户手写sql语句即可，没有返回结果。</p>

                     </el-tab-pane>
                     <el-tab-pane name="随机变量"  label="随机变量">
                        <el-input v-model="seting_configure.value" placeholder="按照下面要求，输入表达式"></el-input>
                        <br>
                        <p>帮助：</p>
                         <p>1.常数：a=5, a=8.55, a="呵呵", a=[1,2,3] </p>
                          <p>2.随机整数：a=randint(1,10)+2-3-12 #随机生成1-10之内的某个数</p>
                          <p>3.时间戳：a=time.time()</p>
                          <p>4.身份证：a=IDcard() </p>
                          <p>  5.地址：a=random_adress()</p>
                          <p>  6.手机号：a=random_mobile()</p>
                          <p>  7.人名：a=random_name()</p>
                          <p>  8.商品名：a=random_product()</p>
                          <p>  9.统一社会信用代码：a=random_credit()</p>
                          <p>  10.邮箱地址：a=random_email()</p>


                     </el-tab-pane>
                     <el-tab-pane name="mock"  label="mock">
                         <el-select v-model="seting_configure.select" style="width: 120px;margin: 10px">
                            <el-option label="写死返回值" value="写死返回值"></el-option>
                            <el-option label="第三方接口" value="第三方接口"></el-option>
                        </el-select>
                        <el-input type="textarea" :rows="5" v-model="seting_configure.value" placeholder="请输入返回值、接口请求等 "></el-input>
                        <br>
                        <p>帮助：</p>
                         <p>选择写死返回值，可直接粘贴返回值到上面多行输入框，点击保存即可</p>
                         <p>第三方接口，请依次每行输入：url,请求方式,header字典,请求体类型,请求体</p>
                         <p>如：
                             http://wwww.xxx.com/aaa/bbb?a=1 <br>
                             post <br>
                             {"a":1,"b":"c"} <br>
                             form-data / x-www-form-urlencoded / raw-json / raw-text /raw-html /raw-xml/raw-javascript <br>
                             {"username":"zhangsan","userID":444}
                         </p>

                     </el-tab-pane>
                     <el-tab-pane name="插入参数"  label="插入参数">

                        <el-select v-model="seting_configure.select" style="width: 150px;margin: 10px">
                            <el-option label="request_header" value="request_header"></el-option>
                            <el-option label="params" value="params"></el-option>
                            <el-option label="request_body" value="request_body"></el-option>
                        </el-select>
                        <el-input v-model="seting_configure.value" placeholder="请输入表达式等" style="width: -webkit-calc(100% - 198px)"></el-input>
                        <br>
                        <p>帮助：</p>
                         <p>比如：a=55</p>

                     </el-tab-pane>
                     <el-tab-pane name="加密算法"  label="加密算法">
                          <el-select v-model="seting_configure.select" style="width: 150px;margin: 10px" placeholder="插入位置">
                            <el-option label="request_header" value="request_header"></el-option>
                            <el-option label="params" value="params"></el-option>
                        </el-select>
                        <el-input v-model="seting_configure.value" placeholder="请输入表达式等" style="width: -webkit-calc(100% - 198px)"></el-input>
                        <br>
                        <p>帮助：</p>
                         <p>比如：sign = python能执行的加密算法， 其中可以使用接口的全部位置的参数,函数（hashlib.md5(),hashlib.shar1()）</p>
                         <p>定制算法：sign = self.make_sign()</p>
                     </el-tab-pane>
                     <el-tab-pane name="草稿"  label="草稿">
                         <el-input type="textarea" :rows="10" placeholder="请随意使用该文本框"></el-input>
                         <p>帮助：临时存放粘贴字符串用</p>
                     </el-tab-pane>
                </el-tabs>

            </div>
            <div v-else-if="right_report">

                <Report :project_id="project_id" ></Report>

            </div>
            <div v-else>请点击左侧节点set....</div>
        </el-card>
        <h1>接口用例页 &#12288; <el-button @click="add_apis" size="mini" type="primary">新增接口</el-button></h1>
        <el-tree
        id="left_div"
        style="width: 300px;overflow-y: auto;"
        :data="apis"
        show-checkbox
        node-key="id"
        :default-checked-keys="dck"
        :default-expanded-keys="dek"
        @check-change="handleCheckChange"
        ref="tree"
        :check-strictly="true"
        >
            <span slot-scope="{data}">
                <span v-text="get_label(data.label)" style="margin-right: 10px"></span>
                 <el-button
                    type="text"
                    size="mini"
                    @click="() => set(data)"
                    style="color: darkblue">
                    SET
                  </el-button>
                 <el-button
                         v-if="vif(data)"
                    type="text"
                    size="mini"
                    @click="() => add_configure(data)"
                    style="color: darkgreen">
                    ADD
                  </el-button>
                 <el-button
                    type="text"
                    size="mini"
                    @click="() => remove(data)"
                    style="color: darkred">
                    DEL
                  </el-button>
            </span>
        </el-tree>
        <el-card style="position: fixed;bottom: 15px;width:-webkit-calc(100% - 242px);max-height: 100px;">
            <el-input v-model="useable_par" type="textarea" :rows="3" style="float: right;width: -webkit-calc(100% - 300px)" placeholder="当前可用的变量"></el-input>

            <el-button @click="run" size="mini" type="success">执行</el-button>  <span>【正在执行】：</span> <span id="doing_api" style="color: green">...</span>
            <br>
            <el-button @click="look_report" style="margin-top: 10px" size="mini" type="primary">报告</el-button>   <span>【最终结果】：</span> <strong><span id="end_result"></span></strong>

        </el-card>
    </div>
</template>

<script>
    import axios from 'axios'
    import Report from '../components/Report'



    export default {
        name: "Project_case",
        data(){
            return{

                right_report:false,
                env_list:[],
                fd_index:'',
                chose_tab_pane:'',
                right_api:false,
                right_configure:false,
                useable_par:'',
                apis:[],
                seting_api:{},
                seting_configure:{},
                dck:[], // 默认选中
                dek:[], // 默认展开
                ref:"tree",
                tableData:[{name:"name",des:"des"}],
                activeName:"",
                response_data:{
                    R:'',
                    RD:'',
                    CR:'',
                }
            }
        },
        mounted() {
            document.getElementById('right_div').style.minHeight = (document.documentElement.clientHeight-230).toString()+'px';
            document.getElementById('right_div').style.maxHeight = (document.documentElement.clientHeight-230).toString()+'px';
            document.getElementById('left_div').style.maxHeight = (document.documentElement.clientHeight-285).toString()+'px';
            axios.get('http://localhost:8000/get_apis/',{
                params:{
                    project_id:this.project_id
                }
            }).then(res=>{
                this.apis = res.data
            });
            axios.get('http://localhost:8000/get_dck/',{
                params:{
                     project_id:this.project_id
                }
            }).then(res=>{
                this.dck = res.data
            });
             axios.get('http://localhost:8000/get_env_list/').then(
                res=>{
                    this.env_list = res.data;
                    this.restaurants = this.loadAll();
                }
            )

        },
        methods:{

            look_report(){
                this.right_configure = false;
                this.right_api = false;
                this.right_report = true;
            },
             querySearch(queryString, cb) {
                var restaurants = this.restaurants;
                var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
                // 调用 callback 返回建议列表的数据
                cb(results);
              },
              createFilter(queryString) {
                return (restaurant) => {
                  return (restaurant.host.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
                };
              },
              loadAll() {
                return this.env_list
              },
             handleSelect(item) {
                this.seting_api.host = item.host
              },
            get_action(){
                return process.env.VUE_APP_BASE_URL+'/upload_binary_file/?ApiID='+this.seting_api.id
            },
            get_json(){
                try{
                    return JSON.parse(this.response_data.R)
                }catch (e) {
                    return this.response_data.R
                }
            },
            set_fd_index(index){
                this.fd_index = index;
            },
            up_fd_file(res,file){
                var file_name ='*FILE*'+this.seting_api.id+'_'+file.raw.name;
                this.seting_api.payload_fd[this.fd_index].value = file_name;
                document.getElementById('fd_value_input_'+this.fd_index).value = file_name;
                document.getElementById('fd_value_input_'+this.fd_index).disabled = true;
            },
            upload_binary_file(res,file){
                this.seting_api.payload_binary = this.seting_api.id+'_'+file.raw.name;
            },
            up_api(){
                axios.get('http://localhost:8000/up_api/',{
                    params:{
                        api_id:this.seting_api.id,
                        project_id:this.project_id,
                    }
                }).then(res=>{
                    this.apis=res.data;
                    this.right_api = false;
                    this.dek = [ this.seting_api.id ]
                })
            },
            down_api(){
                 axios.get('http://localhost:8000/down_api/',{
                    params:{
                        api_id:this.seting_api.id,
                        project_id:this.project_id,
                    }
                }).then(res=>{
                    this.apis=res.data;
                    this.right_api = false;
                    this.dek = [ this.seting_api.id ]
                })

            },
            up_configure(){
                axios.get('http://localhost:8000/up_configure/',{
                    params:{
                        configure_id:this.seting_configure.id,
                        project_id:this.project_id
                    }
                }).then(res=>{
                    this.apis = res.data;
                    this.right_configure = false;
                    this.dek = [  parseInt(this.seting_configure.id.split('_')[0])  ]
                })
            },
            down_configure(){
                axios.get('http://localhost:8000/down_configure/',{
                    params:{
                        configure_id:this.seting_configure.id,
                        project_id:this.project_id
                    }
                }).then(res=>{
                    this.apis = res.data
                    this.right_configure = false;
                    this.dek = [  parseInt(this.seting_configure.id.split('_')[0])  ]
                })
            },
            get_label(label){
              return label.substring(0,12) + ((label.length>12)?'...':'')
            },
            handleCheckChange(data, checked){
                axios.get('http://localhost:8000/set_dck/',{
                    params:{
                        project_id:this.project_id,
                        dck:this.$refs.tree.getCheckedKeys().toString()
                    }
                }).then(res=>{
                    this.dck = res.data
                })
            },
            set(data){
                console.log(data)
                if(data.type == 'api'){
                    this.right_api = true;
                    this.right_configure = false;
                    this.right_report = false;
                    this.seting_api = data;
                    this.response_data = {R:'', RD:'', CR:''}
                    //    获取可用变量
                    axios.get('/get_useable_par/',{
                        params:{
                            api_id :data.id,
                            project_id:this.project_id
                        }
                    }).then(res=>{
                        this.useable_par = res.data;
                    })
                }else{
                    this.right_api = false;
                    this.right_configure = true;
                    this.right_report =false;
                    this.seting_configure = data
                }


            },
            remove(data){
                if(confirm("确定删除么?")==false){return}
                axios.get('http://localhost:8000/remove_ac/',{
                    params:{
                        project_id:this.project_id,
                        id: data.id,
                    }
                }).then(res=>{
                    this.apis = res.data
                    this.right_api = false;
                    this.right_configure = false;
                    this.dck.remove(data.id)
                })
            },
            vif(data){
                if(data.type=='api'){
                    return true
                }else{
                    return false
                }
            },
            handleClick(tab,event){
                console.log(tab,event)
            },
            add_configure(data){
                axios.get('http://localhost:8000/add_configure/',{
                    params:{
                        id:data.id,
                        project_id:this.project_id,
                    }
                }).then(res=>{
                    this.apis = res.data;
                    this.dek = [data.id];
                })
            },
            add_apis(){
                axios.get('http://localhost:8000/add_apis/',{
                    params:{
                        project_id : this.project_id
                    }
                }).then(res=>{
                    this.apis = res.data
                })
            },
            save_configure(){
                axios.post('http://localhost:8000/save_configure/',this.seting_configure).then(res=>{
                    this.$message({
                        message:"保存成功",
                        type:'success',
                    })
                })
            },
            save_api(){
                axios.post('http://localhost:8000/save_api/',this.seting_api,{
                    params:{
                        project_id : this.project_id
                    }
                }).then(res=>{
                    this.apis=res.data;
                    this.$message({
                        message:"保存成功",
                        type:"success"
                    })
                })
            },
            send_api(){
                axios.post('http://localhost:8000/send_api/',this.seting_api,{
                    params:{
                        project_id : this.project_id
                    }
                }).then(res=>{
                    this.response_data = res.data;
                    this.chose_tab_pane = 'Response';
                })
            },
            run(){

                this.right_configure = false;
                this.right_api = false;
                this.right_report = false;

                if(confirm('执行大用例之前请先确保当前接口或配置的设置已保存！') == false){return}
                var end_result = document.getElementById('end_result');
                var doing_api = document.getElementById('doing_api');
                var project_id = this.project_id;
                var t = setInterval(function () {
                    axios.get('/doing_api/',{
                        params:{
                            project_id: project_id
                        }
                    }).then(res=>{
                        doing_api.innerText = res.data
                    })
                },500);

                axios.get('/run/',{
                    params:{
                        project_id:this.project_id,
                        // dck:this.dck.toString(),
                    }
                }).then(res=>{
                    clearInterval(t);
                    end_result.innerText = res.data;
                    if(res.data == 'True'){
                        end_result.style.color = 'green'
                    }else{
                        end_result.style.color = 'red'
                    }
                    doing_api.innerText = '全部执行完毕'
                })

            },
            report(){

            },
            chose_configure_method(tab){
                this.seting_configure.select = '';
                this.seting_configure.value = '';
                this.seting_configure.method = tab.label;
            },
            add_params(){
                this.seting_api.params.push( {"key":"","value":""} )
            },
            del_params(index){
                this.seting_api.params.splice(index,1)
            },
            add_headers(){
                this.seting_api.headers.push({"key":"","value":""}  )
            },
            del_headers(index){
                this.seting_api.headers.splice(index,1)
            },
            add_payload_fd(){
                this.seting_api.payload_fd.push( {} )
            },
            del_payload_fd(index){
                this.seting_api.payload_fd.splice(index,1)
            },
            add_payload_xwfu(){
                this.seting_api.payload_xwfu.push( {} )
            },
            del_payload_xwfu(index){
                this.seting_api.payload_xwfu.splice(index,1)
            },
        },
        props:["project_id",],
        components:{
            Report
        }
    }
</script>

<style scoped>
    .el-table{
        max-height:200px ;
        overflow-y: scroll;
    }
    .smallfont{
        font-size: xx-small;
        color: gray;
    }
    p{
        font-size: xx-small;
        color: gray;
    }
</style>