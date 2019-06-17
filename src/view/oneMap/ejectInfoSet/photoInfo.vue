<template>
    <div class="photoInfo"  v-show="isShow">
        <ul class="infoCont">
            <li v-for="item in phoInfoData">
                <img :src="item.img"/>
                <span>{{item.title}}</span>
            </li>
        </ul>
        <div class="viewTool">
            <i class="iconfont icon-enlarge" @click="handleEnlarge"></i>
            <i class="iconfont icon-narrow" @click="handleNarrow"></i>
            <i class="iconfont icon-refresh" @click="handleRefresh"></i>
        </div>
    </div>
</template>

<script>
import {mapGetters} from 'vuex'
export default {
    data(){
        return{
            isShow:false,
            phoInfoData:[
                {title:'整体园区',img:require('../../../assets/c1.jpg')},
                {title:'仓库外观',img:require('../../../assets/c2.jpg')},
                {title:'办公室',img:require('../../../assets/c3.jpg')},
                {title:'员工食堂',img:require('../../../assets/c4.jpg')},
            ]
        }
    },
    computed:{
        ...mapGetters(['photoInfo'])
    },
    mounted(){
        this.init()
    },
    methods:{
        init(){
            console.log(this.$store.state.photoInfo)
            if(this.$store.state.photoInfo != ''){this.isShow=true;}
        },
        handleEnlarge(){//点击放大
            console.log('放大');
            
        },
        handleNarrow(){//点击缩小
            console.log('缩小');

        },
        handleRefresh(){//刷新
            console.log('刷新');

        }
    }
}
</script>

<style lang="scss" scoped>
.photoInfo{
    width: 100%;
    position: absolute;
    top: 30%;
    left: 0;
    z-index: 9;
    background: rgba(16, 117, 170, 0.77);
    color: #fff;
    .infoCont{
        display: flex;
        padding: 2% 10%;
        li{text-align: center;margin: 0 10px;}
        img{display: block;width: 75%;margin: 0 auto;}
        span{line-height: 30px;}
    }
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
</style>
