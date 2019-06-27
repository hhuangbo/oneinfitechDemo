<template>
    <div class="storehouse">
        <div class="toolRight">
            <i class="iconfont icon-close" ></i>  
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
            <div class="store">
                <div class="store-item">
                    <label>{{storeInfoData.class2.class2_1.label}}</label>
                    <p>{{storeInfoData.class2.class2_1.time}}</p>
                </div>
                <!-- <div class="store-item">
                    <label>{{storeInfoData.class2.class2_2.label}}</label>
                    <p>{{storeInfoData.class2.class2_2.name}}</p>
                    <p>{{storeInfoData.class2.class2_2.phone}}</p>
                    <p>{{storeInfoData.class2.class2_2.ps}}</p>
                </div>
                <div class="store-item">
                    <label>{{storeInfoData.class2.class2_3.label}}</label>
                    <p>{{storeInfoData.class2.class2_3.name}}</p>
                </div> -->
            </div>
            <div class="store">
                <label>{{storeInfoData.class3.label}}</label>
                <div class="order" v-for="item in storeInfoData.class3.orderNum">
                    <span>{{item}}</span>
                    <button>POD</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data(){
        return{
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
    }
}
</script>

<style lang="scss" scoped>
.storehouse{
    background-color: $C0d0e0f;
    width: 25%;
    position: absolute;
    right: 0;
    top: 50px;
    color: #fff;
    padding: 20px;
    .toolRight{
        position: absolute;
        top: 10px;
        right: 10px;
    }
}
.store{
    display: flex;
    .storePic{padding-right: 20px;}
}
</style>
