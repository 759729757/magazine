Component({
  data: {
    selected: 0,
    color: "#7A7E83",
    selectedColor: "#3cc51f",
    list: [
      {
      pagePath: "/pages/index/index",
      text: "ALL"
      },
       {
        "pagePath": "/pages/news/news",
        text: " NEWS"
      },{
         "pagePath": "/pages/mine/mine",
         text: " MINE "
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

