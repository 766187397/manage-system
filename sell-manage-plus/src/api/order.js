/**
 * 订单接口模块
 */

import request from '@/utils/request'

/* 获取订单列表 & 查询 */
export const getOrderList = (params) => {
    return request({
        method: 'get',
        url: '/order/list',
        params
    })
}

/* 首页数据 */
export const getTotalData = () => {
    return request({
        method: 'get',
        url: '/order/totaldata',
    })
}

/* 订单数据查询 */
export const getOrderTotal = (params) => {
    return request({
        method: 'get',
        url: '/order/ordertotal',
        params
    })
}