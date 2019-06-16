<template>
    <!-- 组件--普通列表 -->
    <div class="tempMenu1">
        <li v-for="(item,index) in data" :class="[ischecked==index ? 'ischecked' : '']">
             <!-- <el-radio v-model="ischecked" :label="index" >{{item.title}}</el-radio> -->
             <span class="checkbox__label">{{item.title}}</span>
             <span class="checkbox-inner"  @click="handleCheckedCitiesChange(index)"></span>
            <!-- <el-checkbox :label="item" :key="index"  @change="handleCheckedCitiesChange">{{item.title}}</el-checkbox> -->
            <!-- <el-checkbox :label="item.title"border></el-checkbox> -->
        </li>
    </div>
</template>

<script>
export default {
    props:[
        'data'
    ],
    data(){
        return{
            ischecked:0
        }
    },
    mounted(){
    },
    methods:{
        handleCheckedCitiesChange(index){
            this.ischecked=index
        }
    }
}
</script>

<style lang="scss" scoped>
li{   
    border-radius: 5px;
    margin: 5px 10px;
    display: flex;
    justify-content: space-between;
}
.checkbox__label{border: 1px solid #1075aa;
    background-color: #fff;
    border-radius: 5px;
    padding: 5px 10px;
    display: inline-block;
    line-height: 19px;
    font-size: 14px;
}
.checkbox-inner{
    display: inline-block;
    position: relative;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    width: 30px;
    height: 30px;
    border-radius: 5px;
    margin-left: 5px;
    border: 1px solid #1075aa;
    background-color: #FFF;
    z-index: 1;
    position: relative;
    -webkit-transition: border-color .25s cubic-bezier(.71,-.46,.29,1.46),background-color .25s cubic-bezier(.71,-.46,.29,1.46);
    transition: border-color .25s cubic-bezier(.71,-.46,.29,1.46),background-color .25s cubic-bezier(.71,-.46,.29,1.46);
}
.ischecked .checkbox-inner::after{
    -webkit-box-sizing: content-box;
    box-sizing: content-box;
    content: "";
    position: absolute;
    border: 2px solid $C1075aa;
    border-left: 0;
    border-top: 0;
    height: 12px;
    width: 5px;
    left:12px;
    top: 6px;
    -webkit-transform: rotate(45deg) scaleY(0);
    transform: rotate(45deg) scaleY(0);
    -webkit-transform: rotate(45deg) scaleY(1);
    transform: rotate(45deg) scaleY(1);
    -webkit-transition: -webkit-transform .15s ease-in .05s;
    transition: -webkit-transform .15s ease-in .05s;
    transition: transform .15s ease-in .05s;
    transition: transform .15s ease-in .05s, -webkit-transform .15s ease-in .05s;
    transition: transform .15s ease-in .05s,-webkit-transform .15s ease-in .05s;
    -webkit-transform-origin: center;
    transform-origin: center;
}
</style>
