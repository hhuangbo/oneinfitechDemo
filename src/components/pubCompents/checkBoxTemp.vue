<template>
    <ul class="checkBoxTemp">
        <li v-for="(item,index) in data" 
        :class="[ischecked==index ?  'ischecked' : '']"  
        @click="handleSelected(item,index,mType)">
             <span class="checkbox__label">{{item.title}}</span>
             <span class="checkbox-inner" ></span>
        </li>
    </ul>
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
        this.init()
    },
    methods:{
        init(){
            if(this.mType.type && this.mType.type==6){//服务订单
                this.ischecked=0;
                this.$store.commit('set_serviceCompVal',this.data[0])
            }
        },
        handleSelected(item,index){
            this.ischecked = this.ischecked == index?-1:index
            if(this.mType.type && this.mType.type==6){//服务订单
                this.$store.commit('set_serviceCompVal',item)
                return ;
            }
                this.$store.commit('set_wareDataInfo',item)
           
        }
    }
}
</script>

<style lang="scss" scoped>
.checkBoxTemp{
    min-width: 140px;
    li{   
        height: 34px;
        line-height: 34px;
        border-radius: 5px;
        margin: 5px 10px;
        display: flex;
        justify-content: space-between;
    }
}
</style>

