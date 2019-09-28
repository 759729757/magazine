// pages/magazine/magazine.js
var testData = require('data.js');//拿测试数据
Page({

  /**
   * 页面的初始数据
   */
  data: {
    banner: [], readCord: false, purchase:true
    , setMeal: [
      { number: '1本', price: '6.00', checked: 'true' },
      { number: '10本', price: '60.00' },
      { number: '100本', price: '58.00' },
    ]
  },
  goDetail:function(){
    wx.navigateTo({
      url: 'detail',
    })
  },
  radioChange: function (e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
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

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 设置测试数据
    this.setData({
      data: testData
    });
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