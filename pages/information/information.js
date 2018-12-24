// pages/information/information.js
//获取应用实例
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    zxList:[],
    page:0,
    ymnum: '',
    zxidd:"",
  },

  //咨询详情
  zxdetails: function(e){
    console.log(e);
    app.globalData.zxuneidetail = e.currentTarget.dataset.zxddid
    wx.navigateTo({
      url: '/pages/infoDetails/infoDetails?zxid=' + e.currentTarget.dataset.zxddid.id,
    })
  },

  // 资讯首页
  zxdetail: function(){
    let params = {
      openid: app.globalData.openid,
      page: this.data.page
    }
    wx.request({
      url: app.globalData.mapurl + 'api/consultation/index',
      data: params,
      dataType: 'json',
      method: 'POST',
      success: res => {
        console.log(res);
        if (res.data.data.articles == 0) {
          wx.showLoading({
            title: '没有数据了',
          })
          setInterval(function () {
            wx.hideLoading();
            return false;
          }, 1000) //循环间隔 单位ms
        } else {
          let zxs1 = res.data.data.articles;
          let zxs2 = this.data.zxList;
          for (var a = 0; a < zxs1.length; a++) {
            zxs2.push(zxs1[a]);
          }
          this.setData({
            zxList: zxs2
          })
          wx.hideLoading();
        }
        setTimeout(function () {
          wx.hideLoading()
        }, 1000)
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var opens = app.globalData.openid;
    if (!opens) {
      wx.reLaunch({
        url: '/pages/logs/logs',
      })
      return false;
      console.log('-----结束');
    }
    if (options.zxids) {
      wx.navigateTo({
        url: '/pages/infoDetails/infoDetails?zxid=' + options.zxids,
      })
    }
    var opens = app.globalData.openid;
    if (!opens) {
      app.loginopen();
      opens = app.globalData.openid;
    }
    // 审核判断
    this.setData({
      ymnum: app.globalData.ymnum
    })
    wx.showLoading({
      title: '正在加载...',
      mask:true
    })
    this.zxdetail();
  },


  /**
   * 页面上拉触底事件的处理函数
   * 
   */
  onReachBottom: function () {
    // 显示加载图标
    wx.showLoading({
      title: '正在加载资讯',
    })
    this.setData({
      page: this.data.page + 1
    })
    this.zxdetail();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '沂蒙小棉袄',
      path: '/pages/information/information',
      imageUrl:'https://cottonpadded.cnzcs.com/img/mianao.jpeg'
    }
  }
})