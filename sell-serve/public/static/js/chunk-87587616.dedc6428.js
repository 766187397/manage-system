(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-87587616"],{"959f":function(t,e,a){"use strict";a("f9ef")},c40e:function(t,e,a){"use strict";a.d(e,"e",(function(){return o})),a.d(e,"c",(function(){return s})),a.d(e,"b",(function(){return n})),a.d(e,"a",(function(){return c})),a.d(e,"d",(function(){return i})),a.d(e,"f",(function(){return l}));var r=a("b775"),o=function(t){return Object(r["a"])({method:"get",url:"/goods/catelist",params:t})},s=function(t){return Object(r["a"])({method:"post",url:"/goods/editcate",data:t})},n=function(t){return Object(r["a"])({method:"get",url:"/goods/delcate",params:t})},c=function(t){return Object(r["a"])({method:"post",url:"/goods/add",data:t})},i=function(){return Object(r["a"])({method:"get",url:"/goods/categories"})},l=function(t){return Object(r["a"])({method:"get",url:"/goods/list",params:t})}},f34a:function(t,e,a){"use strict";a.r(e);var r=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"goods-list"},[a("el-card",[a("div",{attrs:{slot:"header"},slot:"header"},[a("span",[t._v("添加商品")])]),a("div",{staticClass:"content"},[a("el-form",{staticClass:"form",attrs:{model:t.formData,size:"small","label-width":"100px"}},[a("el-form-item",{attrs:{label:"商品名称"}},[a("el-input",{attrs:{type:"text"},model:{value:t.formData.name,callback:function(e){t.$set(t.formData,"name",e)},expression:"formData.name"}})],1),a("el-form-item",{attrs:{label:"商品分类"}},[a("el-select",{attrs:{placeholder:"请选择用户组"},model:{value:t.formData.category,callback:function(e){t.$set(t.formData,"category",e)},expression:"formData.category"}},t._l(t.cateList,(function(t){return a("el-option",{key:t.cateName,attrs:{label:t.cateName,value:t.cateName}})})),1)],1),a("el-form-item",{attrs:{label:"商品价格"}},[a("el-input-number",{attrs:{min:1,max:1e3,label:"描述文字"},model:{value:t.formData.price,callback:function(e){t.$set(t.formData,"price",e)},expression:"formData.price"}})],1),a("el-form-item",{attrs:{label:"商品图片"}},[a("el-upload",{staticClass:"avatar-uploader",attrs:{action:t.API+"/goods/goods_img_upload","show-file-list":!1,"on-success":t.handleAvatarSuccess,"before-upload":t.beforeAvatarUpload}},[t.formData.imgUrl?a("img",{staticClass:"avatar",attrs:{src:t.formData.imgUrl}}):a("i",{staticClass:"el-icon-plus avatar-uploader-icon"})])],1),a("el-form-item",{attrs:{label:"商品名称"}},[a("el-input",{attrs:{type:"textarea",rows:2,placeholder:"请输入内容"},model:{value:t.formData.goodsDesc,callback:function(e){t.$set(t.formData,"goodsDesc",e)},expression:"formData.goodsDesc"}})],1),a("el-form-item",[a("el-button",{attrs:{type:"primary"},on:{click:t.submit}},[t._v("添加商品")])],1)],1)],1)])],1)},o=[],s=a("5530"),n=a("1da1"),c=(a("96cf"),a("c40e")),i={data:function(){return{API:"http://localhost:5000",formData:{name:"",category:"",price:"",imgUrl:"",goodsDesc:""},cateList:[]}},methods:{getAllCate:function(){var t=this;return Object(n["a"])(regeneratorRuntime.mark((function e(){var a;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,Object(c["d"])();case 2:a=e.sent,t.cateList=a.data;case 4:case"end":return e.stop()}}),e)})))()},submit:function(){var t=this;return Object(n["a"])(regeneratorRuntime.mark((function e(){var a,r,o;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return a=t.formData.imgUrl,a=a.substr(a.lastIndexOf("/")+1),e.next=4,Object(c["a"])(Object(s["a"])(Object(s["a"])({},t.formData),{},{imgUrl:a}));case 4:r=e.sent,o=r.data.code,0===o&&t.$router.push({path:"/goods"});case 7:case"end":return e.stop()}}),e)})))()},handleAvatarSuccess:function(t){var e=t.code,a=t.msg,r=t.imgUrl;0===e?(this.$message({type:"success",message:a}),this.formData.imgUrl=this.API+r):this.$message.error(a)},beforeAvatarUpload:function(t){var e=/[jpeg|png]/.test(t.type),a=t.size/1024/1024<2;return e||this.$message.error("上传头像图片只能是 JPG 格式!"),a||this.$message.error("上传头像图片大小不能超过 2MB!"),e&&a}},created:function(){this.getAllCate()}},l=i,u=(a("959f"),a("2877")),m=Object(u["a"])(l,r,o,!1,null,"d8355d5e",null);e["default"]=m.exports},f9ef:function(t,e,a){}}]);