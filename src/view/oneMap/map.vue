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
        
        <!--仓库照片、基本信息、实时监控-->
        <checkBoxTemp id="wareinfowCont" :data="wareinfowData" :mType="4" v-show="wareinfow_isShow"/>

        
        <!--搜索条件-->
        <searchTerm />

        <orderInfo :data="serviceCompVal"  
        :class="[serviceCompVal && serviceCompVal.level_type==2 ? 'animated fadeInRight': 'animated fadeOutRight']" 
        v-if="serviceCompVal && serviceCompVal.level_type==2"/>
        <epod :class="[serviceCompVal && serviceCompVal.level_type==3 ? 'animated fadeInRight': 'animated fadeOutRight']" 
         v-if="serviceCompVal && serviceCompVal.level_type==3"/>
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
import orderInfo from './ejectInfoSet/orderInfo'
import epod from './ejectInfoSet/epod'
import customerEva from './ejectInfoSet/customerEva'
import checkBoxTemp from '../../components/pubCompents/checkBoxTemp'




import {mapGetters} from 'vuex'
export default {
    components:{
        menuCate,photoInfo,warehInfo,storehouseInfo,searchTerm,orderInfo,epod,customerEva,
        checkBoxTemp
    },
    data(){
        return{
            wareinfow_isShow:false,
            wareinfowData:[],
            serviceOrderData:[],
            map:null,//地图实例
            infoWindow:null,//信息窗体
            ainfoWindow:null,
            markerClusterer:null,//聚合点对象实例
            mapData:{
                resizeEnable:true,//自适应大小
                zoom:5,//默认层级
                zooms:[4,18],//最小最大
                center: [110.98934,36.500585]
            },
            iconSize:new AMap.Size(30, 30),
            sh_markers:[],
            sh_markers_2:[],
            sh_markers_3:[],//收货地址
            startMarker:[],
            TruckDMarker:{
                startMarker:[],endMarker:[],routeLine:[],routeCar:[]
            },
            drawbounds:{district :null,polygons:[]},//行政区域

            storeInfoData:'',//仓库信息
            storeCheck:false,//地图多点 仓库点击
            
            thisMenuActive:null,//当前展开得菜单项

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
            var _this=this;
            this.storeCheck=false
            localStorage.setItem('thisMenuActive',data)
            if(data==6){_this.map.clearMap();}
            if(data==1 || data==3 || data==4 || data==5 || 8<= data <=11){//收货地址
                if(window.pathSimplifierIns){pathSimplifierIns.setData([]);};
                _this.routeTruckMarker('');//清空干线路线的marker
                // return;
            }else{
                // _this.map.clearMap();
                // if(window.pathSimplifierIns){pathSimplifierIns.setData([])}
            }
            _this._onZoomEnd();
        },
        level3Data(data){
            this.setlevel3Data(data)
        },
        serviceCompVal(data){
            this.simplifierInit(data)
        }
    },
    mounted(){
        var _this=this;
        _this.mapInit();
            
        //监听当前缩放级别
        AMap.event.addListener(_this.map,'zoomend',function(){
            _this._onZoomEnd();
            _this.storeCheck=false
        });
        
    },
    methods:{
        mapInit(){//创建地图
            let _this=this;            
            // console.log('搜索的关键字：',_this.$route.query)
            this.map=new AMap.Map('container',{
                zoom:_this.mapData.zoom, 
                zooms:_this.mapData.zooms, 
                center: _this.mapData.center,
                resizeEnable: _this.mapData.resizeEnable,//自适应大小
                viewMode: '2D'
            })  
            //信息窗体
            this.infoWindow = new AMap.InfoWindow({
                offset: new AMap.Pixel(0, -20)
            }); 
            this.ainfoWindow = new AMap.InfoWindow({
                offset: new AMap.Pixel(0, -20),
                isCustom:true,closeWhenClickMap:true
            });  

        },
        menuClassA(data,active){
            if(data.type ==1 || data.type ==3 || data.type ==4 || data.type ==5 ){this.secondLevelData(data,active)}
            // else if(8<=data.type<=11){this.infoPopover(data);}//收货人 发货人 司机列表
            else if(data.type == 8 || data.type== 9 || data.type ==10 || data.type==11){this.infoPopover(data);}//收货人 发货人 司机列表
            else if(data.type == 7 || data.type == 12){this.cust_InfoMarker(data)}
            else if(data.type == 2 || data.type == 13){this.trunkLineInit(data)}
            
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
        setlevel3Data(data){
            // if(data.addressInfo){this.areaInit(data.addressInfo)}
            if(data){this.areaInit(data)}
        },
        province(data){//省
            var _this=this;
            _this.map.clearMap();
             _this.map.remove(this.sh_markers_2)//清除点聚合 
            // this.map.setZoomAndCenter(5,[data[0].lng,data[0].lat]);
            this.map.setZoomAndCenter(5);
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
                    this.sh_markers.push(marker);
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
             _this.map.remove(this.sh_markers)
             _this.map.remove(this.sh_markers_2)//清除点聚合
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
                    this.sh_markers_2.push(marker);
                    _this.map.add(marker)//点标记添加到地图上
                    AMap.event.addListener(marker,'click', (e)=>{
                        var addData=JSON.parse(JSON.stringify(e.target.getExtData()))
                        this.areaInit(addData);
                    });

                }
            }
        },
        areaInit(data){//区 
            var _this=this;_this.map.remove(this.sh_markers_2)//清除点聚合 
            localStorage.setItem('areaData',JSON.stringify(data))  
            if(data.addressInfo){
                _this.map.setZoomAndCenter(11,[data.lng,data.lat]);
                data=data.addressInfo;
            } else{_this.map.setZoomAndCenter(11,[data[0].lng,data[0].lat]);data=data;}
            _this.map.remove(this.sh_markers_3)

            for (var i=0; i < data.length; i ++) {
                var marker=new AMap.Marker({
                    position: [data[i].lng,data[i].lat],
                    size: new AMap.Size(20, 20),
                    icon: require('../../assets/difineDir2_1.png'),
                    offset: new AMap.Pixel(-13, -30),
                    // map:_this.map,
                    extData:data[i]
                }); 

                if(localStorage.getItem('thisMenuActive')==4){//仓库信息
                    marker.content=document.getElementById('wareinfowCont');//弹出框
                    _this.wareinfowData=[
                        {level_type:1,title:'仓库信息'},
                        {level_type:2,title:'基本信息'},
                        {level_type:3,title:'实时监控'}
                    ]
                }
                
                _this.sh_markers_3.push(marker);
                _this.map.add(marker);
                AMap.event.addListener(marker,'click',(e)=>{
                    var areaData=JSON.parse(JSON.stringify(e.target.getExtData()))
                    _this.eject_addressInfo(areaData)
                });
                AMap.event.addListener(marker,'mouseover',(e)=>{          
                    var areaData=JSON.parse(JSON.stringify(e.target.getExtData()))
                    _this.showBoundsInfo(areaData)

                    if(localStorage.getItem('thisMenuActive')==4){//仓库信息
                        _this.wareinfow_isShow=true
                        _this.infoWindow.setContent(e.target.content);
                        _this.infoWindow.open(_this.map, e.target.getPosition());
                    }
                });
                AMap.event.addListener(marker,'mouseout',(e)=>{
                    _this.map.remove(_this.drawbounds.polygons)
                    _this.drawbounds.polygons=[];

                });
                    
            }
            
        },
        infoPopover(datas){//收货人 发货人  司机列表  车辆检索
            var _this=this,iconImg;
            if(datas.type==8){
                iconImg =require('../../assets/sp.png')
            }else if(datas.type==9){
                iconImg=require('../../assets/kp.png')
            }else if(datas.type==10){
                iconImg=require('../../assets/cp.png')
            }else if(datas.type==11){
                iconImg=require('../../assets/carlist.png')
            }
            let data=datas.level;
            _this.map.clearMap();
            for (var i=0; i < data.length; i ++) {
                var marker= new AMap.Marker({
                    position: [data[i].lng,data[i].lat],
                    icon: iconImg,
                    extData:data[i],
                    map: _this.map
                });
                var dataInfo=data[i].info
                var dataInfo_divs=''
                for(var j=0;j<dataInfo.length;j++){         
                   dataInfo_divs += `<p><span>${dataInfo[j].name}：</span>${dataInfo[j].desc}</p>`
                }  
                marker.content=`<div class="infoPop ">
                <div class="el-message-box__header">
                    <div class="el-message-box__title"><span>${datas.title}</span></div>
                </div>
                <div class="el-message-box__content">
                ${dataInfo_divs}
                </div></div>`;

                AMap.event.addListener(marker,'click',(e)=>{
                    _this.infoWindow.setContent(e.target.content);
                    _this.infoWindow.open(_this.map, e.target.getPosition());
                });
            }
            _this.map.setFitView();
        },
        
        cust_InfoMarker(datas){//客户检索   供应商检索
            var _this=this,iconImg;
            _this.map.clearMap();
            if(datas.type==7){
                iconImg =require('../../assets/sp.png')
            }else if(datas.type==12){
                iconImg=require('../../assets/company.png')
            }
            let data=datas.level;
            for (var i=0; i < data.length; i ++) {
                var marker= new AMap.Marker({
                    position: [data[i].lng,data[i].lat],
                    icon: iconImg,
                    extData:data[i],
                    map: _this.map
                });
                AMap.event.addListener(marker,'click',(e)=>{
                    console.log('信息台')
                });
            }
            _this.map.setFitView();
        },
        eject_addressInfo(areaData){
            this.storeCheck=true
        },
        showBoundsInfo(data){
            this.drawBounds(data.area)
        },
        simplifierInit(data){//交付轨迹 服务订单           
            if(data.level_type=='1'){//交付轨迹
                this.truckDrivingData(data)
            }else{//客户评价
                this.serviceOrderData=data
            }
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

            _this.truckDrivingData(data) 
            
            //if(data.title.indexOf('南京') !=-1){                
            //     _this.map.clearMap();
            //     var lineArr = [
            //         [121.424029,31.189007],
            //         [120.918658,31.353336],
            //         [120.638507,31.470539],
            //         [120.347369,31.568876],
            //         [119.946368,31.760568],
            //         [119.473956,32.175315],
            //         [118.831256,32.012436]
            //     ];
            //         // 绘制轨迹
            //     var polyline = new AMap.Polyline({
            //         map: _this.map,
            //         path: lineArr,
            //         showDir:true,
            //         strokeColor: "#28F",  //线颜色
            //         // strokeOpacity: 1,     //线透明度
            //         strokeWeight: 6,      //线宽
            //         // strokeStyle: "solid"  //线样式
            //     });
            //     var iconSize=new AMap.Size(40, 40);
            //     _this.TruckDMarker.startMarker = new AMap.Marker({//起点
            //         position: lineArr[0],
            //         size: iconSize,
            //         icon: require('../../assets/difineDir1.png'),
            //         offset: new AMap.Pixel(-10, -20),
            //         map: _this.map
            //     })
            //     _this.TruckDMarker.endMarker = new AMap.Marker({//终点
            //         position: lineArr[lineArr.length-1],
            //         size: iconSize,
            //         icon: require('../../assets/difineDir2.png'),
            //         offset: new AMap.Pixel(-20, -10),
            //         map: _this.map
            //     })
            //     _this.map.setFitView();
            // }
        },
        set_initPage(orderData,PathSimplifier) {
            var _this=this;
            _this.map.clearMap();
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
                        lineWidth: 4,
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
                path.push({lnglat:[data.path[data.path.length-1]]});//终点

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
                var difineICON_start,difineICON_end;
            if(localStorage.getItem('thisMenuActive')==6){
                difineICON_start=require('../../assets/difineDir1-1.png');
                difineICON_end=require('../../assets/difineDir2-1.png');
            }else{
                difineICON_start=require('../../assets/difineDir1.png');
                difineICON_end=require('../../assets/difineDir2.png');
            }
            var startMarker = new AMap.Marker({//起点
                position: path[0],
                size: _this.iconSize,
                icon: difineICON_start,//require('../../assets/difineDir1_1.png'),
                offset: new AMap.Pixel(-8, -9),
                map: _this.map
            })
            // startMarker.on('mousemove',_this.infosdasd)
            var endMarker = new AMap.Marker({//终点
                position: path[path.length - 1],
                size: _this.iconSize,
                icon: difineICON_end,//require('../../assets/difineDir2.png'),
                offset: new AMap.Pixel(-10, -8),
                map: _this.map
            });
            if(localStorage.getItem('thisMenuActive')==6){//服务订单
                // startMarker.setLabel({
                //     offset: new AMap.Pixel(5, 10),  //设置文本标注偏移量
                //     content: "<div class='infoTips'><p>EAT 10:30</p><p>ATA 10:30 17mins </p><p>ETD 10:30</p><p>ATD 12:47 10mins</p></div>", //设置文本标注内容
                //     direction: 'right', //设置文本标注方位
                // }); 
                startMarker.setLabel({
                    offset: new AMap.Pixel(5, -10),  //设置文本标注偏移量
                    content: '<div class="info infop-start"><span class="sp1">发</span><span class="sp2">南京</span></div><div class="infop-sharp"></div>', 
                    direction: 'top', //设置文本标注方位
                });
                //  var ainfoWindow = new AMap.InfoWindow({
                //     offset: new AMap.Pixel(0, -20),
                //     isCustom:true
                // }); 
                startMarker.content="<div class='infoTips'><p>EAT 10:30</p><p>ATA 10:30 17mins </p><p>ETD 10:30</p><p>ATD 12:47 10mins</p></div>"
                // startMarker.content='<div class="infop_start"><span class="sp1">发</span><span class="sp2">南京</span></div>'
                // infoWindow.setContent(startMarker.content);
                // infoWindow.open(_this.map, path[0]);
                AMap.event.addListener(startMarker,'mouseover',(e)=>{
                    _this.ainfoWindow.setContent(e.target.content);
                    _this.ainfoWindow.open(_this.map, e.target.getPosition());
                });
                AMap.event.addListener(startMarker,'mouseover',(e)=>{
                    _this.ainfoWindow.close()
                });

                // endMarker.setLabel({
                //     offset: new AMap.Pixel(5, 10),  //设置文本标注偏移量
                //     content: "<div class='infoTips'><p>EAT 10:30</p><p>ATA 10:30 17mins </p><p>ETD 10:30</p><p>ATD 12:47 10mins</p></div>", //设置文本标注内容
                //     direction: 'right', //设置文本标注方位
                // }); 
                
                endMarker.setLabel({
                    offset: new AMap.Pixel(5, -10),  //设置文本标注偏移量
                    content: '<div class="info infop-start"><span class="sp1-1">收</span><span class="sp2">浙江</span></div><div class="infop-sharp"></div>', 
                    direction: 'top', //设置文本标注方位
                });
                endMarker.content="<div class='infoTips'><p>EAT 10:30</p><p>ATA 10:30 17mins </p><p>ETD 10:30</p><p>ATD 12:47 10mins</p></div>"
                AMap.event.addListener(endMarker,'mouseover',(e)=>{
                    _this.ainfoWindow.setContent(endMarker.content);
                    _this.ainfoWindow.open(_this.map, path[path.length - 1]);
                });
                AMap.event.addListener(endMarker,'mouseover',(e)=>{
                    _this.ainfoWindow.close()
                });

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
            }
            var routeLine = new AMap.Polyline({
                path: path,
                showDir:true,
                strokeWeight: 5,
                strokeColor: '#2f7fdc'//'#28F',
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
            var this_menuAct=localStorage.getItem('thisMenuActive');//当前展开的菜单
            
            if(this_menuAct==1 || this_menuAct==3 || this_menuAct==4 || this_menuAct==5){//收货地址
                var provinceData=JSON.parse(localStorage.getItem('provinceData')),
                cityData=JSON.parse(localStorage.getItem('cityData')),
                areaData=JSON.parse(localStorage.getItem('areaData'));
                if(provinceData&&this.map.getZoom()==6){this.province(provinceData);}
                if(cityData&&this.map.getZoom()==9){this.cityInit(cityData);}
                if(areaData&&this.map.getZoom()==13){this.areaInit(areaData);}
            }
            if (this.map.getZoom() < 7) {//全国下的省份
                this.map.remove(this.sh_markers_2)//移除不再层级的点聚合
                this.map.remove(this.sh_markers_3)
            }else if((this.map.getZoom() < 10) && (this.map.getZoom() > 7)){//省份下的市
                this.map.remove(this.sh_markers)
                this.map.remove(this.sh_markers_3)
            }else if(this.map.getZoom() < 14 && this.map.getZoom() > 10){//市下面的区或县
                
            }
        },
        _renderClusterMarker(context) {
            var count = this.sh_markers.length;
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
                this.sh_markers.setMap(null);
                this.sh_markers = null;
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
<style lang="scss" >
.infop-start{//
    height: 20px;
    line-height: 20px;
    border-radius: 4px;
    .sp1,.sp1-1,.sp2{
        padding: 3px 4px;
        color: #fff;opacity: 1;
    }
    .sp1{background-color: #e53447;}
    .sp1-1{background-color: #f1bb2e;}
    .sp2{padding: 5px;color: #000;
    background-color: #fff;}
}
.infop-sharp{
    position: absolute;
    content: "";
    margin-left: 20px;
    margin-top: 1px;
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    border-top: 8px solid #fff;
    &::after{
        position: absolute;
        content: "";
        margin-left: -8px;
        margin-top: -7px;
        border-left: 8px solid transparent;
        border-right: 8px solid transparent;
        border-top: 8px solid rgba(0,0,0,0.3);
        filter: blur(2px);
        z-index: -1;
    }
}
// .amap-info-close{display: none;}

.infoTips{
    background-color: #0d0e0f;
    color: #fff;
    opacity: .9;
    padding: 10px;
    border-radius: 3px;
    border:none;
}

.amap-marker-label{
    padding: 0;

    // background-color: #0d0e0f;
    color: #fff;
    opacity: .9;
    // padding: 10px;
    border-radius: 3px;
    border:none;
}


.amap-logo,.amap-copyright{
    display: none !important;
    opacity:0 !important;
}

</style>

