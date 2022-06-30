<template>
  <div class="goods-list">
    <el-card>
      <div slot="header"><span>添加商品</span></div>
      <div class="content">
        <!-- form表单 -->
        <el-form
          :model="formData"
          size="small"
          label-width="100px"
          class="form"
        >
          <!-- 商品名称 -->
          <el-form-item label="商品名称">
            <el-input type="text" v-model="formData.name"></el-input>
          </el-form-item>
          <!-- 商品分类 -->
          <el-form-item label="商品分类">
            <el-select v-model="formData.category" placeholder="请选择用户组">
              <el-option
                :label="item.cateName"
                v-for="item in cateList"
                :value="item.cateName"
                :key="item.cateName"
              ></el-option>
            </el-select>
          </el-form-item>
          <!-- 商品价格 -->
          <el-form-item label="商品价格">
            <el-input-number
              v-model="formData.price"
              :min="1"
              :max="1000"
              label="描述文字"
            ></el-input-number>
          </el-form-item>
          <!-- 商品图片 -->
          <el-form-item label="商品图片">
            <el-upload
              class="avatar-uploader"
              :action="API + '/goods/goods_img_upload'"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
            >
              <img
                v-if="formData.imgUrl"
                :src="formData.imgUrl"
                class="avatar"
              />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
          <!-- 商品描述 -->
          <el-form-item label="商品名称">
            <el-input
              type="textarea"
              :rows="2"
              placeholder="请输入内容"
              v-model="formData.goodsDesc"
            >
            </el-input>
          </el-form-item>
          <!-- 操作 -->
          <el-form-item>
            <el-button @click="submit" type="primary">添加商品</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
import { addGoods, getAllCate } from "@/api/goods";
export default {
  data() {
    return {
      //主机地址
      API: 'http://localhost:5000',
      //表单数据
      formData: {
        name: '',
        category: '',
        price: '',
        imgUrl: '',
        goodsDesc: ''
      },
      //商品分类
      cateList: []
    }
  },
  //函数
  methods: {
    //获取所有分类
    async getAllCate() {
      let res = await getAllCate();
      this.cateList = res.data
    },
    //提交表单
    async submit() {
      let imgUrl = this.formData.imgUrl;
      //截取需要的图片名称
      imgUrl = imgUrl.substr(imgUrl.lastIndexOf('/') + 1);
      //发生数据给后台 对象浅拷贝+扩展运算符高级用法
      let res = await addGoods({ ...this.formData, imgUrl })
      let { code } = res.data;
      //成功跳转到商品列表页面
      if (code === 0) {
        this.$router.push({ path: '/goods' })
      }
    },
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
        this.formData.imgUrl = this.API + imgUrl
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

  },
  created() {
    this.getAllCate()
  }
}
</script>

<style lang="scss" scoped>
.form {
  width: 350px;
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