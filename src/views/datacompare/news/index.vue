<template>
  <div class="chart-container">
    <el-form ref="pmnForm" :rules="rules" :model="entityForm" label-width="100px">
      <el-row :gutter="20" :span="24">
        <el-card class="box-card" shadow="never" header="查询条件">
          <el-col :offset="4" :span="8">
            <el-form-item label="keyword1">
              <el-input v-model="entityForm.keyword1" :disabled="false"/>
            </el-form-item>
            <el-form-item label="keyword2">
              <el-input v-model="entityForm.keyword2" :disabled="false"/>
            </el-form-item>
            <el-form-item label="keyword3">
              <el-input v-model="entityForm.keyword3" :disabled="false"/>
            </el-form-item>
            <el-form-item label="keyword_not">
              <el-input v-model="entityForm.keyword_not" :disabled="false"/>
            </el-form-item>
          </el-col>
          <el-col :span="9">
            <el-form-item label="发布时间">
              <el-row>
                <div class="block">
                  <el-date-picker
                    v-model="entityForm.start_time"
                    align="right"
                    type="date"
                    placeholder="开始时间"
                    value-format="yyyy-MM-dd"
                    :picker-options="pickerOptions">
                  </el-date-picker>
                  --
                  <el-date-picker
                    v-model="entityForm.end_time"
                    align="right"
                    type="date"
                    placeholder="结束时间"
                    value-format="yyyy-MM-dd"
                    :picker-options="pickerOptions">
                  </el-date-picker>
                </div>
              </el-row>
            </el-form-item>

            <el-form-item label="信源类型" prop="name">
              <el-select
                v-model="entityForm.source_type"
                size="medium"
                multiple
                collapse-tags
                placeholder="请选择">
                <el-option
                  v-for="item in sourceTypeOptions"
                  :key=item.value
                  :label="item.label"
                  :value=item.value>
                </el-option>
              </el-select>
            </el-form-item>


            <el-form-item label="相关度" prop="url">
              <el-slider
                v-model="entityForm.rel"
                :max=5
                :min=0
                :step="1"
                show-stops
                show-input
              >
              </el-slider>
            </el-form-item>


            <el-form-item>
              <el-button type="primary" @click="sendAndDrawChart">查询</el-button>
              <el-button @click="entityForm= {}">清空</el-button>
            </el-form-item>

          </el-col>
        </el-card>
      </el-row>
    </el-form>
    <el-card class="box-card" shadow="never">
      <div class="chart-wrapper">
        <chart height="580px" width="100%" :chart-data="chartData"/>
      </div>
    </el-card>
  </div>
</template>

<script>

import Chart from './Lines'
import { getBaoGuangDu } from '@/api/baoguangdu.js'

const defaultFrom = {
  keyword1: '济南',
  keyword2: '交警',
  keyword3: '',
  keyword_not: '支队',
  start_time: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
  end_time: new Date(),
  rel: 2,
  source_type: [0, 1, 2, 4, 11]
}

export default {

  name: 'LineChart',
  components: { Chart },
  data() {
    return {
      entityForm: Object.assign({}, defaultFrom),
      chartData: [],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
        shortcuts: [{
          text: '今天',
          onClick(picker) {
            picker.$emit('pick', new Date());
          }
        }, {
          text: '昨天',
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() - 3600 * 1000 * 24);
            picker.$emit('pick', date);
          }
        }, {
          text: '一周前',
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', date);
          }
        }, {
          text: '月初',
          onClick(picker) {
            const date = new Date()
            var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
            date.setTime(firstDay)
            picker.$emit('pick', date);
          }
        }]
      },
      sourceTypeOptions: [{
        value: 0,
        label: '网站'
      }, {
        value: 1,
        label: '论坛'
      }, {
        value: 2,
        label: '贴吧'
      }, {
        value: 4,
        label: '微博'
      }, {
        value: 11,
        label: '微信'
      }]
    }
  },
  created() {
    // this.getBaoguangdu()
  },
  methods: {
    makeSeries(result) {
      console.log(result.data.data)
      var list = result.data.data
      var total = []
      var broadcast = []
      var infos = {}

      for (var i in list) {
        var oneday = list[i]
        var datestr = oneday.date
        var date = this.parserDate(datestr)
        total.push([datestr, oneday.totalNum])
        broadcast.push([datestr, oneday.broadcastlNum, oneday.tops])
        infos[datestr] = oneday.tops
      }

      const rtn = { total, broadcast, infos }
      console.log(rtn)
      return rtn
    },
    sendAndDrawChart() {
      console.log(this.entityForm)
      this.getBaoguangdu(this.entityForm)
    },
    getBaoguangdu(entity) {
      // 获取菜单列表以树节点的形式展示
      const _this = this
      _this.loading = true
      // var entity = {
      //   'keyword1': '济南',
      //   'keyword2': '交警',
      //   'start_time': '2021-07-01',
      //   'end_time': '2021-07-18'
      // }
      var entity2Send = Object.assign({}, entity)
      entity2Send.source_type = entity2Send.source_type.join(',')
      console.log(entity2Send)
      getBaoGuangDu(entity2Send).then(result => {
        let ss = this.makeSeries(result)
        _this.chartData = ss
        _this.loading = false
      })
    },
    // 格式化日期字符串
    parserDate(date) {
      var t = Date.parse(date);
      if (!isNaN(t)) {
        return new Date(Date.parse(date.replace(/-/g, '/')));
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
.chart-wrapper {
  background: #fff;
  padding: 16px 16px 0;
  margin-bottom: 32px;
}

@media (max-width: 1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
