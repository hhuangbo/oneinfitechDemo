<template>
    <div class="mapContent">
        <div class="oneMap" id="container"></div>
        <menuCate></menuCate>
    </div>
</template>

<script>
import menuCate from './menuCate/index'
export default {
    components:{
        menuCate
    },
    data(){
        return{
            map:null,
            mapData:{
                resizeEnable:true,//自适应大小
                zoom:5,//默认层级
            }
        }
    },
    created(){

    },
    mounted(){
        this.init();
    },
    methods:{
        init(){
            let _this=this;
            this.map=new AMap.Map('container',{
                resizeEnable: this.mapData.resizeEnable,//自适应大小
                zoom:this.mapData.zoom,
                viewMode: '2D'
            })
            
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

