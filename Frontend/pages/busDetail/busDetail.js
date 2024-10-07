// pages/busDetail/busDetail.js
const app = getApp();
// 如果使用 MD5，确保已正确引入
const md5 = require('../../utils/md5.js'); // 根据实际路径调整

Page({
  data: {
    busInfo: null,
    lineInfo: null,
    stations: [],
    buses: [],
    mapMarkers: [],
    polyline: [],
    latitude: 36.0671, // 默认值：青岛市中心纬度
    longitude: 120.3826, // 默认值：青岛市中心经度
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
      // 设置默认地图中心点
      this.setDefaultMapCenter();
    }
  },

  processBusInfo: function() {
    const busInfo = this.data.busInfo;
    console.log('正在处理 busInfo：', busInfo);
    
    if (busInfo.returl_list) {
      const data = busInfo.returl_list; // returl_list 是一个对象
      const lineInfo = data.lineinfo;
      let stations = data.stations;
      let buses = data.buses;
  
      console.log('lineInfo:', lineInfo);
      console.log('stations:', stations);
      console.log('buses:', buses);
  
      // 确保 stations 是一个数组
      if (stations && !Array.isArray(stations)) {
        stations = [stations];
        console.warn('stations 不是数组，已转换为数组形式');
      }
  
      // 确保 buses 是一个数组，即使为空
      if (!Array.isArray(buses)) {
        buses = buses ? [buses] : [];
        console.warn('buses 不是数组，已转换为数组形式');
      }
  
      // 检查 stations 是否存在且不为空
      if (stations && stations.length > 0) {
        this.setData({
          lineInfo: lineInfo,
          stations: stations,
          buses: buses
        });
        // 调用函数来设置地图标记等
        this.updateMapData();
      } else {
        wx.showToast({
          title: '未获取到站点数据',
          icon: 'none'
        });
        // 设置默认地图中心点
        this.setDefaultMapCenter();
      }
    } else {
      wx.showToast({
        title: '未获取到线路信息',
        icon: 'none'
      });
      // 设置默认地图中心点
      this.setDefaultMapCenter();
    }
  },
  

  updateMapData: function() {
    const stations = this.data.stations;
    const buses = this.data.buses;
  
    console.log('stations:', stations);
    console.log('buses:', buses);
  
    if (stations && Array.isArray(stations) && stations.length > 0) {
      // 处理站点列表，获取站点的经纬度
      const stationPoints = stations.map((station, index) => {
        console.log(`处理站点 ${index + 1}:`, station);
        const lngLat = station.lng_lat;
        console.log(`站点 ${index + 1} 的 lng_lat:`, lngLat);
  
        // 确保 lngLat 存在且格式正确
        if (lngLat && typeof lngLat === 'string') {
          // 支持逗号和分号作为分隔符
          const separators = [',', ';'];
          let separatorUsed = null;
  
          for (let sep of separators) {
            if (lngLat.includes(sep)) {
              separatorUsed = sep;
              break;
            }
          }
  
          if (separatorUsed) {
            const [lng, lat] = lngLat.split(separatorUsed).map(item => item.trim());
            const parsedLng = parseFloat(lng);
            const parsedLat = parseFloat(lat);
  
            if (isNaN(parsedLng) || isNaN(parsedLat)) {
              console.error(`站点 ${station.bus_staname} 的经纬度解析失败: lng=${lng}, lat=${lat}`);
              return null; // 或者设置为默认值
            }
  
            return {
              longitude: parsedLng,
              latitude: parsedLat,
              name: station.bus_staname,
              id: index
            };
          } else {
            console.error(`站点 ${station.bus_staname} 的 lng_lat 格式不支持:`, lngLat);
            return null; // 或者设置为默认值
          }
        } else {
          console.error(`站点 ${station.bus_staname} 的 lng_lat 格式不正确或缺失:`, lngLat);
          return null; // 或者设置为默认值
        }
      }).filter(point => point !== null); // 过滤掉解析失败的站点
  
      // 检查 stationPoints 是否有数据
      if (stationPoints.length > 0) {
        // 地图中心定位在第一个站点
        const centerLatitude = stationPoints[0].latitude;
        const centerLongitude = stationPoints[0].longitude;
  
        console.log('中心经纬度：', centerLongitude, centerLatitude);
  
        // 处理车辆列表，获取车辆的经纬度
        const busMarkers = buses.map((bus, index) => {
          const parsedLng = parseFloat(bus.longitude);
          const parsedLat = parseFloat(bus.latitude);
  
          if (isNaN(parsedLng) || isNaN(parsedLat)) {
            console.error(`车辆 ${index + 1} 的经纬度解析失败: longitude=${bus.longitude}, latitude=${bus.latitude}`);
            return null;
          }
  
          return {
            id: index + 1000, // 避免与站点的 id 冲突
            longitude: parsedLng,
            latitude: parsedLat,
            iconPath: '/images/bus.png',
            width: 30,
            height: 30
          };
        }).filter(marker => marker !== null);
  
        console.log('mapMarkers:', [
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
              display: 'BYCLICK'
            }
          })),
          ...busMarkers
        ]);
  
        console.log('polyline:', [{
          points: stationPoints,
          color: '#FF0000DD',
          width: 4,
          dottedLine: false
        }]);
  
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
                display: 'BYCLICK'
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
      } else {
        // 设置默认中心点
        this.setDefaultMapCenter();
      }
    } else {
      // 设置默认中心点
      this.setDefaultMapCenter();
    }
  },
  

  setDefaultMapCenter: function() {
    const defaultLatitude = 36.0671; // 示例：青岛市中心纬度
    const defaultLongitude = 120.3826; // 示例：青岛市中心经度

    this.setData({
      latitude: defaultLatitude,
      longitude: defaultLongitude,
      mapMarkers: [],
      polyline: []
    });

    console.warn('已设置地图为默认中心点');
  },

  // 点击标记时的事件
  onMarkerTap: function(e) {
    const markerId = e.markerId;
    const markers = this.data.mapMarkers;

    // 遍历 markers，更新对应 marker 的 callout.display 属性
    const updatedMarkers = markers.map(marker => {
      if (marker.id === markerId && marker.callout) {
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
  },

  onReady: function() {
    // 创建地图上下文
    this.mapCtx = wx.createMapContext('busMap');
  }
});
