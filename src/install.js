export default function install (Vue, options) {
  if (install.installed) return
  install.installed = true

  Object.defineProperty(Vue.prototype, '$wechatAuth', {
    get () { return this.$root._wechatAuth }
  })

  Vue.mixin({
    beforeCreate () {
      if (this.$options.wechatAuth) {
        this._wechatAuth = this.$options.wechatAuth
      }
    }
  })
}
