/**
 * 工具函数
 */

/*
    rule 表示一个对象 里面有很多东西 rule可用可不用
    value 表单的值
    callback 回调函数 校验成功或失败 必填
    失败 callback(new Error('错误信息'))
    成功 callback()
*/
//验证用户名
export const checkAccount = (rule, value, callback) => {
    //非空验证
    if (value === '') {
        callback(new Error('用户名不能为空！'))
    } else if (!/^[a-zA-Z0-9\u4e00-\u9fa5]{3,12}$/.test(value)) {
        callback(new Error('中文，数字，英文 3至12位'))
    } else {
        //验证成功必填
        callback()
    }
}
//验证密码
export const checkPassword = (rule, value, callback) => {
    //非空验证
    if (value === '') {
        callback(new Error('密码不能为空！'))
    } else if (!/^[a-zA-Z0-9_]{6,12}$/.test(value)) {
        callback(new Error('数字，英文，下划线 6至12位'))
    } else {
        //验证成功必填
        callback()
    }
}

// 处理格式 年与日 时分秒
export const normalizeYmdHms = (date) => {
    let time = new Date(date);
    let y = time.getFullYear();
    let M = time.getMonth() + 1;
    let d = time.getDate();

    let h = time.getHours();
    let m = time.getMinutes();
    let s = time.getSeconds();

    let res = [y, M, d, h, m, s].map(v => v.toString().padStart(2, '0'));
    return res.slice(0, 3).join('-') + ' ' + res.slice(3).join(':')
}

