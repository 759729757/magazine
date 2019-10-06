//index.js
//获取应用实例
const app = getApp()
var testData = require('data.js');//拿测试数据

Page({
  data: {
    banner: [], bannerId:0,
    top:[],
    autoplay: false,
    interval: 5000,
    duration: 1000
  },
  goMgz:function(e){
    console.log(e)
    var id = e.currentTarget.dataset.bookid;
    wx.navigateTo({
      url: '/pages/magazine/magazine?id='+id,
    })
  },
  /**
  * 生命周期函数--监听页面显示
  */
  onShow: function () {
    wx.setNavigationBarTitle({
      title: '时尚芭莎电子期刊',
    })
// 获取数据
    var self = this;
    wx.request({
      method:'get',
      url: app.globalData.ajaxUrl +'/getBanner',
      success:function(data){
        console.log(data);
        self.setData({
          banner: data.data.data,
        });
      },
      error:function(err){
        console.log(err);
      }
    })
    wx.showLoading({
      title: '读取中',
    })
// 拿热门top10 数据
    wx.request({
      method: 'get',
      url: app.globalData.ajaxUrl + '/getTop',
      success: function (data) {
        console.log(data);
        self.setData({
          top: data.data.data,
        });
        wx.hideLoading();
      },
      error: function (err) {
        console.log(err);
      }
    })



    // 设置测试数据
    this.setData({
      banner: testData.banner,
      top: testData.top10,
      imgUrl: app.globalData.imgUrl
    });
  },
  bannerChange:function(e){
    console.log(e.detail.current)
    this.setData({
      bannerId:e.detail.current
    })
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
