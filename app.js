//app.js
App({

  globalData: {
    userInfo: null,
    usercode: '',
    openid: '',
    mapurl:'https://cottonpadded.cnzcs.com/',
    zxuneidetail:null,
    ymnum:'2'
  },

  onLaunch: function () {
    // 获取openid
    var opens = wx.getStorageSync('openids');
    this.globalData.openid = opens;
    // 获取userinfo
    var userif = wx.getStorageSync('wx_userInfo');
    this.globalData.userInfo = userif;
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs);
    // huoqu
    if (!opens){
      this.loginopen();
    }
    // 审核判断
    // this.shenhnum();
  },

  // loginopen
  loginopen:function(){
    // 登录
    wx.login({
      success: res => {
        console.log(res.code);
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        this.globalData.usercode = res.code;
        wx.setStorageSync('wx_usercode', res.code);
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              console.log("app.js")
              console.log(res);
              var rawData = res.rawData;
              var userInfo = res.userInfo;
              var signature = res.signature;
              var encryptedData = res.encryptedData;
              var iv = res.iv;
              var code = this.globalData.usercode;
              wx.request({
                url: this.globalData.mapurl + '/api/user/login',
                data: {
                  "code": code,
                  "rawData": rawData,
                  "signature": signature,
                  'iv': iv,
                  'userInfo': userInfo,
                  'encryptedData': encryptedData
                },
                method: 'POST',
                success: res => {
                  console.log(res);
                  this.globalData.openid = res.data.openid;
                  wx.setStorageSync('openids', res.data.openid);
                }
              })
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res;
              // 本地存储userInfo
              wx.setStorageSync('wx_userInfo', this.globalData.userInfo);
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        } else {
          wx.reLaunch({
            url: '/pages/logs/logs',
          })
        }
      }
    })
  },


  // 审核判断
  // shenhnum:function(){
  //   wx.request({
  //     url: this.globalData.mapurl + 'api/status/index',
  //     method: 'GET',
  //     success: res => {
  //       // this.globalData.ymnum = res.data.ym_num;
  //     }
  //   })
  // },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },
})