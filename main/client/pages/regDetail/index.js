// pages/regDetail/index.js

const app = getApp();
const AV = app.AV;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tableName: null,
    displayName: null,
    records: null
  },

  /**
   * get table records
   */

  getTableRecords(tableName) {
    let that = this;
    let query = new AV.Query(tableName);
    query.find().then(function(records) {
      let len = records.length;
      if(len === 0) {
        wx.showToast({
          title: '暂时没有数据',
          icon: 'none'
        });
        return false;
      }
      console.log('data render start');
      let modifiedRecords = {};
      for(let i = 0;i < len; ++i) {
        modifiedRecords[i] = records[i].attributes;
        modifiedRecords[i].signTime = new Date(modifiedRecords[i].signTime).toString().slice(4, -15);
      }
      that.setData({
        records: modifiedRecords
      });
      console.log(that.data.records);
    }, function(err) {
      console.log(err);
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      tableName: options.tableName,
      displayName: options.displayName
    });
    this.getTableRecords(options.tableName);
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
