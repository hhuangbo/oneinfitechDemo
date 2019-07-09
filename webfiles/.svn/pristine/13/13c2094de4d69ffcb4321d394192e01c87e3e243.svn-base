<template>
<div class="photoInfo" v-show="infoIsShow">
    <ul class="infoCont">
        <li v-for="(item,index) in phoInfoData" :class="[phoneScal ? '' : 'phoneScal']" > 
            <img :src="item.img" @click="handleImg(item)" :class="[imgzoom==1 ? 'zoom-in' : '',imgzoom==2?'zoom-out':'']"/>
            <span>{{item.title}}</span>
        </li>
    </ul>
    <div class="viewTool">
        <i class="iconfont icon-enlarge" @click="handleEnlarge"></i>
        <i class="iconfont icon-narrow" @click="handleNarrow"></i>
        <i class="iconfont icon-refresh" @click="handleRefresh"></i>
    </div>
    <i class="btnclose iconfont icon-close" @click="handleClose"><!--关闭弹出--></i>
</div>
</template>

<script>
import {mapGetters} from 'vuex'
export default {
    props:[
        'dataInfo'
    ],
    data(){
        return{
            imgzoom:0,
            phoneScal:-1,
            infoIsShow:true,//是否显示
            phoInfoData:[
                {title:'整体园区',img:require('../../../assets/c1.jpg')},
                {title:'仓库外观',img:require('../../../assets/c2.jpg')},
                {title:'办公室',img:require('../../../assets/c3.jpg')},
                {title:'员工食堂',img:require('../../../assets/c4.jpg')},
            ]
        }
    },
    computed:{
        // ...mapGetters(['wareDataInfo'])
    },
    watch:{
        dataInfo(res){
            console.log(res);
            
        }
    },
    mounted(){
        this.init()
    },
    methods:{
        init(){
            
        },
        handleImg(data){
            console.log(data)
            this.imgzoom=1;
        },
        handleEnlarge(index){//点击放大
            console.log('放大');
            this.imgzoom=1;
            this.phoneScal=this.phoneScal == index ? -1 : index;
            // setInterval(() => {
            //     this.imgzoom=2;
            // }, 2000);
            
        },
        handleNarrow(){//点击缩小
            console.log('缩小');
            this.imgzoom=2;

        },
        handleRefresh(){//刷新
            console.log('刷新');

        },
        handleClose(){//关闭
            this.infoIsShow=false;
        }
    }
}
</script>

<style lang="scss" scoped>
.photoInfo{
    //width: 100%;
    width: 70%;
    position: absolute;
    top: 30%;
    // left: 0;
    left: 20%;
    z-index: 8;
    background: rgba(16, 117, 170, 0.77);
    color: #fff;
    .infoCont{
        display: flex;
        padding: 2% 2% 0;
        // padding: 2% 10% 0;
        li{
            text-align: center;//margin: 0 10px;
        }
        img{display: block;
        // width: 75%;
        width: 85%;
        margin: 0 auto;
        }
        span{line-height: 30px;font-size: 12px;}
    }
}
.phoneScal{
    -webkit-transform: scale(1.2);
    transform: scale(1.2);
}
.viewTool{    
    text-align: center;
    padding: 10px 0;
    i{    
        font-size: 22px;
        margin: 0 5px;
        line-height: 30px;
        cursor: pointer;
    }
}
.btnclose{
    position: absolute;
    top: 0px;
    right: 4px;
    font-size: 20px;
    cursor: pointer;
}
.zoom-in{
    cursor:zoom-in;
}
.zoom-out{
    cursor:zoom-out;
}
</style>
