//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // console.log('login',res);
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        var self = this;
        wx.request({
          method: 'post',
          data: { openId: 'asdf' },//open 测试用
          url: self.globalData.ajaxUrl + '/login',
          success: function (data) {
            console.log('login:', data);
            if(data.data.status == 1){
              let token = data.data.token;
              self.globalData.token = token; //保存token

            }else{
              // 登陆失败 

            }
          },
          error: function (err) {
            console.log(err);
          }
        })
      }
    })


    // 可以通过 wx.getSetting 先查询一下用户是否授权了 "scope.record" 这个 scope
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.werun']) {
          wx.authorize({
            scope: 'scope.werun',
            success() {
              // 用户已经同意小程序使用功能，后续调用 wx.getUserInfo 接口不会弹窗询问
              wx.getUserInfo()
            }
          })
        }
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              console.log('getUserInfo',res);
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    ajaxUrl:'http://www.cy2017.cn/',
    token:'',
    userInfo: null,
    imgUrl:'http://www.cy2017.cn/images/magazines/'
  }
})