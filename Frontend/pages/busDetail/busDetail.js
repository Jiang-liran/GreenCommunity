// pages/busDetail/busDetail.js
const app = getApp();

Page({
  data: {
    busInfo: null,
  },
  onLoad: function(options) {
    const busInfo = app.globalData.busInfo;
    console.log('busDetail onLoad');
    console.log('app.globalData.busInfo：', app.globalData.busInfo);
    if (busInfo) {
      this.setData({ busInfo });
      this.processBusInfo();
    } else {
      wx.showToast({
        title: '未获取到公交信息',
        icon: 'none'
      });
    }
  },
  processBusInfo: function() {
    const busInfo = this.data.busInfo;
    console.log('正在处理 busInfo：', busInfo);
    if (busInfo.returl_list) {
      const data = busInfo.returl_list; // returl_list 是一个对象
      const lineInfo = data.lineinfo;
      const stations = data.stations;
      const buses = data.buses;
      // 后续处理...
      // 更新页面数据
      this.setData({
        lineInfo: lineInfo,
        stations: stations,
        buses: buses
      });
      // 调用函数来设置地图标记等
      this.updateMapData();
    } else {
      wx.showToast({
        title: '未获取到线路信息',
        icon: 'none'
      });
    }
  },
  updateMapData: function() {
    const stations = this.data.stations;
    const buses = this.data.buses;
  
    // 处理站点列表，获取站点的经纬度
    const stationPoints = stations.map((station, index) => {
      const [lng, lat] = station.lng_lat.split(',');
      return {
        longitude: parseFloat(lng),
        latitude: parseFloat(lat),
        name: station.bus_staname,
        id: index
      };
    });
  
    // 处理车辆列表，获取车辆的经纬度
    const busMarkers = buses.map((bus, index) => {
      return {
        id: index + 1000, // 避免与站点的 id 冲突
        longitude: parseFloat(bus.longing),
        latitude: parseFloat(bus.lating),
        iconPath: '/images/bus.png',
        width: 30,
        height: 30
      };
    });
  
    // 地图中心定位在第一个站点
    const centerLatitude = stationPoints[0].latitude;
    const centerLongitude = stationPoints[0].longitude;
  
    // 设置地图上的标记和路线
    this.setData({
      mapMarkers: [
    ...stationPoints.map(point => ({
      id: point.id,
      longitude: point.longitude,
      latitude: point.latitude,
      iconPath: '/images/station.png',
      width: 20,
      height: 20,
      callout: {
        content: point.name,
        fontSize: 12,
        borderRadius: 5,
        padding: 5,
        display: 'BYCLICK' // 初始设置为 'BYCLICK'
      }
    })),
    ...busMarkers
  ],
      polyline: [{
        points: stationPoints,
        color: '#FF0000DD',
        width: 4,
        dottedLine: false
      }],
      latitude: centerLatitude,
      longitude: centerLongitude
    });
  },
  
  // 点击站点标记时的事件
  onMarkerTap: function(e) {
    const markerId = e.markerId;
    const markers = this.data.mapMarkers;
  
    // 遍历 markers，更新对应 marker 的 callout.display 属性
    const updatedMarkers = markers.map(marker => {
      if (marker.id === markerId) {
        // 显示被点击的 marker 的 callout
        marker.callout.display = 'ALWAYS';
      } else if (marker.callout) {
        // 隐藏其他 marker 的 callout
        marker.callout.display = 'BYCLICK';
      }
      return marker;
    });
  
    // 更新 markers 数据
    this.setData({
      mapMarkers: updatedMarkers
    });
  }
});
