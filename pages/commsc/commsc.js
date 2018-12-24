// pages/commodity/commodity.js

//获取应用实例
const app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    show: false,//控制下拉列表的显示隐藏，false隐藏、true显示
    selectData: [
      {
        tiele: "全部产品",
        id: "0"
      },
      {
        tiele: "男装",
        id: "1"
      },
      {
        tiele: "女装",
        id: "2"
      },
      {
        tiele: "童装",
        id: "3"
      },
      {
        tiele: "其他",
        id: "4"
      }
    ],//下拉列表的数据
    typeid: 0,//当前选中id
    index: 0, //选择的下拉列表下标
    sximage: "/images/sx_wei.png", //筛选图片
    sxicon: 0, //当前选择
    sximgId: "",//当前选择筛选的id

    // 产品lIST
    coanlist: [],
    chanpinList: [],//展示
    xinimg: "/images/xin_wei.png",//收藏图标
    xinflag: 0,
    yepage: 0,//分页
    shcanum: 0,//收藏排序
  },

  // 产品首页数据
  chanpinslis: function () {
    let params = {
      openid: app.globalData.openid,
      page: this.data.yepage,
      status: 0
    }
    console.log('-------------------获取产品也详情数据---------------------')
    console.log(params);
    wx.request({
      url: app.globalData.mapurl + 'api/coll/getCollection',
      data: params,
      method: 'POST',
      success: res => {
        console.log(res);
        let lists = res.data.data.collection;
        if (lists.length == 0) {
          wx.showLoading({
            title: '没有数据了',
          })
          setInterval(function () {
            wx.hideLoading();
          }, 1000) //循环间隔 单位ms
          console.log("空");
        } else {
          for (var a = 0; a < lists.length; a++) {
            if (lists[a].goods_id.goods_images) {
              var ss = lists[a].goods_id.goods_images;
              var simg = JSON.parse(ss);
              lists[a].goods_id.goods_images = simg[0];
            }
          }
          console.log(lists);
          let lists2 = this.data.chanpinList;
          for (var a = 0; a < lists.length; a++) {
            lists2.push(lists[a].goods_id);
          }
          this.setData({
            chanpinList: lists2
          })
          wx.hideLoading();
        }
      }
    })
  },


  // 产品详情页跳转
  cpdetail: function (e) {
    console.log(e);
    wx.navigateTo({
      url: '/pages/commDetails/commDetails?cpid=' + e.currentTarget.dataset.cpid,
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '正在加载...',
      mask: true
    })
    // 产品首页数据
    this.chanpinslis();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this;
    console.log("上拉加载");
    this.setData({
      yepage: this.data.yepage + 1
    })
    console.log(this.data.yepage);
    // 显示加载图标
    wx.showLoading({
      title: '正在加载商品',
    })
    // 产品首页数据
    this.chanpinslis();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})