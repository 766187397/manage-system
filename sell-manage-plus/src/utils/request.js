/**
 * ajax工具函数层
 */
import axios from 'axios'
import local from '@/utils/local'
// import router from '@/router'

//单独使用element-ui的信息组件
import { Message } from 'element-ui';
axios.defaults.baseURL = 'http://localhost:5000' //默认服务器地址 
axios.defaults.timeout = 10000;//配置超时时间10秒

//严格模式的this 是undefined

//配置请求拦截器
axios.interceptors.request.use(config => {
    //取出token 鉴权。 token相当于人的身份证 一个角色的信息 权限全部存在这个加密的字符串里面
    let token = local.get('t_k');
    if (token) {
        //只要有token 所有的接口请求都会携带这个token 发给后台【后台检查token 判断你是否有当前请求的权限】
        //authorization 字段是和后端商议的【当前项目叫authorization】
        config.headers.authorization = token;
    }
    return config
}, err => {
    return Promise.reject(err)
})

//配置响应拦截器
axios.interceptors.response.use(response => {
    //解构数据 
    let { code, msg } = response.data;
    switch (code) {
        case 0:
            Message({
                type: 'success',
                message: msg
            });
            break;
        case 1:
            Message.error(msg)
            break;
        case 5001:
            Message.error(msg)
            break;
        default:
            break;
    }
    return response
}, err => {
    try {
        //解构错误 状态码
        let { status } = err.response;
        switch (status) {
            // case 401:
            //     Message.error('无效的token,请重新登录');
            //     //清空本地数据 
            //     local.clear();
            //     //储存跳转前的页面
            //     local.set('redirectUrl', router.history.current.path)
            //     // 返回登录页面重新登录
            //     router.push('/login')
            //     break;
            case 404:
                Message.error('404错误')
                break;
            default:
                break;
        }
    } catch (err) {

    }
    return Promise.reject(err)
})

//暴露配置好的axios
export default axios