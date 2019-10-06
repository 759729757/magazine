// pages/all/all.js
const app = getApp();
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
      data:testData.data,
      imgUrl: app.globalData.imgUrl
    })
    // 拿数据
    wx.showLoading({
      title: '加载中',
    })
    var self = this;
      getData('',0,function(data){ //参数是 类型，页数，回调
      console.log('拿杂志数据',data)
      self.setData({
        data: data.data.data,
      });
      wx.hideLoading();
    })
    // 拿 类型 
    var self = this;
    wx.request({
      method: 'get',
      url: app.globalData.ajaxUrl + '/getMgzType',
      success: function (data) {
        console.log('拿杂志类型', data)
        self.setData({
          tab: data.data.data,
        });
      },
      error: function (err) {
        console.log(err);
      }
    })
  },
  goMgz: function (e) {
    console.log(e)
    var id = e.currentTarget.dataset.bookid;
    wx.navigateTo({
      url: '/pages/magazine/magazine?id=' + id,
    })
  },
  // 选择了tab标签
  chooseTab:function(e){
    var i = e.target.dataset.index;
    var type = '';
    type = (this.data.tab[i].name);
    console.log('杂志类型：',type);
    var self = this;
    getData(type, 1, function (data){
      console.log('拿杂志数据', data)
      self.setData({
        data: data.data.data,
        tabIndex: i
      });
    });
  },
  goSearch:function(){
    wx.navigateTo({
      url: '/pages/search/search',
    })
  }
})
function getData(type,page,cb){
  // 拿数据
  var query={};
  if (type) query.type = type;
  if (page) query.page = page;
  
  wx.request({
    method: 'get',
    data: query,
    url: app.globalData.ajaxUrl + '/getMagazine',
    success: function (data) {
      console.log(data);
      cb(data);
    },
    error: function (err) {
      console.log(err);
    }
  })
}