//index.js
//获取应用实例
const app = getApp()
var testData = require('data.js');//拿测试数据

Page({
  data: {
    banner: [], bannerId:0,
    top:[],
    imgUrls: [
      'https://images.unsplash.com/photo-1551334787-21e6bd3ab135?w=640',
      'https://images.unsplash.com/photo-1551214012-84f95e060dee?w=640',
      'https://images.unsplash.com/photo-1551446591-142875a901a1?w=640'
    ],
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
