<template>
    <div class="mapContent">
        <div class="oneMap" id="container"></div>
        <!--左菜单-->
        <menuCate />
        <!--仓库照片弹框-->
        <photoInfo :dataInfo="wareDataInfo"  
        :class="[wareDataInfo.level_type ==1 || wareDataInfo.level_type==3 ? 'animated fadeIn' : 'animated fadeOut' ]" 
        v-if=" wareDataInfo && wareDataInfo.level_type==1 || wareDataInfo.level_type==3"/>
        <!--仓库基本信息弹框-->
        <warehInfo :dataInfo="wareDataInfo"  
        :class="[wareDataInfo && wareDataInfo.level_type==2 ? 'animated fadeInRight' : 'animated fadeOutRight']" 
        v-if="wareDataInfo && wareDataInfo.level_type==2"/>
        <!--门店信息弹框-->
        <storehouseInfo :dataInfo="storeInfoData" v-if="storeCheck" />
        <!--搜索条件-->
        <searchTerm />
        <detailList :data="serviceCompVal"  
        :class="[serviceCompVal && serviceCompVal.level_type==2 ? 'animated fadeInRight': 'animated fadeOutRight']" 
        v-if="serviceCompVal && serviceCompVal.level_type==2"/>
        <customerEva :data="serviceCompVal" 
        :class="[serviceCompVal && serviceCompVal.level_type==4 ?  'animated fadeInRight': 'animated fadeOutRight']"             
        v-if="serviceCompVal && serviceCompVal.level_type==4"/>
        
    </div>
</template>

<script>
import qs from 'QS'

