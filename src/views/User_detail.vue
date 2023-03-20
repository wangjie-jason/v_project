<template>
    <div style="height: 100%">
       <el-container style="height: 100%">
           <el-aside style="width: 200px">
                <Menu></Menu>
           </el-aside>

           <el-main>
                <h1>个人资料设置</h1>
                <el-form ref="form" :model="form_data" label-width="100px" :label-position="'left'">
                    <el-form-item label="您的用户名">
                        <el-input v-model="form_data.user_name"></el-input>
                    </el-form-item>

                    <el-form-item label="您的密码">
                        <el-input v-model="form_data.password"></el-input>
                    </el-form-item>

                    <el-form-item label="职位头衔">
                        <el-input v-model="form_data.title"></el-input>
                    </el-form-item>

                    <el-form-item label="头像">
                        <el-upload
                          class="avatar-uploader"
                          action="http://localhost:8000/upload_user_avatar/"
                          :show-file-list="false"
                          :on-success="handleAvatarSuccess"
                            name="user_avatar"
                            >
                          <img v-if="imageUrl" :src="imageUrl" class="avatar">
                          <i v-else class="el-icon-plus avatar-uploader-icon" style="line-height: 178px" ></i>
                        </el-upload>
                    </el-form-item>

                    <el-form-item>
                        <el-button type="primary" @click="save_user_detail">保存生效</el-button>
                    </el-form-item>


                </el-form>
           </el-main>
       </el-container>
    </div>
</template>

<script>
    import Menu from '../components/Menu'
    import axios from 'axios'
    export default {
        name: "User_detail",
        data(){
            return{
                imageUrl: '',
                form_data:{
                    user_name:'',
                    password:'',
                    title:'',
                    user_id:'',
                }
            }
        },
        methods:{
          save_user_detail(){
              axios.post('http://localhost:8000/save_user_detail/',this.form_data).then(res=>{
                  this.$message({
                      message:'保存成功',
                      type:'success',
                  })
              })
          },
            handleAvatarSuccess(res, file) {
                this.imageUrl = URL.createObjectURL(file.raw);
              },
              beforeAvatarUpload(file) {
                const isJPG = file.type === 'image/jpeg';
                const isLt2M = file.size / 1024 / 1024 < 2;
                if (!isJPG) {
                  this.$message.error('上传头像图片只能是 JPG 格式!');
                }
                if (!isLt2M) {
                  this.$message.error('上传头像图片大小不能超过 2MB!');
                }
                return isJPG && isLt2M;
              }
        },
        mounted(){
          axios.get('http://localhost:8000/get_user_detail/').then(res=>{
              this.form_data = res.data;
              this.imageUrl = '/static/user_avatar/userImg_'+res.data.user_id+'.jpg'
          })
        },
        components:{
            Menu
        }
    }
</script>
<style >

    .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
      height: 178px;
      line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }


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