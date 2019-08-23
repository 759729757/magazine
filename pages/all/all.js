// pages/all/all.js
var testData = require('data.js');//拿测试数据
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tab:[],tabIndex:0,
    data:[]
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
    wx.setNavigationBarTitle({
      title: '全部期刊',
    })
    this.setData({
      tab: testData.tab,
      data:testData.data
    })
  },
  // 选择了tab标签
  chooseTab:function(e){
    var i = e.target.dataset.index;
    this.setData({
      tabIndex:i
    })
  },
  goSearch:function(){
    wx.navigateTo({
      url: '/pages/search/search',
    })
  }
})