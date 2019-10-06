// pages/magazine/detail.js
var testData = require('data.js');//拿测试数据
const app = getApp();

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
    var id = options.id;
    var readCord = options.readCord;
    var data = {
      magazine: id,
    }
    if(readCord)data.readCode = readCord;

    // 检查是否购买过，是的话直接阅读，否则弹出输入阅读码弹框
    wx.showLoading({
      title: '加载中',
    })
    var self = this;
    wx.request({
      method: 'get',
      header: { 'Authorization': app.globalData.token },
      url: app.globalData.ajaxUrl + '/readMgz',
      data: data,
      success: function (data) {
        console.log(data);
        if (data.data.status == 1) {
          // 已经买过了
          self.setData({
            data: data.data.magazine,
            imgUrl: app.globalData.imgUrl
          })
          
        } else {
          // 弹出阅读码弹框
          
        }
        wx.hideLoading();
      },
      error: function (err) {
        console.log(err);
      }
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
    // 设置测试数据
    this.setData({
      data: testData
    });

    // 设置屏幕图片参数
    var self = this;
    wx.getSystemInfo({
      success: function (res) {
        console.log('屏幕数据', res);
        var windowHeight = res.windowHeight;
        var windowWidth = res.windowWidth;

        if (windowHeight / windowWidth >= 2) {
          self.setData({ //适配全面屏
            imgType: 'widthFix'
          })
        } else {
          self.setData({ //适配非全面屏 19:9
            imgType: 'aspectFill'
          })
        }
      },
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