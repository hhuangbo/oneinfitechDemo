<template>
    <div class="warehInfo">
        <div class="park parkLayOut" >
            <div class="wareHead">
                <label>{{parkLayOut.title}}</label>
                <div class="toolRight">
                    <i class="iconfont icon-e60b"></i>  
                    <i class="iconfont icon-close" @click="handleCurrClose()"></i>  
                </div>
            </div>
            <div class="cont">
                <ul>
                    <li v-for="item in parkLayOut.areaInfo">
                        <span>{{item.name}}：</span><span>{{item.area}}</span>
                    </li>
                </ul>
            </div>
        </div>
        <div class=" park parkSet">
            <div class="wareHead">
                <label>{{parkSet.title}}</label>
                <div class="toolRight">
                    <i class="iconfont icon-e60b"></i>  
                    <i class="iconfont icon-close" @click="handleCurrClose"></i>  
                </div>
            </div>
            <ul class="cont">
                <li v-for="(item,index) in parkSet.info" :class="[ischecked==index ? 'ischecked iconfont ' + item.icon : 'iconfont ' + item.icon]">
                    <span class="des">{{item.title}}</span>
                    <span class="checkbox-inner" @click="handleChecked(item,index)"></span>
                    <!-- <el-checkbox  @change="handleChecked">{{item.title}}</el-checkbox> -->
                </li>
                <li class="moreSet" @click="handleMoreSet"><span>...更多配置...</span></li>
            </ul>
        </div>
    </div>
</template>

<script>
export default {
    data(){
        return{
            ischecked:0,
            parkLayOut:{
                title:'园区布局',
                info:[
                    {img:'s'},
                ],
                areaInfo:[
                    {name:'园区总面积',area:'76,982m²'},
                    {name:'总建筑面积',area:'40,305m²'},
                    {name:'1#单层仓库',area:'22.263m²'},
                    {name:'2#单层仓库',area:'17,645m²'},
                    {name:'3#综合楼',area:'1,523.6m²'},
                    {name:'4#设备房',area:'874.4m²'}
                ]
            },
            parkSet:{
                title:'园区布局',
                info:[
                {icon:'icon-e68f',title:'2H应急照明灯'},
                {icon:'icon-e790',title:'24H监控全覆盖'},
                {icon:'icon-e600',title:'火灾报警系统'},
                {icon:'icon-e602',title:'备用柴油发电机'},
                {icon:'icon-e62c',title:'数字化运营看板'},
            ]}
        }
    },
    methods:{
        handleChecked(item,index){
            this.ischecked=index;//点击选中当前项
        },
        handleCurrClose(){//关闭当前窗口

        },
        handleMoreSet(){//更多配置

        }
    }
}
</script>

<style lang="scss" scoped>
.warehInfo{
    width: 25%;
    position: absolute;
    right: 0;
    top: 50px;
    color: #fff;
}
.wareHead{
    display: flex;
    justify-content: space-between;
    text-align: center;
    font-size: 14px;
    label,.toolRight i{
        background-color: $C031f4a;
        border-radius: 3px;
    }
    label{
        padding:5px 8px;
    }
    .toolRight i{
        padding: 5px;
        cursor: pointer;
    }
}
.parkLayOut{
    .cont{
        background-color: $C031f4a;
        font-size: 12px;
        margin: 5px 0;
        padding: 5px;
        border-radius: 3px;
    }
    ul{
        display: flex;
        justify-content: space-around;
        flex-wrap: wrap;
    }
    li{padding: 2px 10px;span{text-align: left;}}
}
.parkSet{
    
    ul{width: 70%;}
    li{
        background-color: $C031f4a;
        border-radius: 3px;
        margin: 5px 0;
        color: #fff;
        height: 30px;
        display: flex;
        line-height: 30px;
        justify-content: space-between;
        padding: 1px 1px 1px 5px;
        .des{font-size: 12px;}
    }
}
.moreSet{
    height: 20px !important;
    line-height: 20px !important;
    font-size: 12px;
    cursor: pointer;
    span{margin: 0 auto;}
}
</style>
