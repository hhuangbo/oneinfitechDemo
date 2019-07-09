<template>
    <div class="storehouse" v-show="storehouseShow">
        <div class="toolRight">
            <i class="iconfont icon-close" @click="handleCurrClose(1)"></i>  
        </div>
        <div class="storeInfo">
            <div class="store">
                <img :src="storeInfoData.class1.img" class="storePic" />
                <div class="store1">
                    <div class="log"><img :src="storeInfoData.class1.strorelogo" /></div>
                    <p>{{storeInfoData.class1.title}}</p>
                    <div class="address">
                        <p>门店：{{storeInfoData.class1.num}}</p>
                        <p>地址：{{storeInfoData.class1.address}}</p>
                    </div>
                </div>
            </div>
            <div class="store storefelxW">
                <div class="store-item">
                    <label>{{storeInfoData.class2.class2_1.label}}</label>
                    <p>{{storeInfoData.class2.class2_1.time}}</p>
                </div>
                <div class="store-item">
                    <label>{{storeInfoData.class2.class2_2.label}}</label>
                    <p>{{storeInfoData.class2.class2_2.name}}</p>
                    <p>{{storeInfoData.class2.class2_2.phone}}</p>
                    <p>{{storeInfoData.class2.class2_2.ps}}</p>
                </div>
                <div class="store-item">
                    <label>{{storeInfoData.class2.class2_3.label}}</label>
                    <div v-for="item in storeInfoData.class2.class2_3.num" class="s-item">
                        <span>{{item.m}}</span>
                        <i v-if="item.type==1" class="limit limit-T">√</i>
                        <i v-else class="limit limit-F">×</i>
                    </div>
                </div>
                <div class="store-item">
                    <label>{{storeInfoData.class2.class2_4.label}}</label>
                    <div v-for="item in storeInfoData.class2.class2_4.reqs" class="s-item">
                        <span>{{item.req}}</span>
                        <i v-if="item.type==1" class="limit limit-T">√</i>
                        <i v-else class="limit limit-F">×</i>
                        <span v-if="item.des">{{item.des}}</span>
                    </div>
                </div>
            </div>
            <div class="orderstore">
                <label>{{storeInfoData.class3.label}}</label>
                <div class="order" v-for="item in storeInfoData.class3.orderNum">
                    <span>{{item}}</span>
                    <i>POD</i>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props:[
        // 'storehouseShow'
    ],
    data(){
        return{
            storehouseShow:true,
            storeInfoData:{
                class1:{
                    img:require('../../../assets/w1.png'),
                    strorelogo:require('../../../assets/w2.png'),
                    title:'麦德龙上海嘉定店',
                    num:'044',
                    address:'上海市嘉定区宝安公路3718号'
                },
                class2:{
                    class2_1:{label:'卸货时间',time:'08:00 am-05:00 pm'},
                    class2_2:{label:'收货关键人',name:'陆杰',phone:'18001969483',ps:'收货部主管'},
                    class2_3:{label:'车型限制',num:[{m:'7.7m',type:1},{m:'9.6m',type:1},{m:'12.5m',type:0},{m:'16.5m',type:0}]},
                    class2_4:{label:'其他要求',reqs:[
                        {req:'门店限高',des:'2.1m',type:1},
                        {req:'装卸工具',type:1},
                        {req:'服装限制',type:0},
                        {req:'配送标准'}
                    ]}
                },
                class3:{
                    label:'服务订单',
                    orderNum:[201905077514044,201905077546044,201905087686044]
                }
            }
        }
    },
    methods:{
        handleCurrClose(data){
            data == 1 ? this.storehouseShow = false : this.storehouseShow = false

        }
    }
}
</script>

<style lang="scss" scoped>
.storehouse{
    background-color: $C0d0e0f;
    width: 28%;
    position: absolute;
    right: 0;
    top: 50px;
    color: #fff;
    padding: 15px;
    .toolRight{
        position: absolute;
        top: 2px;
        right: 0px;
    }
}
.storefelxW{flex-wrap: wrap;}
.store{
    display: flex;
    padding-bottom: 10px;
    .storePic{width:50%;height:20%;padding-right: 10px;}
    .store-item{
        width: 50%;
        .s-item{
            width: 80%;
            padding:5px 0;
            line-height: 25px;
            display: flex;
            justify-content: space-between;
        }
    }
    .store-item p{color: #ccc;}
}
.store,.orderstore{
    span{color: #ccc;}
    label{
        text-decoration: underline;
        font-size: 14px;
    }
}
.orderstore{
    .order{    
        display: flex;
        padding: 5px 0;
        justify-content: space-between;
    }
    i{
        background-color: #fff;
        color: #ccc;
        border-radius: 2px;
        padding: 0px 20px;
    }
}
 
.limit{
    font-size: 16px;
    border-radius: 2px;
    background-color: #fff;
    display: inline-block;
    width: 25px;
    height: 25px;
    text-align: center;
    line-height: 20px;
    cursor: pointer;
}
.limit-T{color: $C0d0e0f;}
.limit-F{color: $Cff3333}
</style>
