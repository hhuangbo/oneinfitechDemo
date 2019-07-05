<template>
    <div class="search">
        <div class="serContent">            
            <h3 class="">ONEINFITECH</h3>
            <div class="searchCont">
                <!-- <el-select v-model="selectValue" placeholder="请选择">
                    <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.value"
                    :value="item.value">
                    </el-option>
                </el-select> -->
                <input class="searchInp" type="text"  placeholder="项目检索  麦德龙" v-model.trim="searchVal" @keyup.enter="searchEvent"/>
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
            hotData:['麦德龙','保时捷','索尼','赛默飞'],
            options:[{
                value: '项目检索'
            },{
                value: '干线路线'
            },{
                value: '收货地址'
            },{
                value: '服务订单'
            }],
            selectValue:''
        }
    },
    methods:{
        searchEvent(){
            //查询成功跳转到map页面
            if(this.searchVal==''){
                this.$notify.error({
                title: '提示',
                message: '输入有误,无法匹配！'
                });
                return;
            }
            this.$router.push({path:'oneMap',query:{selectType:this.selectValue,searchVal:this.searchVal}});
        },
        handlehotSearch(item){
            this.searchVal=item
            this.$router.push({path:'oneMap',query:{selectType:this.selectValue,searchVal:this.searchVal}});
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
        font-size: 40px;
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
    border-left: 1px solid #f3e6e6;
    border-radius: 4px;
    // border-radius: 0 4px 4px 0;
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
