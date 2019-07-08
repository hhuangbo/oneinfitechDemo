<template>
    <ul class="tempMenu1">
        <li v-for="(item,index) in wareCond" 
        :class="[ischecked==index ?  'ischecked' : '']"  
        @click="handleSelected(item,index)">
             <span class="checkbox__label">{{item.title}}</span>
             <span class="checkbox-inner" ></span>
        </li>
    </ul>
</template>

<script>
export default {
    props:[
        'data'
    ],
    data(){
        return{
            wareCond:[
                {
                    "level_type": "1",
                    "title": "仓库照片"
                },
                {
                    "level_type": "2",
                    "title": "基本信息"
                },
                {
                    "level_type": "3",
                    "title": "实时监控"
                }
            ],
            ischecked:-1
        }
    },
    mounted(){
        this.init()
    },
    methods:{
        init(){
        },
        handleSelected(item,index){
            this.ischecked=index
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
