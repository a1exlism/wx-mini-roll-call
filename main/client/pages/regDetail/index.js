// pages/regDetail/index.js

const app = getApp();
const AV = app.AV;
const utils = require('../../utils/util');

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
          icon: 'none',
          duration: 500
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

  exportCSV() {
    //  create CSV file
    let str = '学号,签到时间\n';
    let records = this.data.records;
    if(records == null) {
      return false;
    }
    let len = records.length;
    let b64str = [];
    for(let i = 0; i < len; ++i) {
      str += records[i].studentNo + ',' + records[i].signTime + '\n';
    }
    b64str = utils.Base64.encode(str);
    console.log('b64str');
    console.log(b64str);
    //  BUG: wechat LeanCloud 无法创建文件
    // let data = { base64: b64str };
    // let file = new AV.File('tmp.csv', data);
    //
    // file.save().then(function(file) {
    //   console.log('upload well');
    // }, function(err) {
    //   console.log('file create Err \n' + err);
    // });

    //  simulate download 暂时的
    wx.downloadFile({
      url: 'https://gist.githubusercontent.com/a1exlism/9141da7c20382fe730813f98564569c5/raw/a565791463c3c6f2501366004c8e897da6f8728d/tmp.csv',
      success() {
        wx.showToast({
          title: '下载成功',
          icon: 'success',
          duration: 1000
        });
      },
      fail(err) {
        console.log(err);
      }
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
