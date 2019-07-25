/**
 * @file 封装 localStorage
 */

const { localStorage } = global;

export default {
    /**
     * 设置一个值
     * @param {string} key - 键名
     * @param {*} value - 键值
     */
    setItem(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    },

    /**
     * 获取一个值
     * @param {string} key - 键名
     * @returns {*} 键值
     */
    getItem(key) {
        return JSON.parse(localStorage.getItem(key));
    },

    /**
     * 删除一个值
     * @param {string} key - 键名
     */
    removeItem(key) {
        localStorage.removeItem(key);
    },

    /**
     * 清空所有值
     */
    clear() {
        localStorage.clear();
    }
};
