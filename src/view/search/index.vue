<template>
    <div class="search">
        <div class="serContent">            
            <h3 class="">ONEINFITECH</h3>
            <div class="searchCont">
                <input class="searchInp" type="text" v-model.trim="searchVal" placeholder="请输入关键字查询"  @keyup.enter="searchEvent"/>
                <button class="btnsearch" @click="searchEvent">搜索</button>
            </div>
            <ul class="hotSearch">
                <label>热门搜索：</label>
                <li v-for="item in hotData" @click="handlehotSearch(item)">{{item}}</li>
            </ul>
        </div>
        
    </div>
</template>

<script>
export default {
    data(){
        return{
            searchVal:'',
            hotData:['麦德龙','保时捷','索尼','赛默飞']
        }
    },
    methods:{
        searchEvent(){
            //查询成功跳转到map页面
            this.$router.push({name:'oneMap',params:{searchVal:this.searchVal}});
        },
        handlehotSearch(item){
            this.searchVal=item
            this.$router.push({name:'oneMap',params:{searchVal:this.searchVal}});
        }
    }
}
</script>

<style lang="scss" scoped>
.search{
    width: 100%;
    height: 100%;
    background: url(../../assets/searchbg.jpg) no-repeat;
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
    width: 15%;
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
