<template>
  <div>
    <div id="container" class="oneMap"></div>
    <div id="panel"></div>
  </div>
</template>
 
<script>
export default {
  data () {
    return {
      map: null,
      mapData:{
          resizeEnable:true,//自适应大小
          zoom:5,//默认层级
          zooms:[4,18],//最小最大
          center: [106.259411,37.072703]
      },
    }
  },
  mounted () {
    this.mapInit()
    this.truckInit()
  },
  methods: {
    mapInit(){//初始创建地图
        let _this=this;
        _this.map=new AMap.Map('container',{
            zoom:_this.mapData.zoom, 
            zooms:_this.mapData.zooms, 
            center: _this.mapData.center,
            resizeEnable: _this.mapData.resizeEnable,//自适应大小
            viewMode: '2D'
        })        
    },
    truckInit(){
      var _this=this;
      // _this.map.remove(_this.markers)
          //调用 Driving
      _this.map.plugin(["AMap.TruckDriving"],function() {
            var truckDriving = new AMap.TruckDriving({
              policy: 0, // 规划策略
              size: 1, // 车型大小   1：微型车，2：轻型车（默认值），3：中型车，4：重型车
              width: 2.5, // 宽度
              height: 2, // 高度      
              load: 1, // 载重
              weight: 12, // 自重
              axlesNum: 2, // 轴数
              province: '京', // 车辆牌照省份
              strategy:1,
              // panel: 'panel'
          })
// https://lbs.amap.com/api/webservice/guide/api/direction#t9
          
          _this.getJSON('../../static/json/demo.json').then(res=>{
            console.log('哈哈哈',res)
              var route=res.data.data.route
              var origin=route.origin,destination=route.destination;
              var path=[]
              path.push({lnglat:[origin.split(',')[0],origin.split(',')[1]]});//起点
              path.push({lnglat:[destination.split(',')[0],destination.split(',')[1]]});//终点
              // _this.truckDriving(path)
              truckDriving.search(path, function(status, result) {
                  if (status === 'complete') {
                      console.log('绘制货车路线完成',result)
                      if (result.routes && result.routes.length) {
                          _this.drawRoute(result.routes[0]);//路线 
                      }
                  } else {
                      console.log('获取货车数据失败：' + result)
                  }
              });
          })          
      })
    },
    drawRoute (route) {
        var _this=this;
        console.log('路线了',route)
        var path = _this.parseRouteToPath(route)

        console.log(route)
        var startMarker = new AMap.Marker({
            position: path[0],
            icon: 'https://webapi.amap.com/theme/v1.3/markers/n/start.png',
            map: _this.map
        })

        var endMarker = new AMap.Marker({
            position: path[path.length - 1],
            icon: 'https://webapi.amap.com/theme/v1.3/markers/n/end.png',
            map: _this.map
        })

        var routeLine = new AMap.Polyline({
            path: path,
            isOutline: true,
            outlineColor: '#ffeeee',
            borderWeight: 2,
            strokeWeight: 5,
            strokeColor: '#0091ff',
            lineJoin: 'round'
        })

        routeLine.setMap(_this.map)

        // 调整视野达到最佳显示区域
        _this.map.setFitView([ startMarker, endMarker, routeLine ])
    },
    parseRouteToPath(route) {
        var path = []
      console.log('厉害了',route)
       for (var i = 0, l = route.steps.length; i < l; i++) {
            var step = route.steps[i]

            for (var j = 0, n = step.path.length; j < n; j++) {
                path.push(step.path[j])
            }
        }

        return path
    },
    truckDriving(path){
      truckDriving.search(path, function(status, result) {
                  console.log('永远永远',path,status, result);
          if (status === 'complete') {
              console.log('绘制货车路线完成')
              if (result.routes && result.routes.length) {
                  // _this.drawRoute(result.routes[0]);//路线 
              }
          } else {
              console.log('获取货车数据失败：' + result)
          }
      });
    },
    getJSON(url){
      return new Promise((resolve,reject) => {
        this.$http.get(url)
          .then(res=>{
            resolve(res)
          }).catch(err=>{
            reject(err)
          })
      })
    }
  }
}

</script>

<style scoped>
.oneMap{
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
}
</style>