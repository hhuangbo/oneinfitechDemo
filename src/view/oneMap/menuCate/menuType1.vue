<template>
    <!-- 组件--普通列表 -->
    <div class="tempMenu1">
        <li v-for="(item,index) in data" 
        :class="[ischecked==index ?  'ischecked' : '']"  
        @click="handleSelected(item,index,mType)">
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
        this.init()
    },
    methods:{
        init(){
            if(this.mType.type==6){//服务订单
                this.ischecked=0;
                this.$store.commit('set_serviceCompVal',this.data[0])
            }
        },
        handleSelected(item,index,mType){
            this.ischecked=index
            switch(mType.type){
                case '4'://仓库信息
                    this.$store.commit('set_wareDataInfo',item)
                    break;
                case '6'://服务订单
                    // this.$parent.set_serviceCompVal(item)
                    this.$store.commit('set_serviceCompVal',item)
                    break;
            }
        }
    }
}
</script>

<style lang="scss" scoped>
li{   height: 34px;line-height: 34px;
    border-radius: 5px;
    margin: 5px 10px;
    display: flex;
    justify-content: space-between;
    
}


</style>
