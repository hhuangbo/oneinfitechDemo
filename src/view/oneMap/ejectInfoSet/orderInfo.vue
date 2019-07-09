<template>
    <div class="orderInfo" v-show="orderShow">
        <div class="toolRight">
            <i class="iconfont icon-close" @click="handleCurrClose(1)"></i>  
        </div>
        <div>
            <label class="title">装车清单</label>
            <div class="orderCont">
                <!-- 运单编号
                起点地址
                终点地址
                订单生效日期
                车牌号
                挂车号
                类型
                托盘码
                箱数
                体积
                重量 -->
                <ul class="orderT">
                    <li v-for="item in orderTData">
                        <label>{{item.name}}：</label>
                        <span>{{item.value}}</span>
                    </li>
                </ul>
                <ul class="orderTable orderThead">
                    <li class="th" v-for="item_th in orderTh">{{item_th}}</li>
                </ul>
                <ul class="orderTable orderTabCont"  v-for="item_tr in orderTr">
                    <li class="tr">{{item_tr.type}}</li>
                    <li class="tr">{{item_tr.tpNum}}</li>
                    <li class="tr">{{item_tr.boxNum}}</li>
                    <li class="tr">{{item_tr.volume}}</li>
                    <li class="tr">{{item_tr.weight}}</li>
                </ul>
            </div>
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
            orderShow:true,
            orderTData:[
                {name:'运单编号',value:'00000000000001'},
                {name:'起点地址',value:'00000000000001'},
                {name:'终点地址',value:'00000000000001'},
                {name:'订单生效日期',value:'00000000000001'},
                {name:'车牌号',value:'00000000000001'},
                {name:'挂车号',value:'00000000000001'}
            ],
            orderTh:['类型','托盘码','箱数','体积','重量'],
            orderTr:[
                {type:'AAAA',tpNum:'A00000001',boxNum:'20',volume:'0.04',weight:21},
                {type:'BBBB',tpNum:'B00000001',boxNum:'20',volume:'0.04',weight:21},
                {type:'CCCC',tpNum:'C00000001',boxNum:'20',volume:'0.04',weight:21},
                {type:'DDDD',tpNum:'D00000001',boxNum:'20',volume:'0.04',weight:21},
                {type:'EEEE',tpNum:'E00000001',boxNum:'20',volume:'0.04',weight:21},
                {type:'FFFF',tpNum:'F00000001',boxNum:'20',volume:'0.04',weight:21},
                {type:'GGGG',tpNum:'GA00000001',boxNum:'20',volume:'0.04',weight:21},
            ]
        }
    },
    methods:{
        handleCurrClose(data){
            data==1?this.orderShow=false : this.orderShow=false
        }
    }
}
</script>

<style lang="scss" scoped>
.orderInfo{
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
    label.title{
        font-size: 18px;
        display: inline-block;
        padding-bottom: 10px;
        letter-spacing: 4px;
    }
    
}
.orderCont{
    background-color: #fff;
    color: #333;
    padding: 10px;
}
.orderT{
    display: flex;
    flex-wrap: wrap;    
    font-size: 14px;
    margin-bottom: 15px;
    li{
        line-height: 30px;
    }
}
.orderTable{
    display: flex;
    justify-content: space-between;
    li{
        height:25px;line-height:25px;flex:1;
    }
}
.orderThead{
    background-color: #cecece;
}
.orderTabCont{
    &:hover{background-color:#fff;}
    &:nth-of-type(odd){ background:#e6e6e6;}
    &:nth-of-type(even){ background:#efefef;}
}
</style>

