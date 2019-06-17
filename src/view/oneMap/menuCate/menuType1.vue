<template>
    <!-- 组件--普通列表 -->
    <div class="tempMenu1">
        <li v-for="(item,index) in data" :class="[ischecked==index ? 'ischecked' : '']">
             <span class="checkbox__label">{{item.title}}</span>
             <span class="checkbox-inner"  @click="handleSelected(item,index)"></span>
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
        handleSelected(item,index){
            this.ischecked=index
            switch(item.type){
                case'1'://仓库照片
                    this.$store.commit('set_photoInfo',item)
                    break;
                case'2'://基本信息
                    this.$store.commit('set_photoInfo',item)
                    break;
                case'3'://实施监控
                    this.$store.commit('set_photoInfo',item)
            }
            // console.log(item)
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


</style>
