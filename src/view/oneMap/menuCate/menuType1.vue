<template>
    <!-- 组件--普通列表 -->
    <div class="tempMenu1">
        <li v-for="(item,index) in data" :class="[ischecked==index ? 'ischecked' : '']"  @click="handleSelected(item,index,mType)">
             <span class="checkbox__label">{{item.title}}</span>
             <span class="checkbox-inner" ></span>
        </li>
    </div>
</template>

<script>
export default {
    props:[
        'data','mType'
    ],
    data(){
        return{
            ischecked:-1
        }
    },
    mounted(){
    },
    methods:{
        handleSelected(item,index,mType){
            this.ischecked=index
            switch(mType){
                case '1'://仓库地址
                    this.$store.commit('set_wareDataInfo',item)
                    break;
                case '3'://服务订单
                        this.$parent.set_serviceCompValue(item)
                    break;
            }
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
