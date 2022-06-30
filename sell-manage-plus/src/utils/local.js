/**
 * 操作本地存储
 */

const local = {
    set(key, val) {
        window.localStorage.setItem(key, JSON.stringify(val))
    },
    get(key) {
        return JSON.parse(window.localStorage.getItem(key))
    },
    remove(key) {
        window.localStorage.removeItem(key)
    },
    clear() {
        window.localStorage.clear()
    }
}

export default local