<template>
    <div class="login">
        <div class="serContent">            
            <h3 class="">ONEINFITECH</h3>
            <div class="searchCont">
                <input class="searchInp" type="text" placeholder="请输入关键字查询"/>
                <button class="btnsearch" @click="searchEvent" @keyup.enter="searchEvent">搜索</button>
            </div>
            <ul class="hotSearch">
                <label>热门搜索：</label>
                <li v-for="item in hotData">{{item}}</li>
            </ul>
        </div>
        
    </div>
</template>

<script>
export default {
    data(){
        return{
            hotData:['麦德龙','保时捷','索尼','赛默飞']
        }
    },
    methods:{
        searchEvent(){
            console.log('啊啊啊啊')
            //查询成功跳转到map页面
            this.$router.push({path:'/oneMap'});
    
        }
    }
}
</script>

<style lang="scss" scoped>
$C0a2c9a:#0a2c9a;
.login{
    width: 100%;
    height: 100%;
    background: url(../../assets/loginbg.jpg) no-repeat;
    background-size: cover;
    position: absolute;
    top: 0;
    left: 0;
    h3{
        letter-spacing: 4px;
        color: $C0a2c9a; 
        font-style: italic;
        font-size: 36px;
        font-weight: 600;
        padding: 5px 0;
    }
}
.serContent{
    width: 45%;
    position: absolute;
    top: 50%;
    left: 50%;
    -webkit-transform: translate(-50%);
    transform: translate(-50%,-50%);
    
}
.searchCont{font-size: 12px;display: flex;}
.searchInp{
    width: 100%;
    background-color: #fff;
    border: none;
    padding: 10px 8px;
    border-radius: 5px;
}
.btnsearch{
    width: 10%;
    background-color: $C0a2c9a;
    color: #fff;
    padding: 10px;
    margin-left: 10px;
    border-radius: 5px;
    cursor: pointer;
}
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
