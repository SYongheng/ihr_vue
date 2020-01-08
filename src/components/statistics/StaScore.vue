<template>
  <div>
    <el-menu
      :default-active="activeIndex"
      mode="vertical"
      @select="handleSelect"
      style="margin-top: 10px"
      active-text-color="#409EFF"
    >
      <el-col :span="2">
        <el-menu-item index="preview">
          <span slot="title">积分概要</span>
        </el-menu-item>
        <el-menu-item index="details">
          <span slot="title">积分详情</span>
        </el-menu-item>
      </el-col>
      <el-col :span="22" style="padding-left: 10px">
        <div v-show="preview_visible">
          <el-row>
            <el-col :span="3">
              <el-tooltip class="item" effect="dark" :content="maxScore" placement="bottom">
                <el-alert
                  title="最大值"
                  type="success"
                  center
                  :closable="false"
                  style="height:30px;width:90px"
                ></el-alert>
              </el-tooltip>
            </el-col>
            <el-col :span="3">
              <el-tooltip class="item" effect="dark" :content="minScore" placement="bottom">
                <el-alert
                  title="最小值"
                  type="error"
                  center
                  :closable="false"
                  style="height:30px;width:90px"
                ></el-alert>
              </el-tooltip>
            </el-col>
            <el-col :span="3">
              <el-tooltip class="item" effect="dark" :content="averageScore" placement="bottom">
                <el-alert
                  title="平均值"
                  type="info"
                  center
                  :closable="false"
                  style="height:30px;width:90px"
                ></el-alert>
              </el-tooltip>
            </el-col>
          </el-row>
          <el-divider></el-divider>
          <div ref="pieChart" style="width:80%;height:350px; text-align:center"></div>
        </div>
        <div v-show="details_visible">
          <el-header
            style="display: flex;justify-content: space-between;align-items: center;padding-left: 0px"
          >
            <div style="display: inline">
              <el-input
                placeholder="通过员工名搜索分数信息,记得回车哦..."
                clearable
                @change="keywordsChange"
                style="width: 270px;margin: 0px;padding: 0px;"
                size="mini"
                @keyup.enter.native="searchPoint"
                prefix-icon="el-icon-search"
                v-model="keywords"
              ></el-input>
              <el-button
                type="primary"
                size="mini"
                style="margin-left: 5px"
                icon="el-icon-search"
                @click="searchPoint"
              >搜索</el-button>
            </div>
          </el-header>
          <el-main style="padding-left: 0px;padding-top: 0px">
            <el-table :data="points" stripe border style="width: 360px" v-loading="tableLoading">
              <el-table-column width="90" prop="workID" label="员工工号" align="center"></el-table-column>
              <el-table-column width="90" prop="ename" label="员工名称" align="center"></el-table-column>
              <el-table-column width="90" prop="rpScore" label="员工积分" align="center"></el-table-column>
              <el-table-column label="详情" align="center" size="mini" width="90">
                <template slot-scope="scope">
                  <el-button size="mini" @click="showDetail(scope.row)">详情</el-button>
                </template>
              </el-table-column>
            </el-table>
            <div style="margin-top:5px;width: 360px">
              <el-button
                type="primary"
                size="mini"
                icon="el-icon-sort"
                @click="reverseOrder"
                style="float:left"
              >换序</el-button>
              <el-pagination
                background
                :page-size="5"
                :current-page="currentPage"
                @current-change="currentChange"
                layout="prev, pager, next"
                :total="totalCount"
                style="float:right"
              ></el-pagination>
            </div>
          </el-main>
        </div>
      </el-col>
    </el-menu>
    <el-dialog title="分数变化详情" :visible.sync="dialogVisible">
      <div ref="myChart" style="width: 100%; height: 400px;"></div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      activeIndex: "preview",
      preview_visible: true,
      details_visible: false,
      //圆饼图相关属性与值
      legend_data: ["大于等于均值人数", "小于均值人数"],
      series_data: [
        { value: 0, name: "大于等于均值人数" },
        { value: 0, name: "小于均值人数" }
      ],
      maxScore: "",
      averageScore: "",
      minScore: "",
      //总记录数，未使用
      count: "",
      //空白记录数，未使用
      blankCount: "",

      //分页
      currentPage: 1,
      totalCount: -1,
      keywords: "",
      order: 0,
      points: [],
      //详情对话框
      dialogVisible: false,
      tableLoading: false,
      //详情折线图
      detail_xAxis: [],
      detail_series: []
    };
  },
  methods: {
    handleSelect(key) {
      if (key != "preview") {
        this.preview_visible = false;
      } else {
        this.preview_visible = true;
      }
      if (key != "details") {
        this.details_visible = false;
      } else {
        this.details_visible = true;
      }
    },
    getPie() {
      var _this = this;
      _this.getRequest("/statistics/score/getPreviewRPScore").then(resp => {
        //console.log(resp.data);
        var data = resp.data;
        _this.minScore = data.minScore + "";
        _this.count = data.count + "";
        _this.maxScore = data.maxScore + "";
        _this.blankCount = data.blankCount + "";
        _this.averageScore = data.averageScore + "";
        _this.series_data[0].value = data.moreThanAverage;
        _this.series_data[1].value = data.lessThanAverage;
        var pie = _this.$refs.pieChart;
        var myChart = _this.echarts.init(pie);
        myChart.setOption({
          color: ["#67C23A", "#F56C6C"], //配置颜色
          tooltip: {
            trigger: "item",
            formatter: "{a} <br/>{b}: {c} ({d}%)"
          },
          legend: {
            orient: "vertical",
            x: "left",
            data: _this.legend_data,
            textStyle: {
              //------------此处更改表格中的字体颜色
              fontSize: "12",
              color: "#fff"
            }
          },
          series: [
            {
              name: "积分概要",
              type: "pie",
              radius: ["50%", "70%"],
              avoidLabelOverlap: false,
              label: {
                normal: {
                  show: false,
                  position: "center"
                },
                emphasis: {
                  show: true,
                  textStyle: {
                    fontSize: "20",
                    fontWeight: "bold"
                  }
                }
              },
              labelLine: {
                normal: {
                  show: false
                }
              },
              data: _this.series_data
            }
          ]
        });
      });
    },
    openDialog() {
      var myChart = this.echarts.init(this.$refs.myChart);
      myChart.setOption({
        title: { text: "详情" },
        tooltip: {},
        toolbox: {
          feature: {
            saveAsImage: {} //下载工具
          }
        },
        xAxis: {
          type: "category",
          data: this.detail_xAxis
        },
        yAxis: {
          type: "value"
        },
        series: [
          {
            name: "分数",
            data: this.detail_series,
            type: "line"
          }
        ]
      });
    },
    showDetail(row) {
      var _this = this;
      this.getRequest("/statistics/score/getDetailsByEid?eid=" + row.eid).then(
        resp => {
          if (resp && resp.status == 200) {
            var data = resp.data;
            _this.detail_xAxis = data.rpDate;
            _this.detail_series = data.rpScore;
            _this.open();
          }
        }
      );
      _this.dialogVisible = true;
    },
    open() {
      this.$nextTick(() => {
        this.openDialog();
      });
    },
    currentChange(currentChange) {
      this.currentPage = currentChange;
      this.loadPoints();
    },
    keywordsChange(val) {
      if (val == "") {
        this.loadPoints();
      }
    },
    reverseOrder() {
      this.order = this.order == 1 ? 0 : 1;
      this.loadPoints();
    },
    searchPoint() {
      this.loadPoints();
    },
    loadPoints() {
      var _this = this;
      this.tableLoading = true;
      this.getRequest(
        "/statistics/score/getRPScoreByPage?page=" +
          this.currentPage +
          "&size=5&keywords=" +
          this.keywords +
          "&order=" +
          this.order
      ).then(resp => {
        this.tableLoading = false;
        if (resp && resp.status == 200) {
          var data = resp.data;
          _this.points = data.rpScores;
          _this.totalCount = data.count;
        }
      });
    }
  },
  mounted: function() {
    this.getPie();
  },
  watch: {
    preview_visible: function(val, oldVal) {
      if (val) {
        this.getPie();
      }
    },
    details_visible: function(val, oldVal) {
      if (val) {
        this.loadPoints();
      }
    }
  }
};
</script>


