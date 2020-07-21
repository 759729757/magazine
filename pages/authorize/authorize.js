// pages/authorize/authorize.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    var that = this;
    // 查看是否授权
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: function (res) {
              //从数据库获取用户信息
              that.queryUsreInfo();
              //用户已经授权过
              wx.switchTab({
                url: '/pages/index/index'
              })
            }
          });
        }
      }
    })
  },
  bindGetUserInfo: function (e) {
    if (e.detail.userInfo) {
      //用户按了允许授权按钮
      var self = this;
      //插入登录的用户的相关信息到数据库
      wx.request({
        method: 'post',
        header: { 'Authorization': app.globalData.token },
        url: app.globalData.ajaxUrl + '/updateUserInfo',
        data: e.detail.userInfo,
        success: function (data) {
          console.log('bindGetUserInfo updateUserInfo ', data);
          app.globalData.userInfo = e.detail.userInfo
        },
        error: function (err) {
          console.log('updateUserInfo err', err);
        }
      })
      //授权成功后，跳转进入小程序首页
      wx.switchTab({
        url: '/pages/index/index'
      })
    } else {
      //用户按了拒绝按钮
      wx.showModal({
        title: '警告',
        content: '拒绝授权将无法使用小程序核心功能，请授权之后再进入!',
        showCancel: false,
        confirmText: '返回授权',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击了“返回授权”')
          }
        }
      })
    }
  },
  queryUsreInfo() {
    // 获取用户信息
    var self = this;
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              console.log('getUserInfo', res);
              // 将用户信息发送到后台保存
              wx.request({
                method: 'post',
                header: { 'Authorization': app.globalData.token },
                url: app.globalData.ajaxUrl + '/updateUserInfo',
                data: res.userInfo,
                success: function (data) {
                  console.log('updateUserInfo', data);
                },
                error: function (err) {
                  console.log('updateUserInfo err', err);
                }
              })

              app.globalData.userInfo = res.userInfo

              // // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // // 所以此处加入 callback 以防止这种情况
              // if (self.userInfoReadyCallback) {
              //   self.userInfoReadyCallback(res)
              // }
            }
          })
        } else {

        }
      }
    })
    // 获取用户信息 end
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})