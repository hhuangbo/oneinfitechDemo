<template>
    <ul class="menuCate">
        <li v-for="(item,index) in menuList" :class="[active1==index ? 'li1 isOpened' :'li1']">
            <span @click="setTegel(item,index)" class="menu-name">
                {{item.title}}
            </span>
            <ul class="ul2" v-if="item.level&&(active1 == index)">
                <li v-for="(items,indexs) in item.level" :class="[active2 ==indexs &&item.type==2  ? 'li2 isOpened2' :'li2']">
                    <div class="menuItem"  @click="setTegel2(items,indexs)">
                        <span>{{items.title}}</span>
                        <span v-if="items.count">{{items.count}}</span>
                    </div> 
                    <tempMenu1  v-if="items.info&&(active2 == indexs)&&item.type==1" :data="items.info"></tempMenu1>
                    <tempMenu2 v-if="items.info&&(active2 == indexs)&&item.type==2" :data="items.info"></tempMenu2>
                </li>
            </ul>
        </li>
    </ul>
</template>

<script>
import tempMenu1 from './menuType1'
import tempMenu2 from './menuTyp2'
export default {
    components:{
        tempMenu1,
        tempMenu2
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
            })
            .catch(err => {
            console.log(err);
            });
        },
        setTegel(item,index){//点击是地图展示所有省份的点聚合
            this.active1 = this.active1 == index?-1:index
            this.active2 = -1
            if( this.active1==1 && item.level){
                this.$parent.secondLevelData(item.level)
            }
            
        },
        setTegel2(items,index){
            this.active2 = this.active2 == index?-1:index
            this.$parent.secondLevelData(items)
        }
    }
};
</script>

<style lang="scss" scoped>
li{cursor: pointer;}
.li1{
    margin-bottom: 8px;
    line-height: 28px;
    .menu-name{
        background: #bfbfbf;
        color: #fff;
        display: block;
        padding: 0 10px;
    }
}
.isOpened{
    .menu-name{background-color: $C1075aa;}
    .menuItem{display: flex;}
    .li2 span{
        background-color: $C1075aa;
        opacity: .5;
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
</style>
