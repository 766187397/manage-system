# DAY04

## 0 今日目标

ajax接口联调，数据交互。

- 账号列表
- 删除账号
- 编辑账号
- 批量删除账号
- 修改密码
- 个人中心
- 判断用户的登录状态。



## 1 账号管理模块

### 1.1 账号列表（带分页）

- AccountList.vue

```js
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
        <el-table-column label="日期" prop="ctime"> </el-table-column>
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
        :current-page="currentPage"
        :page-sizes="[3, 5]"
        :page-size="100"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
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
//引入接口管理层的user模块 对应的ajax接口函数
import { getUserList } from '@/api/user'

import { normalizeYmd } from "@/utils/tool";

export default {
  //数据
  data() {
    return {
      //表格数据
      tableData: [],
      //当前页
      currentPage: 1,
      //每页几条
      pageSize: 3,
      //总条数
      total: 0
    }
  },
  //函数
  methods: {
    //获取数据
    async getData() {
      let res = await getUserList({ currentPage: this.currentPage, pageSize: this.pageSize })
      //解构数据
      let { total, data } = res.data;
      this.total = total;
      #赋值之前要处理数据  !!!
      data.forEach(v => {
        v.ctime = normalizeYmd(v.ctime)
      })
      #赋值
      this.tableData = data
    },
    //改变页码触发
    handleSizeChange(val) {
      #把val 赋值给 pageSize
      this.pageSize = val;
      #拉取数据
      this.getData()

    },
    //当前页改变触发
    handleCurrentChange(val) {
      #当前页 赋值给 currentPage
      this.currentPage = val;
      //拉去数据
      this.getData()
    },
    //编辑
    handleEdit(index, row) {
      console.log(`index`, index)
      console.log(`row`, row)
    },
    //删除
    handleDelete(index, row) {

    }
  },
  //生命周期created 获取ajax数据
  created() {
    #初始化获取数据
    this.getData()
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



### 1.2 全局过滤器【扩展】

- filters/index.js

```js
/**
 * 全局过滤器
 */

//处理日期 格式是 年月日
export const normalizeYmd = (date) => {
    let time = new Date(date);
    let y = time.getFullYear();
    let m = time.getMonth() + 1;
    let d = time.getDate();
    let res = [y, m, d].map(v => v.toString().padStart(2, '0'));
    return res.join('/')
}

// 处理格式 年与日 时分秒
export const normalizeYmdHms = (date) => {
    let time = new Date(date);
    let y = time.getFullYear();
    let M = time.getMonth() + 1;
    let d = time.getDate();

    let h = time.getHours();
    let m = time.getMinutes();
    let s = time.getSeconds();

    let res = [y, M, d, h, m, s].map(v => v.toString().padStart(2, '0'));
    return res.slice(0, 3).join('-') + ' ' + res.slice(3).join(':')
}


//处理格式 时分秒 
export const normalizeHms = (date) => {
    let time = new Date(date);

    let h = time.getHours();
    let m = time.getMinutes();
    let s = time.getSeconds();

    let res = [h, m, s].map(v => v.toString().padStart(2, '0'));
    return res.join(':')
}

// 千分加逗号
export const numFormat = (num) => {
    return (num.toString().indexOf('.') !== -1) ? num.toLocaleString() : num.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
}
```

- main.js

```js
//注册全局过滤器
import * as filters from '@/filters'
Object.keys(filters).forEach(v => {
  // 注册
  Vue.filter(v, filters[v])
})
```



### 1.3 删除功能

- AccountList.vue

```js
//获取数据
async getData() {
    let res = await getUserList({ currentPage: this.currentPage, pageSize: this.pageSize })
    //解构数据
    let { total, data } = res.data;
    this.total = total;
    //赋值之前要处理数据  !!!
    // data.forEach(v => {
    //   v.ctime = normalizeYmd(v.ctime)
    // })
    //赋值
    this.tableData = data

    //当前页不为1 拉取数据为空。  当前页码-1 再拉取数据
    if (this.currentPage !== 1 && this.tableData.length === 0) {
        //页码-1
        this.currentPage -= 1;
        //拉取数据
        this.getData()
    }
},

    //删除
    async handleDelete(row) {
        let res = await deleteUser({ id: row.id });
        let { code, msg } = res.data;
        //判断code
        if (code === 0) {
            this.$message({
                type: 'success',
                message: msg
            })
            //拉取数据
            this.getData()
        } else {
            this.$message.error(msg)
        }
    }
