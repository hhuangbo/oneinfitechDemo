<template>
    <div class="menu-search">
        <input v-model.trim="searchV" @input="searchOrder" @keyup.enter="searchOrder" />
        <i class="iconfont icon-search" @click="searchOrder" ></i>
    </div>
</template>

<script>
import Util from '../../../common/js/util'
export default {
    props:['searchMenuData'],
    data(){
        return{
            searchV:'',
            searchMData:[],

            options: [],
            value: [],
            list: [],
            loading: false
        }
    },
    mounted(){
    },
    methods:{
        searchOrder(){
            var get_searchResult=Util.fuzzyQuery(this.searchMenuData,this.searchV)
            this.$emit('searchResult',get_searchResult)
        }
    }
}
</script>

<style lang="scss" scoped>
.menu-search{
    background-color: #3c3e40;
    text-align: center;
    position: relative;
    input{
        border: none;
        border-radius: 2px;
        padding: 2px 5px;
    }
    i{
        color: #ccc;
        position: absolute;
        right: 16px;
        top: 2px;
    }
}
</style>

