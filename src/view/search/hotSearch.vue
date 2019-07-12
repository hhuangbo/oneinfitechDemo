<template>
    <ul class="hotSearch">
        <label>热门搜索：</label>
        <li v-for="item in hotData" @click="handlehotSearch(item)">{{item}}</li>
    </ul>
</template>

<script>
export default {
    data(){
        return{
            hotData:['麦德龙','保时捷','索尼','赛默飞'],
            searchVal:''
        }
    },
    methods:{
        handlehotSearch(item){
            this.searchVal=item
            this.$router.push({path:'oneMap',query:{searchVal:this.searchVal}});
        }
    }
}
</script>

<style lang="scss" scoped>
.hotSearch{
    font-size: 12px;
    color: #fff;
    display: flex;
    padding: 8px 0;
    li{
        padding: 0 5px;
        cursor: pointer;
    }

}
</style>

