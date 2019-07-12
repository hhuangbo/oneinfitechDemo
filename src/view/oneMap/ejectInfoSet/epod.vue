<template>
    <div class="ejectInfoSet detailList" v-show="deListShow">
        <div class="toolRight">
            <i class="iconfont icon-close" @click="handleCurrClose(1)"></i>  
        </div>
        <div>
            <label>EPOD</label>
            <img :src="dListPic"/>
        </div>
    </div>
</template>

<script>
export default {
    props:[
        'data'
    ],
    data(){
        return{
            deListShow:true,
            dListPic:require('../../../assets/detailList.png')
        }
    },
    methods:{
        handleCurrClose(data){
            data==1?this.deListShow=false : this.deListShow=false
        }
    }
}
</script>

<style lang="scss" scoped>
.detailList{
    label{
        font-size: 18px;
        display: inline-block;
        padding-bottom: 10px;
        letter-spacing: 4px;
    }
    img{width: 100%;}
}
</style>

