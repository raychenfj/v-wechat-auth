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

export default class WechatAuth {
  /**
   * @typedef {Object} Options wechat auth options
   * @property {boolean} autoRedirect optional, auto redirect to wechat oauth url when there is no code in query or no openid in ajax response
   * @property {string} appId required, wechat appId
   * @property {string} scope required, wechat auth scope, snsapi_base or snsapi_userinfo
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

  authorize () {
    const urlObj = url.parse(window.location.href, true)

    if (urlObj.query && !urlObj.query.code) {
      delete urlObj.query.state
      delete urlObj.search
      return this.redirect(url.format(urlObj))
    }

    try {
      const promise = this.options.authorize(urlObj.query.code, this.onSuccess.bind(this), this.onFail.bind(this))
      if (promise && promise instanceof Promise) {
        return promise.then(data => this.onSuccess(data))
      }
    } catch (e) {
      this.onFail(e)
    }
  }

  onSuccess (data) {
    if (!data.openid && this.options.autoRedirect) {
      const urlObj = url.parse(window.location.href, true)
      delete urlObj.query.code
      delete urlObj.query.state
      delete urlObj.search
      return this.redirect(url.format(urlObj))
    }
    this.user = data
    return this.user
  }

  onFail (e) {
    console.error('error occurs when authorize from back end')
    console.error(e)
  }

  redirect (url) {
    const options = this.options
    window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${options.appId}&redirect_uri=${encodeURIComponent(url)}&response_type=code&scope=${options.scope}&state=${options.state}#wechat_redirect`
  }
}

WechatAuth.install = install