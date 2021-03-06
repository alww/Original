var config = require('../../config.js');
var util = require('../../utils/util.js');
var orderUtils = require('../../utils/order.js');
var chargeUtils = require('../../utils/charge.js')
var appInstance = getApp()

Page({
  data: {
    noOrder: false,
    tabs: [
			{title: '全部', type: 0},
      {title: '待付款', type: 1},
      {title: '已完成', type: 2},
    ],
		orderList: [],
		pageMeta: {},
		loadmore: false,
		loadText: '正在努力加载...',
		type: 0
  },
	onLoad () {
		// this.getOrderList(0, 1)
	},
	/**
	 *  页面上拉触底事件的处理函数
	 */
	onReachBottom () {
		if (this.data.loadmore === true) {
			let page = this.data.pageMeta.currentPage + 1
			let type = 0
			console.log('加载分页数据 页码: ' + page)
			this.getOrderList(type, page)
		} else {
			console.log('没有下一页的数据了')
		}
	},
	/**
	 *  页面下拉刷新的处理事件
	 */
	onPullDownRefresh () {
		this.setData({
			orderList: [],
			loadmore: true,
			loadText: '正在努力加载...'
		})
		this.getOrderList(this.data.type, 1)
	},
  onClick: function(e) {
    console.log(`ComponentId:${e.detail.componentId},you selected:${e.detail.key}`);
		var that = this
		let tab = this.data.tabs[e.detail.key]
		that.setData({
			type: tab.type
		}, function () {
			that.onPullDownRefresh()
		})
  },
	/**
	 *  根据分类，页数 加载订单列表
	 *
	 */
	getOrderList: function (type, page) {
		var that = this
		orderUtils.getOrderList({
			'type': type,
			'page': page,
			'success': function (res) {
				console.log('订单列表获取成功回调')
				console.log(res)
				let list = that.data.orderList
				for (var i=0; i<res.items.length; i++) {
					list.push(res.items[i])
				}

				that.setData({
					orderList: list,
					pageMeta: res.meta
				}, function () {
					console.log('now orderlist is: ')
					console.log(that.data.orderList)
				})

				if (res.meta.currentPage < res.meta.pageCount) {
					that.setData ({
						loadmore: true,
						loadText: '正在努力加载...'
					})
				} else {
					that.setData ({
						loadmore: false,
						loadText: '到底啦~'
					})
				}
			},
			'fail': function (error) {
				console.log('订单列表失败回调')
			}
		})
	},
	btnClick: function (e) {
		console.log('hello world')
	},
	go2OrderDetail (e) {
		let id = e.currentTarget.dataset.orderId
		let status = e.currentTarget.dataset.orderStatus
		console.log(id)
		wx.navigateTo({
			url: '/pages/orderDetail/orderDetail?id=' + id + '&status=' + status
		})
	},
	getUserInfo () {
		var that = this
		chargeUtils.getUserMe ({
			'success': function (res) {
				console.log(res)
				that.setData({
					userInfo: res
				}, function () {
					console.log(that.data.userInfo)
					that.calculatePrice()
				})
			},
			'fail': function (error) {
				console.log('用户信息获取失败')
			}
		})
	}
})

