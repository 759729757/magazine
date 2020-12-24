// pages/magazine/magazine.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    banner: [], readCord: false, purchase: false, autoplay:false,
    magazineId: '', 
    imgType:'widthFix',//'widthFix',
    chooseMenu: { number: '1', price: '8.00', }
    , setMeal: [
      { number: '1', price: '8.00', checked: 'true' },
      { number: '10', price: '80.00' },
      { number: '100', price: '800.00' },
    ],
    selfMenu: { number: 1, price: '8.00', },//自定义
    rankingList:[],//购买排行版
    magazinePrice:8,
    buyInputFocus:false,
    isBuy:false,//记录是否买过了
    showMenu:false,//显示购买按钮
    preLoad:[],//需要预加载的东西
  },
  subscribe:function(){
    this.setData({
      purchase:true
    })
  },
  clickBuyInput:function(){
    this.setData({
      buyInputFocus: true,
    })
  },
  // 用户自定义购买量
  bindBuyInput:function(e){
    let num = Math.ceil(e.detail.value);
    let price = num * this.data.data.price;
    if (num >= 100) price = (price * 0.95).toFixed(2);
    this.setData({
      selfMenu: { number: num, price: price, },
      chooseMenu: { number: num, price: price, },
    })
  },
  // 检测自定义输入的数据
  chechBuyInput:function(e){
    let num = Math.ceil(e.detail.value);
    if(num<1)num=1;
    let price = num * this.data.data.price;
    if (num >= 100) price = (price * 0.95).toFixed(2);
    this.setData({
      selfMenu: { number: num, price: price, },
      chooseMenu: { number: num, price: price, },
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
    if (!readCode){
      wx.showToast({
        title: '请输入阅读码', icon: 'none'
      })
      return false;
    }
    // 检查是否购买过，是的话直接阅读，否则弹出输入阅读码弹框
    var self = this;
    wx.request({
      method: 'get',
      header: { 'Authorization': app.globalData.token },
      url: app.globalData.ajaxUrl + '/readMgz',
      data: {
        token: app.globalData.token,
        magazine: self.data.magazineId,
        readCode: readCode
      },
      success: function (data) {
        console.log(data);
        if (data.data.status == 1) {
          // 已经买过了
          wx.navigateTo({
            url: 'detail?id=' + self.data.magazineId+ '&readCode='+readCode,
          })
        } else {
          // 弹出阅读码弹框
          wx.showToast({
            title: '无效阅读码', icon:'none'
          })
        }
        wx.hideLoading();
      },
      error: function (err) {
        console.log(err);
      }
    })

  },
  // 获取购买排行版
  fetchRankingList:function(){
    const self =this;
    wx.request({
      url: app.globalData.ajaxUrl + '/rankingList',
      header: { 'Authorization': app.globalData.token },
      data: {
        magazine: self.data.magazineId,
      },
      success:function(data){
        console.log('rankingList:',data);
        if (data.data.status == 1) {
          // 获取成功
          self.setData({
            rankingList: data.data.data
          });

        }
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
        token: app.globalData.token,
        magazine:  self.data.magazineId ,
        mgzName: self.data.data.name,
        _:new Date().valueOf()
        },
      success: function (data) {
        console.log('readMgz:',data);
        self.setData({
          showMenu: true,
        })
        if(data.data.status == 1 || self.data.magazinePrice == 0){
            // 已经买过了
          console.log(' 已经买过了',self.data.magazinePrice);
          wx.getSystemInfo({
            success: function (res) {
              var windowHeight = res.windowHeight;
              var windowWidth = res.windowWidth;
              if (windowHeight / windowWidth >= 1.7) {
                console.log('全面屏');
                self.setData({
                  isBuy: true,
                  // preLoad: data.data.magazine.magazine //取消预加载
                })
              } else {
                console.log('非全面屏');
                self.setData({
                  isBuy: true,
                  // preLoad: data.data.magazine.subMagazine //取消预加载
                })
              }
            },
          })
        }else{
          console.log(' 还没购买过');
          // 弹出阅读码弹框
          // self.setData({
          //   readCord:true
          // })
        }
        wx.hideLoading();
      },
      error: function (err) {
        console.log(err);
      }
    })
  },
  // 观看杂志
  read:function(){
    var self = this;
    if(this.data.isBuy || this.data.price == 0){
      wx.navigateTo({
        url: 'detail?id=' + self.data.magazineId,
      })
    }else{
      self.setData({
        readCord: true
      })
    }
  },

  // 购买功能
  purchaseMgz:function(){
    var self = this;
    self.setData({
      paybtn:true //禁用付款按钮，防止重复递交
    })
    wx.request({
      method: 'get',
      url: app.globalData.ajaxUrl + '/wxPurchase',
      header: { 'Authorization': app.globalData.token },
      data: { 
        magazine: self.data.magazineId ,
        amount: self.data.chooseMenu.price,
        tradeCount: self.data.chooseMenu.number,
        tradeBody: self.data.data.name
      },
      success: function (data) {
        console.log('purchase',data);
        if (data.data.error_code == 0){
          let paydatas = data.data.result,
            out_trade_no = data.data.out_trade_no;

            // 调起支付接口
          wx.requestPayment({
            'timeStamp': paydatas.timeStamp.toString(),
            'nonceStr': paydatas.nonceStr,
            'package': "prepay_id=" + paydatas.package,
            'signType': 'MD5',
            'paySign': paydatas.paySign,
            'success': function (res) {
             
              // 向后台发送支付成功信息
              wx.request({
                method: 'get',
                url: app.globalData.ajaxUrl + '/purchase',
                header: { 'Authorization': app.globalData.token },
                data: {
                  magazine: self.data.magazineId,
                  amount: self.data.chooseMenu.price,
                  tradeCount: self.data.chooseMenu.number,
                  tradeBody: self.data.name,
                  out_trade_no: out_trade_no
                },
                success:function(data){
                  self.setData({
                    isBuy: true
                  })
                  wx.showModal({
                    title: "提示",
                    content: "您已购买成功！阅读码为：" + data.data.readCode,
                    confirmColor: "#30a0ef",
                    success: function (res) {
                      if (res.confirm) {
                        self.setData({
                          isBuy: true,
                          purchase: false
                        })
                        wx.navigateTo({
                          url: 'detail?id=' + self.data.magazineId,
                        })
                      } else {
                        self.setData({
                          isBuy: true,
                          purchase: false
                        })
                      }
                    }
                  })
                },
                fail:function(data){

                }
              });

            },
             'fail': function (res) {
              // 用户取消支付
              wx.showModal({
                title: "支付失败",
                content: '付款失败，需要重新付款吗？',
                confirmColor: "#ff6622",
                success: function (res) {
                  if (res.confirm) {
                    self.purchaseMgz()
                  } else {
                    
                  }
                }
              })
            },
            'complete': function (res) {
              console.log(res)
            }
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
      },
      complete:function(err){
        console.log('complete',err);
        self.setData({
          paybtn: false //恢复购买按钮（防止重复提交）
        })
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
    var self = this;
    wx.showLoading({
      title: '读取中'
    })
    var id = options.id;
    if(!id){
      console.log('没有id')
      wx.switchTab({
        url: '/pages/index/index'
      })
    }else{
      self.setData({
        magazineId: id
      });
    }
    // 获取数据
    wx.request({
      method: 'get',
      url: app.globalData.ajaxUrl + '/fetchMagazine',
      data:{_id:id},
      success: function (data) {
        console.log('getMagazine',data);
        if(data.statusCode !==200){
          wx.redirectTo({
            url: 'pages/index/index',
          })
          return;
        }
        var magazine = data.data.data[0];
        var magazinePrice = magazine.price;//杂志价格
        self.setData({
          magazinePrice:magazinePrice
        })
        // magazine.subHeadImg.shift();//删除第一个，第一个是封面图

        wx.setNavigationBarTitle({
          title: ' ',
        });

        self.setData({
          // 设置价格
          setMeal: [
            { number: '1', price: magazine.price, checked: 'true' },
            { number: '10', price: magazine.price * 10 },
            { number: '100', price: magazine.price * 95 },
          ],

          data: magazine,
          imgUrl: app.globalData.imgUrl,
        });
        self.goDetail();

        wx.hideLoading();
      },
      error: function (err) {
        console.log(err);
      }
    });

// 读取排行榜
    this.fetchRankingList();
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
    //  如果没有拿到用户信息，需要申请拿
    if (!app.globalData.userInfo) { app.getSetting(); }

    // 设置屏幕图片参数
    var self = this;
    wx.getSystemInfo({
      success: function(res) {
        console.log('屏幕数据', (windowHeight / windowWidth));
        var windowHeight = res.windowHeight;
        var windowWidth = res.windowWidth;

        if (windowHeight / windowWidth >= 1.7){
          console.log('全面屏', res);
          self.setData({ //适配全面屏
              imgType:'widthFix'
            })
        }else{
          console.log('非全面屏', res);
          self.setData({ //适配非全面屏 19:9
            imgType: 'widthFix'
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
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: this.data.data.name,
    }
  },

})