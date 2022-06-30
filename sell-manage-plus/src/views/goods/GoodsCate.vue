<template>
  <div class="goods-cate">
    <el-card>
      <div slot="header"><span>商品分类</span></div>
      <div class="content">
        <!-- 表格 -->
        <el-table class="table" :data="tableData" :style="{ width: w + 'px' }">
          <!-- 序号 -->
          <el-table-column type="index" label="序号"></el-table-column>
          <!-- 分类名称 -->
          <el-table-column label="分类名称">
            <template slot-scope="scope">
              <span v-if="!scope.row.isEdit">{{ scope.row.cateName }}</span>
              <el-input
                v-else
                type="text"
                size="small"
                v-model="scope.row.cateName"
              ></el-input>
            </template>
          </el-table-column>
          <!-- 是否启用 -->
          <el-table-column label="是否启用">
            <template slot-scope="scope">
              <el-switch
                :disabled="!scope.row.isEdit"
                v-model="scope.row.state"
                active-color="#13ce66"
                inactive-color="#ff4949"
              >
              </el-switch>
            </template>
          </el-table-column>
          <!-- 操作 -->
          <el-table-column label="操作" width="160">
            <template slot-scope="scope">
              <el-button
                size="mini"
                :type="scope.row.isEdit ? 'success' : ''"
                @click="handleEdit(scope.row)"
                >{{ scope.row.isEdit ? "完成" : "编辑" }}</el-button
              >
              <el-popconfirm
                @confirm="handleDelete(scope.row)"
                @cancel="$message({ type: 'info', message: '取消删除' })"
                title="这个分类确定删除吗？"
              >
                <el-button
                  class="btn-delete"
                  type="danger"
                  size="mini"
                  slot="reference"
                  >删除</el-button
                >
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页组件 -->
        <el-pagination
          :total="total"
          background
          :page-size="pageSize"
          :current-page="currentPage"
          layout="total,prev, pager, next, jumper"
          class="pagination"
          @current-change="handleCurrentChange"
        ></el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
import { getCateList, editCate, delCate } from "@/api/goods";
export default {
  //数据先行
  data() {
    return {
      //表格数据
      tableData: [],
      //当前页
      currentPage: 1,
      //每页几条
      pageSize: 4,
      //总页数
      total: 0,
      //table宽度
      w: 0
    }
  },
  //函数
  methods: {
    //获取数据
    async getData() {
      let res = await getCateList({ currentPage: this.currentPage, pageSize: this.pageSize })
      //解构数据
      let { data, total } = res.data;
      //处理数据
      data.forEach(v => {
        //如果state值为1 给他赋值true 反之false
        v.state = v.state === 1 ? true : false
        //新增一个可编辑字段
        v.isEdit = false;
      })

      //赋值
      this.total = total;
      this.tableData = data;

      //如果当前页不等与1 且获取数据为空数组， 就拉取上一页数据 
      if (this.currentPage !== 1 && this.tableData.length === 0) {
        this.currentPage -= 1;
        //重新拉取数据
        this.getData()
      }
    },
    //编辑
    async handleEdit(row) {
      //修改当前行的可编辑状态
      row.isEdit = !row.isEdit

      //只有两种状态 如果不清楚逻辑可以去试
      if (!row.isEdit) {
        //解构需要的数据

        let { id, cateName, state } = row;
        //处理数据格式
        state = state ? 1 : 0
        let res = await editCate({ id, cateName, state });
      }
    },
    //删除
    async handleDelete(row) {
      let { id } = row;
      let res = await delCate({ id });
      let { code } = res.data;
      if (code === 0) {
        //成功之后拉取数据
        this.getData()
      }
    },
    //改变页码触发
    handleCurrentChange(val) {
      //把val赋值给当前页
      this.currentPage = val;
      //重新拉取数据
      this.getData()
    },
    //设置table宽度
    setTableWidth() {
      this.w = document.body.clientWidth - 280;
    }
  },
  //生命周期
  created() {
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
.btn-delete {
  margin-left: 10px;
}
</style>