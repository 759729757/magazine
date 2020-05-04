//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    banner: [], bannerId:0,
    top:[],
    autoplay: false,
    interval: 5000,
    duration: 1000,

    total:0,//需要被加载的图片个数
    progress: 0,
    loadComplete: 0,//图片加载完成个数
  },

  /// 求百分比
  GetPercent: function (num, total) {
    num = parseFloat(num);
    total = parseFloat(total);
    if (isNaN(num) || isNaN(total)) {
      return "-";
    }
    return total <= 0 ? "100" : (Math.round(num / total * 10000) / 100.00);
  },
  // 图片加载完成
  imgLoad: function (event) {
    var num = this.data.loadComplete + 1;
    var total = this.data.total;
    var progress = this.GetPercent(num, total);
    this.setData({
      loadComplete: num,
      progress: progress
    });
    // 显示导航栏
    // if(progress >= '98'){
    //   setTimeout(()=>{
    //     wx.showTabBar({
    //       animation: true //是否需要过渡动画
    //     })
    //   },1000)
    // }
  },
  // 跳转到某个杂志
  goMgz:function(e){
    console.log(e)
    var id = e.currentTarget.dataset.bookid;
    wx.navigateTo({
      url: '/pages/magazine/magazine?id='+id,
    })
  },
  // 下拉刷新
  onPullDownRefresh: function () {
    // 显示顶部刷新图标
    wx.showNavigationBarLoading();
    this.init();

  },
 
  bindGetUserInfo(e) {
    console.log(e.detail.userInfo)
  },
  
  /**
  * 生命周期函数--监听页面显示
  */
  onShow: function () {
    // 设置初始数据
    this.setData({
      imgUrl: app.globalData.imgUrl
    });
    wx.setNavigationBarTitle({
      title: 'Planet电子刊',
    })
    this.init();
    // 图片加载超时
    setTimeout(() => {
      if (this.data.progress < 95) {
        this.setData({
          loadComplete: this.data.total,
          progress: '100'
        });
      }
    }, 5000)
  },
  init:function(){
    // 获取数据
    var self = this;
    wx.request({
      method: 'get',
      url: app.globalData.ajaxUrl + '/getBanner',
      success: function (data) {
        console.log('getBanner', data);
        self.setData({
          banner: data.data.data,
          total: parseInt(self.data.total) + parseInt(data.data.data.length)
        });
        wx.hideNavigationBarLoading();
        // 停止下拉动作
        wx.stopPullDownRefresh();
      },
      error: function (err) {
        console.log(err);
      }
    })
    // wx.showLoading({
    //   title: '读取中',
    // })
    // // 拿热门top10 数据
    // wx.request({
    //   method: 'get',
    //   url: app.globalData.ajaxUrl + '/getTop',
    //   success: function (data) {
    //     console.log('getTop', data);
    //     self.setData({
    //       top: data.data.data,
    //       total: parseInt(self.data.total) + parseInt(data.data.data.length)
    //     });
    //     wx.hideLoading();
    //   },
    //   error: function (err) {
    //     console.log(err);
    //   }
    // })
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
  },
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: "Planet电子刊",
    }
  },
})
