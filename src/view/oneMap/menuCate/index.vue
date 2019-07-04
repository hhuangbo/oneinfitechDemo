<template>
<div class="menu-pane">
    <div :class="[paneisShow ? 'menuCate animated h-anim-slideInLeft' : 'menuCate animated h-anim-slideOutLeft pane-isShow']">
        <ul class="ul1">
            <li v-for="(item,index) in menuList" :class="[active1==index ? 'li1  isOpened' :'li1']">
                <span @click="setTegel(item,index)" class="menu-name">
                    {{item.title}}
                    <i :class="[active1==index ? 'iconfont icon-e60b' : 'iconfont icon-eb38']"></i>
                </span>
                    <el-collapse-transition>
                    <div class="ul2 " v-if="item.level&&(active1 == index)">
                            <menuSearch v-if="item.type == 6 || item.type ==8|| item.type ==9" :searchMenuData="item.level" @searchResult="searchResult"></menuSearch>
                            <transition-group
                            name="staggered-fade" 
                            tag="ul"
                            v-bind:css="false"
                            v-on:before-enter="beforeEnter"
                            v-on:enter="enter"
                            v-on:leave="leave">
                            
                            <li v-for="(items,indexs) in itemlevel"  v-bind:key="items.title" v-bind:data-index="indexs"
                                :class="[active2 ==indexs   ? 'li2 isOpened2' :'li2']" >
                                <div class="menuItem"  >
                                    <span @click="setTegel2(items,item,indexs)">{{items.title}}</span>
                                    <span v-if="items.count">{{items.count}}</span>
                                    <i :class="[LinkageActive==indexs ? 'iconfont icon-linkage linkage LinkageActive' : 'iconfont icon-linkage linkage ']" 
                                    @click="handleLinkage(items,item,indexs)" title="联动"></i>
                                </div> 
                                <el-collapse-transition>
                                    <menuType1  v-if="items.info&&(active2 == indexs)&& (item.type==4 || item.type==6)" :data="items.info" :mType="item"/>
                                    <menuType2 v-if="items.info&&(active2 == indexs)&&item.type==3" :data="items.info" />         
                                </el-collapse-transition>
                            </li>
                        </transition-group>
                    </div>
                    </el-collapse-transition>
            </li>
        </ul>
        <button class="enterWork" @click="enterWork">进入工作台</button>
        <button :class="[paneisShow ? 'toggle-button' : 'toggle-button toggle-btnclose']" @click="handlePane_isShow"><!--折叠面板--></button>
    </div>
</div>
</template>

<script>
import menuType1 from './menuType1'
import menuType2 from './menuTyp2'
import menuSearch from './menu_search'

