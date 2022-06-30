# DAY06

## 0 今日目标

- 订单模块
- 店铺模块

## 1 订单管理

### 1.1 查询表单渲染 【同下】

### 1.2 table分页渲染

- Order.vue

```vue
<template>
  <el-card class="order">
    <div slot="header"><span>订单管理</span></div>
    <div class="content">
      <!-- form -->
      <el-form class="search-form" inline :model="formData" size="mini">
        <!-- 订单号 -->
        <el-form-item label="订单号">
          <el-input type="text" v-model="formData.orderNo"></el-input>
        </el-form-item>
        <!-- 收货人 -->
        <el-form-item label="收货人">
          <el-input type="text" v-model="formData.consignee"></el-input>
        </el-form-item>
        <!-- 手机号 -->
        <el-form-item label="手机号">
          <el-input type="text" v-model="formData.phone"></el-input>
        </el-form-item>
        <!-- 订单状态 -->
        <el-form-item label="订单状态">
          <el-select v-model="formData.orderState" placeholder="请选择订单状态">
            <el-option label="派送中" value="派送中"></el-option>
            <el-option label="已受理" value="已受理"></el-option>
            <el-option label="已完成" value="已完成"></el-option>
          </el-select>
        </el-form-item>
        <!-- 选择时间 -->
        <!-- format 显示数据格式  -->
        <!-- value-format 获取值的数据格式 -->
        <el-form-item>
          <el-date-picker
            v-model="formData.date"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd HH:mm:ss"
            format="yyyy-MM-dd HH:mm:ss"
          >
          </el-date-picker>
        </el-form-item>
        <!-- 操作 -->
        <el-form-item>
          <el-button @click="search" type="primary">查询</el-button>
        </el-form-item>
      </el-form>
      <!-- table -->
      <el-table
        :data="tableData"
        border
        class="table"
        :style="{ width: w + 'px' }"
      >
        <!-- 订单号 -->
        <el-table-column prop="orderNo" label="订单号"> </el-table-column>
        <!-- 下单时间 -->
        <el-table-column label="下单时间">
          <template slot-scope="scope">
            {{ scope.row.orderTime | normalizeHms }}
          </template>
        </el-table-column>
        <!-- 手机号 -->
        <el-table-column prop="phone" label="手机号" width="120">
        </el-table-column>
        <!-- 收货人 -->
        <el-table-column prop="consignee" label="收货人"> </el-table-column>
        <!-- 配送地址 -->
        <el-table-column prop="deliverAddress" width="160" label="配送地址">
        </el-table-column>
        <!-- 送达时间 -->
        <el-table-column label="送达时间">
          <template slot-scope="scope">
            {{ scope.row.deliveryTime | normalizeHms }}
          </template>
        </el-table-column>
        <!-- 用户备注 -->
        <el-table-column prop="remarks" width="180" label="用户备注">
        </el-table-column>
        <!-- 订单金额 -->
        <el-table-column prop="orderAmount" label="订单金额"> </el-table-column>
        <!-- 订单状态 -->
        <el-table-column prop="orderState" label="订单状态"> </el-table-column>
        <el-table-column fixed="right" label="操作" width="100">
          <template slot-scope="scope">
            <el-button @click="handleClick(scope.row)" type="text" size="small"
              >查看</el-button
            >
            <el-button type="text" size="small">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页pagination -->
      <el-pagination
        background
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-size="pageSize"
        layout="total, prev, pager, next, jumper"
        :total="total"
        class="pagination"
      >
      </el-pagination>
    </div>
  </el-card>
</template>

<script>

import { getOrderList } from "@/api/order";
export default {
  //数据
  data() {
    return {
      formData: {},//查询表单数据
      tableData: [],
      searchForm: {}, //存储查询的表单
      //当前页
      currentPage: 1,
      //每页几条
      pageSize: 3,
      //总条数
      total: 0,
      //table宽度
      w: 0
    }
  },
  //函数
  methods: {
    async getData(searchForm = {}) {
      //如果有查询数据 把查询数据添加到数据里
      let res = await getOrderList({
        currentPage: this.currentPage,
        pageSize: this.pageSize,
        ...searchForm
      });
      //解构数据
      let { total, data } = res.data;
      //赋值
      this.total = total;
      this.tableData = data;
    },
    //当前页改变触发
    handleCurrentChange(val) {
      //当前页 赋值给 currentPage
      this.currentPage = val;

      //分页时 如果searchForm有值 就分页查询列表，如果没值查询所有数据
      this.getData({ ...this.searchForm })
    },
    //查询
    search() {
      //初始化页码为第一页
      this.currentPage = 1;

      //处理格式
      let date = JSON.stringify({ ...this.formData }.date);
      //把formData的数据 拷贝一份 存进查询searchForm里面
      this.searchForm = { ...this.formData, date }
      this.getData({ ...this.searchForm })
    },
    //设置table宽度
    setTableWidth() {
      this.w = document.body.clientWidth - 280;
    }
  },
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
</style>
```



