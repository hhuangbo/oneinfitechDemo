<template>
    <div class="wrap">
      <div class="iconStyle">
        <div @click="isShow = !isShow">
          <i class="el-icon-arrow-up" v-show="isShow == true"></i>
          <i class="el-icon-arrow-down" v-show="isShow == false"></i>
        </div>
      </div>

      <el-collapse-transition>
        <div class="addKanban" v-show="isShow">
          <p class="addKanban_title">添加新面板</p>
          <div  ref="addKanbans"></div>
          <div class="addKanban_list" v-for="(item, i) in order"  v-dragging="{ item: item, list: order, group: 'item' }" :key="item.id" :disabled="isDisable" @click="addKanban(item.type, i, item)">
            <img src="./img/DDS.png" alt="" v-show="item.type == 1">
            <img src="./img/KKFB.png" alt="" v-show="item.type == 2">
            <img src="./img/DDLQS.png" alt="" v-show="item.type == 3">
            <p>{{item.name}}</p>
          </div>
        </div>
      </el-collapse-transition>

      <div class="wrap_box">
        <div class="box_left" ref="box_left">
          <div class="left_item" v-for="(item, i) in data" v-dragging="{ item: item, list: data, group: 'item' }" :key="item.id">
            <div @click="enter(i)" class="popover_box" v-if="item.type != 4">
              <div class="popover">
                <div></div>
                <div></div>
                <div></div>
              </div>
              <div class="popoverList" @mouseleave="leave()" v-show="isPopover == i">
                <span @click="popover(i, item)">关闭</span>
              </div>
            </div>
            <!--订单数据表-->
            <div class="left_order" v-if="item.type == 1">
              <p class="title">{{item.name}}</p>
              <div ref="myChart" :id="'myChart' + i" class="left_order_myChart"></div>
            </div>
            <!--客户分布图-->
            <div class="left_customer" v-if="item.type == 2">
              <p class="title">{{item.name}}</p>
              <div class="customer_left">
                <div ref="myChart2" :id="'myChart2' + i" style="width:100%; height: 100%"></div>
                <p>中国外运</p>
              </div>
              <div class="customer_right">
                <div class="item_right">
                  <div ref="myChart2" :id="'myChart2_' + Math.random()" style="width:100%; height: 100%"></div>
                  <p>测试</p>
                </div>
                <div class="item_right">
                  <div ref="myChart2" :id="'myChart2_' + Math.random()" style="width:100%; height: 100%"></div>
                  <p>测试</p>
                </div>
                <div class="item_right">
                  <div ref="myChart2" :id="'myChart2_' + Math.random()" style="width:100%; height: 100%"></div>
                  <p>测试</p>
                </div>
                <div class="item_right">
                  <div ref="myChart2" :id="'myChart2_' + Math.random()" style="width:100%; height: 100%"></div>
                  <p>测试</p>
                </div>
              </div>
            </div>
            <!--订单数据表-->
            <div class="left_order" v-if="item.type == 3">
              <p class="title">{{item.name}}</p>
              <div ref="myChart3" :id="'myChart3' + i" class="left_order_myChart"></div>
            </div>
            <!--添加-->
            <div class="add_item" v-if="item.name == '添加'" @click="openPanel">
              <i class="el-icon-plus"></i>
            </div>
          </div>
        </div>
        <div class="box_right">
          <div id="myChart4" style="width: 100%; height: 100%"></div>
        </div>
      </div>

      <div class="nextPageBtn">
        <el-button type="warning" @click="nextPage">进入项目对比页面</el-button>
      </div>
    </div>
</template>