import {mapGetters} from 'vuex'
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
            active2:-1,
            searchRData:[],
            
            itemlevel:[],
            LinkageActive:-1,
            paneisShow:true//折叠面板
        };
    },
    watch:{
    },
    computed:{
        // ...mapGetters(['menuInit'])
        // itemlevel(){
        //     return this.menuList.level
        // }
    },
    mounted() {
        // this.menuList=this.$store.dispatch("get_menuData"); 
        this.init();
    },
    methods:{
        init() {
            //初始控制台
            var _this = this;
            //  _this.menuList = _this.menuInit.menuList;
            // console.log(_this.menuList)
                //默认展开收获地址
            // this.$parent.secondLevelData(_this.menuList[2],this.active1)
            this.$http.get("../../static/json/menuCate.json")
                .then(res => {
                    this.menuList = res.data.menuList;
                    this.itemlevel=this.menuList[0].level//第一个菜单展开
                    let items=res.data.menuList[0].level[0],item=res.data.menuList[0]//type=res.data.menuList[0].type
                    this.$store.commit('set_searchTermData',{items,item})
                //默认展开收获地址聚合点
                    this.$parent.secondLevelData(this.menuList[2],this.active1)
                })
                .catch(err => {
                console.log(err);
                });
        },
        setTegel(item,index){//点击是地图展示所有省份的点聚合
            this.active1 = this.active1 == index?-1:index
            this.active2 = -1;
            this.LinkageActive=-1;
            
            this.itemlevel=item.level

            this.$store.commit('set_wareDataInfo',{});
            this.$store.commit('set_serviceCompVal',{});
            this.$store.commit('set_menuActive',this.active1);
            if(item.type=='3'){//收获地址
                this.$parent.secondLevelData(item,this.active1)
            }
            if(item.type=='13' ){//干线路线
                this.$parent.trunkLineInit(item)
            }
        },
        setTegel2(items,item,index){
            this.active2 = this.active2 == index?-1:index
            this.$store.commit('set_wareDataInfo',{})
            this.$store.commit('set_serviceCompVal',{});
            this.$store.commit('set_menuActive',this.active1);
            if(item.type=='3'){//收获地址
                this.$parent.Level2Data(items)
            }
            if(items.title.indexOf('上海') !=-1){this.$parent.singleRoute(items);return;}
        },
        handleLinkage(items,item,indexs){
            this.LinkageActive=this.LinkageActive==indexs ? -1 : indexs;
            let type=item.type;
            this.$store.commit('set_searchTermData',{items,item})
        },
        enterWork(){//进入工作台 跳转
            this.$alert('进入壹站工作台...', '提示', {
                confirmButtonText: '确定'
            });
        },
        // set_level3Data(data){
        //     this.$parent.setlevel3Data(data)
        // },
        // set_serviceCompVal(data){//交付轨迹
        //     this.$parent.simplifierInit(data)
        // },
        searchResult(val){
            this.itemlevel=val
            this.active2=-1;
        },
        handlePane_isShow(){
            this.paneisShow ? this.paneisShow=false : this.paneisShow=true
            this.$store.commit('set_paneisShow',this.paneisShow)
        },

        beforeEnter: function (el) {
            el.style.opacity = 0
            el.style.height = 0
        },
        enter: function (el, done) {
            var delay = el.dataset.index * 150
            setTimeout(function () {
                Velocity(
                el,
                { opacity: 1, height: '34px' },
                { complete: done }
                )
            }, delay)
        },
        leave: function (el, done) {
            var delay = el.dataset.index * 150
            setTimeout(function () {
                Velocity(
                el,
                { opacity: 0, height: 0 },
                { complete: done }
                )
            }, delay)
        }
    }
};
</script>

<style lang="scss" scoped>
//菜单分类 css
.menu-pane{
    position: absolute;
    top: 20px;
    left: 1%;    
}
.menuCate{
    width: 180px;
    height:85%;
    // overflow: hidden;
    position: relative;
    z-index: 9;
    .ul1{
        max-height: 70%;
        overflow: auto;
        box-shadow: 0 2px 6px rgba(0,0,0,0.12);
        background-color: #fff;
        border-radius: 3px 0 3px 3px;
    }
    .iconfont{font-size: 12px;}
}
.pane-isShow{
    -webkit-transform: translateX(-200px);
    transform: translateX(-200px)
}
.toggle-btnclose{
    -webkit-transform: scaleX(-1);
    transform: scaleX(-1);
}
.toggle-button{
    width: 23px;
    height: 48px;
    background: rgba(255,255,255,0.9) url('../../../assets/togglebtn.png') 7px center/7px 10px no-repeat;
    border-left: 1px solid #f7f7f7;
    box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.3);    
    position: absolute;
    top: 0px;
    right: -23px;
    z-index:-1;
    cursor: pointer;
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
    
}
.menuItem{display: flex;}
.li2{height: auto !important;}
.li2 span{
    background-color: $C0d0e0f;
    opacity: .8;
    color: #fff;
    display: block;
    flex:1;
    font-size: 12px;
    &:first-child{padding-left:40px;}
}
.linkage{
    color: #fff;
    background-color: #3d3e3f;
    width: 12%;
}
.LinkageActive{color: $Cfe6a01;}
.isOpened2{  
    height: auto !important;
    // border-bottom: 1px solid #f5f5f5;
    span{
        font-size: 14px !important;
        color: $Cfe6a01 !important;
        background-color: #000 !important;
        &:first-child{border-left: 4px solid red;}
    }
    .linkage{background-color:#333;}
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

.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
