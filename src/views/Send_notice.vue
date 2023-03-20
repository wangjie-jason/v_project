<template>
    <div style="height: 100%">
       <el-container style="height: 100%">
           <el-aside style="width: 200px">
                <Menu></Menu>
           </el-aside>

           <el-main>
                <h1>发送公告</h1>

               <el-input
                type="textarea"
                :rows="5"
                placeholder="请输入公告内容"
                v-model="content"
               >
               </el-input>
               <br>
               <br>

               &#12288;<el-button @click="send_notice" type="primary" plain="">发送公告</el-button>


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
            }
        },
        methods:{
             send_notice(){
                axios.post('http://localhost:8000/send_notice/',{'content':this.content}).then(res=>{
                    this.$message({
                        message:'发送公告成功',
                        type:'success'
                    })
                })
             }
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