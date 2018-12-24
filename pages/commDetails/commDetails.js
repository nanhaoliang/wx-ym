// pages/commDetails/commDetails.js
//获取应用实例
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    cpdetails:null,
    imgUrls: [],
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    duration: 1000,
    indicatorcolor:"#E85027",
    circular:true,
    scimage:"/images/xin_wei.png",// 收藏图片
    scimgflag:0, //是否收藏id
    cpIds:"", //产品id
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
  shoucang: function(e){
    let that = this;
    if (that.data.scimgflag == 0){
      that.setData({ //收藏
        scimgflag: 1,
        scimage:"/images/xin_yi.png"
      })
      this.shc("1");
    } else if (that.data.scimgflag == 1){
      that.setData({ //取消收藏
        scimgflag: 0,
        scimage: "/images/xin_wei.png"
      })
      this.shc("0");
    }
  },

  shc:function(e){
    let params = {}
    params = {
      status: '0',
      id: this.data.cpdetails.goods_id,
      openid: app.globalData.openid
    }
    wx.request({
      url: app.globalData.mapurl + 'api/collection',
      data:params,
      method:'POST',
      dataType:'json',
      success: res =>{
        console.log(res);
      }
    })
  },

  // 图片放大
  imgbind: function(e){
    console.log(e);
    wx.previewImage({
      current: e.currentTarget.dataset.imgurl,
      urls: e.currentTarget.dataset.imgurllist
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
    wx.showLoading({
      title: '正在加载...',
      mask: true
    })
    console.log(options.cpid);
    this.setData({
      cpIds: options.cpid
    })
    let params = {
      openid: app.globalData.openid,
      id: options.cpid
    }
    wx.request({
      url: app.globalData.mapurl + 'api/goods/detail',
      data:params,
      method:'POST',
      dataType:'json',
      success: res =>{
        console.log(res);
        let images = res.data.data.goods_images;
        for (var a = 0; a < images.length; a++){
          var is = app.globalData.mapurl + images[a];
          images[a] = is;
        }
        this.setData({
          cpdetails: res.data.data,
          imgUrls: images
        })

        if (res.data.data.goods_status == 0){
          this.setData({
            scimage:"/images/xin_wei.png",
            scimgflag: 0,
          })
        }else {
          this.setData({
            scimage: "/images/xin_yi.png",
            scimgflag: 1,
          })
        }
        setTimeout(function () {
          wx.hideLoading()
        }, 1000)
      }
    })
  },


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    // return {
    //   title: this.data.cpdetails.goods_name,
    //   path: '/pages/commDetails/commDetails?cpid=' + this.data.cpdetails.goods_id,
    //   imageUrl: this.data.imgUrls[0]
    // }
    return {
      title: this.data.cpdetails.goods_name,
      path: '/pages/commodity/commodity?cpids=' + this.data.cpdetails.goods_id,
      imageUrl: this.data.imgUrls[0]
    }
  }
})