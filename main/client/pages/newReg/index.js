// pages/newReg/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    date: '2018-01-01',
    time: '00:00',
    delayIndex: '0',
    delayArr: [3, 5, 10, 15, 30],

    location: {
      name: '点我选择地点',
      address: '',
      latitude: '',
      longitude: '',
    },

    variColumn: '学号',
  },

  //  time setting
  bindDateChange(e) {
    this.setData({
      date: e.detail.value
    })
  },
  bindTimeChange(e) {
    this.setData({
      time: e.detail.value
    })
  },
  bindDelayChange(e) {
    this.setData({
      delayIndex: e.detail.value
    })
  },
  //  location setting
  setLocation() {
    console.log('set location triggered');
    let that = this;
    wx.chooseLocation({
      type: 'wgs84',
      altitude: true,
      success(res) {
        let locationName = '已保存地点信息';
        if(res.name != '' && res.name !== undefined) {
          locationName = res.name;
        }
        that.setData({
          location: {
            name: locationName,
            address: res.address,
            latitude: res.latitude,
            longitude: res.longitude
          }
        });
        // console.log('locationName: ' + locationName);
        // console.log(res.name);
        // console.log(that.data.location);
      }
    })
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
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
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