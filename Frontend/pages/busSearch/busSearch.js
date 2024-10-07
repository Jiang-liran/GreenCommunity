import md5 from '../../utils/md5.js';
const app = getApp();
Page({
  data: {
    query: '',
    busList: [],
    cities: [],
    filteredCities: [],
    cityQuery: '',
    selectedCityId: null,
    selectedCityName: '',
    inputTimeout: null // 用于防抖
  },
  onLoad: function() {
    this.getCityList();
  },
  getCityList: function() {
    const that = this;
    wx.request({
      url: 'http://api.wxbus163.cn/z_busapi/BusApi.php',
      method: 'GET',
      data: {
        optype: 'city',
        uname: '747329069@qq.com'
      },
      header: {
        'ngrok-skip-browser-warning': 'true'
      },
      success(res) {
        if (res.data.return_code === 'ok' && res.data.error_code === '0') {
          const cities = res.data.returl_list.map(city => ({
            cityid: city.cityid,
            city: city.city
          }));
          that.setData({ 
            cities,
            filteredCities: cities // 初始化 filteredCities
          });
        } else {
          wx.showToast({
            title: '获取城市列表失败',
            icon: 'none'
          });
        }
      },
      fail() {
        wx.showToast({
          title: '请求失败，请检查网络',
          icon: 'none'
        });
      }
    });
  },
  onCityInput: function(e) {
    const that = this;
    const query = e.detail.value.trim().toLowerCase();
    if (this.data.inputTimeout) {
      clearTimeout(this.data.inputTimeout);
    }
    this.data.inputTimeout = setTimeout(() => {
      const filteredCities = that.data.cities.filter(city => {
        return city.city.toLowerCase().includes(query);
      });
      that.setData({
        cityQuery: query,
        filteredCities
      });
    }, 300);
  },
  onCitySelect: function(e) {
    const selectedCity = e.currentTarget.dataset.city;
    this.setData({
      selectedCityId: selectedCity.cityid,
      selectedCityName: selectedCity.city,
      cityQuery: selectedCity.city,
      filteredCities: []
    });
    wx.showToast({
      title: `已选择城市：${selectedCity.city}`,
      icon: 'none'
    });
  },
  onCityChange: function(e) {
    const index = e.detail.value;
    const selectedCity = this.data.cities[index];
    this.setData({
      selectedCityId: selectedCity.cityid,
      selectedCityName: selectedCity.city
    });
  },
  onInput: function(e) {
    this.setData({ query: e.detail.value });
  },
  onSearch: function() {
    const query = this.data.query.trim();
    const cityid = this.data.selectedCityId;
    if (!query) {
      wx.showToast({
        title: '请输入公交线路名称',
        icon: 'none'
      });
      return;
    }
    if (!cityid) {
      wx.showToast({
        title: '请选择城市',
        icon: 'none'
      });
      return;
    }
  
    wx.showLoading({
      title: '搜索中...'
    });
  
    const that = this;
    const optype = 'luxian';
    const uname = '747329069@qq.com'; // 请替换为您的实际用户名
    const key = 'c3014a314bb0d784c19a9c6f1ea66972';   // 请替换为您的实际密钥
    const keySecret = md5(uname + key + optype);
  
    // 设置请求参数
    const params = {
      optype: optype,
      uname: uname,
      cityid: cityid,
      keywords: query,
      keySecret: keySecret
    };
  
    // 发起请求
    wx.request({
      url: 'http://api.wxbus163.cn/z_busapi/BusApi.php',
      method: 'GET',
      data: params,
      success(res) {
        wx.hideLoading();
        console.log('线路搜索接口返回数据：', res.data);
        if (res.data.return_code === 'ok' && res.data.error_code === '0') {
          const busList = res.data.returl_list;
          if (busList && busList.length > 0) {
            // 将搜索结果保存，或者直接跳转到详情页
            that.setData({ busList });
          } else {
            wx.showToast({
              title: '未找到相关线路',
              icon: 'none'
            });
            that.setData({ busList: [] });
          }
        } else {
          wx.showToast({
            title: res.data.error_msg || '未找到相关线路',
            icon: 'none'
          });
          that.setData({ busList: [] });
        }
      },
      fail(error) {
        wx.hideLoading();
        console.error('请求失败：', error);
        wx.showToast({
          title: '请求失败，请检查网络',
          icon: 'none'
        });
      }
    });
  },
  // busSearch.js

  onBusTap: function(e) {
    const bus = e.currentTarget.dataset.bus;
    const optype = 'rtbus'; // 获取实时公交位置
    const uname = '747329069@qq.com';
    const key = 'c3014a314bb0d784c19a9c6f1ea66972';
    const keySecret = md5(uname + key + optype);
  
    const params = {
      optype: optype,
      uname: uname,
      keySecret: keySecret,
      cityid: this.data.selectedCityId,
      bus_linestrid: bus.bus_linestrid,
      bus_linenum: bus.bus_linenum,
      bus_staname: bus.bus_staname
    };
  
    wx.showLoading({
      title: '加载中...'
    });
  
    wx.request({
      url: 'http://api.wxbus163.cn/z_busapi/BusApi.php',
      method: 'GET',
      data: params,
      success(res) {
        wx.hideLoading();
        console.log('实时公交接口返回数据：', res.data);
        if (res.data.return_code === 'ok' && res.data.error_code === '0') {
          // 将数据保存到全局变量
          app.globalData.busInfo = res.data;
          console.log('设置 app.globalData.busInfo：', app.globalData.busInfo);
          // 跳转到 busDetail 页面
          wx.navigateTo({
            url: `/pages/busDetail/busDetail`
          });
        } else {
          wx.showToast({
            title: res.data.error_msg || '获取实时公交信息失败',
            icon: 'none'
          });
        }
      },
      fail(error) {
        wx.hideLoading();
        console.error('请求失败：', error);
        wx.showToast({
          title: '请求失败，请检查网络',
          icon: 'none'
        });
      }
    });
  },
});
