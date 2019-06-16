<template>
    <!-- 组件--普通列表 -->
    <div class="tempMenu1">
        <li v-for="(item,index) in data">
            <el-checkbox :label="item" :key="index"  @change="handleCheckedCitiesChange">{{item.title}}</el-checkbox>
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
            ischecked:false
        }
    },
    mounted(){
    },
    methods:{
        handleCheckedCitiesChange(){}
    }
}
</script>

<style lang="scss" scoped>
li{   
    border-radius: 5px;
    margin: 5px 10px;}
</style>
