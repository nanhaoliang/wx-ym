//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    imgUrls:[],
    msgList: [],
    imgList:[],
    ite:[], //占位加载图片
    swiperIndex: '', //变时轮播图id存储
    currentImageId:"", // 当前轮播图id存储
    indicatorDots: false,
    autoplay: false,
    interval: 5000,
    duration: 1000,
    ymnum: '',
    imglo:false,
    tupainlist:[],
  },
  

  // 当band变化时执行的操作
  swiperChange(e) {
    const that = this;
    that.setData({
      swiperIndex: e.detail.current,
      imgList: e.currentTarget.dataset.imglist
    });
    let images = that.data.imgList;
    console.log(images[that.data.swiperIndex]);
  },

  // 点击操作
  detail: function(e){
    const that = this;
    that.setData({
      currentImageId: e.currentTarget.dataset.imgid
    });
    console.log("当前轮播图id" + that.data.currentImageId);
    wx.navigateTo({
      url: '/pages/commDetails/commDetails?cpid=' + that.data.currentImageId,
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
    var opens = app.globalData.openid;
    if (!opens){
      app.loginopen();
      opens = app.globalData.openid;
    }
    let that = this;
    let params = {
      openid: opens
    }
    wx.showLoading({
      title: '正在加载...',
      mask: true
    })
    console.log('-------------------首页登录---------------------')
    console.log(params);
    wx.request({
      url: app.globalData.mapurl + 'api/firstPage',
      data:params,
      method:'POST',
      dataType:'json',
      success: res => {
        console.log(res);
        if (res.data.data.goods == undefined){
          return false;
        }
        // 图片占位加载
        let lists = res.data.data.goods; // 图片空
        this.setData({
          tupainlist: res.data.data.goods
        })
        for (var a = 0; a < lists.length; a++) {
          if (lists[a].goods_images) {
            var ss = lists[a].goods_images;
            var simg = JSON.parse(ss);
            lists[a].goods_images = simg[0];
          }
        }
        let ites = this.data.tupainlist;
        for (var b = 0; b < ites.length; b++) {
          if (ites[b].goods_images) {
            var ss = ites[b].goods_images;
            var simg = JSON.parse(ss);
            ites[b].goods_images = '';
          }
        }
        console.log(lists);
        console.log(ites);
        this.setData({
          imgUrls: ites,
          ite: lists,
          msgList: res.data.data.article // 最新资讯
        })
        
        setTimeout(function () {
          wx.hideLoading();
          let ite = this.data.ite;
          this.setData({
            imgUrls: ite,
          })
        }.bind(this),2000)
      }
    })
  },

  xiangqing:function(){
    wx.switchTab({
      url: '/pages/information/information',
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '沂蒙小棉袄',
      path: '/pages/index/index',
      imageUrl: 'https://cottonpadded.cnzcs.com/img/mianao.jpeg'
    }
  }
  
})
