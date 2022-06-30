<template>
  <el-card class="password-modify">
    <div slot="header"><span>修改密码</span></div>
    <div class="content">
      <!-- form表单 -->
      <el-form
        :rules="rules"
        :model="formData"
        size="small"
        label-width="100px"
        class="form"
        status-icon
        ref="form"
      >
        <!-- 原密码 -->
        <el-form-item prop="password" label="原密码">
          <el-input v-model="formData.password" type="text"></el-input>
        </el-form-item>
        <!-- 新密码 -->
        <el-form-item prop="newPassword" label="新密码">
          <el-input v-model="formData.newPassword" type="password"></el-input>
        </el-form-item>
        <!-- 确认新密码 -->
        <el-form-item prop="twiceNewPassword" label="确认新密码">
          <el-input
            v-model="formData.twiceNewPassword"
            type="password"
          ></el-input>
        </el-form-item>
        <!-- 操作 -->
        <el-form-item>
          <el-button @click="submit" type="primary">确认</el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </el-card>
</template>

<script>
export default {
  //数据
  data() {
    //验证密码
    const checkPwd = (rule, value, callback) => {
      //非空验证
      if (value === '') {
        callback(new Error('密码不能为空！'))
      } else if (!/^[a-zA-Z0-9_]{6,12}$/.test(value)) {
        callback(new Error('数字，英文，下划线 6至12位'))
      } else {
        //验证成功必填
        callback()
      }
    }
    const checkNewPwd = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('密码不能为空！'))
      } else if (value === this.formData.password) {
        callback(new Error('新密码不能和原密码相同！'))
      } else if (!/^[a-zA-Z0-9_]{6,12}$/.test(value)) {
        callback(new Error('数字，英文，下划线 6至12位'))
      } else {
        //当确认新密码不为空的时候 再验证一次 确认新密码
        if (this.formData.checkTwiceNewPwd !== '') {
          this.$refs.form.validateField('twiceNewPassword')
        }
        callback()
      }
    }
    const checkTwiceNewPwd = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('密码不能为空！'))
      } else if (value !== this.formData.newPassword) {
        callback(new Error('密码不同'))
      } else {
        callback()
      }
    }

    return {
      //表单数据
      formData: {
        password: '',
        newPassword: '',
        twiceNewPassword: ''
      },
      //验证规则
      rules: {
        password: [{ validator: checkPwd, trigger: 'blur' }],
        newPassword: [{ validator: checkNewPwd, trigger: 'blur' }],
        twiceNewPassword: [{ validator: checkTwiceNewPwd, trigger: 'blur' }],
      }
    }
  },
  //函数
  methods: {
    //提交表单
    submit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          console.log(`this.formData`, this.formData)
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
</style>