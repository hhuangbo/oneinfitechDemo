<template>
  <div class="menuCate">
    <el-menu
      :unique-opened="true"
      text-color="#fff"
      active-text-color="#fff"
      >
        <el-submenu :index="String((indexs+1))" class="submenu1" v-for="(item,indexs) in menuList"  :key="(indexs+1)">
            <template slot="title">
                <span>{{item.title}}</span>
            </template>
            <el-submenu v-for="(tlevel,tindex) in item.level" :key="(tindex+1)"
                :index="String([(indexs+1)+'-'+(tindex+1)])" >
              <template slot="title"  @click="handleMenuItem(tlevel)">{{tlevel.title}}</template>
              <!-- <el-menu-item v-for="(tinfo,Ind) in tlevel.info" :key="(Ind+1)"
                :index="String([(indexs+1)+'-'+(tindex+1) +'-'+ (Ind+1)])"> -->
                <tempMenu1 class="class1" v-if="item.type==1" :data="tlevel.info"></tempMenu1>
                <tempMenu2 class="class2" v-if="item.type==2" :data="tlevel.info"></tempMenu2>
              <!-- </el-menu-item> -->
            </el-submenu>
        </el-submenu>
    </el-menu>
    <button class="enterWork" @click="enterWork">进入工作台</button>
  </div>
</template>

<script>
import tempMenu1 from '../../../components/menuType/tempMenu1'
import tempMenu2 from '../../../components/menuType/tempMenu2'
export default {
  components:{
    tempMenu1,
    tempMenu2
  },
  data() {
    return {
      menuList: []
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      //初始控制台
      var _this = this;
      this.$http
        .get("../../static/json/menuCate.json")
        .then(res => {
          this.menuList = res.data.menuList;
        })
        .catch(err => {
          console.log(err);
        });
    },
    handleMenuItem(data){
      this.$emit('menuInfo',data)
    },
    enterWork(){//进入工作台 跳转
    }
  }
};
</script>

<style lang="scss" scoped>
.enterWork{
  width: 100%;
  padding: 10px;
  border-radius: 6px;
  color: #fff;
  background: #155a90;
  cursor: pointer;
}
</style>