<script>
  import { geoCoordMap, BJData, SHData, GZData } from './data'
  export default {
    data() {
      return {
        isDisable: true,
        isShow: false,
        geoCoordMap: geoCoordMap,
        BJData: BJData,
        SHData: SHData,
        GZData: GZData,
        isPopover: null,
        isDisplayPanel: true,
        index: 5,
        order:[],
        data: [{
          name: "订单",
          type: '1',
          id: 1
        }, {
          name: "客户分布",
          type: '2',
          id: 2
        }, {
          name: "订单趋势",
          type: '3',
          id: 3
        }, {
          name: "添加",
          type: '4',
          id: 4
        }]
        }
    },
    computed: {

    },
    created() {

    },
    mounted() {
      this.drawLine()
      this.orderTrend()
      this.customerDistribution()
      this.warehouseDistribution()
    },
    methods: {
      offsetDis(obj) {
        let l = 0, t = 0;
        while(obj) {
          l = l + obj.offsetLeft + obj.clientLeft;
          t = t + obj.offsetTop + obj.clientTop;
          obj = obj.offsetParent;
        }
        return {left: l, top: t};
      },
      openPanel() {
        this.isShow = !this.isShow
      },
      enter(i) {
        this.isPopover = i
      },
      leave(){
        this.isPopover = null;
      },
      popover(i, item) {
        let a = document.querySelectorAll('.left_item')[i]
        let b = this.offsetDis(a)
        let e = this.offsetDis(this.$refs.addKanbans).top - b.top
        let d = this.order.length * 310
        let c = d - b.left
        a.style = 'transform: translate(' + c + 'px,' + e + 'px) scale(0.5);opacity: 0;'
        setTimeout(() => {
          this.data.splice(i, 1)
          this.order.push(item)
        }, 1000)
      },
      drawLine(){
        this.$refs.myChart.forEach((item) => {
          let myChart = this.$echarts.init(document.getElementById(item.id))
          // 绘制图表
          let dataAxis = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
          let data = [220, 182, 191, 234, 290, 330, 310, 123, 442, 321, 90, 149];
          let yMax = 1500;
          let dataShadow = [];

          for (let i = 0; i < data.length; i++) {
            dataShadow.push(yMax);
          }
          myChart.setOption({
            color: ['#30E3CA', '#07282C'],
            title: {
              // text: '特性示例：渐变色 阴影 点击缩放',
              // subtext: 'Feature Sample: Gradient Color, Shadow, Click Zoom'
            },
            xAxis: {
              type: 'category',
              data: dataAxis,
              axisLabel: {
                inside: true,
                textStyle: {
                  color: '#2FDCC5'
                }
              },
              axisTick: {
                show: false
              },
              axisLine: {
                lineStyle: {
                  color: '#2FDCC5'
                }
              },
              splitLine:{
                show:false
              },
              z: 10
            },
            yAxis: {
              axisLine: {
                lineStyle: {
                  color: '#2FDCC5'
                }
              },
              axisTick: {
                lineStyle: {
                  color: '#2FDCC5'
                }
              },
              axisLabel: {
                textStyle: {
                  color: '#2FDCC5'
                }
              },
              splitLine:{
                show:false
              },
            },
            dataZoom: [
              {
                type: 'inside'
              }
            ],
            series: [
              { // For shadow
                type: 'bar',
                itemStyle: {
                  normal: {color: 'rgba(0,0,0,0.05)'}
                },
                barGap:'-100%',
                barCategoryGap:'40%',
                data: dataShadow,
                animation: false
              },
              {
                type: 'bar',
                label: {
                  normal: {
                    show: true,
                    position: 'top',
                    color: '#fff'
                  }
                },
                itemStyle: {
                  normal: {
                    color: new this.$echarts.graphic.LinearGradient(
                      0, 0, 0, 1,
                      [
                        {offset: 0, color: '#30DFC7'},
                        {offset: 0.5, color: '#255D68'},
                        {offset: 1, color: '#2B2B44'}
                      ]
                    )
                  },
                  emphasis: {
                    color: new this.$echarts.graphic.LinearGradient(
                      0, 0, 0, 1,
                      [
                        {offset: 0, color: '#30DFC7'},
                        {offset: 0.5, color: '#255D68'},
                        {offset: 1, color: '#2B2B44'}
                      ]
                    )
                  }
                },
                data: data
              }
            ]
          })
          let zoomSize = 6;
          myChart.on('click', function (params) {
            myChart.dispatchAction({
              type: 'dataZoom',
              startValue: dataAxis[Math.max(params.dataIndex - zoomSize / 2, 0)],
              endValue: dataAxis[Math.min(params.dataIndex + zoomSize / 2, data.length - 1)]
            });
          });
        })
      },
      customerDistribution() {
        this.$refs.myChart2.forEach((item) => {
          // 基于准备好的dom，初始化echarts实例
          let myChart2 = this.$echarts.init(document.getElementById(item.id))
          let data2 = [{value: 80, name: '80%'},{value:20, name: '20%'}]
          this.newMyChart(myChart2, data2)

          let myChart2_1 = this.$echarts.init(document.getElementById(item.id))
          let data2_1 = [{value: 80, name: '80%'},{value:20, name: '20%'}]
          this.newMyChart(myChart2_1, data2_1)

          let myChart2_2 = this.$echarts.init(document.getElementById(item.id))
          let data2_2 = [{value: 80, name: '80%'},{value:20, name: '20%'}]
          this.newMyChart(myChart2_2, data2_2)

          let myChart2_3 = this.$echarts.init(document.getElementById(item.id))
          let data2_3 = [{value: 80, name: '80%'},{value:20, name: '20%'}]
          this.newMyChart(myChart2_3, data2_3)

          let myChart2_4 = this.$echarts.init(document.getElementById(item.id))
          let data2_4= [{value: 80, name: '80%'},{value:20, name: '20%'}]
          this.newMyChart(myChart2_4, data2_4)
        })

      },
      newMyChart(key, data) {
        key.setOption({
          color: ['#30E3CA', '#07282C'],
          tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b}: {c} ({d}%)"
          },
          legend: {
            orient: 'vertical',
            x: 'left',
            data:[]
          },
          series: [
            {
              name:'访问来源',
              type:'pie',
              radius: ['65%', '70%'],
              hoverAnimation: false,
              avoidLabelOverlap: false,
              label: {
                normal: {
                  show: false,
                  position: 'center'
                },
                emphasis: {
                  show: true,
                  textStyle: {
                    fontSize: '18',
                    fontWeight: 'bold'
                  }
                }
              },
              labelLine: {
                normal: {
                  show: false
                }
              },
              data: data
            }
          ]
        })
        this.$nextTick(() => {
          key.dispatchAction({type: 'highlight',seriesIndex: 0,dataIndex: 0});
          key.on('mouseover',(v) => {
            if(v.dataIndex != 0){
              key.dispatchAction({
                type: 'downplay',
                seriesIndex: 0,
                dataIndex: 0
              });
            }
          })
          key.on('mouseout',(v) => {
            key.dispatchAction({type: 'highlight',seriesIndex: 0,dataIndex: 0});
          })
        })
      },
      orderTrend() {
        let arr = []
        arr = this.$refs.myChart3.length > 0 ? this.$refs.myChart3 : arr.push(this.$refs.myChart3)
        this.$refs.myChart3.forEach((item) => {
          let myChart3 = this.$echarts.init(document.getElementById(item.id))
          // 绘制图表
          myChart3.setOption({
            color: ['#30E3CA'],
            xAxis: {
              type: 'category',
              data: ['', '', '', '', '', '', ''],
              axisLine: {
                lineStyle: {
                  color: '#2FDCC5'
                }
              },
              axisLabel: {
                textStyle: {
                  color: '#2FDCC5'
                },
                lineStyle: {
                  color: '#2FDCC5'
                }
              },
              labelLine: {
                lineStyle: {
                  color: '#2FDCC5'
                }
              },
              splitLine:{
                show:false
              },
            },
            yAxis: {
              type: 'value',
              splitLine:{
                show:false
              },
              axisLine: {
                lineStyle: {
                  color: '#2FDCC5'
                }
              },
              axisLabel: {
                textStyle: {
                  color: '#2FDCC5'
                }
              },
              labelLine: {
                lineStyle: {
                  color: '#2FDCC5'
                }
              }
            },
            series: [{
              data: [820, 932, 901, 934, 1290, 1330, 5000],
              type: 'line',
              smooth: true,
              itemStyle: { normal: { label: { show: true } } }
            }]
          });
        })
      },
      warehouseDistribution() {
        let myChart4 = this.$echarts.init(document.getElementById('myChart4'))
        let planePath = 'path://M1705.06,1318.313v-89.254l-319.9-221.799l0.073-208.063c0.521-84.662-26.629-121.796-63.961-121.491c-37.332-0.305-64.482,36.829-63.961,121.491l0.073,208.063l-319.9,221.799v89.254l330.343-157.288l12.238,241.308l-134.449,92.931l0.531,42.034l175.125-42.917l175.125,42.917l0.531-42.034l-134.449-92.931l12.238-241.308L1705.06,1318.313z';
        let geoCoordMap = this.geoCoordMap
        let BJData = this.BJData
        let SHData = this.SHData
        let GZData = this.GZData
        let convertData = function (data) {
          let res = [];
          for (let i = 0; i < data.length; i++) {
            let dataItem = data[i];
            let fromCoord = geoCoordMap[dataItem[0].name];
            let toCoord = geoCoordMap[dataItem[1].name];
            if (fromCoord && toCoord) {
              res.push({
                fromName: dataItem[0].name,
                toName: dataItem[1].name,
                coords: [fromCoord, toCoord]
              });
            }
          }
          return res;
        };

        let color = ['#a6c84c', '#ffa022', '#46bee9'];
        let series = [];
        [['北京', BJData], ['上海', SHData], ['广州', GZData]].forEach(function (item, i) {
          series.push({
              name: item[0] + ' Top10',
              type: 'lines',
              zlevel: 1,
              effect: {
                show: true,
                period: 6,
                trailLength: 0.7,
                color: '#fff',
                symbolSize: 3
              },
              lineStyle: {
                normal: {
                  color: color[i],
                  width: 0,
                  curveness: 0.2
                }
              },
              data: convertData(item[1])
            },
            {
              name: item[0] + ' Top10',
              type: 'lines',
              zlevel: 2,
              symbol: ['none', 'arrow'],
              symbolSize: 10,
              effect: {
                show: true,
                period: 6,
                trailLength: 0,
                symbol: planePath,
                symbolSize: 15
              },
              lineStyle: {
                normal: {
                  color: color[i],
                  width: 1,
                  opacity: 0.6,
                  curveness: 0.2
                }
              },
              data: convertData(item[1])
            },
            {
              name: item[0] + ' Top10',
              type: 'effectScatter',
              coordinateSystem: 'geo',
              zlevel: 2,
              rippleEffect: {
                brushType: 'stroke'
              },
              label: {
                normal: {
                  show: true,
                  position: 'right',
                  formatter: '{b}'
                }
              },
              symbolSize: function (val) {
                return val[2] / 8;
              },
              itemStyle: {
                normal: {
                  color: color[i]
                }
              },
              data: item[1].map(function (dataItem) {
                return {
                  name: dataItem[1].name,
                  value: geoCoordMap[dataItem[1].name].concat([dataItem[1].value])
                };
              })
            });
        })

        myChart4.setOption({
          backgroundColor: '#404a59',
          title : {
            text: '供应商仓库分布与车辆位置',
            subtext: '数据纯属虚构',
            left: 'center',
            textStyle : {
              color: '#fff'
            }
          },
          tooltip : {
            trigger: 'item'
          },
          legend: {
            orient: 'vertical',
            top: 'bottom',
            left: 'right',
            data:['北京 Top10', '上海 Top10', '广州 Top10'],
            textStyle: {
              color: '#fff'
            },
            selectedMode: 'single'
          },
          geo: {
            map: 'china',
            label: {
              emphasis: {
                show: false
              }
            },
            roam: true,
            itemStyle: {
              normal: {
                areaColor: '#323c48',
                borderColor: '#404a59'
              },
              emphasis: {
                areaColor: '#2a333d'
              }
            }
          },
          series: series
        })

      },
      addKanban(type, i, item) {
        if(this.isDisable == true) {
          this.isDisable = false
          let a = document.querySelectorAll('.addKanban_list')[i]
          let e = this.$refs.box_left
          let c = this.offsetDis(e)
          let b = this.offsetDis(a)
          let left = b.left - c.left
          a.style = 'transform: translate(' + -left + 'px,' + c.top + 'px) scale(0.5);opacity: 0;'
          setTimeout(() => {
            this.isDisable = true
            this.data.unshift(item)
            this.order.splice(i, 1)
            if(type == 1) {
              this.$nextTick(() => {
                this.drawLine()
              })
            } else if(type == 2) {
              this.$nextTick(() => {
                this.customerDistribution()
              })
            } else if(type == 3) {
              this.$nextTick(() => {
                this.orderTrend()
              })
            }
          }, 1000)
        }
      },
      nextPage() {
        this.$router.push({ path: '/projectComparison' })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .wrap{
    width: 100%;
    height: 100%;
    background: #FAFAFA;
    padding: 30px;
    .iconStyle{
      height: 50px;
      position: relative;
      div{
        position: absolute;
        top: -20px;
        right: 5px;
        font-size: 50px;
        font-weight: bold;
        color: #000000;
      }

    }
    .addKanban{
      width: 100%;
      overflow: scroll hidden;
      height: 280px;
      background: #F2F2F2;
      margin-left: 10px;
      border-radius: 5px;
      padding: 10px;
      white-space:nowrap;
      .addKanban_title{
        font-size: 20px;
        color: #717777;
        padding: 10px 0 20px 0;
        overflow: hidden;
      }
      .addKanban_list{
        width: 300px;
        height: 200px;
        display: inline-block;
        margin-right: 10px;
        -webkit-transition:  all 1s cubic-bezier(.2,-0.59,.47,.97);
        -o-transition:  all 1s cubic-bezier(.2,-0.59,.47,.97);
        transition:  all 1s cubic-bezier(.2,-0.59,.47,.97);
        opacity: 1;
        img{
          width: 100%;
          height: 80%;
          border-radius: 5px;
        }
        p{
          padding: 5% 0;
          font-size: 15px;
          font-weight: bold;
          color: #373634;
        }
      }
    }
    .wrap_box{
      width: 100%;
      display: flex;
      justify-content: space-between;
      flex-flow: row wrap;
      padding-bottom: 50px;
      .box_left{
        flex: 2;
        display: flex;
        justify-content: space-between;
        flex-flow: row wrap;
        position: relative;
        .add_item{
          width: 100%!important;
          height: 100%!important;
          text-align: center;
          line-height: 200px;
          font-size: 190px;
          color: #273F54;
          font-weight: bold;
        }
        .left_item{
          width: 47%;
          height: 300px;
          margin: 10px;
          background: #2B2B44;
          padding: 20px;
          border-radius: 5px;
          position: relative;
          -webkit-transition:  all 1s cubic-bezier(.2,-0.59,.47,.97);
          -o-transition:  all 1s cubic-bezier(.2,-0.59,.47,.97);
          transition:  all 1s cubic-bezier(.2,-0.59,.47,.97);
          opacity: 1;
          .title{
            color: #1A7078;
            font-size: 16px;
          }
          .left_order, .left_customer{
            width: 100%;
            height: 100%;
            .left_order_myChart{
              width: 100%;
              height: 100%;
              /*transform: translate(5%, 10%);*/
            }
          }
          .customer_right{
            width: 50%;
            height: 80%;
            position: absolute;
            right: 0;
            top: 20%;
            padding-bottom: 30px;
            display: flex;
            justify-content: space-around;
            flex-flow: row wrap;
            .item_right{
              width: 50%;
              height: 100px;
              p{
                text-align: center;
                color: #30E3CA;
              }
            }
          }
          .customer_left{
            width: 50%;
            height: 80%;
            p{
              color: #30E3CA;
              text-align: center;
            }
          }
          .popover{
            width: 35px;
            height: 40px;
            position: absolute;
            top: 5px;
            right: 5px;
            padding: 5px;
            div{
              width: 100%;
              height: 4px;
              background: #86868F;
              margin-top: 4px;
              border-radius: 2px;
            }
          }
          .popoverList{
            width: 40px;
            background: #000;
            position: absolute;
            top: 35px;
            right: 0;
            z-index: 999;
            span{
              display: block;
              width: 100%;
              height: 20px;
              text-align: center;
              line-height: 20px;
              color: #fff;
            }
          }
        }
      }
      .box_right{
        margin-top: 10px;
        margin-left: 10px;
        flex: 1;
        background: #404A59;
        padding: 5px;
        border-radius: 5px;
        margin-bottom: 10px;
      }
    }
    .nextPageBtn{
      width: 95%;
      height: 50px;
      padding-bottom: 80px;
      button{
        float: right;
      }
    }
    .popover_box{
      position: absolute;
      top: 0;
      right: 0;
      width: 50px;
      height: 50px;
    }
  }
</style>
