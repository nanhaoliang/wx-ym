//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    userInfo:null,//用户信息
    usercode: "",
    ymnum: ''
  },

  // 产品收藏
  chnpsc:function(){
    wx.navigateTo({    //保留当前页面，跳转到应用内的某个页面（最多打开5个页面，之后按钮就没有响应的）
      url: "/pages/commsc/commsc"
    })
  },

  // 资讯收藏
  zixunsc: function () {
    wx.navigateTo({    //保留当前页面，跳转到应用内的某个页面（最多打开5个页面，之后按钮就没有响应的）
      url: "/pages/inforsc/inforsc"
    })
  },

  kefus: function(){
    wx.navigateTo({    //保留当前页面，跳转到应用内的某个页面（最多打开5个页面，之后按钮就没有响应的）
      url: "/pages/kefupag/kefupag"
    })
  },

  onLoad: function () {
    // 审核判断
    this.setData({
      ymnum: app.globalData.ymnum
    })
    let aa = wx.getStorageSync('wx_userInfo');
    let bb = wx.getStorageSync('wx_usercode');
    this.setData({
      userInfo: JSON.parse(aa.rawData),
      usercode: bb
    })
    console.log("mypage.js")
    console.log(this.data.userInfo);
    console.log(bb);
  }
})
