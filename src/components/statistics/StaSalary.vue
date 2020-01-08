<template>
  <el-menu
    :default-active="activeIndex"
    mode="vertical"
    @select="handleSelect"
    style="margin-top: 10px"
    active-text-color="#409EFF"
  >
    <el-col :span="2">
      <el-menu-item index="preview">
        <span slot="title">工资概要</span>
      </el-menu-item>
      <el-menu-item index="details">
        <span slot="title">工资详情</span>
      </el-menu-item>
    </el-col>
    <el-col :span="22" style="padding-left: 10px">
      <div v-show="preview_visible">
        <el-select size="mini" v-model="depId" placeholder="请选择" @change="keywordsChange">
          <el-option v-for="item in deps" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
        <div ref="myChart" style="width: 100%; height: 400px;"></div>
      </div>
      <div v-show="details_visible">
        <el-header
          style="display: flex;justify-content: space-between;align-items: center;padding-left: 0px"
        >
          <div style="display: inline">
            <el-input
              placeholder="通过员工名搜索薪资信息,记得回车哦..."
              clearable
              style="width: 270px;margin: 0px;padding: 0px;"
              size="mini"
              @keyup.enter.native="search"
              @change="keywordsChange2"
              prefix-icon="el-icon-search"
              v-model="keywords"
            ></el-input>
            <el-button
              type="primary"
              size="mini"
              style="margin-left: 5px"
              icon="el-icon-search"
              @click="search"
            >搜索</el-button>
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-sort"
              @click="reverseOrder"
              
            >换序</el-button>
          </div>
        </el-header>
        <el-main style="padding-left: 0px;padding-top: 0px">
          <el-table :data="emps" stripe border style="width: 400px" v-loading="tableLoading">
            <el-table-column width="90" prop="workID" label="员工工号" align="center"></el-table-column>
            <el-table-column width="90" prop="ename" label="员工名称" align="center"></el-table-column>
            <el-table-column width="130" prop="allSalary" label="平均薪水" align="center"></el-table-column>
            <el-table-column label="详情" align="center" size="mini" width="90">
              <template slot-scope="scope">
                <el-button size="mini" @click="showDetail(scope.row)">详情</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div style="margin-top:5px;width: 400px">
            
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
    <el-dialog title="历史薪资详情" :visible.sync="dialogVisible">
      <div ref="historyChart" style="width: 100%; height: 400px;"></div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">关闭</el-button>
      </span>
    </el-dialog>
  </el-menu>
</template>
<script>
export default {
  data() {
    return {
      activeIndex: "preview",
      preview_visible: true,
      details_visible: false,
      deps: [],
      depId: 1,
      //详情折线图
      detail_xAxis:[],// ["2016-12-12","2019-11-27","2019-11-29","2019-12-05","2019-12-23"],
      //最高
      detail_series1: [],//["3", "891", "-108", "-1773", "-2772"],
      //最低
      detail_series2: [],//["312", "223", "-2234", "-32", "2311"],
      //平均
      detail_series3: [],//["2312", "2223", "-32234", "-322", "2311"],
      //详情相关变量
      //查找员工关键字
      keywords: "",
      order: 0,
      currentPage: 1,
      totalCount: -1,
      tableLoading: false,
      emps: [{ workID: "0001", ename: "lzr", aveSalary: 444.2 }],
      //详情对话框
      dialogVisible: false,
      detail_xAxisH: [],//,
      detail_seriesH: [],//["312", "223", "-2234", "-32", "2311"]
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
    loadDeps() {
      var _this = this;
      this.getRequest("/salary/waiting/deps").then(resp => {
        if (resp && resp.status == 200) {
          _this.deps = resp.data;
        }
      });
    },
    loadEmps() {
      var _this = this;
      this.getRequest("/statistics/salary/getEmpSalarySumByPage?page="
      + this.currentPage
      +"&size=5&order="+this.order+"&keywords="+this.keywords
      ).then(resp => {
        if (resp && resp.status == 200) {
          var data = resp.data;
          _this.totalCount = data.count;
          _this.emps = data.empSalarySums;
        }
      });
    },
    getDepChart() {
      var _this = this;
      this.getRequest(
        "/statistics/salary/getPreviewSalarySum?departmentId=" + this.depId
      ).then(resp => {
        if (resp && resp.status == 200) {
          var data = resp.data;
          //console.log(_this.depId);
          _this.detail_xAxis = data.createDates;
          _this.detail_series1 = data.maxs;
          _this.detail_series2 = data.mins;
          _this.detail_series3 = data.averages;
          _this.initChart();
        }
      });
    },
    initChart() {
      var myChart = this.echarts.init(this.$refs.myChart);
      myChart.setOption({
        legend: {
          data: ["最高", "最低", "平均"]
        },
        tooltip: {
          trigger: "axis"
        },
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
            name: "最高",
            data: this.detail_series1,
            type: "line",
            lineStyle: {
              width: 2
            }
          },
          {
            name: "最低",
            data: this.detail_series2,
            type: "line",
            lineStyle: {
              width: 2
            }
          },
          {
            name: "平均",
            data: this.detail_series3,
            type: "line",
            lineStyle: {
              width: 2
            }
          }
        ]
      });
    },
    keywordsChange() {
      this.getDepChart();
    },
    //详情相关函数
    search() {
      this.loadEmps();
    },
    keywordsChange2(val) {
      if (val == "") {
        this.loadEmps();
      }
    },
    reverseOrder() {
       this.order = this.order == 1 ? 0 : 1;
      this.loadEmps();
    },
    currentChange(currentChange) {
       this.currentPage = currentChange;
      this.loadEmps();
    },
    //详情
    showDetail(row) {
      var _this = this;
      this.getRequest("/statistics/salary/getDetailsByEid?eid=" + row.eid).then(
        resp => {
          if (resp && resp.status == 200) {
            var data = resp.data;
            _this.detail_xAxisH = data.createDate;
            _this.detail_seriesH = data.salarySum;
            _this.open();
          }
        }
      );
      // _this.open();
      _this.dialogVisible = true;
    },
    open() {
      this.$nextTick(() => {
        this.openDialog();
      });
    },
    openDialog() {
      var myChart = this.echarts.init(this.$refs.historyChart);
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
          data: this.detail_xAxisH
        },
        yAxis: {
          type: "value"
        },
        series: [
          {
            name: "薪资",
            data: this.detail_seriesH,
            type: "line"
          }
        ]
      });
    }
  },
  mounted: function() {
    this.getDepChart();
    this.loadDeps();
  },
  watch: {
    preview_visible: function(val, oldVal) {
      if (val) {
        this.getDepChart();
        this.loadDeps();
      }
    },
    details_visible: function(val, oldVal) {
      if (val) {
        this.loadEmps();
      }
    }
  }
};
</script>
<style scoped>
</style>