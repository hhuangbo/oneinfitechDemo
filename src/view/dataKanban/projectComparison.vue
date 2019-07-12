<template>
  <div class="wrap">
    <el-form ref="form" :inline="true" :model="formData" label-width="80px">
      <el-form-item label="时间">
        <el-date-picker
          v-model="formData.date"
          type="daterange"
          align="right"
          unlink-panels
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :picker-options="pickerOptions">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="项目">
        <el-cascader
          :options="options"
          v-model="formData.name"
          @change="handleChange">
        </el-cascader>
      </el-form-item>
      <el-form-item label="指标">
        <el-cascader
          :options="options"
          v-model="formData.quota"
          @change="handleChangeQuota">
        </el-cascader>
      </el-form-item>
    </el-form>
    <div class="dashboard_box">
      <div class="dashboard">
        <div class="list_title">
          KPI
        </div>
        <div class="list_title">
          订单走势
        </div>
        <div class="list_title">
          完美签收率
        </div>
      </div>
      <div class="panel_box">
        <div class="panel_list_box" v-for="(list, i) in data" v-dragging="{ item: list, list: data, group: 'list' }" :key="list.id" v-if="list.isShow == true">
          <div class="panel_list">
            <p class="title">{{list.text}}</p>
            <div class="list_body">
              <p class="body_title">客户分布</p>
              <div @mouseenter="enter(i)" @mouseleave="leave()">
                <div class="popover">
                  <div></div>
                  <div></div>
                  <div></div>
                </div>
                <div class="popoverList" v-show="isPopover == i">
                  <div @click="popover(i)">关闭</div>
                </div>
              </div>
              <div class="customer_left">
                <div ref="myChart2" :id="'myChart2' + i" style="width:100%; height: 90%"></div>
                <p>中国外运</p>
              </div>
              <div class="customer_right">
                <div class="item_right">
                  <div ref="myChart2" :id="'myChart2_' + Math.random()" style="width:100%; height: 90%"></div>
                  <p>测试</p>
                </div>
                <div class="item_right">
                  <div ref="myChart2" :id="'myChart2_' + Math.random()" style="width:100%; height: 90%"></div>
                  <p>测试</p>
                </div>
                <div class="item_right">
                  <div ref="myChart2" :id="'myChart2_' + Math.random()" style="width:100%; height: 90%"></div>
                  <p>测试</p>
                </div>
                <div class="item_right">
                  <div ref="myChart2" :id="'myChart2_' + Math.random()" style="width:100%; height: 90%"></div>
                  <p>测试</p>
                </div>
              </div>
            </div>
          </div>

          <div class="panel_list">
            <p class="title">&nbsp;</p>
            <div class="list_body">
              <p class="body_title">订单数</p>
              <div @mouseenter="enter(i)" @mouseleave="leave()">
                <div class="popover">
                  <div></div>
                  <div></div>
                  <div></div>
                </div>
                <div class="popoverList" v-show="isPopover == i">
                  <div @click="popover(i)">关闭</div>
                </div>
              </div>
              <div ref="myChart3" :id="'myChart3' + i" style="width:100%; height: 100%"></div>
            </div>
          </div>

          <div class="panel_list">
            <p class="title">&nbsp;</p>
            <div class="list_body body_text">99%</div>
          </div>
        </div>

      </div>

    </div>

  </div>
</template>

<script>
    export default {
      data() {
        return {
          options: [{
            value: 'zhinan',
            label: '指南',
            children: [{
              value: 'shejiyuanze',
              label: '设计原则',
              children: [{
                value: 'yizhi',
                label: '一致'
              }, {
                value: 'fankui',
                label: '反馈'
              }, {
                value: 'xiaolv',
                label: '效率'
              }, {
                value: 'kekong',
                label: '可控'
              }]
            }, {
              value: 'daohang',
              label: '导航',
              children: [{
                value: 'cexiangdaohang',
                label: '侧向导航'
              }, {
                value: 'dingbudaohang',
                label: '顶部导航'
              }]
            }]
          }],
          pickerOptions: {
            shortcuts: [{
              text: '最近一周',
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                picker.$emit('pick', [start, end]);
              }
            }, {
              text: '最近一个月',
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                picker.$emit('pick', [start, end]);
              }
            }, {
              text: '最近三个月',
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                picker.$emit('pick', [start, end]);
              }
            }]
          },
          formData: {
            name: '',
            date: '',
            quota: ''
          },
          isPopover: null,
          data: [{
            text: "订单",
            isShow: true,
            id: 1
          }, {
            text: "客户分布",
            isShow: true,
            id: 2
          }, {
            text: "订单趋势",
            isShow: true,
            id: 3
          }, {
            text: "添加",
            isShow: true,
            id: 4
          }]
        }
      },
      mounted() {
        this.customerDistribution()
        this.orderTrend()
      },
      methods: {
        customerDistribution() {
          this.$refs.myChart2.forEach((item) => {
            console.log(item.id);
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
                data: [820, 932, 901, 934, 1290, 1330, 1320],
                type: 'line',
                smooth: true,
                itemStyle: { normal: { label: { show: true } } }
              }]
            });
          })
        },
        enter(i) {
          this.isPopover = i
        },
        leave(){
          this.isPopover = null;
        },
        popover(i) {
          let a = this.data[i].isShow == true ? false : true
          this.$set(this.data[i], 'isShow', a)
        },
        handleChange(value) {
          console.log(value);
        },
        handleChangeQuota(value) {
          console.log(value)
        }
      }
    }
</script>

<style lang="scss" scoped>
  .wrap{
    width: 100%;
    height: 100%;
    padding: 10px 0 0 30px;
    overflow: auto;
    background: #FAFAFA;
    .dashboard_box{
      overflow: scroll hidden;
      padding: 5px;
      position: relative;
      margin-bottom: 100px;
      .dashboard{
        .list_title{
          width: 150px;
          height: 325px;
          padding-top: 50px;
          line-height: 295px;
          font-size: 30px;
          font-weight: bold;
          color: #6B6B6B;
          text-align: center;
          margin-bottom: 30px;
        }
      }
      .panel_box{
        position: absolute;
        top: 0;
        left: 200px;
        white-space:nowrap;
        overflow: auto;
        .panel_list_box{
          display: inline-block;
          .panel_list{
            border-bottom: 1px solid #C3C3C3;
            padding: 0 50px 30px 50px;
            .title{
              font-size: 30px;
              font-weight: bold;
              color: #6B6B6B;
              text-align: center;
              line-height: 50px;
            }
            .list_body{
              width: 400px;
              height: 280px;
              border-radius: 5px;
              background: #2B2B44;
              font-size: 40px;
              font-weight: bold;
              color: #6B6B6B;
              padding: 5px;
              position: relative;
              .body_title{
                color: #1A7078;
                font-size: 16px;
              }
              .popover{
                width: 25px;
                height: 30px;
                position: absolute;
                top: 5px;
                right: 5px;
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
                div{
                  width: 100%;
                  height: 20px;
                  text-align: center;
                  line-height: 20px;
                  color: #fff;
                  font-size: 12px;
                }
              }
            }
            .body_text{
              background: rgba(0,0,0,0.0);
              text-align: center;
              line-height: 280px;
            }
          }
        }
      }

    }
    .customer_left{
      width: 50%;
      height: 80%;
      p{
        color: #30E3CA;
        text-align: center;
        font-size: 12px;
      }
    }
    .customer_right{
      width: 50%;
      height: 50%;
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
          font-size: 12px;
        }
      }
    }
  }
</style>
