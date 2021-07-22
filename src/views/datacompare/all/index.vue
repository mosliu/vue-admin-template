<template>
  <div class="chart-container">
    <chart height="100%" width="100%" :chart-data="chartData"/>
  </div>
</template>

<script>

import Chart from './Lines'
import { getCompare } from '@/api/dataCompare'

export default {
  name: 'LineChart',
  components: { Chart },
  data() {
    return {
      chartData: []
    }
  },
  created() {
    this.getCompareData()
  },
  methods: {
    makeSeries(list) {
      const rtn = {}
      const datafroms = {}
      const counts = {}
      for (let i = 0; i < list.length; i++) {
        let item = list[i]
        let date = this.parserDate(item['dateStr'])
        let dataFrom = item['dataFrom']
        let name = dataFrom + '-' + item['sourceType']
        let count = item['count']
        if (rtn[name] === undefined) {
          rtn[name] = []
        }
        rtn[name].push([date, count])

        if (rtn[dataFrom] === undefined) {
          rtn[dataFrom] = {}
        }
        if (rtn[dataFrom][date] === undefined) {
          rtn[dataFrom][date] = 0
        }
        rtn[dataFrom][date] += count
        datafroms[dataFrom] = dataFrom
        // console.log(item)

        // 统计总量
        if (counts[dataFrom] === undefined) {
          counts[dataFrom] = 0
        }
        counts[dataFrom] += count
      }
      for (var i in datafroms) {
        // 从数据中将综合提出，整理成序列
        var to = []
        var temp = rtn[datafroms[i]]
        for (var d in temp) {
          to.push([d, temp[d]])
        }
        rtn[datafroms[i]] = to
      }
      console.log(counts)
      return rtn
    },
    getCompareData() {
      // 获取曝光度数据
      // 获取菜单列表以树节点的形式展示
      const _this = this
      _this.loading = true
      getCompare({ filter: false }).then(result => {
        let ss = this.makeSeries(result)
        // console.log(ss)
        _this.chartData = ss
        _this.loading = false
      })
    },
    // 格式化日期字符串
    parserDate(date) {
      var t = Date.parse(date)
      if (!isNaN(t)) {
        return new Date(Date.parse(date.replace(/-/g, '/')))
      } else {
        return new Date()
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.chart-container {
  position: relative;
  width: 100%;
  height: calc(100vh - 84px);
}
</style>

<style lang='scss' scoped>
</style>
