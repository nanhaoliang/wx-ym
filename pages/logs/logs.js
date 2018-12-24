//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: '欢迎来到沂蒙小棉袄',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    jrss:false,
    remind: '加载中',
    help_status: false,
    userid_focus: false,
    passwd_focus: false,
    userid: '',
    passwd: '',
    angle: 0,
    loginimg:"/images/more/basicprofile.png",
    sy:0
  },

  jinrul:function(){
    wx.reLaunch({
      url: '/pages/index/index',
    })
  },

  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },

  onReady: function () {
    var _this = this;
    setTimeout(function () {
      _this.setData({
        remind: ''
      });
    }, 1000);
    wx.onAccelerometerChange(function (res) {
      var angle = -(res.x * 30).toFixed(1);
      if (angle > 14) { angle = 14; }
      else if (angle < -14) { angle = -14; }
      if (_this.data.angle !== angle) {
        _this.setData({
          angle: angle
        });
      }
    });
  },
  useridInput: function (e) {
    this.setData({
      userid: e.detail.value
    });
    if (e.detail.value.length >= 11) {
      // 收起键盘
      wx.hideKeyboard();
    }
  },
  passwdInput: function (e) {
    this.setData({
      passwd: e.detail.value
    });
  },
  inputFocus: function (e) {
    if (e.target.id == 'userid') {
      this.setData({
        'userid_focus': true
      });
    } else if (e.target.id == 'passwd') {
      this.setData({
        'passwd_focus': true
      });
    }
  },
  inputBlur: function (e) {
    if (e.target.id == 'userid') {
      this.setData({
        'userid_focus': false
      });
    } else if (e.target.id == 'passwd') {
      this.setData({
        'passwd_focus': false
      });
    }
  },
  tapHelp: function (e) {
    if (e.target.id == 'help') {
      this.hideHelp();
    }
  },
  showHelp: function (e) {
    this.setData({
      'help_status': true
    });
  },
  hideHelp: function (e) {
    this.setData({
      'help_status': false
    });
  },

  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail;
    let params = {
      rawData: e.detail.rawData,
      userInfo: e.detail.userInfo,
      signature: e.detail.signature,
      encryptedData: e.detail.encryptedData,
      iv: e.detail.iv,
      code: app.globalData.usercode
    }
    console.log(params);
    wx.request({
      url: app.globalData.mapurl + '/api/user/login',
      data: params,
      method: 'POST',
      dataType:'json',
      success: function (res) {
        console.log(res);
        app.globalData.openid = res.data.openid;
        wx.setStorageSync('openids', res.data.openid);
        wx.reLaunch({
          url: '/pages/index/index',
        })
      }
    })
    wx.setStorageSync('wx_userInfo', e.detail);
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true,
      jrss: true,
      loginimg: e.detail.userInfo.avatarUrl,
      sy:1
    })
  }
})
