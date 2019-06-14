<template>
    <div class="menuCate">
        <el-menu
      default-active="2"
      unique-opened="true"
      @open="handleOpen"
      @close="handleClose"
      text-color="#fff"
      active-text-color="#fff"
      >
      <el-submenu v-for="(item,index) in menuList" :key="index"  :index="index"  v-if="item.level" >
        <template slot="title">
          <span>{{item.title}}</span>
        </template>
        <!-- <el-menu-item-group> -->
          <el-menu-item v-for="(tlevel,tindex) in item.level" :key="tindex" :index="[index+'-'+tindex]">{{tlevel.title}}</el-menu-item>
        <!-- </el-menu-item-group> -->
      </el-submenu>
      <el-menu-item v-else :index="index">
        <span slot="title">{{item.title}}</span>
      </el-menu-item>
    </el-menu>
    </div>
</template>

<script>
export default {
    data(){
        return{
            menuList:[]
        }
    },
    mounted(){
        this.init()
    },
    methods:{
        init(){//初始控制台
            var _this=this;
            this.$http.get('../../static/json/menuCate.json').then((res) => {
                this.menuList = res.data.menuList
            })
            .catch(err =>{
                console.log(err);  
            })
        },
        handleOpen(){
            console.log(key, keyPath);
        },
        handleClose(){
            console.log(key, keyPath);
        }
    }
}
</script>

<style lang="scss" scoped>

</style>
