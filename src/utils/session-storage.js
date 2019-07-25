/**
 * @file 封装 sessionStorage
 */

const { sessionStorage } = global;

export default {
    /**
     * 设置一个值
     * @param {string} key - 键名
     * @param {*} value - 键值
     */
    setItem(key, value) {
        sessionStorage.setItem(key, JSON.stringify(value));
    },

    /**
     * 获取一个值
     * @param {string} key - 键名
     * @returns {*} 键值
     */
    getItem(key) {
        return JSON.parse(sessionStorage.getItem(key));
    },

    /**
     * 更新一个对象的某个key值
     * @param {string} key - 键名
     * @returns {Object} newVal 新值
     */
    updateItem(key, newVal) {
        let oldVal = this.getItem(key);
        this.setItem(key, { ...oldVal, ...newVal });
    },

    /**
     * 删除一个值
     * @param {string} key - 键名
     */
    removeItem(key) {
        sessionStorage.removeItem(key);
    },

    /**
     * 清空所有值
     */
    clear() {
        sessionStorage.clear();
    }
};
