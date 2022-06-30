/**
 * 店铺接口模块
 */

import request from '@/utils/request'

/* 获取店铺详情 */
export const getShopInfo = () => {
    return request({
        method: 'get',
        url: '/shop/info',

    })
}

/* 修改店铺 */
export const editShop = (data) => {
    return request({
        method: 'post',
        url: '/shop/edit',
        data
    })
}
