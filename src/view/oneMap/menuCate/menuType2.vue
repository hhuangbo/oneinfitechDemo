<template>
    <!-- 组件--普通列表 -->
    <ul class="tempMenu2">
        <li v-for="(item,index) in data" @click="level3Data(item,index)" :class="[active3 == index ? 'isOpened3' : ''] "><span>{{item.title}}</span><span>{{item.addressInfo.length}}</span></li>
    </ul>
</template>

<script>

export default {
    props:[
        'data'
    ],
    data(){
        return{
            'active3':-1
        }
    },
    mounted(){
    },
    methods:{
        level3Data(data,index){
            this.active3 = this.active3 == index ? -1 : index;
            // this.$parent.set_level3Data(data)
            this.$store.commit('set_level3Data',data)
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
    width: 40%;
    margin: 0 auto;
    color: #fff;
    text-align: center;
    font-size: 12px;
    height: 34px;line-height: 34px;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
}
.isOpened3{
    color: $Cfe6a01;
}
</style>
