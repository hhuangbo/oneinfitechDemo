<template>
    <div class="header">
        <div class="logo">
            <img src="../../assets/logo.png"/>
        </div>
        <ul class="headRight">
            <li>登录</li>
            <li class="iconfont icon-pic"></li>
            <li class="iconfont icon-menu"></li>
        </ul>
    </div>
</template>

<script>
export default {

}
</script>

<style lang="scss" scoped>
.header{    
    width: 100%;
    height: 45px;
    line-height: 45px;
    background-color: rgba(0, 0, 0, 0.65);
    padding: 0 4%;
    box-sizing: border-box;
    z-index: 9;
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    justify-content: space-between;
}
.logo{
    width: 10%;
    padding: .5% 0;
    vertical-align: middle;
    img{width: 100%;}
}
.headRight{
    color: #fff;
    display: flex;
    font-size: 14px;
    li{
        padding:0 5px;
        cursor: pointer;
    }
}
</style>
