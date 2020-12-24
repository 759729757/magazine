// pages/news/detail.js
var WxParse = require('../../wxParse/wxParse.js');
const app = getApp();
// WxParse.wxParse('article', 'html', magazine.content[i][j].content, self, 5);
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //所有图片的高度  
    imgheights: [],
    //默认  
    current: 0
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

        data.content && WxParse.wxParse('article', 'html', data.content, self, 5);
        wx.hideLoading();
      },
      error: function (err) {
        console.log(err);
      }
    });
  },
  imageLoad: function (e) {//获取图片真实宽度  
    var imgwidth = e.detail.width,
      imgheight = e.detail.height,
      //宽高比  
      ratio = imgwidth / imgheight,
      ratioReal = imgwidth / 338;//缩放比，图片显示宽度为338rpx
      console.log(ratio,imgwidth, imgheight)
    //计算的高度值  
    // var viewHeight = 750 / ratio;
    var viewHeight = 338 / ratio ;
    var imgheight = viewHeight;
    var imgheights = this.data.imgheights;
    //把每一张图片的对应的高度记录到数组里  
    imgheights[e.target.dataset.id] = imgheight;
    this.setData({
      imgheights: imgheights
    })
  },
  bindSwiperchange: function (e) {
    // console.log(e.detail.current)
    this.setData({ current: e.detail.current })
  },



// 保存图片
 /****长按保存图片 */
 saveImg: function (e) {
  wx.showLoading({
   title: '正在保存图片',
 })
 let that=this;
 this.setData({
   saveImgUrl:e.target.dataset.src
 })
 wx.getSetting({
   success(res) {
     //未授权 先授权 然后保存
     if (!res.authSetting['scope.writePhotosAlbum']) {
       wx.authorize({
         scope: 'scope.writePhotosAlbum',
         success(re) {
           that.saveToBlum();
         }
       })
     }else{
      //已授 直接调用保存到相册方法
       that.saveToBlum();
     }
   }
 })  
},
saveToBlum:function(){
 const that = this;
 wx.downloadFile({
   url: that.data.saveImgUrl,
   success: function (res) {
     wx.saveImageToPhotosAlbum({
       filePath: res.tempFilePath,
       success(result) {
         wx.showToast({
           title: '保存成功',
           icon: 'success'
         })
       }
     })
   },
   complete:function(res){
     wx.hideLoading();//关闭提示框
   }
 })
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