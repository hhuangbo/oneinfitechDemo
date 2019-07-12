<template>
    <div class="detailList" v-show="deListShow">
        <div class="toolRight">
            <i class="iconfont icon-close" @click="handleCurrClose(1)"></i>  
        </div>
        <div>
            <label>装车清单</label>
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
    width: 50%;
    position: absolute;
    right: 0;
    top: 50px;
    padding: 20px;
    background-color: $C0d0e0f;
    color: #fff;
    text-align: center;
    .toolRight{
        position: absolute;
        top: 7px;
        right: 5px;
    }
    label{
        font-size: 18px;
        display: inline-block;
        padding-bottom: 10px;
        letter-spacing: 4px;
    }
    img{width: 100%;}
}
</style>

