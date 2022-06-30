/**
 * 全局过滤器
 */

//处理日期 格式是 年月日
export const normalizeYmd = (date) => {
    let time = new Date(date);
    let y = time.getFullYear();
    let m = time.getMonth() + 1;
    let d = time.getDate();
    let res = [y, m, d].map(v => v.toString().padStart(2, '0'));
    return res.join('/')
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


//处理格式 时分秒 
export const normalizeHms = (date) => {
    let time = new Date(date);

    let h = time.getHours();
    let m = time.getMinutes();
    let s = time.getSeconds();

    let res = [h, m, s].map(v => v.toString().padStart(2, '0'));
    return res.join(':')
}

// 千分加逗号
export const numFormat = (num) => {
    return (num.toString().indexOf('.') !== -1) ? num.toLocaleString() : num.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
}

