/**
 * 用户接口模块
 */

import request from '@/utils/request'

/* 登录接口 */
export const checkLogin = (data) => {
    return request({
        method: 'post',
        url: '/users/checkLogin',
        data
    })
}

/* 添加账号 */
export const addUser = (data) => {
    return request({
        method: 'post',
        url: '/users/add',
        data
    })
}

/* 获取用户列表 */
export const getUserList = (params) => {
    return request({
        method: 'get',
        url: '/users/list',
        params
    })
}

/* 删除账号 */
export const deleteUser = (params) => {
    return request({
        method: 'get',
        url: '/users/del',
        params
    })
}

/* 编辑账号 */
export const editUser = (data) => {
    return request({
        method: 'post',
        url: '/users/edit',
        data
    })
}

/* 批量删除账号 */
export const deleteBatchUser = (params) => {
    return request({
        method: 'get',
        url: '/users/batchdel',
        params
    })
}

/* 获取个人信息 */
export const getUserInfo = () => {
    return request({
        method: 'get',
        url: '/users/info',
    })
}

/* 修改用户头像 */
export const editAvatar = (params) => {
    return request({
        method: 'get',
        url: '/users/avataredit',
        params
    })
}
