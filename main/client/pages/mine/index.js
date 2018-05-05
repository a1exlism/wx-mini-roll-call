// pages/mine/index.js
const app = getApp();
const user = app.AV.User.current();


Page({

  /**
   * 页面的初始数据
   */
  data: {
    nickname: app.globalData.user.nickName,
    avatar: app.globalData.user.avatarUrl,

  },
  login() {
    app.AV.User.loginWithWeapp().then(user => {
      app.globalData.user = user.toJSON();
      //  调用微信API获取用户信息
    }).catch(console.error);
  },
  /**
   * Page jumping
   */
  newReg() {
    wx.navigateTo({
      url: '/pages/newReg/index'
    })
  },
  createdRegs() {
    wx.navigateTo({
      url: '/pages/regRecords/index'
    })
  },
  joinedRegs() {
    wx.navigateTo({
      url: '/pages/regRecords/index'
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      nickname: app.globalData.user.nickName,
      avatar: app.globalData.user.avatarUrl
    });
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