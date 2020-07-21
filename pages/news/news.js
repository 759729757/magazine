// pages/news/news.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    data:[],

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.init();

    wx.setNavigationBarTitle({
      title: 'NEWS时尚资讯',
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

    // 设置底部tab
    if (typeof this.getTabBar === 'function' &&
      this.getTabBar()) {
      this.getTabBar().setData({
        selected: 1
      })
    }
  },
  goDetail: function (e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: 'detail?id=' + id,
    })
  },
  goSearch: function () {
    wx.navigateTo({
      url: '/pages/search/search',
    })
  },

  init: function () {
    // 获取数据
    var self = this;
    wx.request({
      method: 'get',
      url: app.globalData.ajaxUrl + '/fetchNews',
      success: function (data) {
        console.log('fetchNews', data);
        self.setData({
          data: data.data.data,
        });
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