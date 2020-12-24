// pages/mine/mine.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabIndex: 1, tab1: [], 
    canIUse: wx.canIUse('button.open-type.getUserInfo')
    ,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   
    // console.log('userInfo',app.globalData.userInfo)
    // if (app.globalData.userInfo) {
    //   console.log(app.globalData.userInfo)
    //   this.setData({
    //     user: app.globalData.userInfo,
    //     hasUserInfo: true
    //   })
    // } else if (this.data.canIUse) {
    //   // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //   // 所以此处加入 callback 以防止这种情况
    //   app.userInfoReadyCallback = res => {
    //     this.setData({
    //       user: res.userInfo,
    //       hasUserInfo: true
    //     })
    //   }
    // } else {
    //   // 在没有 open-type=getUserInfo 版本的兼容处理
    //   wx.getUserInfo({
    //     success: res => {
    //       app.globalData.userInfo = res.userInfo
    //       this.setData({
    //         user: res.userInfo,
    //         hasUserInfo: true
    //       })
    //     }
    //   })
    // }

  },
  cancelLogin() {
    this.setData({
      wxlogin: true
    })
  },
// 长按复制
  copy: function (e){
    console.log('复制阅读码', e.target.dataset.code)
    wx.setClipboardData({
      data: e.target.dataset.code,
      success: function (res) {
        wx.showToast({
          title: '复制成功!快去发送给好友吧',
          icon:'none'
        });
      }
    });
  },
  // 下拉刷新
  onPullDownRefresh: function () {
    // 显示顶部刷新图标
    console.log('触发下拉刷新')
    wx.showNavigationBarLoading();
    this.init();

  },
  goMgz: function (e) {
    console.log(e)
    var id = e.currentTarget.dataset.bookid;
    wx.navigateTo({
      url: '/pages/magazine/magazine?id=' + id,
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

    //  如果没有拿到用户信息，需要申请拿
    if(!app.globalData.userInfo){app.getSetting();}
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 设置底部tab
    if (typeof this.getTabBar === 'function' &&
      this.getTabBar()) {
      this.getTabBar().setData({
        selected: 2
      })
    }
    // 设置初始数据
    this.setData({
      imgUrl: app.globalData.imgUrl
    });

    wx.setNavigationBarTitle({
      title: '个人中心',
    })
    this.setData({
      imgUrl: app.globalData.imgUrl
    })
    // wx.showLoading({
    //   title: '加载中',
    // })
    this.init();
   

  },
  init:function(){
    const self = this;
    const token = app.globalData.token;
    wx.request({
      method: 'get',
      header: { 'Authorization': app.globalData.token },
      url: app.globalData.ajaxUrl + '/userBuy',
      data: { token: token},
      success: function (data) {
        console.log('userBuy', data);
        if (data.data.status == 0) {
          wx.showToast({
            title: data.data.mess,
            icon: 'none',
            duration: 2000
          })
          return false;
        }
        self.setData({
          tab1: data.data.data
        })
      },
      error: function (err) {
        console.log(err);
      }
    })
    wx.request({
      method: 'get',
      header: { 'Authorization': app.globalData.token },
      url: app.globalData.ajaxUrl + '/userRecord',
      data: { token: token },
      success: function (data) {
        console.log('app.globalData.token', app.globalData.token)
        console.log('userRecord', data);
        if (data.data.status == 0) {
          wx.showToast({
            title: data.data.mess,
            icon: 'none',
            duration: 2000
          })
          return false;
        }
        self.setData({
          tab2: data.data.data
        })
        
        wx.hideNavigationBarLoading();
        // 停止下拉动作
        wx.stopPullDownRefresh();
      },
      error: function (err) {
        console.log(err);
      }
    })
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
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },


  // 选择标签
  setTab:function(e){
    var i = e.target.dataset.index;
    this.setData({
      tabIndex:i
    })
    if(i == 1){
      wx.showToast({
        title: '长按可复制阅读码哦',
        icon: 'none'
      });
    }
  }
})