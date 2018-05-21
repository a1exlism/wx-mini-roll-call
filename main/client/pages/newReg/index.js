// pages/newReg/index.js
const app = getApp();
const AV = app.AV;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    displayName: '',
    date: '2018-01-01',
    time: '00:00',
    timestamp: '',
    delayIndex: '0',
    delayArr: [3, 5, 10, 15, 30],
    signCode: '',
    location: {
      name: '点我选择地点',
      address: null,
      latitude: null,
      longitude: null,
    },

    variColumn: '学号'
  },
  //  displayName
  saveDisplayName(e) {
    this.setData({
      displayName: e.detail.value
    });
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
      // altitude: true, 高度暂时不用
      success(res) {
        let locationName = '已保存地点信息';
        if (res.latitude !== null) {
          if(res.name != '' || res.name !== undefined) {
            locationName = res.name;
          }
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
   * 操作整合; todo: showModal 防止误操作
   */
  requestCreate() {
    console.log('btn create triggered');
    let that = this;
    let userId = app.globalData.user.objectId;
    let createdNum = 0;
    //  优先判断输入合法性
    if(this.data.location.latitude === null) {
      wx.showToast({
        title: '请选择地点',
        icon: 'none',
        duration: 1000
      });
      return false;
    } else if(this.data.displayName === '项目名'){
      wx.showToast({
        title: '请更改签到名称',
        icon: 'none',
        duration: 1000
      });
      return false;
    }


    this.setData({
      timestamp: Date.parse(this.data.date + ' ' + this.data.time),
      signCode: generateSignCode()
    });
    //  1. fetch increated table nums
    getCreatedNum('RegRecords', userId, function (count) {
      console.log('getCreatedNum then()');
      let num = count  * 1 + 1;
      let tableName = 'S_' + userId + '_' + num;
      //  2. insert record
      insertRegRecords('RegRecords', {
        newTableName: tableName,
        displayName: that.data.displayName,
        creatorId: userId,
        createAt: that.data.timestamp,
        delay: that.data.delayArr[that.data.delayIndex],
        longitude: that.data.location.longitude,
        latitude: that.data.location.latitude,
        signCode: that.data.signCode
      }, count);
      //  3. create table
      createTable(tableName, that.data);
      //  4. 复制signCode至剪切板
      wx.setClipboardData({
        data: that.data.signCode,
        success() {
          wx.getClipboardData({
            success(res) {
              console.log('Clipboard Success: ' + res.data);
            }
          })
        }
      });
      //  5. show notify 没用promise这里没法做判断
      that.dbNotify(true, that.data.signCode);
    });

    /**
     * 生成8位随机签到码 Join Code
     */
    function generateSignCode() {
      return Math.random().toString(36).substr(2, 8);
    };
    /**
     * 获取用户已创建表数量
     */
    function getCreatedNum(tableName, userId, resolve) {
      let query = new AV.Query(tableName);
      query.equalTo('creatorId', userId);
      query.count().then(function (count) {
        resolve(count);
      });
    };
    /**
     * 数据库操作
     * RegRecords 插入单条数据, 用于记录
     */
    function insertRegRecords(tableName, data, createdNum) {
      // 声明类型
      const Table = AV.Object.extend(tableName);
      // 新建对象
      console.log(data);
      let obj = new Table();
      obj.set('tableName', data.newTableName);
      obj.set('displayName', data.displayName);
      obj.set('creatorId', data.creatorId);
      obj.set('createAt', data.createAt); //  timestamp
      obj.set('delay', data.delay);
      obj.set('longitude', parseFloat(data.longitude));
      obj.set('latitude', parseFloat(data.latitude));
      obj.set('signCode', data.signCode)
      obj.save().then(() => {
        console.log('RegRecords insert successfully');
      }).catch((err) => {
        console.log('RegRecords insert Error');
        console.log(err);
        //  todo: 用于提示用户内容check
      });
    };
    /**
     * 数据库操作
     * 创建一张新表: objectId_No 用于签到记录
     * displayName: 表的前端显示名
     */
    function createTable(tableName, data) {
      console.log('start create Table');
      const Table = AV.Object.extend(tableName);
      let table = new Table();
      //  initial table info
      table.set('userId', app.globalData.user.objectId);
      table.set('studentNo', '00000000');
      table.set('signTime', data.timestamp);
      table.set('longitude', data.location.longitude);
      table.set('latitude', data.location.latitude);
      table.save().then(() => {
        table.destroy().then(function (success) {
          console.log('删除成功');
        }, function (error) {
          // 删除失败
          console.log('Delete Error: ' + error);
        });
      });

    };
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.callback !== undefined) {
      options.callback();
    }
  },

  /**
   * 提示 - 数据库创建成功/失败提示
   */
  dbNotify(status, msg = '') {
    if(status === true) {
      wx.showModal({
        title: '签到表创建成功, 签到码 ' + msg + ' 已复制到剪切板',
        icon: 'success',
        duration: 1500,
        mask: true
      });
    } else {
      wx.showToast({
        title: '签到表创建失败，请检查数据是否填写完整',
        icon: 'none',
        duration: 1000,
        mask: true
      });
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
