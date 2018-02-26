var config = {
  appId: '', // your wechat appid,
  scope: 'snsapi_userinfo', // snsapi_base or snsapi_userinfo
  /**
   * 
   * @param {*} code 
   * @param {*} success if you use callback, don't return anything in the function, and call success and pass response data to it
   * @param {*} fail 
   */
  authorize (code, success, fail) {
    return axios.get('your backend api here', { params: { code: code } })
    .then(function (res) {
      var data = (res && res.data) || {} // response data should at least contain openid
      return data
    })
  }
}