### 1.3 查询带分页实现

```js
 methods: {
     #1把getData 修改为 可传参模式，如果有参数 就使用查询模式，如果没参数就查询所有数据
    async getData(searchForm = {}) {
      //如果有查询数据 把查询数据添加到数据里
      let res = await getOrderList({
        currentPage: this.currentPage,
        pageSize: this.pageSize,
        ...searchForm
      });
      //解构数据
      let { total, data } = res.data;
      //赋值
      this.total = total;
      this.tableData = data;
    },
    //当前页改变触发
    handleCurrentChange(val) {
      //当前页 赋值给 currentPage
      this.currentPage = val;
      #3分页时 如果searchForm有值 就分页查询列表，如果没值查就询所有数据
      this.getData({ ...this.searchForm })
    },
    //查询
    #2 查询按钮 初始化第一页。 处理时间格式 把处理好的格式数据储存到searchForm里
    #用searchForm的值进行分页查询
    search() {
      //初始化页码为第一页
      this.currentPage = 1;
      //处理格式
      let date = JSON.stringify({ ...this.formData }.date);
      //把formData的数据 拷贝一份 存进查询searchForm里面
      this.searchForm = { ...this.formData, date }
      this.getData({ ...this.searchForm })
    },
    //设置table宽度
    setTableWidth() {
      this.w = document.body.clientWidth - 280;
    }
  },
```

- dateTimePicker日期选择器

```js
#format 显示数据格式 
#value-format 获取值的数据格式 
    
<el-date-picker
    v-model="formData.date"
    type="datetimerange"
    range-separator="至"
    start-placeholder="开始日期"
    end-placeholder="结束日期"
    value-format="yyyy-MM-dd HH:mm:ss"
    format="yyyy-MM-dd HH:mm:ss">
</el-date-picker>
```



## 2  路由传参【扩展】

### 2.1 query

- 传数据 页

```js
 this.$router.push({ path: '/路由地址', query: 参数对象 })
 this.$router.push({ name: '路由名称', query: 参数对象 })

#query 传参参数拼接在路由地址里面 通过路由信息对象获取 。。刷新不消失
```

- 接受数据 页

```js
this.$route.query 来接受传过来的数据对象
```

### 2.2 params

- 传数据 页

```js
 this.$router.push({ name: '路由名称', params: 参数对象 })

#params传参 通过路由信息对象获取 。。刷新丢失
```

- 接受数据 页

```js\
this.$route.params 来接受传过来的数据对象
```



### 2.3 路由+params

- router/index.js

```js
{
    path: '/路由地址/:参数名',
    name: '路由名称',
    component: 组件
}
#params传参 通过路由信息对象获取 。。刷新不丢失
```

- 接受数据 页

```js
this.$route.params.参数名 来接受传过来的数据对象
```

### 2.4  订单页面 查看和编辑 使用路由传参跳转页面做！

## 3 店铺模块

- Shop.vue

