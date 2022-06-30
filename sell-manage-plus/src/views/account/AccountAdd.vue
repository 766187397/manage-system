<template>
  <el-card class="account-add">
    <div slot="header">
      <span>添加账号</span>
    </div>
    <!-- 内容部分 -->
    <div class="content">
      <!-- model绑定表单数据 -->
      <!-- status-icon验证规则的图标反馈 -->
      <!-- rules验证规则对象 -->
      <!-- label-width	表单域标签的宽度 -->
      <el-form
        :model="formData"
        status-icon
        :rules="rules"
        size="small"
        ref="form"
        class="form"
        label-width="80px"
      >
        <!-- 账号 -->
        <el-form-item label="账号" prop="account">
          <el-input
            type="text"
            v-model="formData.account"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item label="密码" prop="password">
          <el-input
            type="password"
            v-model="formData.password"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <!-- 用户组 -->
        <el-form-item label="用户组" prop="userGroup">
          <el-select v-model="formData.userGroup" placeholder="请选择用户组">
            <el-option label="超级管理员" value="超级管理员"></el-option>
            <el-option label="普通管理员" value="普通管理员"></el-option>
          </el-select>
        </el-form-item>
        <!-- 操作 -->
        <el-form-item>
          <el-button @click="submit" type="primary">添加</el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </el-card>
</template>

<script>
//引入工具函数
import { checkAccount, checkPassword } from '@/utils/tool'

//引入ajax接口管理层的接口函数 addUser
import { addUser } from '@/api/user'

export default {
  //数据
  data() {
    return {
      //表单数据
      formData: {
        account: '',
        password: '',
        userGroup: ''
      },
      //规则
      rules: {
        account: [{ validator: checkAccount, trigger: 'blur' }],
        password: [{ validator: checkPassword, trigger: 'blur' }],
        userGroup: [
          { required: true, message: '请选择用户组', trigger: 'blur' },
        ]
      }
    }
  },
  //函数
  methods: {
    //提交方法
    submit() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          let res = await addUser({ ...this.formData });
          //解构响应数据
          let { code, msg } = res.data;
          //判断code状态
          if (code === 0) {
            //跳转到账号列表
            this.$router.push('/account/account-list')
          }
        } else {
          console.log('验证不通过！');
        }
      })
    },
    //重置表单
    resetForm() {
      this.$refs.form.resetFields()
    }
  },
}
</script>

<style lang="scss" scoped>
.form {
  width: 300px;
}
::v-deep .el-input__inner {
  width: 215px;
}
</style>