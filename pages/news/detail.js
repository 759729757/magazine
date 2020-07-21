// pages/news/detail.js
var WxParse = require('../../wxParse/wxParse.js');
const app = getApp();
// WxParse.wxParse('article', 'html', magazine.content[i][j].content, self, 5);
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var self = this;
    wx.showLoading({
      title: '读取中'
    })
    var id = options.id;
    if (!id) {
      wx.navigateBack({
        delta: 1
      })
    }

    // 获取数据
    wx.request({
      method: 'get',
      url: app.globalData.ajaxUrl + '/fetchNews',
      data: { _id: id },
      success: function (data) {
        console.log('fetchNews', data);
        var data = data.data.data[0];
        self.setData({
          data: data
        })

        WxParse.wxParse('article', 'html', data.content, self, 5);
        wx.hideLoading();
      },
      error: function (err) {
        console.log(err);
      }
    });


  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

    wx.setNavigationBarTitle({
      title: 'NEWS时尚资讯',
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})