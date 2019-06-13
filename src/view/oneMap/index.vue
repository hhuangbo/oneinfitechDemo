<template>
    <div>
        <div class="oneMap" id="container"></div>
        <!-- <el-amap vid="amapDemo" :zoom="zoom" :center="center"></el-amap> -->
    </div>
</template>

<script>
export default {
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





</style>
<style>
.amap-logo,.amap-copyright{
    display: none !important;
    opacity:0 !important;
}
</style>

