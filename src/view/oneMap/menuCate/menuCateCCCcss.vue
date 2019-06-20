<template>
<div class="menuCate">
    <ul class="ul1">
        <li v-for="(item,index) in menuList" :class="[active1==index ? 'li1  isOpened' :'li1']">
            <span @click="setTegel(item,index)" class="menu-name">
                {{item.title}}
                <i :class="[active1==index ? 'iconfont icon-e60b' : 'iconfont icon-eb38']"></i>
            </span>
            <transition>
                <ul class="ul2" v-if="item.level&&(active1 == index)">
                    <div v-if="item.type==3">
                        <menuType1 :data="item.level" :mType="item.type"/>
                    </div>
                    <div v-else>
                        <li v-for="(items,indexs) in item.level" :class="[active2 ==indexs &&item.type==2  ? 'li2 isOpened2' :'li2']">
                            <div class="menuItem"  @click="setTegel2(items,item.type,indexs)">
                                <span>{{items.title}}</span>
                                <span v-if="items.count">{{items.count}}</span>
                            </div> 
                            <menuType1  v-if="items.info&&(active2 == indexs)&&item.type==1" :data="items.info" :mType="item.type"/>
                            <menuType2 v-if="items.info&&(active2 == indexs)&&item.type==2" :data="items.info" />
                        </li>
                    </div>
                </ul>
            </transition>
        </li>
    </ul>
    <button class="enterWork" @click="enterWork">进入工作台</button>
</div>
</template>

<script>
import menuType1 from './menuType1'
import menuType2 from './menuTyp2'
export default {
    components:{
        menuType1,
        menuType2
    },
    data() {
        return {
            menuList: [],
            active1:-1,
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
            })
            .catch(err => {
            console.log(err);
            });
        },
        set_serviceCompValue(data){
        //     this.$parent.serviceInit(data)
            this.$parent.simplifierInit(data)
        },
        setTegel(item,index){//点击是地图展示所有省份的点聚合
            this.active1 = this.active1 == index?-1:index
            this.active2 = -1;
            this.$store.commit('set_wareDataInfo',{});
            this.$store.commit('set_menuActive',this.active1);
            console.log('哈哈哈',this.active1)
            if(item.type=='2'){//收获地址
                if( this.active1==1 && item.level){
                    this.$parent.secondLevelData(item,this.active1)
                }
            }
        },
        setTegel2(items,type,index){
            this.active2 = this.active2 == index?-1:index
            this.$store.commit('set_wareDataInfo',{})
            this.$store.commit('set_menuActive',this.active1);
            if(type=='2'){//收获地址
                this.$parent.Level3Data(items)
            }
        },
        enterWork(){//进入工作台 跳转
            alert('进入壹站工作台...')
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
    width: 150px;
    height:85%;
    overflow: hidden;
    z-index: 9;
    .ul1{
        max-height: 70%;
        overflow-y: auto;
    }
}

li{cursor: pointer;}
.li1{
    margin-bottom: 8px;
    line-height: 28px;
    .menu-name{
        background: #bfbfbf;
        color: #fff;
        display: block;
        padding: 0 10px;
        display: flex;
        justify-content: space-between;
    }
    .aaa::before{
        position: absolute;
        right: 12px;
        color: #fff;
    }
}
.ul2{
    // max-height: 200px;
    // overflow-y: auto;
}
// .collapse-transition{transition:height .3s ease-in-out,padding-top .3s ease-in-out,padding-bottom .3s ease-in-out}
// .collapse-transitions{transition:height .3s ease-in}

.isOpened{
    .menu-name{background-color: $C031f4a;}
    .menuItem{display: flex;}
    .li2 span{
        background-color: $C031f4a;
        opacity: .8;
        color: #fff;
        padding: 0 12px;
        display: block;
        flex:1
    }
}
.isOpened2{
    span{background-color: #9c0a0a !important;}
}
.ul3 .li3 span{
    color: blue
}
.ul3_1 .li3_1 span{
    color: #fff
}
.enterWork{
  width: 100%;
  padding: 10px;
  margin-top: 10px;
  border-radius: 5px;
  color: #fff;
  background: $C1075aa;
  cursor: pointer;
}
</style>
