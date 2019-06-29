<template>
<div class="menuCate">
    <ul class="ul1">
        <!-- <li  class="li1  isOpened">
            <span data-v-2eed9d99="" class="menu-name">项目检索<i data-v-2eed9d99="" class="iconfont icon-e60b"></i></span> 
            <ul data-v-2eed9d99="" class="ul2">
                <li data-v-2eed9d99="" class="li2">
                    <div data-v-2eed9d99="" class="menuItem"><span data-v-2eed9d99="">麦德龙</span> </div>
                </li>
            </ul>
        </li> -->
        <li v-for="(item,index) in menuList" :class="[active1==index ? 'li1  isOpened' :'li1']">
            <span @click="setTegel(item,index)" class="menu-name">
                {{item.title}}
                <i :class="[active1==index ? 'iconfont icon-e60b' : 'iconfont icon-eb38']"></i>
            </span>
            <!-- <transition> -->
                <ul class="ul2" v-if="item.level&&(active1 == index)">
                    <!-- <div v-if="item.type==3">
                        <menuType1 :data="item.level" :mType="item.type"/>
                    </div>
                    <div v-else> -->
                        <menuSearch v-if="item.type == 3 || item.type ==4"></menuSearch>
                        <li v-for="(items,indexs) in item.level" 
                            :class="[active2 ==indexs   ? 'li2 isOpened2' :'li2']">
                            <div class="menuItem"  @click="setTegel2(items,item.type,indexs)">
                                <span>{{items.title}}</span>
                                <span v-if="items.count">{{items.count}}</span>
                            </div> 
                            <menuType1  v-if="items.info&&(active2 == indexs)&& (item.type==1 || item.type==3)" :data="items.info" :mType="item"/>
                            <menuType2 v-if="items.info&&(active2 == indexs)&&item.type==2" :data="items.info" />
                        </li>
                    <!-- </div> -->
                </ul>
            <!-- </transition> -->
        </li>
    </ul>
    <button class="enterWork" @click="enterWork">进入工作台</button>
</div>
</template>

<script>
import menuType1 from './menuType1'
import menuType2 from './menuTyp2'
import menuSearch from './menu_search'
export default {
    components:{
        menuType1,
        menuType2,
        menuSearch
    },
    data() {
        return {
            menuList: [],
            active1:0,
            active2:-1
        };
    },
    mounted() {
        this.init();
    },
    methods:{
        init() {
            //初始控制台
            var _this = this;
            
            this.$http.get("../../static/json/menuCate.json")
                .then(res => {
                this.menuList = res.data.menuList;
                //默认展开收获地址
                    this.$parent.secondLevelData(this.menuList[2],this.active1)
                })
                .catch(err => {
                console.log(err);
                });
        },
        setTegel(item,index){//点击是地图展示所有省份的点聚合
            this.active1 = this.active1 == index?-1:index
            this.active2 = -1;
            
            this.$store.commit('set_wareDataInfo',{});
            this.$store.commit('set_menuActive',this.active1);
            if(item.type=='2' && item.title=='收货地址'){//收获地址
                // if( this.active1==1 && item.level){
                    this.$parent.secondLevelData(item,this.active1)
                // }
            }
            if(item.type=='3' && item.title=='干线路线'){
                this.$parent.trunkLineInit(item)
            }
        },
        setTegel2(items,type,index){
            this.active2 = this.active2 == index?-1:index
            this.$store.commit('set_wareDataInfo',{})
            this.$store.commit('set_menuActive',this.active1);
            console.log(items,type)
            this.$store.commit('set_searchTermData',items);
            if(type=='2'){//收获地址
                this.$parent.Level2Data(items)
            }
            if(items.title.indexOf('上海') !=-1){this.$parent.singleRoute(items);return;}
        },
        enterWork(){//进入工作台 跳转
            this.$alert('进入壹站工作台...', '提示', {
                confirmButtonText: '确定'
            });
        },
        set_level3Data(data){
            this.$parent.level3Data(data)
        },
        set_serviceCompValue(data){//交付轨迹
            this.$parent.simplifierInit(data)
        },
        set_orderInfoVal(data){//订单信息
            this.$parent.orderInfoVal(data)
        }
    }
};
</script>

<style lang="scss" scoped>
//菜单分类 css
.menuCate{
    position: absolute;
    top: 50px;
    left: 4%;    
    width: 180px;
    height:85%;
    overflow: hidden;
    z-index: 9;
    .ul1{
        max-height: 70%;
        overflow: auto;
        box-shadow: 0 2px 6px rgba(0,0,0,0.12);
        background-color: #fff;
        border-radius: 3px;
    }
    .iconfont{font-size: 12px;}
}

li{cursor: pointer;line-height: 34px;}
.li1{
    margin-bottom: 5px;
    line-height: 34px;
    .menu-name{
        background: #fff;
        color: #565656;
        display: block;
        font-size: 12px;
        padding: 0 10px 0 20px;
        display: flex;
        justify-content: space-between;
    }
}
.isOpened{
    .menu-name{background-color: $C0d0e0f;color: #fff;}
    .menuItem{display: flex;}
    .li2 span{
        background-color: $C0d0e0f;
        opacity: .8;
        color: #fff;
        display: block;
        flex:1;
        font-size: 12px;
        &:first-child{padding-left:40px;}
    }
}
.isOpened2{
    span{
        font-size: 14px !important;
        color: #fe6a01 !important;
        background-color: #000 !important;
        &:first-child{border-left: 4px solid red;}
    }
}
.ul3 .li3 span{
    color: blue
}
.ul3_1 .li3_1 span{
    color: #fff
}
.enterWork{
  width: 100%;
  padding: 5px 10px;
  margin-top: 10px;
  border-radius: 3px;
  color: #fff;
  font-size: 12px;
  background: $C1a1e20;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.12);
  cursor: pointer;
}
</style>
