var config = {
  appId: '', // your wechat appid,
  scope: '', // snsapi_base or snsapi_userinfo
  authorize () {
    return axios.get('your backend api here', { params: { code: code } })
    .then(function (res) {
      var data = (res && res.data) || {} // response data should at least contain openid
      return data
    })
  }
}
