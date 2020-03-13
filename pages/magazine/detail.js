// pages/magazine/detail.js
const app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    current: 0, videoArr: [], showFlag:'',
  },
  // 播放视频
  showVideo:function(videoId){
    this.setData({
      showFlag: this.data.current
    })
  },
  // 视频加载完成触发
  videoLoadComplete:function(index){
    console.log('videoLoadComplete', index.currentTarget.id)
    let arr = this.data.videoArr;
    arr.push(index.currentTarget.id)
    this.setData({
      videoArr: arr
    })
  },
  // 绑定swiper滚动
  bindchange: function (current, source){
    this.setData({
      current: current.detail.current,
      showFlag:false
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var id = options.id;
    var readCode = options.readCode;
    console.log('readCode', options)
    var data = {
      magazine: id,
    }
    if (readCode) data.readCode = readCode;

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
        console.log('request', data);
        if (data.data.status == 1) {
          // 已经买过了
          data.data.magazine.magazine = self.handleData(data.data.magazine.magazine);
          self.setData({
            data: data.data.magazine,
            imgUrl: app.globalData.imgUrl
          })
          
        } else {
          // 弹出阅读码弹框
          wx.showToast({
            title: '无效阅读码',
          })
        }
        wx.hideLoading();
      },
      error: function (err) {
        console.log(err);
      }
    })
  },
// 处理拿到的杂志数据
    handleData:function(data){
      var i=0,length=data.length;
      for(i;i<length;i++){
        if (i>0 && this.isVideo(data[i].url)){
// 如果这个是视频,把它加到前面一页
          var video = data.splice(i, 1);
          i--;
          length--;
          data[i].video = video[0];
        }
      }
      // console.log('splice', data);
      return data;

    },

  // // 判断是视频或者是图片格式
  isVideo:function(url){
    // console.log('匹配：' + url)
    var reg = RegExp(/mp4$|wmv$|MP4/);
    return reg.test(url) ? true : false
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
    // 设置初始数据
    this.setData({
      imgUrl: app.globalData.imgUrl
    });
    
    // 设置屏幕图片参数
    var self = this;
    wx.getSystemInfo({
      success: function (res) {
        console.log('屏幕数据', res);
        var windowHeight = res.windowHeight;
        var windowWidth = res.windowWidth;

        if (windowHeight / windowWidth >= 1.7) {
          console.log('全面屏');
          self.setData({ //适配全面屏
            imgType: 'widthFix'
          })
        } else {
          console.log('非全面屏');
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