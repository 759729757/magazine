// pages/magazine/magazine.js
var testData = require('data.js');//拿测试数据
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    banner: [], readCord: false, purchase: false, autoplay:false,
    magazineId: '', imgType:'widthFix',
    chooseMenu: { number: '1', price: '6.00', }
    , setMeal: [
      { number: '1', price: '6.00', checked: 'true' },
      { number: '10', price: '60.00' },
      { number: '100', price: '588.00' },
    ]
  },
  subscribe:function(){
    this.setData({
      purchase:true
    })
  },
  bindKeyInput: function (e) {
    this.setData({
      readCordNumber: e.detail.value
    })
  },
  readByCord:function(){
    var readCode = this.data.readCordNumber;//已经输入的阅读吗
    wx.showLoading({
      title: '读取中'
    })
    // 检查是否购买过，是的话直接阅读，否则弹出输入阅读码弹框
    var self = this;
    wx.request({
      method: 'get',
      header: { 'Authorization': app.globalData.token },
      url: app.globalData.ajaxUrl + '/readMgz',
      data: {
        magazine: self.data.magazineId,
        readCode: readCode
      },
      success: function (data) {
        console.log(data);
        if (data.data.status == 1) {
          // 已经买过了
          wx.navigateTo({
            url: 'detail?id=' + self.data.magazineId,
          })
        } else {
          // 弹出阅读码弹框
          wx.showToast({
            title: '无效阅读码', icon:'success'
          })
        }
        wx.hideLoading();
      },
      error: function (err) {
        console.log(err);
      }
    })

  },
  goDetail:function(){
    wx.showLoading({
      title: '读取中'
    })
    // 检查是否购买过，是的话直接阅读，否则弹出输入阅读码弹框
    var self = this;
    wx.request({
      method: 'get',
      header: {'Authorization':app.globalData.token},
      url: app.globalData.ajaxUrl + '/readMgz',
      data: { 
        magazine:  self.data.magazineId ,
        },
      success: function (data) {
        console.log(data);
        if(data.data.status == 1){
            // 已经买过了
            wx.navigateTo({
              url: 'detail?id=' + self.data.magazineId,
            })
        }else{
          // 弹出阅读码弹框
          self.setData({
            readCord:true
          })
        }
        wx.hideLoading();
      },
      error: function (err) {
        console.log(err);
      }
    })

  },
  purchaseMgz:function(){
    // 支付成功后 发送购买信息
    var self = this;
    wx.request({
      method: 'get',
      url: app.globalData.ajaxUrl + '/purchase',
      header: { 'Authorization': app.globalData.token },
      data: { 
        magazine: self.data.magazineId ,
        price: self.data.chooseMenu.price,
        tradeCount: self.data.chooseMenu.number
      },
      success: function (data) {
        console.log('purchase',data);
        if(data.data.status == 1){
          wx.showToast({
            title: '购买成功',
            icon:'success'
          })
          self.setData({
            purchase: false
          })
        }else{
          wx.showToast({
            title: '购买失败',
            icon: 'success'
          })
          self.setData({
            purchase: false
          })
        }
      },
      error: function (err) {
        console.log(err);
      }
    })
  },
  radioChange: function (e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value);
    var meal = this.data.setMeal;
    this.setData({
      chooseMenu: meal[e.detail.value]
    })

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '读取中'
    })
    var id = options.id;
    if(!id){
      wx.navigateBack({
        delta: 1
      })
    }
    // 获取数据
    var self = this;
    wx.request({
      method: 'get',
      url: app.globalData.ajaxUrl + '/getMagazine',
      data:{_id:id},
      success: function (data) {
        console.log(data);
        var magazine = data.data.data[0];
        magazine.subHeadImg.shift();//删除第一个，第一个是封面图

        wx.setNavigationBarTitle({
          title: magazine.name,
        });

        self.setData({
          data: magazine,
          imgUrl: app.globalData.imgUrl,
          magazineId:id
        });
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
    // // 设置测试数据
    // this.setData({
    //   data: testData
    // });
    
    // 设置屏幕图片参数
    var self = this;
    wx.getSystemInfo({
      success: function(res) {
        console.log('屏幕数据',res);
        var windowHeight = res.windowHeight;
        var windowWidth = res.windowWidth;

        if(windowHeight/windowWidth >= 2){
          self.setData({ //适配全面屏
              imgType:'widthFix'
            })
        }else{
          self.setData({ //适配非全面屏 19:9
            imgType: 'aspectFill'
          })
        }
      },
    })
  },

  cancelReadCord: function () {
    this.setData({
      readCord: false
    })
  },
  cancelPurchase: function () {
    this.setData({
      purchase: false
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})