```js
<template>
  <el-card class="shop">
    <div slot="header" class="header">
      <span>店铺管理</span>
      <el-button size="small" @click="submit" v-if="!isEdit">编辑</el-button>
      <el-button type="success" @click="submit" v-else size="small"
        >完成</el-button
      >
    </div>
    <div class="content">
      <!-- 表单 -->
      <el-form
        :disabled="!isEdit"
        :model="formData"
        size="small"
        class="form"
        label-width="100px"
      >
        <!-- 店铺名称 -->
        <el-form-item label="店铺名称">
          <el-input type="text" v-model="formData.name"></el-input>
        </el-form-item>
        <!-- 店铺公告 -->
        <el-form-item label="店铺公告">
          <el-input
            type="textarea"
            :rows="5"
            v-model="formData.bulletin"
          ></el-input>
        </el-form-item>
        <!-- 店铺头像 -->
        <el-form-item label="店铺头像">
          <el-upload
            class="avatar-uploader"
            :action="API + '/shop/upload'"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="formData.avatar" :src="formData.avatar" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <!-- 店铺图片 -->
        <el-form-item label="店铺名称">
          <el-upload
            :action="API + '/shop/upload'"
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :on-success="handleShopSuccess"
            :file-list="formData.pics"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
          <!-- 预览弹窗 -->
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="" />
          </el-dialog>
        </el-form-item>
        <!-- 配送费 -->
        <el-form-item label="配送费">
          <el-input-number
            v-model="formData.deliveryPrice"
            :min="1"
            :max="100"
            label="配送费"
          ></el-input-number>
        </el-form-item>
        <!-- 配送时间 -->
        <el-form-item label="配送时间">
          <el-input-number
            v-model="formData.deliveryTime"
            :min="1"
            :max="100"
            label="配送费"
          ></el-input-number>
        </el-form-item>
        <!-- 配送描述 -->
        <el-form-item label="配送描述">
          <el-input type="text" v-model="formData.description"></el-input>
        </el-form-item>
        <!-- 店铺评分 -->
        <el-form-item label="店铺名称">
          <el-rate v-model="formData.score"></el-rate>
        </el-form-item>
        <!-- 销量 -->
        <el-form-item label="销量">
          <el-input-number
            v-model="formData.sellCount"
            :min="1"
            :max="100"
          ></el-input-number>
        </el-form-item>
        <!-- 活动 -->
        <el-form-item label="活动">
          <el-checkbox-group v-model="formData.supports">
            <el-checkbox label="在线支付满28减5"></el-checkbox>
            <el-checkbox label="VC无限橙果汁全场8折"></el-checkbox>
            <el-checkbox label="单人精彩套餐"></el-checkbox>
            <el-checkbox label="特价饮品8折抢购"></el-checkbox>
            <el-checkbox label="单人特色套餐"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <!-- 营业时间 -->
        <el-form-item label="营业时间">
          <el-time-picker
            is-range
            v-model="formData.date"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            placeholder="选择时间范围"
            value-format="yyyy-MM-dd HH:mm:ss"
            format="HH:mm:ss"
          >
          </el-time-picker>
        </el-form-item>
      </el-form>
    </div>
  </el-card>
</template>

<script>
import { getShopInfo, editShop } from '@/api/shop'
export default {
  //数据
  data() {
    return {
      API: 'http://localhost:5000', //服务器地址
      isEdit: false,//是否可编辑
      formData: {
        avatar: "", //店铺头像
        bulletin: "", //店铺公告
        date: [], //营业时间
        deliveryPrice: 0,//起送价格
        deliveryTime: 0,//送达时间
        description: "",//店铺描述
        id: 1, //店铺id
        minPrice: 20, //价格
        name: "",//店铺名称
        pics: [],//店铺图片
        score: 0,//店铺好评率
        sellCount: 0,//店铺销量
        supports: [],//活动支持
      },
      dialogImageUrl: '',
      dialogVisible: false,
      // fileList: [
      //   { name: 'food.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100' },
      //   { name: 'food2.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100' }
      // ]
    }
  },
  //方法
  methods: {
    //获取数据
    async getData() {
      let res = await getShopInfo();
      //解构数据
      let { data } = res.data;
      //处理数据格式
      data.avatar = this.API + '/upload/shop/' + data.avatar;
      //处理多图数据 需要按照 别人的格式来 [{name:'xx',url:'全地址'}]
      data.pics = data.pics.map(v => {
        return {
          name: v,
          url: this.API + '/upload/shop/' + v
        }
      })
      // 使用forEach方法
      // data.pics.forEach((v, i) => {
      //   data.pics[i] = {
      //     name: v,
      //     url: this.API + '/upload/shop/' + v
      //   }
      // });

      //赋值
      this.formData = data;
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
        this.formData.avatar = this.API + imgUrl
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
    //多图上传触发
    handleShopSuccess(res) {
      let { code, msg, imgUrl } = res;
      if (code === 0) {
        this.$message({
          type: 'success',
          message: msg
        })
        //处理格式 [返回的地址 后台决定，缺什么拼什么]
        this.formData.pics.push({
          name: imgUrl.substr(imgUrl.lastIndexOf('/') + 1),
          url: this.API + imgUrl
        })
      } else {
        this.$message.error(msg)
      }
    },
    //删除多图
    handleRemove(file, fileList) {
      //处理数据 
      //找到当前被删除文件的 索引
      let index = this.formData.pics.findIndex(v => {
        return file.name === v.name
      })
      //处理数据 删除指定索引的数据
      this.formData.pics.splice(index, 1);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    //提交
    async submit() {
      this.isEdit = !this.isEdit;
      if (!this.isEdit) {
        let data = { ...this.formData };
        //处理格式
        data.avatar = data.avatar.substr(data.avatar.lastIndexOf('/') + 1);
        data.pics = data.pics.map(v => v.name)
        let res = await editShop({ ...data });
        console.log(`res.data`, res.data)
      }
    }

  },
  created() {
    this.getData()
  }
}
</script>

<style lang="scss" scoped>
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

// .avatar-uploader {
//   margin-top: 20px;
// }
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
.form {
  width: 450px;
}
</style>
```






