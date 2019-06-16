<template>
    <div class="mapContent">
        <div class="oneMap" id="container"></div>
        <menuCate ></menuCate>
    </div>
</template>

<script>
// import menuCate from './menuCate/index'
import menuCate from './menuCate/menuCate'
import {mapGetters} from 'vuex'
export default {
    components:{
        menuCate
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
            },
            markers:[],
            markersTwo:[],
            cluster:null
        }
    },
    created(){

    },
    watch:{
        menuInfo(data){
            console.log(data);
            
        }
    },
    computed:{
        ...mapGetters(['menuInfo'])
    },
    watach:{
        // this._onZoomEnd()
    },
    mounted(){
        var that=this;
        that.mapInit();
         //添加监听时间，当前缩放级别
        AMap.event.addListener(that.map,'zoomend',function(){
            that._onZoomEnd()
        });
        
        
        // this.addCluster()
    },
    methods:{
        mapInit(){//初始创建地图
            let _this=this;
            this.map=new AMap.Map('container',{
                resizeEnable: _this.mapData.resizeEnable,//自适应大小
                zoom:_this.mapData.zoom,
                viewMode: '2D'
            })                
        },
        secondLevelData(data){//左侧菜单点击取值 子组件
            console.log('我是从子组件来的',data)
            // this.markers.push(data.lng,data.lat)
            this.province(data)
        },
        _onZoomEnd(){//监听地图缩放
            var _this=this;
            if (this.map.getZoom() < 7) {//全国下的省份
            console.log('ssss')
            //     for (var i = 0; i < this.markers.length; i += 1) {
            //         this.map.remove(this.markers[i].subMarkers);
            //     }
            //    this.map.add(this.markers);
             
            this.map.remove(this.markersTwo)
            _this.markers.push(localStorage.getItem('markers'))
            }else if((this.map.getZoom() < 9) && (this.map.getZoom() > 7)){//省份下的市
            
            console.log('aaa');
                // for (var i = 0; i < this.markersTwo.length; i += 1) {
                //     this.map.remove(this.markersTwo[i].subMarkers);
                // }
                // this.map.add(this.markersTwo);
                 this.map.remove(this.markers)
            }
            // else if(map.getZoom() < 14 && map.getZoom() > 9){//市下面的区或县
            //     for (var i = 0; i < markersThree.length; i += 1) {
            //         map.remove(markersThree[i].subMarkers);
            //     }
            //     map.add(markersThree);
            // }
        },
        province(data){////省
            var _this=this
            if(this.cluster){this.cluster.setMap(null);}
            // let datas=data.level;
            for (var i = 0; i < data.length; i ++) {
               var marker=new AMap.Marker({
                    position: [data[i].lng,data[i].lat],
                    map: this.map,
                    extData:data[i],//自定义属性值
                    content:  `<div style="background-color: hsla(208, 80%, 48%, 0.7); height: 50px;line-height: 50px; width: 50px;text-align:center; border: 1px solid hsl(208, 80%, 48%); border-radius: 50%; box-shadow: hsl(208, 80%, 48%) 0px 0px 1px;">${data[i].count}</div> `,
                    offset: new AMap.Pixel(-15, -15)//点标记显示位置偏移量
                })
                localStorage.setItem('markers',marker)
                this.markers.push(marker)

               marker.on('click', this.cityInit);
            } 
            // var count = this.markers.length;
            // _this.addCluster()
        },
        addCluster(){//添加点聚合
            let _this=this
              if (_this.cluster) {
                _this.cluster.setMap(null);
            }
            _this.map.plugin(["AMap.MarkerClusterer"],function() {
                _this.cluster = new AMap.MarkerClusterer(_this.map, _this.markers, {
                    gridSize: 80,
                    renderClusterMarker: _this._renderClusterMarker
                });
            })
        },
        cityInit(e){//市
            var _this=this;
             this.map.remove(this.markers)
            this.map.setZoomAndCenter(10);
            var provinceDatas=JSON.parse(JSON.stringify(e.target.getExtData()));
            let datas=provinceDatas.info;
            if(datas){
                for (var i = 0; i < datas.length; i ++) {
                var marker=new AMap.Marker({
                        position: [datas[i].lng,datas[i].lat],
                        map: this.map,
                        extData:datas[i],
                        content: `<div style="background-color: rgba(16, 117, 170, 0.8); 
                            height: 50px;line-height:50px; width: 50px; text-align:center;border: 1px solid hsl(180, 100%, 40%); 
                            border-radius: 50%; box-shadow: hsl(180, 100%, 50%) 0px 0px 1px;color:#fff" >
                            ${datas[i].count}</div>`,
                        offset: new AMap.Pixel(-10,-20)//点标记显示位置偏移量
                    });
                    this.markersTwo.push(marker);
                }
            }
        },
        areaInit(){//区

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
//菜单分类 css
.menuCate{
    position: absolute;
    top: 50px;
    left: 4%;    
    width: 140px;
    overflow: hidden;
}



</style>
<style>
.amap-logo,.amap-copyright{
    display: none !important;
    opacity:0 !important;
}
</style>

