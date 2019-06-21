<template>
    <!-- 组件--普通列表 -->
    <ul class="tempMenu2">
        <li v-for="item in data" @click="level3Data(item)">{{item.title}}</li>
    </ul>
</template>

<script>

export default {
    props:[
        'data'
    ],
    mounted(){
    },
    methods:{
        level3Data(data){
            
        }
    }
}
</script>

<style lang="scss" scoped>
.tempMenu2{
    background-color:$C0d0e0f; 
    opacity: .8;
}
li{    
    color: #fff;
    text-align: center;
    font-size: 14px;
    height: 34px;line-height: 34px;
    cursor: pointer;
}
</style>
