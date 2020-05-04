//app.js
// 所有ajax的链接接口
var baseUrl = 'https://wechat.planetofficial.cn'

 App({
  onLaunch: function () {
    // wx.hideTabBar({
    //   animation: false //是否需要过渡动画
    // })

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        var self = this;
        wx.request({
          method: 'get',
          data: { code: res.code },
          url: self.globalData.ajaxUrl + '/loginByCode',
          success: function (data) {
            console.log('login:', data);
            if(data.data.status == 1){
              let token = data.data.token;
              self.globalData.token = token; //保存token
              self.getUserInfo();

            }else{
              // 登陆失败,一般是后台问题
              console.log('登陆失败,一般是后台问题')
              // self.showSettingToast("请授权")
              // wx.redirectTo({
              //   url: '/pages/authorize/authorize',
              // })
            }
          },
          error: function (err) {
            console.log(err);
          }
        })
      }
    })
   
    // 可以通过 wx.getSetting 先查询一下用户是否授权了 "scope.record" 这个 scope
    var self = this;
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.userInfo']) {
          wx.authorize({
            scope: 'scope.userInfo',
            success() {
              // 用户已经同意小程序使用功能，后续调用 wx.getUserInfo 接口不会弹窗询问
              console.log('用户已经同意小程序使用功能');
              self.getUserInfo()
            },
            fail(res){
              console.log('用户未授权authorize');
              wx.redirectTo({
                url: '/pages/authorize/authorize',
              })
            }
          })
        }else{
          // console.log('用户未授权authSetting');
          // wx.redirectTo({
          //   url: '/pages/authorize/authorize',
          // })
          self.getUserInfo()
        }
      }
    })
  },
  getSysInfo() {
    return new Promise(function (resolve, reject) {
      wx.getSystemInfo({
        success: res => {
          resolve(res)
        }
      })
    }) 
    
  },
  async getUserInfo(){
    // 获取用户信息
    if (this.globalData.isUpdateUserInfo){return false;}//已经上传过一次，无需重复提交
    this.globalData.isUpdateUserInfo = true;
    var self = this;
    console.log('屏幕数据：',await self.getSysInfo());
    const systemInfo = await self.getSysInfo();
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              console.log('getUserInfo', res);
              res.userInfo.systemInfo = systemInfo; //将用户设备信息提交到后台
              // 将用户信息发送到后台保存
              wx.request({
                method: 'post',
                header: { 'Authorization': self.globalData.token },
                url: self.globalData.ajaxUrl + '/updateUserInfo',
                data: res.userInfo,
                success: function (data) {
                  console.log('updateUserInfo', data);
                },
                error: function (err) {
                  console.log('updateUserInfo err', err);
                }
              })

              self.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (self.userInfoReadyCallback) {
                self.userInfoReadyCallback(res)
              }
            }
          })
        }else{

        }
      }
    })
                // 获取用户信息 end
  },

  globalData: {
    isUpdateUserInfo:false,
    ajaxUrl: baseUrl +'/client',
    token:'',
    userInfo: null,
    imgUrl: baseUrl+'/images/magazines/'
  }
})