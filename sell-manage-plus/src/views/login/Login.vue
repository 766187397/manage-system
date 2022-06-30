<template>
  <div class="login">
    <!-- 登录表单 -->
    <div class="form">
      <div class="title">
        <img class="logo" src="../../assets/imgs/apple.png" alt="" />
        系统登录
      </div>
      <!-- 表单组件 -->
      <!-- size属性控制整个表单控件的大小 -->
      <!-- model属性绑定表单数据 -->
      <!-- rules表单验证规则 -->
      <!-- status-icon反馈验证图标 -->
      <el-form
        :rules="rules"
        ref="form"
        size="small"
        status-icon
        :model="formData"
      >
        <!-- 账号 -->
        <!-- prop验证字段 必须和表单数据一致 -->
        <el-form-item prop="account">
          <el-input
            prefix-icon="iconfont icon-account"
            type="text"
            v-model="formData.account"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
            v-model="formData.password"
            :type="isPwd ? 'password' : 'text'"
            autocomplete="off"
          >
            <i slot="prefix" class="iconfont icon-lock"></i>
            <i
              v-if="isPwd"
              slot="suffix"
              @click="isPwd = !isPwd"
              class="iconfont icon-eye-close"
            ></i>
            <i
              v-else
              slot="suffix"
              @click="isPwd = !isPwd"
              class="iconfont icon-eye-open"
            ></i>
          </el-input>
        </el-form-item>
        <!-- 操作 -->
        <el-form-item>
          <el-button class="btn" @click="submit" type="primary">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
//引入工具函数
import { checkAccount, checkPassword } from '@/utils/tool'
import local from '@/utils/local'

//引入对应的用户ajax模块函数
import { checkLogin } from '@/api/user'

//引入创建路由函数
import { createRoutes } from '@/router'

export default {
  //数据
  data() {
    return {
      //表单数据
      formData: {
        account: '',
        password: ''
      },
      //表单验证规则对象
      rules: {
        account: [{ validator: checkAccount, trigger: 'blur' }],
        password: [{ validator: checkPassword, trigger: 'blur' }],
      },
      //密码输入框状态
      isPwd: true,
    }
  },
  //函数
  methods: {
    //提交方法
    submit() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          //发送请求
          let res = await checkLogin({ ...this.formData });
          //解构数据
          let { code, role, token } = res.data;

          //如果code值为0 表示成功
          if (code === 0) {
            //token鉴权 存入本地
            local.set('t_k', token);

            //把角色存入本地
            local.set('role', role);

            //登录时 调用一次创建路由
            createRoutes()

            //跳转到首页
            // this.$router.push('/home')
            this.$router.push({ path: '/' })
          }
        } else {
          console.log('验证不通过！');
        }
      })
    }
  },
}
</script>

<style lang="scss" scoped>
.login {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  background: url("../../assets/imgs/bg.jpeg") #21334d top center no-repeat;
  background-size: auto 100%;
}
.form {
  width: 300px;
  height: 240px;
  .title {
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    letter-spacing: 2px;
    color: white;
  }
  .btn {
    width: 100%;
  }
  ::v-deep .el-input__inner {
    background: transparent;
    color: white;
  }
}
.logo {
  animation: turnAround 5s linear infinite;
  width: 40px;
  margin-right: 5px;
}

@keyframes turnAround {
  0% {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(180deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>