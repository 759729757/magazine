Component({
  data: {
    selected: 0,
    color: "#7A7E83",
    selectedColor: "#3cc51f",
    list: [
      {
      pagePath: "/pages/index/index",
      text: "ALL所有期刊"
      },
       {
        "pagePath": "/pages/news/news",
        text: "NEWS时尚咨询"
      },{
         "pagePath": "/pages/mine/mine",
         text: "MINE个人中心"
      }
    ]
  },
  attached() {
  },
  methods: {
    switchTab(e) {
      const data = e.currentTarget.dataset;
      console.log('点击了:',data)
      this.setData({
        selected: data.index
      })
      const url = data.path
      wx.switchTab({url})
    }
  }
})

