// pages/search/search.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },  
  goMgz: function (e) {
    console.log(e)
    var id = e.currentTarget.dataset.bookid;
    wx.navigateTo({
      url: '/pages/magazine/magazine?id=' + id,
    })
  },
  search:function(e){
    var self= this;
    var name = e.detail.value;
    wx.request({
      method: 'get',
      // data: { name: { '$$regex': name } },
      data: { name:  name  },
      url: app.globalData.ajaxUrl + '/getMagazine',
      success: function (data) {
        console.log('search:',data);
        self.setData({
          data: data.data.data,
          imgUrl: app.globalData.imgUrl
        });
      },
      error: function (err) {
        console.log(err);
      }
    })
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