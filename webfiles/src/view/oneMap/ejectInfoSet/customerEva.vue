<template>
    <div class="customerEva" v-show="customerEvaShow">
        <div class="toolRight">
            <i class="iconfont icon-close" @click="handleCurrClose(1)"></i>  
        </div>
        <div class="eva-item comInfo">
            <img :src="customerData.img" />
            <img :src="customerData.imgLogo" />
        </div>
        <div class="eva-item jfscore" >
            <span class="name">交付评分</span>
            <label><span class="jfs-ite">4.9</span>/5.0</label>
        </div>
        <ul class="eva-item scoreInfo">
            <li v-for="item in customerData.scoreInfo">
                <label><span class="score-ite">{{item.score}}</span>/5.0</label>
                <p>{{item.name}}</p>
            </li>
        </ul>
        <ul class="eva-item">
            <li v-for="item in customerData.evaLabel" :class="[item.type && item.type==0 ? 'evalabel starRed':'evalabel ' ]">{{item.name}}</li>
        </ul>
        <ul class="eva-item">
            <li v-for="item in customerData.CourierInfo" class="courier">
                <div class="Pic">
                    <img :src="item.pic" />
                </div>
                <div class="persInfo">
                    <span class="pers-ite">{{item.name}}</span>
                    <span class="pers-ite">{{item.phone}}</span>
                    <span class="pers-ite"><span>{{item.comScore[0]}}</span>/<span>{{item.comScore[1]}}</span></span>
                    <span class="pers-ite"><span>{{item.proOrder[0]}}</span>/<span>{{item.proOrder[1]}}</span></span>
                    <span class="pers-ite">{{item.onlineTime}} 小时</span>
                </div>
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    data(){
        return{
            customerEvaShow:true,
            customerData:{
                img:require('../../../assets/w2.png'),
                imgLogo:require('../../../assets/w3.png'),
                scoreInfo:[
                    {name:'车辆到达',score:'4.8'},
                    {name:'货物状况',score:'4.9'},
                    {name:'专业操作',score:'5.0'},
                    {name:'文档交接',score:'4.9'}
                ],
                evaLabel:[{name:'经验老道'},{name:'线路熟悉'},{name:'自备工具'},{name:'沟通顺畅'},{name:'主动协助清理现场垃圾'},{type:'0',name:'字迹不清'},{type:'0',name:'车内不够整洁'}],
                CourierInfo:[
                    {
                        pic:require('../../../assets/c1.png'),
                        name:'陆师傅',
                        phone:'13946789927',
                        comScore:['4.9','5.0'],
                        proOrder:['58','892'],
                        onlineTime:'4321'
                    },
                    {
                        pic:require('../../../assets/c2.png'),
                        name:'乐师傅',
                        phone:'13527778126',
                        comScore:['4.8','5.0'],
                        proOrder:['79','892'],
                        onlineTime:'1013'
                    }

                ]
            }
        }
    },
    methods:{
        handleCurrClose(data){
            data==1 ? this.customerEvaShow=false : this.customerEvaShow=false
        }
    }
}
</script>

<style lang="scss" scoped>
.customerEva{
    width: 40%;
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
}
.eva-item{display: flex;flex-wrap: wrap;font-size: 14px;margin:15px 0;}
.evalabel{       
    padding: 5px 10px;
    background-color: $Cf3cc0c;
    border-radius: 3px;
    margin: 5px 5px 5px 0;
}
.comInfo{
    width: 80%;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
}
.starRed{
    background-color: #f3170c;
}
.courier{
    display: flex;
    flex: 1;
}
.persInfo{
    margin-left: 10px;
    .pers-ite{
        display: block;
        text-align: left;
    }
}
.jfscore{    
    margin: 10px auto;
    width: 50%;
    .name{font-size: 30px;}
    .jfs-ite{
        color: $Cf3cc0c;
        font-size: 35px;
        margin-left: 30px;
    }
    label{}
}
.scoreInfo{    
    display: flex;
    justify-content: space-between;
    .score-ite{
        color: $Cf3cc0c;
        font-size: 24px;
    }
    p{font-size: 18px;}
}
</style>

