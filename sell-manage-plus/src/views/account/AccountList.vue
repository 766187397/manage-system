<template>
  <el-card class="account-list">
    <div slot="header"><span>账号列表</span></div>
    <div class="content">
      <!-- 表格 -->
      <!-- data绑定数据 -->
      <el-table
        @selection-change="handleSelChange"
        :data="tableData"
        ref="table"
        :style="{ width: w + 'px' }"
      >
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
        <el-button type="danger" @click="handleBatchDel" size="small"
          >批量删除</el-button
        >
        <el-button type="primary" @click="handleCancelSel" size="small"
          >取消选择</el-button
        >
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
import { getUserList, deleteUser, editUser, deleteBatchUser } from '@/api/user'

// import { normalizeYmd } from "@/utils/tool";
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
      total: 0,
      //弹窗表单数据
      form: {
        id: '',
        account: '',
        userGroup: ''
      },
      //编辑弹出显示
      dialogFormVisible: false,
      //table宽度
      w: 0
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
    //改变页码触发
    handleSizeChange(val) {
      //把val 赋值给 pageSize
      this.pageSize = val;
      //拉取数据
      this.getData()
    },
    //当前页改变触发
    handleCurrentChange(val) {
      //当前页 赋值给 currentPage
      this.currentPage = val;
      //拉去数据
      this.getData()
    },
    //编辑
    handleEdit(row) {
      //回填数据 数据脱绑
      this.form = { ...row }
    },
    //确定编辑
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
    //删除
    async handleDelete(row) {
      let res = await deleteUser({ id: row.id });
      let { code, msg } = res.data;
      //判断code
      if (code === 0) {
        //拉取数据
        this.getData()
      }
    },
    //多选框触发
    handleSelChange(val) {
      //处理数据
      this.ids = JSON.stringify(val.map(v => v.id))
    },
    //取消选择
    handleCancelSel() {
      this.$refs.table.clearSelection();
      this.$message({
        type: 'success',
        message: '取消成功'
      })
    },
    //批量删除
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
            //拉取数据
            this.getData()
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
    },
    //设置table宽度
    setTableWidth() {
      this.w = document.body.clientWidth - 280;
    }
  },
  //生命周期created 获取ajax数据
  created() {
    //初始化获取数据
    this.getData()
  },
  //生命周期mounted 操作dom
  mounted() {
    this.setTableWidth();
    window.addEventListener('resize', this.setTableWidth)
  },
  beforeDestroy() {
    //在销毁组件前  把window上挂着的方法也销毁掉
    window.removeEventListener('resize', this.setTableWidth)
  }
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