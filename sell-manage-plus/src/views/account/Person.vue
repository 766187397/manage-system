<template>
  <div class="person">
    <el-card>
      <div slot="header"><span>管理员信息</span></div>
      <div class="content">
        管理员ID：{{ form.id }}
        <el-divider></el-divider>
        管理员ID：{{ form.account }}
        <el-divider></el-divider>
        用户组：{{ form.userGroup }}
        <el-divider></el-divider>
        创建时间：{{ form.ctime | normalizeYmd }}
        <el-divider></el-divider>
        管理员头像
        <!-- action头像上传地址 -->
        <!-- show-file-list是否显示已上传文件列表 -->
        <!-- on-success文件上传成功时的钩子 -->
        <!-- before-upload上传文件之前的钩子 -->
        <el-upload
          class="avatar-uploader"
          :action="API + '/users/avatar_upload'"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
        >
          <img v-if="form.imgUrl" :src="form.imgUrl" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>

        <el-button
          @click="uploadImg"
          class="btn-upload"
          size="small"
          type="primary"
          >确定上传</el-button
        >
      </div>
    </el-card>
  </div>
</template>

<script>
// 引入ajax函数
import { editAvatar } from "@/api/user";
import local from '@/utils/local'
export default {
  data() {
    return {
      API: 'http://localhost:5000',
      //数据占位
      form: {
        account: "",
        ctime: "",
        id: '',
        imgUrl: "",
        userGroup: "",
      },
    }
  },
  //函数
  methods: {
    //上传成功触发
    handleAvatarSuccess(res) {
      //res 后台返给前段的数据
      let { code, msg, imgUrl } = res;
      if (code === 0) {
        this.$message({
          type: 'success',
          message: msg
        })
        //处理格式 [返回的地址 后台决定，缺什么拼什么]
        this.form.imgUrl = this.API + imgUrl
      } else {
        this.$message.error(msg)
      }
    },
    //上传之前触发 用于限制格式和大小
    beforeAvatarUpload(file) {
      const isJPG = /[jpeg|png]/.test(file.type);
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isJPG && isLt2M;
    },
    //上传头像到数据库
    async uploadImg() {
      //处理数据
      let temp = this.form.imgUrl
      let imgUrl = temp.substr(temp.lastIndexOf('/') + 1)
      //上传
      let res = await editAvatar({ imgUrl });
      let { code, msg } = res.data;
      //为0 表成功
      if (code === 0) {
        //中央事件总线 发送数据
        this.$bus.$emit('uploadImg')
      } else {
        this.$message.error(msg)
      }
    }
  },
  //生命周期发送ajax
  created() {
    //拉取本地数据 赋值给form
    this.form = local.get('userInfo')
  }
}
</script>

<style lang="scss" scoped>
.btn-upload {
  margin-top: 20px;
}
.avatar-uploader {
  margin-top: 20px;
}
.avatar-uploader ::v-deep .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 90px;
  height: 90px;
  line-height: 90px;
  text-align: center;
}
.avatar {
  width: 90px;
  height: 90px;
  display: block;
}
</style>