import menuCate from './menuCate/index'
import photoInfo from './ejectInfoSet/photoInfo'
import warehInfo from './ejectInfoSet/warehInfo'
import storehouseInfo from './ejectInfoSet/storehouseInfo'
import searchTerm from './ejectInfoSet/searchTerm'
import detailList from './ejectInfoSet/detailList'
import customerEva from './ejectInfoSet/customerEva'
import {mapGetters} from 'vuex'
export default {
    components:{
        menuCate,photoInfo,warehInfo,storehouseInfo,searchTerm,detailList,customerEva
    },
    data(){
        return{
            // orderInfoData:[],customerEvaData:[],
            serviceOrderData:[],
            map:null,//地图实例
            markerClusterer:null,//聚合点对象实例
            mapData:{
                resizeEnable:true,//自适应大小
                zoom:5,//默认层级
                zooms:[4,18],//最小最大
                center: [110.98934,36.500585]
            },
            iconSize:new AMap.Size(30, 30),
            markers:[],
            markersTwo:[],
            addressMarkers:[],//收货地址
            startMarker:[],
            TruckDMarker:{
                startMarker:[],endMarker:[],routeLine:[],routeCar:[]
            },
            cluster:null,
            travelCar:null,//巡航
            drawbounds:{district :null,polygons:[]},//行政区域

            storeInfoData:'',//仓库信息
            storeCheck:false,//地图多点 仓库点击
        }
    },
    created(){

    },
    computed:{
        ...mapGetters([
            'menuActive',
            'level3Data',
            'wareDataInfo',//仓库地址
            'serviceCompVal'//服务订单
        ])
    },
    watch:{
        menuActive(data){ //选取菜单展开的索引
            this.storeCheck=false
            // if(data==2){//收货地址
            if(data==3|| data ==8 || data ==9 || data ==10){//收货地址
                if(window.pathSimplifierIns){pathSimplifierIns.setData([]);};
                this.routeTruckMarker('');//清空干线路线的marker
                return;
            }else{
                this.map.clearMap();
                if(window.pathSimplifierIns){pathSimplifierIns.setData([])}
            }
        },
        level3Data(data){
            this.setlevel3Data(data)
        },
        serviceCompVal(data){
            this.simplifierInit(data)
        }
    },
    mounted(){
        var that=this;
        that.mapInit();
         //添加监听时间，当前缩放级别
        AMap.event.addListener(that.map,'zoomend',function(){
            that._onZoomEnd();
            that.storeCheck=false
        });
        
    },
    methods:{
        mapInit(){//初始创建地图
            let _this=this;            
            // console.log('搜索的关键字：',_this.$route.query)
            this.map=new AMap.Map('container',{
                zoom:_this.mapData.zoom, 
                zooms:_this.mapData.zooms, 
                center: _this.mapData.center,
                resizeEnable: _this.mapData.resizeEnable,//自适应大小
                viewMode: '2D'
            })    
        },
        menuClassA(data,active){
            switch(data.type){
                case '3':
                    this.secondLevelData(data,active)
                    break;
                case '13':
                    this.trunkLineInit(data)
                    break;
                case '8':
                    // var iconImg=require(`../../assets/${data.type}.png`)
                    var iconImg=require('../../assets/sp.png')
                    this.infoPopover(data,iconImg)
                    break;
                case '9':
                    var iconImg=require('../../assets/kp.png')
                    this.infoPopover(data,iconImg)
                    break;
                case '10':
                    var iconImg=require('../../assets/cp.png')
                    this.infoPopover(data,iconImg)
                    break;
            }
        },
        secondLevelData(data,act){//左侧菜单点击取值 子组件1
            // this.map.clearMap()
            if(data){
                this.province(data.level)
                localStorage.setItem('provinceData',JSON.stringify(data.level)) 
            }
        },
        Level2Data(data){//左侧菜单点击取值 子组件2级
            if(data){this.cityInit(data.info)}
        },
        setlevel3Data(data){console.log(data)
            // if(data.addressInfo){this.areaInit(data.addressInfo)}
            if(data){this.areaInit(data)}
        },
        province(data){////省
            var _this=this;
            _this.map.clearMap();
             _this.map.remove(this.markersTwo)//清除点聚合 
            this.map.setZoomAndCenter(5,[data[0].lng,data[0].lat]);
            localStorage.setItem('provinceData',JSON.stringify(data))  
            if(data){
                for (var i = 0; i < data.length; i ++) {                    
                    var marker=new AMap.Marker({
                        position: [data[i].lng,data[i].lat],
                        // map: _this.map,//点标记添加到地图上
                        extData:data[i],//自定义属性值
                        content:  `<div style="background-color: hsla(208, 80%, 48%, 0.7); height: 50px;line-height: 50px; width: 50px;text-align:center; border: 1px solid hsl(208, 80%, 48%); border-radius: 50%; box-shadow: hsl(208, 80%, 48%) 0px 0px 1px;">${data[i].count}</div> `,
                        offset: new AMap.Pixel(-30, -30)//点标记显示位置偏移量
                    })
                    this.markers.push(marker);
                    _this.map.add(marker)//点标记添加到地图上                   
                    AMap.event.addListener(marker,'click', (e)=>{
                        var proData=JSON.parse(JSON.stringify(e.target.getExtData()))
                        this.cityInit(proData.info);
                    });
                } 
            }
        },
        cityInit(data){//市
            var _this=this
            this.map.setZoomAndCenter(9,[data[0].lng,data[0].lat]);//地图层级及中心位置
             _this.map.remove(this.markers)
             _this.map.remove(this.markersTwo)//清除点聚合
            localStorage.setItem('cityData',JSON.stringify(data)) 
            if(data){
                for (var i = 0; i < data.length; i ++) {
                    var marker=new AMap.Marker({
                        position: [data[i].lng,data[i].lat],
                        // map: _this.map,
                        extData:data[i],
                        content: `<div style="background-color: rgba(16, 117, 170, 0.8); 
                            height: 50px;line-height:50px; width: 50px; text-align:center;border: 1px solid hsl(180, 100%, 40%); 
                            border-radius: 50%; box-shadow: hsl(180, 100%, 50%) 0px 0px 1px;color:#fff" >                            
                            ${data[i].addressInfo.length}</div>`,
                        offset: new AMap.Pixel(-20,-30)//点标记显示位置偏移量
                    });
                    this.markersTwo.push(marker);
                    _this.map.add(marker)//点标记添加到地图上
                    AMap.event.addListener(marker,'click', (e)=>{
                        var addData=JSON.parse(JSON.stringify(e.target.getExtData()))
                        this.areaInit(addData);
                    });

                }
            }
        },
        areaInit(data){//区 
            var _this=this;_this.map.remove(this.markersTwo)//清除点聚合 
            localStorage.setItem('areaData',JSON.stringify(data))  
            if(data.addressInfo){
                _this.map.setZoomAndCenter(11,[data.lng,data.lat]);
                data=data.addressInfo;
            } else{_this.map.setZoomAndCenter(11,[data[0].lng,data[0].lat]);data=data;}
            _this.map.remove(this.addressMarkers)
            for (var i=0; i < data.length; i ++) {
                var marker=new AMap.Marker({
                        position: [data[i].lng,data[i].lat],
                        size: new AMap.Size(20, 20),//_this.iconSize,
                        icon: require('../../assets/difineDir2_1.png'),
                        offset: new AMap.Pixel(-13, -30),
                        // map:_this.map,
                        extData:data[i]
                    }); 
                    _this.addressMarkers.push(marker);
                    _this.map.add(marker);
                    AMap.event.addListener(marker,'click',(e)=>{
                        var areaData=JSON.parse(JSON.stringify(e.target.getExtData()))
                        _this.eject_addressInfo(areaData)
                    });
                    AMap.event.addListener(marker,'mouseover',(e)=>{          
                        var areaData=JSON.parse(JSON.stringify(e.target.getExtData()))
                        _this.showBoundsInfo(areaData)
                    });
                    AMap.event.addListener(marker,'mouseout',(e)=>{
                        _this.map.remove(_this.drawbounds.polygons)
                        _this.drawbounds.polygons=[];
                    });
                    
            }
            
        },
        infoPopover(datas,iconImg){
            var _this=this;
            let data=datas.level;
            _this.map.clearMap();
            var title=`<div class="el-message-box__header">
                <div class="el-message-box__title"><span>aaaaaa</span></div>
                <button type="button" class="el-message-box__headerbtn"><i class="el-message-box__close el-icon-close"></i></button>
            </div>`;
            var infoWindow = new AMap.InfoWindow({
                isCustom: true, 
                offset: new AMap.Pixel(0, -30)
            });
            for (var i=0; i < data.length; i ++) {
                var marker = new AMap.Marker({
                    position: [data[i].lng,data[i].lat],
                    icon: iconImg,
                    iconSize:new AMap.Size(20, 20),
                    extData:data[i],
                    map: _this.map
                });
                var dataInfo=data[i].info
                var dataInfo_divs=[]
                for(var j=0;j<dataInfo.length;j++){         
                   dataInfo_divs.push(`<p><span>${dataInfo[j].name}：</span>${dataInfo[j].desc}</p>`)
                }
                console.log(dataInfo_divs)     
                marker.content=`<div class="infoPop el-message-box">
                <div class="el-message-box__header">
                    <div class="el-message-box__title"><span>${datas.title}</span></div>
                    <button type="button" class="el-message-box__headerbtn"><i class="el-message-box__close el-icon-close"></i></button>
                </div>
                <div class="el-message-box__content">
                ${dataInfo_divs}
                </div></div>`;
                AMap.event.addListener(marker,'click',(e)=>{
                    infoWindow.setContent(e.target.content);
                    infoWindow.open(_this.map, e.target.getPosition());
                });
                // _this.infoPopoverMarker(data[i],marker)
            }
            // <p><span>所属公司：</span>${data[i].info[i].desc}</p>
            //         <p><span>详细地址：</span>${data[i].info[i].desc}</p>
            //         <p><span>发货次数：</span>${data[i].info[i].desc}</p>
            _this.map.setFitView();
        },
        infoPopoverMarker(data,marker){   
            var _this=this;         
            var title=`<div class="el-message-box__header">
                    <div class="el-message-box__title"><span>aaaaaa</span></div>
                    <button type="button" class="el-message-box__headerbtn"><i class="el-message-box__close el-icon-close"></i></button>
                </div>`;
            var infoWindow = new AMap.InfoWindow({
                isCustom: true, 
                offset: new AMap.Pixel(0, -30)
            });
            for(var i=0;i<data.info.length;i++){
                marker.content=`<div class="infoPop el-message-box">
                <div class="el-message-box__header">
                    <div class="el-message-box__title"><span>aaaaaa</span></div>
                    <button type="button" class="el-message-box__headerbtn"><i class="el-message-box__close el-icon-close"></i></button>
                </div>
                <div class="el-message-box__content">
                    <p><span>${data.info[i].name}：</span>${data.info[i].desc}</p>
                </div></div>`;
                AMap.event.addListener(marker,'click',(e)=>{
                    infoWindow.setContent(e.target.content);
                    infoWindow.open(_this.map, e.target.getPosition());
                });
            }
                
        },
        eject_addressInfo(areaData){
            this.storeCheck=true
        },
        showBoundsInfo(data){
            this.drawBounds(data.area)
        },
        trunkLineInit(data){
            var _this=this;
            AMapUI.load(['ui/misc/PathSimplifier'], function(PathSimplifier) {
                if (!PathSimplifier.supportCanvas) {
                    alert('当前环境不支持 Canvas！');
                    return;
                }
                //启动页面
                _this.set_initPage(data,PathSimplifier);
            });
        },
        singleRoute(data){//干线路线
            var _this=this;
            _this.map.clearMap();
            if (window.pathSimplifierIns) {pathSimplifierIns.setData([]);}            
            if(data.title.indexOf('北京') !=-1){
                var lineArr = {"path":[
                    [121.424029,31.189007],
                    [118.78731,32.235739],
                    [117.117388,34.111513],
                    [113.425982,34.72778],
                    [116.415312,39.852138]
                    ]};
                _this.truckDrivingData(lineArr)
                    // 绘制轨迹
                // var polyline = new AMap.Polyline({
                //     map: _this.map,
                //     path: lineArr,
                //     showDir:true,
                //     strokeColor: "#28F",  //线颜色
                //     // strokeOpacity: 1,     //线透明度
                //     strokeWeight: 6,      //线宽
                //     // strokeStyle: "solid"  //线样式
                // });
                // _this.map.setFitView();
                // var iconSize=new AMap.Size(40, 40);
                // _this.TruckDMarker.startMarker = new AMap.Marker({//起点
                //     position: lineArr[0],
                //     size: iconSize,
                //     icon: require('../../assets/difineDir1.png'),
                //     offset: new AMap.Pixel(-10, -20),
                //     map: _this.map
                // })
                // _this.TruckDMarker.endMarker = new AMap.Marker({//终点
                //     position: lineArr[lineArr.length-1],
                //     size: iconSize,
                //     icon: require('../../assets/difineDir2.png'),
                //     offset: new AMap.Pixel(-20, -10),
                //     map: _this.map
                // })
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
                _this.map.setFitView();
                var iconSize=new AMap.Size(40, 40);
                _this.TruckDMarker.startMarker = new AMap.Marker({//起点
                    position: lineArr[0],
                    size: iconSize,
                    icon: require('../../assets/difineDir1.png'),
                    offset: new AMap.Pixel(-10, -20),
                    map: _this.map
                })
                _this.TruckDMarker.endMarker = new AMap.Marker({//终点
                    position: lineArr[lineArr.length-1],
                    size: iconSize,
                    icon: require('../../assets/difineDir2.png'),
                    offset: new AMap.Pixel(-20, -10),
                    map: _this.map
                })
            }
        },
        simplifierInit(data){//交付轨迹 服务订单 
           
            if(data.level_type=='1'){//交付轨迹
                this.truckDrivingData(data)
            }else{//客户评价
                this.serviceOrderData=data
            }
        },
        set_initPage(orderData,PathSimplifier) {
            var _this=this;
            var pathSimplifierIns = new PathSimplifier({
                zIndex: 100,
                map: _this.map, 
                getPath: function(pathData, pathIndex) {
                    return pathData.path;
                },
                getHoverTitle: function(pathData, pathIndex, pointIndex) {
                    if (pointIndex >= 0) {
                        return pathData.name
                    }
                    return pathData.name
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
                pathSimplifierIns.setData(routeData);
                _this.routeTruckMarker(routeData)
            }).catch(err =>{
                console.log(err)
            })
        },
        truckDrivingData(data){
            var _this=this;
            _this.map.clearMap()
            _this.map.plugin(["AMap.TruckDriving"],function() {
                var truckDriving = new AMap.TruckDriving({
                    // policy: 0, // 规划策略
                    // size: 1, // 车型大小
                    // strategy: 10,//驾车选择策略 路线条数有关
                    // width: 2.5, // 宽度
                    // height: 2, // 高度      
                    // load: 1, // 载重
                    // weight: 12, // 自重
                    // axlesNum: 2, // 轴数
                    // province: '沪', // 车辆牌照省份

                    width: 2.5,
                    size: 2,
                    weight: 10,
                    axis: 2,
                    height: 1.6,
                    load: 0.9,
                    strategy: 5,
                })
                // 根据起终点经纬度规划驾车导航路线
                var path=[]
                path.push({lnglat:[data.path[0]]});//起点
                // var pathLine=data.path//途径
                // for(var i=1;i<pathLine.length-1;i++){
                //     path.push({lnglat:[pathLine[i]]})
                    
                //     _this.TruckDMarker.endMarker2 = new AMap.Marker({//终点
                //         position: pathLine[i],
                //         size: _this.iconSize,
                //         icon: require('../../assets/difineDir2.png'),
                //         offset: new AMap.Pixel(-13, -20),
                //         map: _this.map
                //     })
                //     _this.TruckDMarker.endMarker2.setLabel({
                //         offset: new AMap.Pixel(5, 10),  //设置文本标注偏移量
                //         content: "<div class='infoTips'><p>EAT 10:30</p><p>ATA 10:30 17mins </p><p>ETD 10:30</p><p>ATD 12:47 10mins</p></div>", //设置文本标注内容
                //         direction: 'right', //设置文本标注方位
                //     });
                // }
                // path.push({lnglat:[121.396582,31.245129]});//途径
                // path.push({lnglat:[121.544897,31.219882]});//途径
                path.push({lnglat:[data.path[data.path.length-1]]});//终点

                
                // path.push({lnglat:[116.481008,39.989625]});//途径
                // path.push({lnglat:[116.414217,40.061741]});//途径

                truckDriving.search(path, function(status, result) {
                    if (status === 'complete') {
                        console.log('绘制货车路线完成')
                        if (result.routes && result.routes.length) {
                            _this.drawRoute(result.routes[0]);//路线 
                        }
                    } else {
                        console.log('获取货车数据失败：' + result)
                    }
                });
            })
        },
        routeTruckMarker(routePath){
            var _this=this;
            if(routePath==''){_this.map.remove(_this.TruckDMarker.startMarker); return;}
            var iconSize=new AMap.Size(30, 30);
            for(var i=0;i<routePath.length;i++){
                _this.TruckDMarker.startMarker = new AMap.Marker({//起点
                    position: routePath[0].path[0],
                    size: iconSize,
                    icon: require('../../assets/difineDir1.png'),
                    offset: new AMap.Pixel(-10, -10),
                    map: _this.map
                })
                _this.TruckDMarker.endMarker= new AMap.Marker({//终点
                    position: routePath[i].path[routePath[i].path.length-1],
                    size: iconSize,
                    icon: require('../../assets/difineDir2.png'),
                    offset: new AMap.Pixel(-20, -10),
                    map: _this.map
                })
            }
        },
        drawRoute(route){//点标记
            var _this=this;
            var path = _this.parseRouteToPath(route);
            var difineICON=require('../../assets/difineDir1.png');
            var routeCar = new AMap.Marker({
                map: _this.map,
                position: path[0],
                size: (10,10),
                icon:  require('../../assets/car.png'),
                offset: new AMap.Pixel(-26, -13),
                autoRotation: true,
                angle:-90,
                zIndex:1
            });
            routeCar.moveTo(path, 2000000)
            // var iconSize=new AMap.Size(30, 30);
            var startMarker = new AMap.Marker({//起点
                position: path[0],
                size: _this.iconSize,
                icon: require('../../assets/difineDir1.png'),
                offset: new AMap.Pixel(-13, -25),
                map: _this.map
            })
             startMarker.setLabel({
                offset: new AMap.Pixel(5, 10),  //设置文本标注偏移量
                content: "<div class='infoTips'><p>EAT 10:30</p><p>ATA 10:30 17mins </p><p>ETD 10:30</p><p>ATD 12:47 10mins</p></div>", //设置文本标注内容
                direction: 'right', //设置文本标注方位
            });
            // startMarker.on('mousemove',_this.infosdasd)
            var endMarker = new AMap.Marker({//终点
                position: path[path.length - 1],
                size: _this.iconSize,
                icon: require('../../assets/difineDir2.png'),
                offset: new AMap.Pixel(-13, -20),
                map: _this.map
            })
            endMarker.setLabel({
                offset: new AMap.Pixel(5, 10),  //设置文本标注偏移量
                content: "<div class='infoTips'><p>EAT 10:30</p><p>ATA 10:30 17mins </p><p>ETD 10:30</p><p>ATD 12:47 10mins</p></div>", //设置文本标注内容
                direction: 'right', //设置文本标注方位
            });
            var routeLine = new AMap.Polyline({
                path: path,
                showDir:true,
                strokeWeight: 6,
                strokeColor: '#28F',
            })
            routeLine.setMap(this.map)
            
             // 调整视野达到最佳显示区域
            _this.map.setFitView([startMarker,endMarker,routeLine ])
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
        drawBounds(dvalue){//行政区域
            var _this=this;
            if(!_this.drawbounds.district){
                var opts={
                    subdistrict:0,
                    extensions:'all',
                    level:"district"
                };
                 _this.map.plugin(["AMap.DistrictSearch"],function() {
                    _this.drawbounds.district=new AMap.DistrictSearch(opts);
                 })
            }
            //行政区域查询
            _this.drawbounds.district.setLevel(dvalue);
            _this.drawbounds.district.search(dvalue,(status,result)=>{
                _this.map.remove(_this.drawbounds.polygons)
                _this.drawbounds.polygons=[];
                var bounds=result.districtList[0].boundaries;
                if(bounds){
                    for (var i = 0, l = bounds.length; i < l; i++) {
                        
                        //生成行政区划polygon
                        var polygon = new AMap.Polygon({
                            strokeWeight: 1,
                            path: bounds[i],
                            fillOpacity: 0.4,
                            fillColor: '#80d8ff',
                            strokeColor: '#0091ea'
                        });
                        _this.drawbounds.polygons.push(polygon);
                    }
                }
                _this.map.add(_this.drawbounds.polygons)
                // _this.map.setFitView(_this.drawbounds.polygons);//视口自适应
            })
        },
        _onZoomEnd(){//监听地图缩放
            /**
             * zoom
             * 5-7  省份
             * 8-10 市/各别省区
             */
            var _this=this;
            var provinceData=JSON.parse(localStorage.getItem('provinceData')),
            cityData=JSON.parse(localStorage.getItem('cityData')),
            areaData=JSON.parse(localStorage.getItem('areaData'));
            if(provinceData&&this.map.getZoom()==6){this.province(provinceData);}
            if(cityData&&this.map.getZoom()==9){this.cityInit(cityData);}
            if(areaData&&this.map.getZoom()==13){this.areaInit(areaData);}
            if (this.map.getZoom() < 7) {//全国下的省份
                this.map.remove(this.markersTwo)//移除不再层级的点聚合
                this.map.remove(this.addressMarkers)
            }else if((this.map.getZoom() < 10) && (this.map.getZoom() > 7)){//省份下的市
                this.map.remove(this.markers)
                this.map.remove(this.addressMarkers)
            }else if(this.map.getZoom() < 14 && this.map.getZoom() > 10){//市下面的区或县
                
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
        createInfoWindow (title, content) {//构建自定义信息窗体
            var info = document.createElement("div");
            info.className = "custom-info input-card content-window-card";
            //可以通过下面的方式修改自定义窗体的宽高
            // 定义顶部标题
            var top = document.createElement("div");
            var titleD = document.createElement("div");
            var closeX = document.createElement("img");
            top.className = "info-top";
            titleD.innerHTML = title;
            closeX.src = "https://webapi.amap.com/images/close2.gif";
            closeX.onclick = this.closeInfoWindow;

            top.appendChild(titleD);
            top.appendChild(closeX);
            info.appendChild(top);

            // 定义中部内容
            var middle = document.createElement("div");
            middle.className = "info-middle";
            middle.style.backgroundColor = 'white';
            middle.innerHTML = content;
            info.appendChild(middle);

            // 定义底部内容
            var bottom = document.createElement("div");
            bottom.className = "info-bottom";
            bottom.style.position = 'relative';
            bottom.style.top = '0px';
            bottom.style.margin = '0 auto';
            var sharp = document.createElement("img");
            sharp.src = "https://webapi.amap.com/images/sharp.png";
            bottom.appendChild(sharp);
            info.appendChild(bottom);
            return info;
        },
        closeInfoWindow() {//关闭信息窗体
            this.map.clearInfoWindow();
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

