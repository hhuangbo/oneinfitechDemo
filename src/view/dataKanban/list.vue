<template>
    <div class="wrap">
      <p class="title">选择所需看板</p>
      <div class="boxList">
        <div class="box_item" v-for="(item, i) in data" :key="i" @click="option(item, i)">
          <div class="item_option" v-show="item.isShow">
            <img src="../../assets/xuanxiang.png" alt="">
            <p>已选择</p>
          </div>
          <div class="item_bottom">
            <p>历史订单趋势表</p>
            <el-rate
              v-model="value"
              disabled
              show-score
              text-color="#ff9900"
              score-template="{value}">
            </el-rate>
          </div>
        </div>
      </div>
      <div class="nextPageBtn">
        <el-button type="warning" @click="nextPage">我选完了，进入主界面</el-button>
      </div>
    </div>
</template>

<script>
    export default {
        data() {
          return {
            value: 3.7,
            data: [
              { isShow: false },
              { isShow: false },
              { isShow: false },
              { isShow: false },
              { isShow: false },
              { isShow: false },
              { isShow: false },
              { isShow: false },
              { isShow: false },
            ]
          }
        },
      methods: {
        option(e, i) {
          let a = e.isShow === false ? true : false
          this.$set(this.data[i], 'isShow', a)
        },
        nextPage() {
          this.$router.push({ path: '/dashboard' })
        }
      }
    }
</script>

<style lang="scss" scoped>
  .wrap{
    width: 100%;
    min-height: 100%;
    background: #FAFAFA;
    overflow: hidden;
    padding: 20px;
    .title{
      font-size: 20px;
      font-weight: bold;
      color: #453D33;
    }
    .boxList{
      width: 90%;
      display: flex;
      justify-content: space-between;
      flex-flow: row wrap;
      padding-top: 20px;
      .box_item{
        width: 23%;
        height: 200px;
        margin: 10px;
        background: pink;
        position: relative;
        .item_bottom{
          height: 50px;
          width: 100%;
          padding: 10px;
          position: absolute;
          left: 0;
          bottom: 0;
          p{
            font-size: 14px;
            color: #557185;

          }
        }
        .item_option{
          width: 100%;
          height: 50px;
          background: #F2F2F2;
          position: absolute;
          left: 0;
          bottom: 50px;
          img{
            width: 35px;
            position: absolute;
            top: 7px;
            left: 60px;
          }
          p{
            font-size: 15px;
            font-weight: bold;
            color: #464E53;
            text-align: center;
            line-height: 50px;
          }
        }
      }
    }
    .nextPageBtn{
      width: 90%;
      height: 50px;
      button{
        float: right;
      }
    }
  }

</style>
