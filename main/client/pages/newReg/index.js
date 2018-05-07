// pages/newReg/index.js
const app = getApp();
const AV = app.AV;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    regName: '',
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

    variColumn: '学号'
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
   * REST: 创建签到表
   */
  requestCreate() {
    console.log('btn create triggered');
    let userId = app.globalData.user.objectId;
    let getCreatedNum = (obj) => {
      let result = {};
      let query = new AV.Query(obj);
      query.equalTo('creatorId', userId);
      query.count().then(function(count) {
        //  todo: 返回promise 如何处理
      });
    };
    //  申明表名
    class RegRecords extends AV.Object {}
    AV.Object.register(RegRecords);

    console.log(getCreatedNum(RegRecords));
    // 新建对象
    // let newRecord = new RegRecords();
    // let schemaNo = getCreatedNum();
    // // 设置名称
    // newRecord.set('schemaName', );
    // // 设置优先级
    // todoFolder.set('priority', 1);
    // todoFolder.save().then(function (todo) {
    //   console.log('objectId is ' + todo.id);
    // }, function (error) {
    //   console.error(error);
    // });
  },
  /**
   * 生成8位随机签到码 Join Code
   */
  generateJoinCode() {
    return Math.random().toString(36).substr(2, 8);
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.callback !== undefined) {
      options.callback();
    }
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
    //  initial data
    let that = this;
    let init = new Promise((resolve, reject) => {
      that.setData({
        regName: '',
        date: '2018-01-01',
        time: '00:00',
        delayIndex: '0',
        location: {
          name: '点我选择地点',
          address: '',
          latitude: '',
          longitude: '',
        },
      })
      resolve();
    });
    init.then(
      () => {
      //  stop refresh
      wx.stopPullDownRefresh();
    })
    .catch(
      (err) => {
        console.log('Promise Error: ' + err);
      }
    );

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
