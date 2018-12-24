// pages/infoDetails/infoDetails.js
let wxparse = require("../../wxParse/wxParse.js"); //解析htmL
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    dkcontent: '',
    dkheight: "100%",
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    duration: 1000,
    indicatorcolor: "#E85027",
    circular: true,
    // 键盘
    password: false, //是否是密码类型
    focus: false, //获取焦点
    confirmhold: false,//点击键盘右下角按钮时是否保持键盘不收起v
    adjustPosition: false, //键盘弹起时，是否自动上推页面
    confirmType: "send",
    srku:false, //输入框隐藏显示
    plList:[],//评论列表
    userlist:[],//当前用户信息
    pages:0, //分页
    zxids:'',
    plsize:'0',
    zuxids:'',
    plnss:'',
    scimage: "/images/xin_wei.png",// 收藏图片
    scimgflag: 0, //是否收藏id
    lianq:null,
    ymnum: ''
  },

  changeIndicatorDots: function (e) {
    this.setData({
      indicatorDots: !this.data.indicatorDots
    })
  },
  changeAutoplay: function (e) {
    this.setData({
      autoplay: !this.data.autoplay
    })
  },
  intervalChange: function (e) {
    this.setData({
      interval: e.detail.value
    })
  },
  durationChange: function (e) {
    this.setData({
      duration: e.detail.value
    })
  },

  // 收藏
  shoucang: function (e) {
    let that = this;
    if (that.data.scimgflag == 0) {
      that.setData({
        scimgflag: 1,
        scimage: "/images/xin_yi.png"
      })
      this.shc("1");
    } else if (that.data.scimgflag == 1) {
      that.setData({
        scimgflag: 0,
        scimage: "/images/xin_wei.png"
      })
      this.shc("0");
    }
  },

  shc: function (e) {
    let params = {}
    params = {
      status: '1',
      id: this.data.zxids,
      openid: app.globalData.openid
    }
    wx.request({
      url: app.globalData.mapurl + 'api/collection',
      data: params,
      method: 'POST',
      dataType: 'json',
      success: res => {
        console.log(res);
      }
    })
  },

  //键盘发送事件
  searchBtn: function (e) {
    let userif = app.globalData.userInfo;
    this.setData({
      userlist: userif
    })
    let usedata = JSON.parse(this.data.userlist.rawData)
    let plun  = {
      comment_content: e.detail.value,
      comment_openid:{
        name: usedata.nickName,
        img_url: usedata.avatarUrl
      }
    }
    console.log(plun);
    //push数组
    let plList_1 = this.data.plList;
    plList_1.push(plun);
    // usetlist_1.push(plun);
    this.setData({
      plList: plList_1
    })
    this.fspl(e.detail.value);
  },

  // 发送评论
  fspl: function(es){
    let params= {
      openid: app.globalData.openid,
      status:'1',
      comment_id: this.data.zxids,
      content: es
    }
    wx.request({
      url: app.globalData.mapurl + 'api/comment',
      data:params,
      dataType:'json',
      method:'POST',
      success: res =>{
        console.log(res);
        this.setData({
          plnss:''
        })
      }
    })
  },

  // 点击评论
  pingshu: function(){
    let that = this;
    that.setData({
      focus: true,
      srku: true
    })
  },
  
  // zixun详情
  zxdetalis: function(){
    wx.showLoading({
      title: '正在加载...',
      mask: true
    })
    let that = this;
    let params = {
      openid: app.globalData.openid,
      id: that.data.zxids,
      page: that.data.pages
    }
    console.log(params);
    wx.request({
      url: app.globalData.mapurl + 'api/con/detail',
      data: params,
      method: 'POST',
      success: res => {
        console.log(res);
        let plun = res.data.data.comment.comment;
        console.log(plun);
        let sdkList = res.data.data.detail.article
        if (!this.data.dkcontent){
          this.setData({
            dkcontent: sdkList,
          })
          wxparse.wxParse('dkcontent', 'html', this.data.dkcontent, this, 5);
        }
        //push数组
        if (res.data.data.comment.length != 0){
          let plList_1 = that.data.plList;
          for (var a = 0; a < plun.length; a++) {
            plList_1.push(plun[a]);
          }
          that.setData({
            plList: plList_1
          })
        }
        if (res.data.data.detail.status == 1) {
          that.setData({
            scimgflag: 1,
            scimage: "/images/xin_yi.png"
          })
        } else {
          that.setData({
            scimgflag: 0,
            scimage: "/images/xin_wei.png"
          })
        }
        wx.hideLoading();
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 审核判断
    this.setData({
      ymnum: app.globalData.ymnum
    })
    console.log(options.zxid);
    // console.log(app.globalData.zxuneidetail);
    this.setData({
      zxids: options.zxid,
      // dkcontent: app.globalData.zxuneidetail.article,
      lianq: app.globalData.zxuneidetail
    })
    this.zxdetalis();
  },

 

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.setData({
      pages: this.data.pages + 1
    })
    this.zxdetalis();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    console.log(this.data.lianq);
    return {
      title: this.data.lianq,
      path: '/pages/information/information?zxids=' + this.data.lianq.id,
    }
  }
})