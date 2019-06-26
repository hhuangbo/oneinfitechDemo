<template>
    <div class="mapContent">
        <div class="oneMap" id="container"></div>
        <menuCate ></menuCate>
        <!-- <transition > -->
            <photoInfo :dataInfo="wareDataInfo"  :class="[wareDataInfo.type ==1 || wareDataInfo.type==3 ? 'animated fadeIn' : 'animated fadeOut' ]" v-if="wareDataInfo && wareDataInfo.type==1 || wareDataInfo.type==3"/><!--仓库照片弹框-->
            <warehInfo :dataInfo="wareDataInfo"  :class="[wareDataInfo && wareDataInfo.type==2 ? 'animated fadeInRight' : 'animated fadeOutRight']" v-if="wareDataInfo && wareDataInfo.type==2"/><!--仓库基本信息弹框-->
        <!-- </transition> -->
        <div id="panel"></div>
    </div>
</template>

<script>
import qs from 'QS'

import menuCate from './menuCate/index'
import photoInfo from './ejectInfoSet/photoInfo'
import warehInfo from './ejectInfoSet/warehInfo'
import {mapGetters} from 'vuex'
export default {
    components:{
        menuCate,photoInfo,warehInfo
    },
    data(){
        return{
            opts:{
    			pointArr:[],//判定点是否在花圈的形状中的参数
    			geoc:null,//经纬度解析地址
				bdary:null,//地址获取行政区域
				ply:[],//行政边界组件
				choseMark:[],
                zIndex:1,//覆盖物的层级
            },
            map:null,//地图实例
            markerClusterer:null,//聚合点对象实例
            mapData:{
                resizeEnable:true,//自适应大小
                zoom:5,//默认层级
                zooms:[4,18],//最小最大
                center: [106.259411,37.072703]
            },
            markers:[],
            markersTwo:[],
            TruckDMarker:{
                startMarker:[],endMarker:[],routeLine:[]
            },
            cluster:null
        }
    },
    created(){

    },
    computed:{
        ...mapGetters([
            'menuActive'
        ])
    },
    watch:{
        menuActive(data){
            if(data !=1){
                this.map.clearMap()//清除全部覆盖物
                // this.map.remove(this.markers)
                // this.map.remove(this.markersTwo)//移除不再层级的点聚合
            }else if(data==1){
                this.map.setZoom(5)
                 this.map.remove([this.TruckDMarker.startMarker,this.TruckDMarker.endMarker,this.TruckDMarker.routeLine])
                 
                //  this.map.remove(this.startMarker)
            }//移除不再层级的点聚合
        },
        wareDataInfo(){
            
            // this.map.remove(this.markers)//清除省份聚合点
            // this.map.remove(this.markersTwo)
        },
        serviceData(res){
            if(res.type==1){
                this.simplifierInit()
            }
        }
    },
    mounted(){
        var that=this;
        that.mapInit();
         //添加监听时间，当前缩放级别
        AMap.event.addListener(that.map,'zoomend',function(){
            that._onZoomEnd()
        });
 
    },
    methods:{
        mapInit(){//初始创建地图
            let _this=this;
            this.map=new AMap.Map('container',{
                zoom:_this.mapData.zoom, 
                zooms:_this.mapData.zooms, 
                center: _this.mapData.center,
                resizeEnable: _this.mapData.resizeEnable,//自适应大小
                viewMode: '2D'
            })                
        },
        secondLevelData(data,act){//左侧菜单点击取值 子组件1
            if(data){
                // _this.map.setZoomAndCenter(5,[106.259411,37.072703]);
                this.province(data.level)
            }
        },
        Level3Data(data){//左侧菜单点击取值 子组件2级
            if(data){this.cityInit(data)}
            
        },
        province(data){////省
            var _this=this;
             _this.map.remove(this.markersTwo)//清除点聚合 
            // _this.map.clearOverlays()
            if(data){
                //  _this.map.setZoom(5)
                // _this.map.setZoomAndCenter(5,[data[0].lng,data[0].lat]);
                for (var i = 0; i < data.length; i ++) {
                    var marker=new AMap.Marker({
                        position: [data[i].lng,data[i].lat],
                        // map: this.map,//点标记添加到地图上
                        extData:data[i],//自定义属性值
                        content:  `<div style="background-color: hsla(208, 80%, 48%, 0.7); height: 50px;line-height: 50px; width: 50px;text-align:center; border: 1px solid hsl(208, 80%, 48%); border-radius: 50%; box-shadow: hsl(208, 80%, 48%) 0px 0px 1px;">${data[i].count}</div> `,
                        offset: new AMap.Pixel(-15, -15)//点标记显示位置偏移量
                    })
                    localStorage.setItem('markersDatas',JSON.stringify(data)) 
                    this.markers.push(marker)
                    this.map.add(marker)//点标记添加到地图上
                    marker.on('click', this.cityInit);
                } 
                // _this.addCluster()
            }
            // var count = this.markers.length;
        },
        addCluster(){//添加点聚合
            let _this=this
              if (_this.cluster) {
                _this.cluster.setMap(null);
            }
            _this.map.plugin(["AMap.MarkerClusterer"],function() {
                _this.cluster = new AMap.MarkerClusterer(_this.map, _this.markers, {
                    gridSize: 80,
                    // renderClusterMarker: _this._renderClusterMarker
                });
            })
        },
        cityInit(e){//市
            var _this=this,data;
            if(e.target){data=JSON.parse(JSON.stringify(e.target.getExtData())).info;}
            else{data=e.info}
            
             _this.map.remove(this.markers)
             _this.map.remove(this.markersTwo)//清除点聚合
            _this.map.setZoomAndCenter(10,[data[0].lng,data[0].lat]);//地图层级及中心位置
            if(data){
                for (var i = 0; i < data.length; i ++) {
                var marker=new AMap.Marker({
                        position: [data[i].lng,data[i].lat],
                        map: this.map,
                        extData:data[i],
                        content: `<div style="background-color: rgba(16, 117, 170, 0.8); 
                            height: 50px;line-height:50px; width: 50px; text-align:center;border: 1px solid hsl(180, 100%, 40%); 
                            border-radius: 50%; box-shadow: hsl(180, 100%, 50%) 0px 0px 1px;color:#fff" >
                            ${data[i].count}</div>`,
                        offset: new AMap.Pixel(-10,-20)//点标记显示位置偏移量
                    });
                    
                    localStorage.setItem('markersTwoDatas',JSON.stringify(data)) 
                    this.markersTwo.push(marker);
                    marker.on('click', this.areaInit);
                }
            }
        },
        areaInit(){//区
            this.map.setZoomAndCenter(12);//设置地图层级
        },
        simplifierInit(data){//交付轨迹
            var _this=this;
            _this.map.remove(_this.markers)
               //调用 Driving
            _this.map.plugin(["AMap.TruckDriving"],function() {
                 var truckDriving = new AMap.TruckDriving({
                    policy: 0, // 规划策略
                    size: 1, // 车型大小
                    width: 2.5, // 宽度
                    height: 2, // 高度      
                    load: 1, // 载重
                    weight: 12, // 自重
                    axlesNum: 2, // 轴数
                    province: '京', // 车辆牌照省份
                })
                // 根据起终点经纬度规划驾车导航路线
                var path=[]
                
                path.push({lnglat:[121.512625,31.293255]});//起点
                // path.push({lnglat:[121.396582,31.245129]});//途径
                // path.push({lnglat:[121.544897,31.219882]});//途径
                path.push({lnglat:[121.382162,31.108247]});//终点

                var opts=[
                    {lnglat:[121.506274,31.317969]},
                    {lnglat:[121.492197,31.331313]}
                ]
                truckDriving.search(path,opts, function(status, result) {
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
        },
        drawRoute(route){//点标记
            var _this=this;
            var path = _this.parseRouteToPath(route);
            var difineICON=require('../../assets/difineDir1.png');
            var iconSize=new AMap.Size(40, 40);
            _this.TruckDMarker.startMarker = new AMap.Marker({//起点
                position: path[0],
                size: iconSize,
                icon: require('../../assets/difineDir1.png'),//'http://a.amap.com/jsapi_demos/static/demo-center/icons/dir-via-marker.png',
                offset: new AMap.Pixel(-13, -30),
                map: _this.map
            })
             _this.TruckDMarker.startMarker.setLabel({
                offset: new AMap.Pixel(5, 10),  //设置文本标注偏移量
                content: "<div class='infoTips'><p>EAT 10:30</p><p>ATA 10:30 17mins </p><p>ETD 10:30</p><p>ATD 12:47 10mins</p></div>", //设置文本标注内容
                direction: 'right', //设置文本标注方位
            });
            // startMarker.on('mousemove',_this.infosdasd)
            _this.TruckDMarker.endMarker = new AMap.Marker({//终点
                position: path[path.length - 1],
                size: iconSize,
                icon: require('../../assets/difineDir2.png'),//'https://webapi.amap.com/theme/v1.3/markers/n/end.png',
                imageSize: new AMap.Size(40, 40),
                imageOffset: new AMap.Pixel(-95, -3),
                map: _this.map
            })
            _this.TruckDMarker.endMarker.setLabel({
                offset: new AMap.Pixel(5, 10),  //设置文本标注偏移量
                content: "<div class='infoTips'><p>EAT 10:30</p><p>ATA 10:30 17mins </p><p>ETD 10:30</p><p>ATD 12:47 10mins</p></div>", //设置文本标注内容
                direction: 'right', //设置文本标注方位
            });
            _this.TruckDMarker.routeLine = new AMap.Polyline({
                path: path,
                showDir:true,
                strokeWeight: 6,
                strokeColor: '#28F',
            })
            _this.TruckDMarker.routeLine.setMap(this.map)
             // 调整视野达到最佳显示区域
            _this.map.setFitView([ _this.TruckDMarker.startMarker, _this.TruckDMarker.endMarker, _this.TruckDMarker.routeLine ])
        },
         parseRouteToPath(route) {//解析DrivingRoute对象
            var path = []
            for (var i = 0, l = route.steps.length; i < l; i++) {
                var step = route.steps[i]

                for (var j = 0, n = step.path.length; j < n; j++) {
                    path.push(step.path[j])
                }
            }
            return path
        },
        _onZoomEnd(){//监听地图缩放
            var _this=this;
            if (this.map.getZoom() < 7) {//全国下的省份
                var markersDatas=JSON.parse(localStorage.getItem('markersDatas'));
                this.map.remove(this.markersTwo)//移除不再层级的点聚合
                if(this.markers ){
                this.province(JSON.parse(localStorage.getItem('markersDatas')))
                }
            }else if((this.map.getZoom() < 9) && (this.map.getZoom() > 7)){//省份下的市
                // for (var i = 0; i < this.markersTwo.length; i += 1) {
                //     this.map.remove(this.markersTwo[i].subMarkers);
                // }
                // this.map.add(this.markersTwo);
                this.map.remove(this.markers)
                // this.cityInit(JSON.parse(localStorage.getItem('markersTwoDatas')))
            }else if(this.map.getZoom() < 14 && this.map.getZoom() > 9){//市下面的区或县
                this.map.remove(this.markers)
                // this.map.remove(this.markersTwo)
                // for (var i = 0; i < markersThree.length; i += 1) {
                //     map.remove(markersThree[i].subMarkers);
                // }
                // map.add(markersThree);
            }
        },
        _renderClusterMarker(context) { 
            var count = this.markers.length;
            var factor = Math.pow(context.count / count, 1 / 18);
            var div = document.createElement('div');
            var Hue = 180 - factor * 180;
            var bgColor = 'hsla(' + Hue + ',100%,50%,0.7)';
            var fontColor = 'hsla(' + Hue + ',100%,20%,1)';
            var borderColor = 'hsla(' + Hue + ',100%,40%,1)';
            var shadowColor = 'hsla(' + Hue + ',100%,50%,1)';
            div.style.backgroundColor = bgColor;
            var size = Math.round(30 + Math.pow(context.count / count, 1 / 5) * 20);
            div.style.width = div.style.height = size + 'px';
            div.style.border = 'solid 1px ' + borderColor;
            div.style.borderRadius = size / 2 + 'px';
            div.style.boxShadow = '0 0 1px ' + shadowColor;
            div.innerHTML = context.count;
            div.style.lineHeight = size + 'px';
            div.style.color = fontColor;
            div.style.fontSize = '14px';
            div.style.textAlign = 'center';
            context.marker.setOffset(new AMap.Pixel(-size / 2, -size / 2));
            context.marker.setContent(div)
        },
        clearMarker(marker) {// 清除 marker

            if (marker) {
                this.markers.setMap(null);
                this.markers = null;
            }
        },
        removeAllOverlay(){ // 清除地图上所有添加的覆盖物
            this.map.clearMap();
        }
    }
}
</script>

<style lang="scss" scoped>
.oneMap{
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
}
.mapContent{
    // position: relative;
}

.infoTips{
    
}

</style>
<style>
.amap-marker-label{
    background-color: #0d0e0f;
    color: #fff;
    opacity: .9;
    padding: 10px;
    border-radius: 3px;
}


.amap-logo,.amap-copyright{
    display: none !important;
    opacity:0 !important;
}
</style>

