(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-596e41ed"],{5315:function(t,e,a){"use strict";a("a0c1")},a0c1:function(t,e,a){},a13e:function(t,e,a){"use strict";a.r(e);var n=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"goods-cate"},[a("el-card",[a("div",{attrs:{slot:"header"},slot:"header"},[a("span",[t._v("商品分类")])]),a("div",{staticClass:"content"},[a("el-table",{staticClass:"table",style:{width:t.w+"px"},attrs:{data:t.tableData}},[a("el-table-column",{attrs:{type:"index",label:"序号"}}),a("el-table-column",{attrs:{label:"分类名称"},scopedSlots:t._u([{key:"default",fn:function(e){return[e.row.isEdit?a("el-input",{attrs:{type:"text",size:"small"},model:{value:e.row.cateName,callback:function(a){t.$set(e.row,"cateName",a)},expression:"scope.row.cateName"}}):a("span",[t._v(t._s(e.row.cateName))])]}}])}),a("el-table-column",{attrs:{label:"是否启用"},scopedSlots:t._u([{key:"default",fn:function(e){return[a("el-switch",{attrs:{disabled:!e.row.isEdit,"active-color":"#13ce66","inactive-color":"#ff4949"},model:{value:e.row.state,callback:function(a){t.$set(e.row,"state",a)},expression:"scope.row.state"}})]}}])}),a("el-table-column",{attrs:{label:"操作",width:"160"},scopedSlots:t._u([{key:"default",fn:function(e){return[a("el-button",{attrs:{size:"mini",type:e.row.isEdit?"success":""},on:{click:function(a){return t.handleEdit(e.row)}}},[t._v(t._s(e.row.isEdit?"完成":"编辑"))]),a("el-popconfirm",{attrs:{title:"这个分类确定删除吗？"},on:{confirm:function(a){return t.handleDelete(e.row)},cancel:function(e){return t.$message({type:"info",message:"取消删除"})}}},[a("el-button",{staticClass:"btn-delete",attrs:{slot:"reference",type:"danger",size:"mini"},slot:"reference"},[t._v("删除")])],1)]}}])})],1),a("el-pagination",{staticClass:"pagination",attrs:{total:t.total,background:"","page-size":t.pageSize,"current-page":t.currentPage,layout:"total,prev, pager, next, jumper"},on:{"current-change":t.handleCurrentChange}})],1)])],1)},r=[],c=a("1da1"),i=(a("96cf"),a("159b"),a("c40e")),o={data:function(){return{tableData:[],currentPage:1,pageSize:4,total:0,w:0}},methods:{getData:function(){var t=this;return Object(c["a"])(regeneratorRuntime.mark((function e(){var a,n,r,c;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,Object(i["e"])({currentPage:t.currentPage,pageSize:t.pageSize});case 2:a=e.sent,n=a.data,r=n.data,c=n.total,r.forEach((function(t){t.state=1===t.state,t.isEdit=!1})),t.total=c,t.tableData=r,1!==t.currentPage&&0===t.tableData.length&&(t.currentPage-=1,t.getData());case 8:case"end":return e.stop()}}),e)})))()},handleEdit:function(t){return Object(c["a"])(regeneratorRuntime.mark((function e(){var a,n,r;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:if(t.isEdit=!t.isEdit,t.isEdit){e.next=7;break}return a=t.id,n=t.cateName,r=t.state,r=r?1:0,e.next=6,Object(i["c"])({id:a,cateName:n,state:r});case 6:e.sent;case 7:case"end":return e.stop()}}),e)})))()},handleDelete:function(t){var e=this;return Object(c["a"])(regeneratorRuntime.mark((function a(){var n,r,c;return regeneratorRuntime.wrap((function(a){while(1)switch(a.prev=a.next){case 0:return n=t.id,a.next=3,Object(i["b"])({id:n});case 3:r=a.sent,c=r.data.code,0===c&&e.getData();case 6:case"end":return a.stop()}}),a)})))()},handleCurrentChange:function(t){this.currentPage=t,this.getData()},setTableWidth:function(){this.w=document.body.clientWidth-280}},created:function(){this.getData()},mounted:function(){this.setTableWidth(),window.addEventListener("resize",this.setTableWidth)},beforeDestroy:function(){window.removeEventListener("resize",this.setTableWidth)}},s=o,u=(a("5315"),a("2877")),l=Object(u["a"])(s,n,r,!1,null,"2d6e0e5e",null);e["default"]=l.exports},c40e:function(t,e,a){"use strict";a.d(e,"e",(function(){return r})),a.d(e,"c",(function(){return c})),a.d(e,"b",(function(){return i})),a.d(e,"a",(function(){return o})),a.d(e,"d",(function(){return s})),a.d(e,"f",(function(){return u}));var n=a("b775"),r=function(t){return Object(n["a"])({method:"get",url:"/goods/catelist",params:t})},c=function(t){return Object(n["a"])({method:"post",url:"/goods/editcate",data:t})},i=function(t){return Object(n["a"])({method:"get",url:"/goods/delcate",params:t})},o=function(t){return Object(n["a"])({method:"post",url:"/goods/add",data:t})},s=function(){return Object(n["a"])({method:"get",url:"/goods/categories"})},u=function(t){return Object(n["a"])({method:"get",url:"/goods/list",params:t})}}}]);