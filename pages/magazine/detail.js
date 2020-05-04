// pages/magazine/detail.js
const app = getApp();
var videoContext ={};
var interval ={};
Page({
  /**
   * 页面的初始数据
   */
  data: {
    current: 0, videoArr: [], showFlag: '',//显示视频
    progress: 0,// 加载进度
    sold:1,//杂志的销售数量

    loadComplete:0,//图片加载完成个数
    imgProgress: 0,//图片加载进度
    timeProgress: 0,//加载太慢时主动模拟动画

    loadCompleteRate:82,//加载进度阈值，最高100（为避免加载太慢，不用设置到100）

  },
      /// 求百分比
  GetPercent:function(num, total) {
    num = parseInt(num);
      total = parseInt(total);
      if(isNaN(num) || isNaN(total)) {
    return "-";
    }
    return total <= 0 ? "100" : (Math.round(num / total * 10000) / 100.00);
    },
  // 图片加载完成
  imgLoad:function(event){
    let num = this.data.loadComplete + 1;
    let total = (this.data.data.magazine).length
    // .filter(item=>{item.type == 'image'}).length;
    let timeProgress = this.data.timeProgress;
    let progress = this.GetPercent(num,total);
    this.setData({
      loadComplete: num,
      imgProgress: progress,
      progress: progress > timeProgress ? progress : timeProgress 
    });
    console.log('加载完成', progress);
  },
  // 视频加载完成触发
  videoLoadComplete:function(index){
    let arr = this.data.videoArr;
    arr.push(index.currentTarget.id);
    this.imgLoad();
    this.setData({
      videoArr: arr
    })
  },
  // 播放进度变化
  bindtimeupdate:function(event){
    console.log('bindtimeupdate:', event);
    this.setData({
      videoDuration: Math.ceil(event.detail.currentTime) //记录当前视频的位置
    })
  },
  // 重播视频
  reLoadVideo:function(){
    // var current = this.data.current;
    var duration = this.data.videoDuration+1;
    // var data = this.data.data.magazine[current];
    // data.url = data.url + "?start="+1
    // var up = 'data.magazine[' + current + ']'
    // this.setData({
    //   [up]: data
    // })
    videoContext.seek(duration);
    videoContext.play();//播放视频
  },
  // 视频播放出错时促发
  binderror:function(event){
    // console.log('binderror:',event); 
    this.reLoadVideo();
  },
  // 视频缓冲触发
  bindwaiting:function(event){
    console.log('bindwaiting', event)
    // var current = this.data.current;
    // var data = this.data.data;
    // var duration = this.data.videoDuration;
    // data.magazine[current].url = data.magazine[current].url + "?start=" + duration
    // // var videoUrl = this.data.data.magazine[current].url;

    // this.setData({
    //   data: data
    // })
  },
  // 绑定swiper滚动
  bindchange: function (current, source){
    var current = current.detail.current
    this.setData({
      current: current,
    })
    let self = this;
    try{
      var video = 'video'+current;
      var videoArr = this.data.videoArr;

      if (videoContext.play)videoContext.pause();//暂停视频
      if (videoArr.indexOf(video) !== -1){
        // 滚到视频页了，播放视频
        videoContext = {};//清空
        videoContext = wx.createVideoContext(video);
        if (self.data.data.magazine[current].autoFull ){
          // 如果设置了全屏播放
          // console.log(self.data.data.magazine[current]);
          videoContext.requestFullScreen();
        }
        videoContext.play();//播放视频
      }

      // console.log('type of', typeof (videoContext.pause) );
      // (typeof videoContext.pause == 'function') && videoContext.pause();

      // videoContext = wx.createVideoContext('video' + current);
      // console.log('videoContext',videoContext);
      // (typeof videoContext.play == 'function') && videoContext.play(); 

    }catch(e){
      console.log('videoContext error', e);
    }
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
    this.setData({
      magazineId : id
    })
    if (readCode) data.readCode = readCode;

    // 检查是否购买过，是的话直接阅读，否则弹出输入阅读码弹框
    wx.showLoading({
      title: '加载中',
    })
    var self = this;
    data.token = app.globalData.token;
    wx.request({
      method: 'get',
      header: { 'Authorization': app.globalData.token },
      url: app.globalData.ajaxUrl + '/readMgz',
      data: data,
      success: function (data) {
        console.log('request', data);
        if (data.data.status == 1) {
          // 已经买过了
          console.log('杂志内容', data.data.magazine.magazine)
          // 处理数据（吧视频放到前一页里面）
          // data.data.magazine.magazine = self.handleData(data.data.magazine.magazine);
          // data.data.magazine.magazine = data.data.magazine.magazine
          self.setData({
            data: data.data.magazine,
            sold: data.data.magazine.sold,
            imgUrl: app.globalData.imgUrl
          });
          wx.setNavigationBarTitle({
            title: data.data.magazine.name,
          });
          
        }
        else if (data.data.status == 0) {
          wx.showToast({
            title: data.data.mess,
            icon: 'none',
            duration: 2000
          })
          return false;
        }
         else {
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

    // 图片加载超时
    interval = setInterval(()=>{
      let progress = this.data.progress;
      let timeProgress = this.data.timeProgress;
      let loadCompleteRate = this.data.loadCompleteRate;
      timeProgress += 10;
      console.log('加载超时', timeProgress, progress)
      
      this.setData({
        timeProgress: timeProgress,
        progress: progress > timeProgress ? progress : timeProgress
      });

      if (progress >= loadCompleteRate){
        clearInterval(interval);
      }
    },1500)

    // setTimeout(()=>{
    //   if (this.data.progress < 95) {
    //     console.log('加载超时。。。')
    //     this.setData({
    //       loadComplete: this.data.data.magazine.length,
    //       progress: '100'
    //     });
    //   }
    // },15000)

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
          self.setData({ //适配非全面屏 16:9
            imgType: 'aspectFit'
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
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: this.data.data.name,
      path: '/pages/magazine/magazine?id=' + this.data.magazineId
    }
  },
})