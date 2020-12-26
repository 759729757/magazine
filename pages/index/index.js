//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    wxlogin: true,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    banner: [], bannerId:0,imgheights:[],
    top:[],
    autoplay: false,
    interval: 5000,
    duration: 1000,

    total:0,//需要被加载的图片个数
    progress: 0,
    loadComplete: 0,//图片加载完成个数
  },
  getPhoneNumber(e) {
    console.log(e.detail.iv)
    console.log(e.detail.encryptedData)
    if (!e.detail.encryptedData){
      return;
    }
    // 将用户手机号发送到后台保存
    var self = this;
    wx.request({
      method: 'post',
      header: { 'Authorization': app.globalData.token },
      url: app.globalData.ajaxUrl + '/updatePhone',
      data: {
        encryted: e.detail.encryptedData,
        iv: e.detail.iv
      },
      success: function (data) {
        console.log('bindPhone', data);
      },
      error: function (err) {
        console.log('bindPhone err', err);
      },
      complete:function(){
        self.setData({
          wxlogin: true,
        })
      }
    })
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
  imgLoad: function (e) {
    var num = this.data.loadComplete + 1;
    var total = this.data.total;
    var progress = this.GetPercent(num, total);
    this.setData({
      loadComplete: num,
      progress: progress
    });

    // 设置图片的宽高
    var imgwidth = e.detail.width,
      imgheight = e.detail.height,
      //宽高比  
      ratio = imgwidth / imgheight,
      ratioReal = imgwidth / 328;//缩放比，图片显示宽度为338rpx
      console.log(ratio,imgwidth, imgheight)
    //计算的高度值  
    // var viewHeight = 750 / ratio;
    var viewHeight = 328 / ratio;
    var imgheight = viewHeight;
    var imgheights = this.data.banner;
    //把每一张图片的对应的高度记录到数组里  
    imgheights[e.target.dataset.id] = imgheight;
    // this.setData({
    //   imgheights: imgheights
    // })

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

  
  onLoad:function(){
    //   // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //   // 所以此处加入 callback 以防止这种情况
    const self = this;
      app.userInfoReadyCallback = res => {
        console.log('callback', res)
        if (!res.data.data.phoneNumber){
          self.setData({
            wxlogin:false
          })
        }
      }

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
      title: 'SortieZine',
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
    // 设置底部tab
    if (typeof this.getTabBar === 'function' &&
      this.getTabBar()) {
      this.getTabBar().setData({
        selected: 0
      })
    }
  },
  init:function(){
    // 获取数据
    var self = this;
    wx.request({
      method: 'get',
      url: app.globalData.ajaxUrl + '/fetchMagazine',
      success: function (data) {
        console.log('init', data);
        self.setData({
          // banner: [data.data.data.shift()],
          banner: data.data.data,
          top: data.data.data,
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
      title: "SortieZine",
    }
  },

})
