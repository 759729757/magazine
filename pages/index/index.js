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
  goMgz:function(){
    wx.navigateTo({
      url: '/pages/magazine/magazine',
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
  wx.request({
    method:'get',
    url: app.globalData.ajaxUrl+'/getBanner',
    success:function(data){
      
    },
    error:function(err){
      console.log(err);
    }

  })


    // 设置测试数据
    this.setData({
      banner: testData.banner,
      top: testData.top10
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
