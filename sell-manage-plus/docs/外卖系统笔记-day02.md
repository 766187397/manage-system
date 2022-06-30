# sell-manage项目开发笔记

# DAY02

## 0 今日目标

- 组件强化【重点】
- 插槽【理解】

## 1 登录组件实现

Login.vue

```js
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
        <!-- prop验证字段 必须和表单数据一致 -->
        <el-form-item prop="account">
          <el-input
            prefix-icon="iconfont icon-account"
            type="text"
            v-model="formData.account"
            autocomplete="off"
          ></el-input>
        </el-form-item>

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

        <el-form-item>
          <el-button class="btn" @click="submit" type="primary">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
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
        account: [
          //required 必填 message提示信息 trigger触发方式
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 12, message: '长度在 3 到 12 个字符', trigger: 'blur' }
        ],
        password: [
          //required 必填 message提示信息 trigger触发方式
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur' }
        ],
      },
      //密码输入框状态
      isPwd: true,
    }
  },
  //函数
  methods: {
    //提交方法
    submit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          console.log(`this.formData`, this.formData)
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
  background: url("../../assets/imgs/bg.jpeg") top center no-repeat;
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
```



## 2 头部组件

## 3 添加账号组

- AccountAdd.vue

```vue
<template>
  <el-card class="account-add">
    <div slot="header">
      <span>添加账号</span>
    </div>
    <!-- 内容部分 -->
    <div class="content">
      <!-- model绑定表单数据 -->
      <!-- status-icon验证规则的图标反馈 -->
      <!-- 验证规则对象 -->
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
        account: [
          //required 必填 message提示信息 trigger触发方式
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 12, message: '长度在 3 到 12 个字符', trigger: 'blur' }
        ],
        password: [
          //required 必填 message提示信息 trigger触发方式
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur' }
        ],
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
::v-deep .el-input__inner {
  width: 215px;
}
</style>
```



## 4 账号列表组件

- AccountAdd.vue

```vue
<template>
  <el-card class="account-list">
    <div slot="header"><span>账号列表</span></div>
    <div class="content">
      <!-- 表格 -->
      <!-- data绑定数据 -->
      <el-table :data="tableData" style="width: 100%">
        <el-table-column type="selection" width="55"> </el-table-column>
        <!-- 账号 -->
        <!-- prop 对应列内容的字段名 -->
        <el-table-column label="账号" prop="account"> </el-table-column>
        <!-- 用户组 -->
        <el-table-column label="用户组" prop="userGroup"> </el-table-column>
        <!-- 日期 -->
        <el-table-column label="日期" prop="date"> </el-table-column>
        <!-- 操作 -->
        <el-table-column label="操作" width="160">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.$index, scope.row)"
              >编辑</el-button
            >
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <!-- background 背景色  -->
      <!-- page-size显示条目数 -->
      <!-- total总页数 -->
      <!-- current-page当前页数 -->
      <!-- page-sizes显示每页多少条选项 -->
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage4"
        :page-sizes="[100, 200, 300, 400]"
        :page-size="100"
        layout="total, sizes, prev, pager, next, jumper"
        :total="400"
        class="pagination"
      >
      </el-pagination>
      <!-- 操作按钮 -->
      <div class="bottom-box">
        <el-button type="danger" size="small">批量删除</el-button>
        <el-button type="primary" size="small">取消选择</el-button>
      </div>
    </div>
  </el-card>
</template>

<script>
export default {
  //数据
  data() {
    return {
      //表格数据
      tableData: [
        {
          account: '千寻',
          userGroup: '超级管理员',
          date: '2019/10-19'
        },
        {
          account: '千寻',
          userGroup: '超级管理员',
          date: '2019/10-19'
        },
        {
          account: '千寻',
          userGroup: '超级管理员',
          date: '2019/10-19'
        }
      ],
      currentPage4: 1,
    }
  },
  //函数
  methods: {
    handleSizeChange() {

    },
    handleCurrentChange() {

    }
  },
}
</script>

<style lang="scss" scoped>
.pagination {
  margin-top: 20px;
}
.bottom-box {
  margin-top: 20px;
}
</style>
```

## 5 3大错误类型

-  SyntaxError 【语法错误】 整个js代码都不执行
- ReferenceError【引用错误】-- 【没定义】
- TypeError 【类型错误】 -- 【定义了，但是不能这样用】

## 6 今日任务

- 完整整个项目`所有`静态页面组件