// pages/mine/mine.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabIndex: 0, tab1:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  
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

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
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
    wx.showLoading({
      title: '加载中',
    })
    const self = this;
    wx.request({
      method: 'get',
      url: app.globalData.ajaxUrl + '/userInfo',
      header: { 'Authorization': app.globalData.token },
      success: function (data) {
        console.log('userInfo', data);
        self.setData({
          user: data.data.user
        })
        wx.hideLoading();
      },
      error: function (err) {
        console.log(err);
      }
    })
    wx.request({
      method: 'get',
      url: app.globalData.ajaxUrl + '/userBuy',
      header: { 'Authorization': app.globalData.token },
      success: function (data) {
        console.log('userBuy', data);
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
      url: app.globalData.ajaxUrl + '/userRecord',
      header: { 'Authorization': app.globalData.token },
      success: function (data) {
        console.log('userRecord', data);
        self.setData({
          tab2: data.data.data
        })
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

  },
  // 选择标签
  setTab:function(e){
    var i = e.target.dataset.index;
    this.setData({
      tabIndex:i
    })
  }
})