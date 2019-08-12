
/**
 * 根据`${method}${url}`拼接的name在__axiosPending中取消请求
 * @param {*} method 方法
 * @param {*} url api
 */
export function cancelAxios({method = 'get', url = '/api'}) {
    let axiosPendingName = `${method}${url}`;
    const cancelAxios = global.__axiosPending.find(item => item.name === axiosPendingName);
    if (cancelAxios) cancelAxios.cancel();
}