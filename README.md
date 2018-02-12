# v-wechat-auth

[![npm](https://img.shields.io/npm/v/v-wechat-auth.svg)](https://www.npmjs.com/package/v-wechat-auth) [![vue2](https://img.shields.io/badge/vue-2.x-brightgreen.svg)](https://vuejs.org/)

> vue 2.0 微信网页授权插件

## 安装

### npm

```bash
npm install --save v-wechat-auth
```

```js
import Vue from 'vue'
import VWechatAuth from 'v-wechat-auth'
```

### 通过 script 标签

```html
<!-- 在 Vue 之后 -->
<!-- 从本地文件 -->
<script src="v-wechat-auth/dist/v-wechat-auth.min.js"></script>

<!-- 从 CDN -->
<script src="https://unpkg.com/v-wechat-auth"></script>
```

## 使用

### 初始化

```js
Vue.use(VWechatAuth)

// 必须在 root 实例上注入 wechatAuth
new Vue({
  el: '#app',
  ...,
  wechatAuth: new VWechatAuth({
    appId: 'your wechat appid',
    scope: 'snsapi_base or snsapi_userinfo'
    authorize () {
      return axios.get('your backend api here', { params: { code: code } })
        .then(function (res) {
          var data = (res && res.data) || {} // response data should at least contain openid
          return data
        })
    }
  })
})
```

### 调用

```js
  this.$wechatAuth.authorize()
```

## 运行例子

## VWechatAuth 实例

## License

[MIT](http://opensource.org/licenses/MIT)
