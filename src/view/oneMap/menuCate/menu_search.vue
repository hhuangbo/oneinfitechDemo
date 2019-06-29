<template>
    <div class="menu-search">
        <input v-model.trim="searchV"/>
        <i class="iconfont icon-search"></i>
    </div>
</template>

<script>
export default {
    data(){
        return{
            searchV:''
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

