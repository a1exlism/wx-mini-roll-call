// pages/newReg/index.js
const app = getApp();
const AV = app.AV;
const utils = require('../../utils/util');

Page({

  /**
   * 页面的初始数据
   * tableName: 唯一签到表 ID
   */
  data: {
    signCode: null,
    verifyCode: null,
    latitude: null,
    longitude: null,
    tableName: null,
  },

  /**
   * 两个input数据更新
   */

  inputSignCodeChange(e) {
    this.setData({
      signCode: e.detail.value
    });
  },
  inputVerifyCodeChange(e) {
    this.setData({
      verifyCode: e.detail.value
    });
  },
  /**
   * 请求签到
   */
  requestSign() {
    let that = this;
    if(that.data.signCode === null || that.data.verifyCode === null) {
      that.showToast('none', '请填写所有内容');
      return false;
    }
    //  get location
    wx.getLocation({
      type: 'wgs84',
      success(res) {
        that.setData({
          latitude: res.latitude,
          longitude: res.longitude
        });
        console.log('data setted')
        console.log(that.data);
        that.signCheck();
      },
      fail(e) {
        console.log('location Err' + e);
      }
    })
  },

  /**
   * LeanCloud 签到确认
   */
  signCheck() {
    console.log('signcheck Start');
    const that = this;
    const data = this.data;
    //  1. get table RegRecords
    let queryGetRecords = new AV.Query('RegRecords');
    queryGetRecords.equalTo('signCode', data.signCode);
    queryGetRecords.find().then(function(records) {
      if(records.length === 0) {
        that.showToast('none', '签到码不匹配');
        return false;
      }
      let record = records[0].attributes;
      that.setData({
        tableName: record.tableName
      });
      //  2. check time
      let timeNow = new Date().getTime();
      let timeToStart = record.createAt;
      let deadline = record.createAt + record.delay * 60 * 60 * 1000;
      console.log('time log start');
      console.log('now ' + timeNow);
      console.log('start ' + timeToStart);
      console.log('deadline ' + deadline);
      if(timeNow < timeToStart) {
        that.showToast('none', '签到还未开始')
        return false;
      } else if(timeNow > deadline) {
        that.showToast('none', '签到已结束');
        return false;
      }
      //  3. GPS location
      console.log('GPS check start');
      let latitudeGap = utils.accSub(data.latitude, record.latitude);
      let longitudeGap = utils.accSub(data.longitude, record.longitude);
      let totalGap = Math.abs(utils.accAdd(longitudeGap, latitudeGap));
      let threshold = 0.00004;
      console.log('GPS GAP ' + totalGap);
      if(totalGap < threshold) {
        console.log('GPS test well; Start Insert data into table.');
        //  4. insert new record in sign Schema
        let tableName = that.data.tableName;
        let userId = app.globalData.user.objectId;

        //  4.1. check has record already
        let query = new AV.Query(tableName);
        query.equalTo('userId', userId);
        query.count().then(function(count) {
          if(count !== 0) {
            that.showToast('none', '该课已签到');
            return false;
          } else {
            //  4.2 start Insert
            let Table = AV.Object.extend(tableName);
            let obj = new Table();
            obj.set('signTime', timeNow);
            obj.set('longitude', that.data.longitude);
            obj.set('latitude', that.data.latitude);
            obj.set('userId', userId);
            obj.set('studentNo', that.data.verifyCode);
            obj.save().then(() => {
              console.log(tableName + ' insert successfully');
            }).catch((err) => {
              console.log('insert error ' + err);
            });
          }
        }, function(err) {
          console.log('Query count Err' + err);
        });



      } else {
        that.showToast('none', '处于错误地址!');
      }
    }, function(err) {
      console.log('signCode query error' + err);
    });

  },

  showToast(type, msg) {
    //  success or none
    wx.showToast({
      title: msg,
      icon: type,
      mask: true
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {

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
