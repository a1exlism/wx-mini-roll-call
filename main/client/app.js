//app.js
const config = require('./config')
const AV = require('./libs/av-weapp-min');
const LQ = require('./libs/av-live-query-weapp-min');

AV.init({
      appId: '6xzvjuFk7Aa99DT4DvJKn6es-gzGzoHsz',
      appKey: 'BzbRWVF2qvHumyHdl5s7RaRU',
 });

App({
    AV: AV,
    LQ: LQ,

    globalData: {
        user: {
            nickName: config.tabs.mine.defaultNickname,
            avatarUrl: config.tabs.mine.defaultAvatar
        },
    },
    //  program init
    onLaunch: function () {
        /*  权限查询 */
        let that = this;
        wx.getSetting({
            success(res) {
                if (!res.authSetting['scope.userinfo']) {
                    //  提前申请授权
                    wx.authorize({
                        scope: 'scope.userInfo',
                        success(err) {
                            that.userUpdate();
                            console.log('权限申请成功');
                        }
                    })
                } else {
                  that.userUpdate();
                }
                console.log('userUpdated');
            }
        });
        //  定位信息
        wx.getSetting({
            success(res) {
                if(!res.authSetting['scope.userLocation']) {
                    wx.authorize({
                        scope: 'scope.userLocation',
                        success(err) {
                            console.log('权限申请成功');
                        }
                    })
                }
            }
        })
    },
    //  当小程序启动，或从后台进入前台显示，会触发 onShow
    onShow: function () {

    },
    userUpdate() {
      //  用户信息
      this.AV.User.loginWithWeapp().then(user => {
        this.globalData.user = user.toJSON();
        //  调用微信API获取用户信息
        console.log(this.globalData.user);
      }).catch(console.error);
    }

})
