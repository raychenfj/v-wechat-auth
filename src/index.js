import url from 'url'

import install from './install'
import config from './config'

const requiredProps = ['appId', 'scope', 'authorize']
const defaultOptions = {
  autoRedirect: true,
  state: '',
  authorize () {
    console.error('should implement authorize method in options')
  }
}

function isFunction (fn) {
  return fn && typeof fn === 'function'
}

export default class WechatAuth {
  /**
   * @typedef {Object} Options wechat auth options
   * @property {boolean} autoRedirect optional, auto redirect to wechat oauth url when there is no code in query or no openid in ajax response
   * @property {string} appId required, wechat appId
   * @property {string} scope required, wechat auth scope, snsapi_base or snsapi_userinfo
   * @property {string} state optional, wechat state
   * @property {function} authorize required, an ajax call to back end and should return an object contains openid at least, support promise or callback
   * @property {boolean} ssr optional, used in server side render, feature not implement yet
   */

  /**
   * Create a wechat auth object
   * @constructor
   * @param {Options} options
   */
  constructor (options) {
    this.options = Object.assign(defaultOptions, options)

    requiredProps.forEach(prop => {
      if (!this.options[prop]) {
        console.error(`required property ${prop} is missing in options, please visit ${config.git} for more info.`)
      }
    })

    this.user = null
  }

  /**
   * authorize
   * @param {*} onSuccess
   * @param {*} onFail
   * @returns {Promise}
   */
  authorize (onSuccess, onFail) {
    const urlObj = url.parse(window.location.href, true)

    if (urlObj.query && !urlObj.query.code) {
      // delete state in query in url
      delete urlObj.query.state
      delete urlObj.search
      return this.redirect(url.format(urlObj))
    }

    // decorated success
    const success = (data) => {
      const user = this.onSuccess(data)
      if (isFunction(onSuccess)) {
        onSuccess(user)
      }
      return user
    }

    // decorated fail
    const fail = (e) => {
      this.onFail(e)
      if (isFunction(onFail)) {
        onFail(e)
      }
    }

    try {
      // if options.authorize use callback
      const promise = this.options.authorize(urlObj.query.code, success, fail)

      // if options.authorize return promise
      if (promise && promise instanceof Promise) {
        return promise.then(success).catch(fail)
      }
    } catch (e) {
      fail(e)
    }
  }

  /**
   * onSuccess
   * @private
   * @param {*} data
   */
  onSuccess (data) {
    if (!data.openid && this.options.autoRedirect) {
      const urlObj = url.parse(window.location.href, true)
      // delete code and state in query in url
      delete urlObj.query.code
      delete urlObj.query.state
      delete urlObj.search
      return this.redirect(url.format(urlObj))
    }
    this.user = data
    return this.user
  }

  /**
   * onFail
   * @private
   * @param {*} e
   */
  onFail (e) {
    console.error('error occurs when authorize from back end')
    console.error(e)
  }

  /**
   * redirect to wechat auth url
   * @param {*} url
   */
  redirect (url) {
    const options = this.options
    window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${options.appId}&redirect_uri=${encodeURIComponent(url)}&response_type=code&scope=${options.scope}&state=${options.state}#wechat_redirect`
  }
}

WechatAuth.install = install
