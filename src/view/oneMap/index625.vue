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
                center: [110.244156,35.138726]
            },
            iconSize:new AMap.Size(30, 30),
            markers:[],
            markersTwo:[],
            addressMarkers:[],//收货地址
            TruckDMarker:{
                startMarker:[],endMarker:[],endMarker2:[],routeLine:[]
            },
            cluster:null,
            travelCar:null,//巡航
        }
    },
    created(){

    },
    computed:{
        ...mapGetters([
            'menuActive',
            'wareDataInfo',//仓库地址
        ])
    },
    watch:{
        menuActive(data){
            if(data !=1){
                this.map.clearMap()//清除全部覆盖物
                if(window.pathSimplifierIns){pathSimplifierIns.setData([])}//清空上次传入的轨迹
            }else if(data==1){
                this.map.setZoom(5)
                if(window.pathSimplifierIns){pathSimplifierIns.setData([])}//清空上次传入的轨迹
                 this.map.remove([this.TruckDMarker.startMarker,this.TruckDMarker.endMarker,this.TruckDMarker.endMarker2,this.TruckDMarker.routeLine])
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
                this.map.setZoomAndCenter(5,[106.259411,37.072703]);
                this.province(data.level)
            }
        },
        Level2Data(data){//左侧菜单点击取值 子组件2级
            if(data){this.cityInit(data)}
        },
        level3Data(data){
            data ? this.areaInit(data) :''
        },
        province(data){////省
            var _this=this;
             _this.map.remove(this.markersTwo)//清除点聚合 
            // _this.map.clearOverlays()
            if(data){
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
            }
            // var count = this.markers.length;
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
                            ${data[i].addressInfo.length}</div>`,
                        offset: new AMap.Pixel(-10,-20)//点标记显示位置偏移量
                    });
                    
                    localStorage.setItem('markersTwoDatas',JSON.stringify(data)) 
                    this.markersTwo.push(marker);
                    var  addData=data[i]
                    AMap.event.addListener(marker,'click', ()=>{
                        this.areaInit(addData.addressInfo);
                    });

                }
            }
        },
        areaInit(data){//区 difineDir2
            var _this=this;_this.map.remove(this.markersTwo)//清除点聚合 
            _this.map.setZoomAndCenter(14,[data[0].lng,data[0].lat]);//设置地图层级
            var i=0;
            for (i; i < data.length; i ++) {
                // var count=data[i].count  ?  data[i].count : 1;
                var marker=new AMap.Marker({
                        position: [data[i].lng,data[i].lat],
                        size: _this.iconSize,
                        icon: require('../../assets/difineDir2.png'),
                        offset: new AMap.Pixel(-13, -30),
                        map:_this.map
                    }); 
                    // this.addressMarkers.push(marker);
                    AMap.event.addListener(marker,'click',()=>{_this.eject_addressInfo()});
                    // AMap.event.addListener(marker,'mouseover',()=>{_this.eject_addressInfo()});
            }
            
        },eject_addressInfo(){console.log('hover了')},
        trunkLineInit(data){//干线路线
            var _this=this;
            if(data.title.indexOf('北京') !=-1){_this.map.clearMap();
                var lineArr = [
                    [121.424029,31.189007],
                    [118.78731,32.235739],
                    [117.117388,34.111513],
                    [113.425982,34.72778],
                    [116.415312,39.852138]
                ];
                    // 绘制轨迹
                var polyline = new AMap.Polyline({
                    map: _this.map,
                    path: lineArr,
                    showDir:true,
                    strokeColor: "#28F",  //线颜色
                    // strokeOpacity: 1,     //线透明度
                    strokeWeight: 6,      //线宽
                    // strokeStyle: "solid"  //线样式
                });
            }else if(data.title.indexOf('南京') !=-1){                
                _this.map.clearMap();
                var lineArr = [
                    [121.424029,31.189007],
                    [120.918658,31.353336],
                    [120.638507,31.470539],
                    [120.347369,31.568876],
                    [119.946368,31.760568],
                    [119.473956,32.175315],
                    [118.831256,32.012436]
                ];
                    // 绘制轨迹
                var polyline = new AMap.Polyline({
                    map: _this.map,
                    path: lineArr,
                    showDir:true,
                    strokeColor: "#28F",  //线颜色
                    // strokeOpacity: 1,     //线透明度
                    strokeWeight: 6,      //线宽
                    // strokeStyle: "solid"  //线样式
                });
            }
        },
        simplifierInit(data){//交付轨迹
        console.log('服务订单',data)
            var _this=this;
            if(data.type==1){
                AMapUI.load(['ui/misc/PathSimplifier'], function(PathSimplifier) {
                    if (!PathSimplifier.supportCanvas) {
                        alert('当前环境不支持 Canvas！');
                        return;
                    }
                    //启动页面
                    _this.set_initPage(data,PathSimplifier);
                });
            }else{
                
                _this.travelCar.destroy()//销毁巡航器
                if(window.pathSimplifierIns){pathSimplifierIns.setData([])}//清空上次传入的轨迹
                 _this.map.remove([_this.TruckDMarker.startMarker,_this.TruckDMarker.endMarker,_this.TruckDMarker.endMarker2,_this.TruckDMarker.routeLine])
            }
        },
        set_initPage(orderData,PathSimplifier) {
            var _this=this;
            //创建组件实例
            var pathSimplifierIns = new PathSimplifier({
                zIndex: 100,
                map: _this.map, //所属的地图实例
                getPath: function(pathData, pathIndex) {
                    //返回轨迹数据中的节点坐标信息，[AMap.LngLat, AMap.LngLat...] 或者 [[lng|number,lat|number],...]
                    return pathData.path;
                },
                getHoverTitle: function(pathData, pathIndex, pointIndex) {
                    //返回鼠标悬停时显示的信息
                    if (pointIndex >= 0) {
                        //鼠标悬停在某个轨迹节点上
                        return pathData.name// + '，点:' + pointIndex + '/' + pathData.path.length;
                    }
                    //鼠标悬停在节点之间的连线上
                    return pathData.name// + '，点数量' + pathData.path.length;
                },
                renderOptions: {
                    //轨迹线的样式
                    pathLineStyle: {
                        strokeStyle: '#28F',
                        lineWidth: 6,
                        dirArrowStyle: true
                    }
                }
            });
            window.pathSimplifierIns=pathSimplifierIns
            //轨迹
            _this.$http.get('../../static/json/routes.json').then(res =>{
                var routeData=res.data;
                var travelRoutes=[];
                console.log('哈哈哈',res.data)
                // for (var i = 0, len=routeData.length; i < len; i++) {
                //     console.log(routeData.splice(i))
                //     routeData.splice(i,0,{
                //         path: PathSimplifier.getGeodesicPath(
                //             routeData[i].path[0],path[routeData[i].path.length -1 ],100)
                //     })
                //     i++;
                //     len++;
                // }
                // routeData.push.apply(routeData,travelRoutes);
                pathSimplifierIns.setData(routeData.path);
                _this.routeTruckMarker(res.data)

                _this.travelCar = pathSimplifierIns.createPathNavigator(0, {
                    // loop: true,
                    speed: 2000,
                    pathNavigatorStyle: {
                        width: 25,
                        height: 35,
                        autoRotate:true,
                        content: PathSimplifier.Render.Canvas.getImageContent(require('../../assets/car.png'), onload, onerror),
                        strokeStyle: null,
                        fillStyle: null,
                        //经过路径的样式
                        pathLinePassedStyle: {
                            lineWidth: 6,
                            strokeStyle: '#0f9532',
                            dirArrowStyle: {
                                stepSpace: 15,
                                strokeStyle: '#fff'
                            }
                        }
                    }
                });
                _this.travelCar.start();
            
            }).catch(err =>{
                console.log(err)
            })
            
                // _this.travelCar.destroy()//销毁巡航器
        },
        routeTruckMarker(routePath){
            var _this=this;
            // var Iconpath = _this.parseRouteToPath(route);
            var iconSize=new AMap.Size(40, 40);
            _this.TruckDMarker.startMarker = new AMap.Marker({//起点
                position: routePath[0].path[0],
                size: iconSize,
                icon: require('../../assets/difineDir1.png'),
                offset: new AMap.Pixel(-10, -20),
                map: _this.map
            })
             _this.TruckDMarker.startMarker.setLabel({
                offset: new AMap.Pixel(5, 10),  //设置文本标注偏移量
                content: "<div class='infoTips'><p>EAT 10:30</p><p>ATA 10:30 17mins </p><p>ETD 10:30</p><p>ATD 12:47 10mins</p></div>", //设置文本标注内容
                direction: 'left', //设置文本标注方位
            }); 
            _this.TruckDMarker.endMarker = new AMap.Marker({//途径
                position: routePath[0].path[routePath[0].path.length-1],
                size: iconSize,
                icon: require('../../assets/difineDir2.png'),
                offset: new AMap.Pixel(-20, -10),
                map: _this.map
            })
            _this.TruckDMarker.endMarker.setLabel({
                offset: new AMap.Pixel(0, 10),  //设置文本标注偏移量
                content: "<div class='infoTips'><p>EAT 10:30</p><p>ATA 10:30 17mins </p><p>ETD 10:30</p><p>ATD 12:47 10mins</p></div>", //设置文本标注内容
                direction: 'bottom', //设置文本标注方位
            });
        },
        drawRoute(route){//点标记
            var _this=this;
            var path = _this.parseRouteToPath(route);
            var difineICON=require('../../assets/difineDir1.png');
            // var iconSize=new AMap.Size(30, 30);
            _this.TruckDMarker.startMarker = new AMap.Marker({//起点
                position: path[0],
                size: _this.iconSize,
                icon: require('../../assets/difineDir1.png'),
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
                size: _this.iconSize,
                icon: require('../../assets/difineDir2.png'),
                offset: new AMap.Pixel(60, 20),
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
                // this.province(JSON.parse(localStorage.getItem('markersDatas')))
                }
            }else if((this.map.getZoom() < 9) && (this.map.getZoom() > 7)){//省份下的市
                // for (var i = 0; i < this.markersTwo.length; i += 1) {
                //     this.map.remove(this.markersTwo[i].subMarkers);
                // }
                // this.map.add(this.markersTwo);
                this.map.remove(this.markers)
                // this.cityInit(JSON.parse(localStorage.getItem('markersTwoDatas')))
            }else if(this.map.getZoom() < 12 && this.map.getZoom() > 9){//市下面的区或县
                this.map.remove(this.markers)
                // this.map.remove(this.markersTwo)
                // for (var i = 0; i < markersThree.length; i += 1) {
                //     map.remove(markersThree[i].subMarkers);
                // }
                // map.add(markersThree);
            }
        },
        _renderClusterMarker(context) { 
            console.log('真的',this.markers)
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
    border:none;
}


.amap-logo,.amap-copyright{
    display: none !important;
    opacity:0 !important;
}
</style>