```



### 1.4 编辑功能

- AccountList.vue

```js
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
        <el-table-column label="日期">
          <!-- 作用域插槽  -->
          <template slot-scope="scope">
            <span>{{ scope.row.ctime | normalizeYmd }}</span>
          </template>
        </el-table-column>
        <!-- 操作 -->
        <el-table-column label="操作" width="160">
          <template slot-scope="scope">
            <el-button
              class="btn-edit"
              size="mini"
              @click="
                handleEdit(scope.row);
                dialogFormVisible = true;
              "
              >编辑</el-button
            >
            <el-popconfirm
              @confirm="handleDelete(scope.row)"
              @cancel="$message({ type: 'info', message: '取消删除' })"
              title="这是一段内容确定删除吗？"
            >
              <el-button slot="reference" size="mini" type="danger"
                >删除</el-button
              >
            </el-popconfirm>
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
        :current-page="currentPage"
        :page-sizes="[3, 5]"
        :page-size="100"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        class="pagination"
      >
      </el-pagination>
      <!-- 操作按钮 -->
      <div class="bottom-box">
        <el-button type="danger" size="small">批量删除</el-button>
        <el-button type="primary" size="small">取消选择</el-button>
      </div>
    </div>

    <!-- 编辑弹窗 -->
    <el-dialog title="编辑账号" :visible.sync="dialogFormVisible">
      <el-form size="small" :model="form" label-width="100px">
        <!-- 账号 -->
        <el-form-item label="账号">
          <el-input v-model="form.account" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="用户组">
          <el-select v-model="form.userGroup" placeholder="请选择用户组">
            <el-option label="普通管理员" value="普通管理员"></el-option>
            <el-option label="超级管理员" value="超级管理员"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogFormVisible = false"
          >取 消</el-button
        >
        <el-button size="small" type="primary" @click="handleEditConfirm"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
//引入接口管理层的user模块 对应的ajax接口函数
import { getUserList, deleteUser, editUser } from '@/api/user'

