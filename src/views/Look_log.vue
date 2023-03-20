<template>
    <div style="height: 100%">
       <el-container style="height: 100%">
           <el-aside style="width: 200px">
                <Menu></Menu>
           </el-aside>

           <el-main>
                <h1>查看日志 <span style="font-size: xx-small;color: gray">（请使用ctrl/command + F 来查询关键字）</span> </h1>
                <span style="font-size: xx-small;color: gray">（最近1000行数据）</span>
                <el-input type="textarea" :rows="10" v-model="res.logs"></el-input>
               <el-divider></el-divider>
               错误数：<strong style="color: #c50000;font-size: xx-large">{{res.error_count}}</strong>
               <br><br>
               错误行：<strong style="color: #c50000;">{{res.error_lines}}</strong>
               <el-divider></el-divider>
               警告数：<strong style="color: #c50000;font-size: xx-large">{{res.warning_count}}</strong>
               <br><br>
               警告行：<strong style="color: #c50000;">{{res.warning_lines}}</strong>
               <el-divider></el-divider>
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
                res:{
                    logs:'',
                    error_count:0,
                    error_lines:[],
                    warning_count:0,
                    warning_lines:[]
                }

            }
        },
        mounted(){
            axios.get('http://localhost:8000/look_log/').then(res=>{
                this.res = res.data
            })
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