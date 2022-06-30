/**
 * 商品接口模块
 */

import request from '@/utils/request'

/* 商品分类 */
export const getCateList = (params) => {
    return request({
        method: 'get',
        url: '/goods/catelist',
        params
    })
}

/* 编辑分类 */
export const editCate = (data) => {
    return request({
        method: 'post',
        url: '/goods/editcate',
        data
    })
}

/* 删除分类 */
export const delCate = (params) => {
    return request({
        method: 'get',
        url: '/goods/delcate',
        params
    })
}

/* 添加商品 */
export const addGoods = (data) => {
    return request({
        method: 'post',
        url: '/goods/add',
        data
    })
}

/* 获取所有商品分类 */
export const getAllCate = () => {
    return request({
        method: 'get',
        url: '/goods/categories',
    })
}


/* 获取商品列表 */
export const getGoodsList = (params) => {
    return request({
        method: 'get',
        url: '/goods/list',
        params
    })
}
