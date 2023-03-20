<template>
    <div style="height: 100%">
       <el-container style="height: 100%">
           <el-aside style="width: 200px">
                <Menu></Menu>
           </el-aside>

           <el-main>
                <h1>发送消息</h1>

               <el-input
                type="textarea"
                :rows="5"
                placeholder="请输入消息内容"
                v-model="content"
               >
               </el-input>
               <br>
               <br>

               <el-autocomplete
                  class="inline-input"
                  v-model="state1"
                  :fetch-suggestions="querySearch"
                  placeholder="输入接收者用户名"
                  @select="handleSelect"
                  :trigger-on-focus="true"
                  style="float: left;width: 500px"

                >
                    <template slot-scope="{ item }">
                        <div style="color: #0a2d8f"><strong>用户名：{{item.username}}</strong></div>
                        <img onerror="this.src='/static/user_avatar/default.png'" class="avatar" style="float: left;width: 50px;height: 50px" :src="'/static/user_avatar/userImg_'+item.id+'.jpg'" alt="">
                        <span style="color: gray;font-size: xx-small">【ID: {{item.id}}】</span>
                        <span style="color: gray;font-size: xx-small">【{{item.first_name}}】</span>
                        <el-divider></el-divider>
                    </template>
               </el-autocomplete>


               &#12288;<el-button @click="send_news" type="primary" plain="">发送消息</el-button>

               <br><br>

           <el-card class="box-card" style="overflow-y: auto;width: 100%;min-height: -webkit-calc(100% - 280px)">
              <div slot="header" class="clearfix">
                <span>历史消息</span>
              </div>
                <div v-for="o in news" class="text item">
                    <span style="color: gray">发送者：【 {{o.from_user_name}} 】</span>
                    <span style="color: #8c939d;font-size: xx-small">（{{o.date}}）</span>
                    <br><br>
                    <strong>{{o.content}}</strong>
                    <el-divider></el-divider>
                </div>
            </el-card>



           </el-main>
       </el-container>
    </div>
</template>

<script>
    import Menu from '../components/Menu'
    import axios from 'axios'
    export default {
        data(){
            return{
                content:'',
                restaurants: [],
                state1: '',
                to_user_list:[],
                to_user_id:'',
                news:[],
            }
        },
        methods:{
            querySearch(queryString, cb) {
                var restaurants = this.restaurants;
                var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
                // 调用 callback 返回建议列表的数据
                cb(results);
              },
              createFilter(queryString) {
                return (restaurant) => {
                  return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
                };
              },
              loadAll() {
                return this.to_user_list
              },
              handleSelect(item) {
                this.to_user_id = item.id
              },
             send_news(){
                axios.post('http://localhost:8000/send_news/',{'content':this.content,'to_user_id':this.to_user_id}).then(res=>{
                    this.$message({
                        message:'发送消息成功',
                        type:'success'
                    })
                })
             }
        },
        mounted(){
            axios.get('http://localhost:8000/get_to_user_list/').then(res=>{
                this.to_user_list = res.data.to_user_list;
                this.news = res.data.news;
                this.restaurants = this.loadAll();
            });


        },
        components:{
            Menu
        }
    }
</script>
<style >
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