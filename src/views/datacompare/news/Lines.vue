<template>
  <div :id="id" :class="className" :style="{height:height,width:width}"/>
</template>

<script>
import echarts from 'echarts'
import resize from './mixins/resize'

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    id: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '1024px'
    },
    height: {
      type: String,
      default: '800px'
    },
    chartData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      chart: null,
      tops: {},
      option: {
        // backgroundColor: '#394056',
        color: ['#FF0087', '#FFBF00', '#80FFA5', '#00DDFF', '#37A2FF',],
        backgroundColor: '#FFFFFF',
        title: {
          top: 20,
          text: '曝光度',
          textStyle: {
            fontWeight: 'normal',
            fontSize: 16,
            color: '#212123'
          },
          left: '3%'
        },
        tooltip: {
          trigger: 'axis',
          formatter(params) {
            // console.log(params)
            var htmlStr = '<div style="height: auto;max-height: 320px;overflow-y: auto;"><p>' + params[0].axisValue + '</p>';
            for (var i = 0; i < params.length; i++) {
              // htmlStr += '<p style="color: #eeeeee;">' + params[i].marker + params[i].seriesName + ':' + params[i].value + '</p>';
              htmlStr += '<p style="color: #eeeeee;">' + params[i].seriesName + ':' + params[i].value[1] + '</p>';
            }
            var topstr = ''
            for (const v of params[1]['data'][2]) {
              // console.log(v)
              topstr += '<br/>' + v['title'].substr(0,40) + '... : ' + v['after_similar_count']
            }
            htmlStr += '<p style="color: #eeeeee;"> 当日Top5:' + topstr + '</p>'
            htmlStr += '</div>'
            return htmlStr
          },
          axisPointer: {
            lineStyle: {
              color: '#57617B'
            }
          }
        },
        legend: {
          top: 20,
          icon: 'rect',
          itemWidth: 14,
          itemHeight: 5,
          itemGap: 13,
          data: ['CMCC', 'CTCC', 'CUCC'],
          right: '4%',
          textStyle: {
            fontSize: 12,
            color: '#313133'
          }
        },
        grid: {
          top: 100,
          left: '2%',
          right: '2%',
          bottom: '2%',
          containLabel: true
        },
        xAxis: [{
          type: 'category',
          boundaryGap: false,
          axisLine: {
            lineStyle: {
              color: '#57617B'
            }
          }
        }],
        yAxis: [{
          type: 'value',
          name: '',
          axisTick: {
            show: true
          },
          axisLine: {
            lineStyle: {
              color: '#57617B'
            }
          },
          axisLabel: {
            margin: 10,
            textStyle: {
              fontSize: 14
            }
          },
          splitLine: {
            lineStyle: {
              color: '#57617B'
            }
          }
        }],
        series: []
      }
    }
  },
  watch: {
    chartData: {
      deep: true,
      handler(val) {
        console.log('**********************')
        console.log(val)
        this.setOptions(val)
      }
    }
  },
  mounted() {
    this.initChart()
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(document.getElementById(this.id))
      const tops = this.tops
      this.chart.setOption(
        this.option
      )
    },
    setOptions(val) {
      console.log(val)
      this.option.series.length = 0
      this.option.legend.data.length = 0
      const total = {
        name: '当日总量',
        type: 'line',
        smooth: true,
        symbol: 'none',
        areaStyle: {},
        data: val['total']
      }
      this.option.series.push(total)
      this.option.legend.data.push('当日总量')

      const broadcast = {
        name: '当日所有数据传播总量',
        type: 'line',
        smooth: true,
        symbol: 'none',
        areaStyle: {},
        data: val['broadcast']
      }
      this.option.series.push(broadcast)
      this.option.legend.data.push('当日所有数据传播总量')

      this.tops = val['infos']
      // for (var key in val) {
      //   const newS = {
      //     name: key,
      //     type: 'line',
      //     smooth: false,
      //     symbol: 'none',
      //     areaStyle: {},
      //     data: val[key]
      //   }
      //   this.option.series.push(newS)
      //   this.option.legend.data.push(key)
      // }
      this.chart.setOption(
        this.option
      )
    }
  }
}
</script>
