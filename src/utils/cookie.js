export default {
    /**
     * 设置一个值
     * @param {string} key - 键名
     * @param {*} value - 键值
     */
    setCookie(name, value) {
        document.cookie = `${name}=${value}`;
    },

    /**
     * 获取一个值
     * @param {string} key - 键名
     * @returns {*} 键值
     */
    getCookie(name) {
        var name = name + "=";
        var decodedCookie = document.cookie;
        var ca = decodedCookie.split(';');
        for(var i = 0; i <ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    },
};