//import { normalizeYmd } from "@/utils/tool";
export default {
  //数据
  data() {
    return {
      #弹窗表单数据
      form: {
        id: '',
        account: '',
        userGroup: ''
      },
      #编辑弹出显示
      dialogFormVisible: false,
    }
  },
  //函数
  methods: {
    #编辑
    handleEdit(row) {
      //回填数据
      this.form = row
    },
    #确定编辑
    async handleEditConfirm() {
      //解构需要的数据
      let { id, account, userGroup } = { ...this.form }
      let res = await editUser({ id, account, userGroup });
      let { code, msg } = res.data;
      //code为0表示成功
      if (code === 0) {
        this.$message({
          type: 'success',
          message: msg
        })
        //关闭弹窗
        this.dialogFormVisible = false;
      } else {
        this.$message.error(msg)
      }
    },
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
::v-deep .el-dialog__body .el-input__inner {
  width: 215px;
}
.btn-edit {
  margin-right: 10px;
}
</style>
```



#### 1.4.1 编辑回填【同上】

#### 1.4.2 保存编辑【同上】

### 1.5 取消选择

```js
export default {
    #多选框触发
    handleSelChange(val) {
      //处理数据
      this.ids = JSON.stringify(val.map(v => v.id))
    },
    #取消选择
    handleCancelSel() {
      this.$refs.table.clearSelection();
      this.$message({
        type: 'success',
        message: '取消成功'
      })
    },
    #批量删除
    handleBatchDel() {
      this.$confirm('您是否确认要批量删除这些用户吗？', '批量删除', {
        distinguishCancelAndClose: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
        .then(async () => {
          let res = await deleteBatchUser({ ids: this.ids })
          let { code, msg } = res.data;
          if (code === 0) {
            this.$message({
              type: 'success',
              message: msg
            });
            //拉取数据
            this.getData()
          } else {
            this.$message.error(msg)
          }
        })
        .catch(action => {
          this.$message({
            type: 'info',
            message: action === 'cancel'
              ? '放弃保存并离开页面'
              : '停留在当前页面'
          })
        });
    }
  },
  //生命周期created 获取ajax数据
  created() {
    //初始化获取数据
    this.getData()
  },
}
</script>
```

### 1.6 批量删除[同上]

### 1.7 个人中心

- Person.vue

```vue
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
    #上传成功触发
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
    #上传之前触发 用于限制格式和大小
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
    #上传头像到数据库
    async uploadImg() {
      //处理数据
      let temp = this.form.imgUrl
      let imgUrl = temp.substr(temp.lastIndexOf('/') + 1)
      //上传
      let res = await editAvatar({ imgUrl });
      let { code, msg } = res.data;
      //为0 表成功
      if (code === 0) {
        this.$message({
          type: 'success',
          message: msg
        })
        #中央事件总线 发送数据
        this.$bus.$emit('uploadImg')
      } else {
        this.$message.error(msg)
      }
    }
  },
  //生命周期发送ajax
  created() {
    #拉取本地数据 赋值给form
    this.form = JSON.parse(window.localStorage.getItem('userInfo'))
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
```

- RightHeader.vue

```js
 created() {
    #中央事件总线 接受数据
    this.$bus.$on('uploadImg', () => {
      this.getData()
    })
  },
```

## 2 头部信息

### 2.1 头部信息渲染

- RightHeader.vue

```js
<template>
  
      <el-col :span="12" :md="16" class="right">
        <!-- 下拉菜单 -->
        <el-dropdown @command="handleDropDown">
          <span class="el-dropdown-link">
            欢迎你,{{ form.account
            }}<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="person">个人中心</el-dropdown-item>
            <el-dropdown-item command="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <!-- 头像 -->
        <el-avatar :size="40" :src="form.imgUrl"></el-avatar>
      </el-col>
   
</template>

<script>
import { getUserInfo } from "@/api/user";
export default {
  //数据
  data() {
    return {
      //面包屑导航数据
      breadList1: [],
      //个人信息
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
    //获取数据
    async getData() {
      let res = await getUserInfo();
      this.form = res.data;
      //把个人信息储存到本地
      window.localStorage.setItem('userInfo', JSON.stringify({ ...this.form }))
    },
    #下拉触发
    handleDropDown(val) {
      if (val === 'person') {
        this.$router.push('/account/person')
      }
      if (val === 'logout') {
        #注销 清理本地数据 跳转到登录页、
        window.localStorage.clear();
        this.$router.push('/login')
      }
    }
  },
  //生命周期
  created() {
    //初始化获取用户信息
    this.getData();
    //中央事件总线 接受数据
    this.$bus.$on('uploadImg', () => {
      this.getData()
    })
  },
}
</script>

<style lang="scss" scoped>
.right-header {
  width: 100%;

  padding: 0 10px;
}
.el-row {
  height: 100%;
}
.breadcrumb {
  height: 100%;
}
.el-col {
  height: 100%;
  display: flex;
  align-items: center;
}
.right {
  justify-content: flex-end;
}
.el-avatar {
  margin: 0 5px;
}
.el-dropdown-link {
  cursor: pointer;
}
</style>
```



### 2.2 退出登录【同上】

## 3 今日任务

- 账号模块所有功能
- 商品列表 【扩展】
  - 添加
  - 列表分页
  - 编辑
  - 删除

















