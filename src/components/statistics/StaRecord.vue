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
          <span slot="title">调动概要</span>
        </el-menu-item>
        <el-menu-item index="details">
          <span slot="title">调动详情</span>
        </el-menu-item>
      </el-col>
      <el-col :span="22" style="padding-left: 10px">
        <div v-show="details_visible">
          <el-header
            style="padding: 0px;display:flex;justify-content:space-between;align-items: center"
          >
            <div style="display: inline">
              <el-input
                placeholder="通过员工名搜索员工,记得回车哦..."
                clearable
                @change="keywordsChange"
                style="width: 300px;margin: 0px;padding: 0px;"
                size="mini"
                :disabled="advanceSearchViewVisible"
                @keyup.enter.native="searchRecord"
                prefix-icon="el-icon-search"
                v-model="keywords"
              ></el-input>
              <el-button
                type="primary"
                size="mini"
                style="margin-left: 5px"
                icon="el-icon-search"
                @click="searchRecord"
              >搜索</el-button>
              <el-button
                slot="reference"
                type="primary"
                size="mini"
                style="margin-left: 5px"
                @click="showAdvanceSearchView"
              >
                <i
                  class="fa fa-lg"
                  v-bind:class="[advanceSearchViewVisible ? faangledoubleup:faangledoubledown]"
                  style="margin-right: 5px"
                ></i>高级搜索
              </el-button>
            </div>
          </el-header>
          <el-main style="padding-left: 0px;padding-top: 0px">
            <div>
              <transition name="slide-fade">
                <div
                  style="margin-bottom: 10px;border: 1px;border-radius: 5px;border-style: solid;padding: 5px 0px 5px 0px;box-sizing:border-box;border-color: #20a0ff"
                  v-show="advanceSearchViewVisible"
                >
                  <el-row>
                    <el-col :span="5">
                      前职位:
                      <el-select
                        v-model="advKeys.prePosId"
                        filterable
                        style="width: 130px"
                        size="mini"
                        placeholder="请选择职位"
                      >
                        <el-option
                          v-for="item in positions"
                          :key="item.id"
                          :label="item.name"
                          :value="item.id"
                        ></el-option>
                      </el-select>
                    </el-col>
                    <el-col :span="5">
                      前职称:
                      <el-select
                        v-model="advKeys.preJobLevelId"
                        filterable
                        style="width: 130px"
                        size="mini"
                        placeholder="请选择职称"
                      >
                        <el-option
                          v-for="item in joblevels"
                          :key="item.id"
                          :label="item.name"
                          :value="item.id"
                        ></el-option>
                      </el-select>
                    </el-col>
                    <el-col :span="5">
                      前部门:
                      <el-popover
                        v-model="showOrHidePop"
                        placement="right"
                        title="请选择部门"
                        trigger="manual"
                      >
                        <el-tree
                          :data="deps"
                          :default-expand-all="true"
                          :props="defaultProps"
                          :expand-on-click-node="false"
                          @node-click="handleNodeClick"
                        ></el-tree>
                        <div
                          slot="reference"
                          style="width: 130px;height: 26px;display: inline-flex;font-size:12px;border: 1px;border-radius: 5px;border-style: solid;padding-left: 13px;box-sizing:border-box;border-color: #dcdfe6;cursor: pointer;align-items: center"
                          @click="showDepTree"
                          v-bind:style="{color: depTextColor}"
                        >{{advKeys.preDepartmentName}}</div>
                      </el-popover>
                    </el-col>
                  </el-row>
                  <el-row style="margin-top: 10px">
                    <el-col :span="5">
                      现职位:
                      <el-select
                        v-model="advKeys.nowPosId"
                        filterable
                        style="width: 130px"
                        size="mini"
                        placeholder="请选择职位"
                      >
                        <el-option
                          v-for="item in positions"
                          :key="item.id"
                          :label="item.name"
                          :value="item.id"
                        ></el-option>
                      </el-select>
                    </el-col>
                    <el-col :span="5">
                      现职称:
                      <el-select
                        v-model="advKeys.nowJobLevelId"
                        filterable
                        style="width: 130px"
                        size="mini"
                        placeholder="请选择职称"
                      >
                        <el-option
                          v-for="item in joblevels"
                          :key="item.id"
                          :label="item.name"
                          :value="item.id"
                        ></el-option>
                      </el-select>
                    </el-col>
                    <el-col :span="5">
                      现部门:
                      <el-popover
                        v-model="showOrHidePop2"
                        placement="right"
                        title="请选择部门"
                        trigger="manual"
                      >
                        <el-tree
                          :data="deps"
                          :default-expand-all="true"
                          :props="defaultProps"
                          :expand-on-click-node="false"
                          @node-click="handleNodeClick2"
                        ></el-tree>
                        <div
                          slot="reference"
                          style="width: 130px;height: 26px;display: inline-flex;font-size:12px;border: 1px;border-radius: 5px;border-style: solid;padding-left: 13px;box-sizing:border-box;border-color: #dcdfe6;cursor: pointer;align-items: center"
                          @click="showDepTree2"
                          v-bind:style="{color: depTextColor}"
                        >{{advKeys.nowDepartmentName}}</div>
                      </el-popover>
                    </el-col>
                    <el-col :span="5" :offset="4">
                      <el-button size="mini" @click="cancelSearch">取消</el-button>
                      <el-button
                        icon="el-icon-search"
                        type="primary"
                        size="mini"
                        @click="searchRecord"
                      >搜索</el-button>
                    </el-col>
                  </el-row>
                </div>
              </transition>
              <el-table
                :data="records"
                v-loading="tableLoading"
                border
                stripe
                @selection-change="handleSelectionChange"
                size="mini"
                style="width: 100%"
              >
                <el-table-column prop="ename" label="姓名" width="90" align="center" fixed="left"></el-table-column>
                <el-table-column prop="workID" label="工号" width="80" align="center" fixed="left"></el-table-column>
                <el-table-column label="前部门" width="110" align="center">
                  <template slot-scope="scope">
                    <div
                      v-if="scope.row.sourceDepName != scope.row.targetDepName && scope.row.targetDepName != '离职'"
                      style="background:red;color:white"
                    >{{scope.row.sourceDepName}}</div>
                    <div
                      v-if="scope.row.sourceDepName == scope.row.targetDepName || scope.row.targetDepName == '离职'"
                    >{{scope.row.sourceDepName}}</div>
                  </template>
                </el-table-column>
                <el-table-column label="现部门" width="110" align="center">
                  <template slot-scope="scope">
                    <div
                      v-if="scope.row.sourceDepName != scope.row.targetDepName  && scope.row.targetDepName != '离职'"
                      style="background:green;color:white"
                    >{{scope.row.targetDepName}}</div>
                    <div
                      v-if="scope.row.targetDepName == '离职'"
                      style="background:black;color:white"
                    >{{scope.row.targetDepName}}</div>
                    <div
                      v-if="scope.row.sourceDepName == scope.row.targetDepName"
                    >{{scope.row.targetDepName}}</div>
                  </template>
                </el-table-column>
                <el-table-column label="前职位" width="110" align="center">
                  <template slot-scope="scope">
                    <div
                      v-if="scope.row.sourcePosName != scope.row.targetPosName  && scope.row.targetDepName != '离职'"
                      style="background:red;color:white"
                    >{{scope.row.sourcePosName}}</div>
                    <div
                      v-if="scope.row.sourcePosName == scope.row.targetPosName || scope.row.targetDepName == '离职'"
                    >{{scope.row.sourcePosName}}</div>
                  </template>
                </el-table-column>
                <el-table-column prop="targetPosName" label="现职位" width="110" align="center">
                  <template slot-scope="scope">
                    <div
                      v-if="scope.row.sourcePosName != scope.row.targetPosName"
                      style="background:green;color:white"
                    >{{scope.row.targetPosName}}</div>
                    <div
                      v-if="scope.row.sourcePosName == scope.row.targetPosName"
                    >{{scope.row.targetPosName}}</div>
                  </template>
                </el-table-column>
                <el-table-column prop="sourceJobName" label="前职称" width="110" align="center">
                  <template slot-scope="scope">
                    <div
                      v-if="scope.row.sourceJobName != scope.row.targetJobName  && scope.row.targetDepName != '离职'"
                      style="background:red;color:white"
                    >{{scope.row.sourceJobName}}</div>
                    <div
                      v-if="scope.row.sourceJobName == scope.row.targetJobName || scope.row.targetDepName == '离职'"
                    >{{scope.row.sourceJobName}}</div>
                  </template>
                </el-table-column>
                <el-table-column prop="targetJobName" label="现职称" width="110" align="center">
                  <template slot-scope="scope">
                    <div
                      v-if="scope.row.sourceJobName != scope.row.targetJobName"
                      style="background:green;color:white"
                    >{{scope.row.targetJobName}}</div>
                    <div
                      v-if="scope.row.sourceJobName == scope.row.targetJobName"
                    >{{scope.row.targetJobName}}</div>
                  </template>
                </el-table-column>
                <el-table-column width="90" label="调动日期" align="center">
                  <template slot-scope="scope">{{ scope.row.removeDate | formatDate}}</template>
                </el-table-column>
                <el-table-column
                  label="调动原因"
                  prop="remark"
                  align="center"
                  :show-overflow-tooltip="true"
                ></el-table-column>
              </el-table>
              <div style="margin-top: 5px;width: 100%">
                <div style="float:left;font-size:smaller">注：部门、职位、职称发生调动会着色强调</div>
                <el-pagination
                  background
                  :page-size="10"
                  :current-page="currentPage"
                  @current-change="currentChange"
                  layout="prev, pager, next"
                  :total="totalCount"
                  style="float:right"
                ></el-pagination>
              </div>
            </div>
          </el-main>
        </div>
        <div v-show="preview_visible">
          <el-divider></el-divider>
          <div ref="pieChart" style="width:80%;height:350px; text-align:center"></div>
        </div>
      </el-col>
    </el-menu>
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
      legend_data: ["调动人数", "未调动人数", "离职人数"],
      series_data: [
        { value: 0, name: "调动人数" },
        { value: 0, name: "未调动人数" },
        { value: 0, name: "离职人数" }
      ],
      records: [],
      keywords: "",
      advKeys: {
        prePosId: "",
        nowPosId: "",
        preJobLevelId: "",
        nowJobLevelId: "",
        preDepartmentName: "所属部门",
        preDepartmentId: "",
        nowDepartmentName: "所属部门",
        nowDepartmentId: ""
      },
      beginDateScope: "",
      faangledoubleup: "fa-angle-double-up",
      faangledoubledown: "fa-angle-double-down",
      dialogTitle: "",
      disabled: true,
      multipleSelection: [],
      depTextColor: "#c0c4cc",
      nations: [],
      politics: [],
      positions: [],
      joblevels: [],
      totalCount: -1,
      currentPage: 1,
      deps: [],
      defaultProps: {
        label: "name",
        isLeaf: "leaf",
        children: "children"
      },
      tableLoading: false,
      advanceSearchViewVisible: false,
      showOrHidePop: false,
      showOrHidePop2: false
    };
  },
  mounted: function() {
    this.initData();
    this.loadRecords();
    this.getPie();
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
      _this.getRequest("/statistics/record/getPreviewEmpRemove").then(resp => {
        //console.log(resp.data);
        var data = resp.data;
        _this.series_data[0].value = data.removeCount;
        _this.series_data[1].value = data.staticCount;
        _this.series_data[2].value = data.dismissionCount;
        var pie = _this.$refs.pieChart;
        var myChart = _this.echarts.init(pie);
        myChart.setOption({
          color: ["#E6A23C", "#67C23A", "#F56C6C"], //配置颜色
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
              name: "调动概要",
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
    cancelSearch() {
      this.advanceSearchViewVisible = false;
      this.emptyAdvkeys();
      this.beginDateScope = "";
      this.loadRecords();
    },
    showAdvanceSearchView() {
      this.advanceSearchViewVisible = !this.advanceSearchViewVisible;
      this.keywords = "";
      if (!this.advanceSearchViewVisible) {
        this.emptyAdvkeys();
        this.beginDateScope = "";
        this.loadRecords();
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    keywordsChange(val) {
      if (val == "") {
        this.loadRecords();
      }
    },
    searchRecord() {
      this.loadRecords();
    },
    currentChange(currentChange) {
      this.currentPage = currentChange;
      this.loadRecords();
    },
    loadRecords() {
      var _this = this;
      this.tableLoading = true;
      this.getRequest(
        "/statistics/record/getEmpRemoveByPage?page=" +
          this.currentPage +
          "&size=10&keywords=" +
          this.keywords +
          "&sourceDepId=" +
          this.advKeys.preDepartmentId +
          "&sourcePosId=" +
          this.advKeys.prePosId +
          "&sourceJobId=" +
          this.advKeys.preJobLevelId +
          "&targetDepId=" +
          this.advKeys.nowDepartmentId +
          "&targetPosId=" +
          this.advKeys.nowPosId +
          "&targetJobId=" +
          this.advKeys.nowJobLevelId
      ).then(resp => {
        this.tableLoading = false;
        if (resp && resp.status == 200) {
          var data = resp.data;
          _this.records = data.empRemoves;
          _this.totalCount = data.count;
          //            _this.emptyAdvkeys();
        }
      });
    },
    showDepTree() {
      this.showOrHidePop = !this.showOrHidePop;
    },
    showDepTree2() {
      this.showOrHidePop2 = !this.showOrHidePop2;
    },
    handleNodeClick(data) {
      this.advKeys.preDepartmentName = data.name;
      this.advKeys.preDepartmentId = data.id;
      this.showOrHidePop = false;
      this.depTextColor = "#606266";
    },
    handleNodeClick2(data) {
      this.advKeys.nowDepartmentName = data.name;
      this.advKeys.nowDepartmentId = data.id;
      this.showOrHidePop2 = false;
      this.depTextColor = "#606266";
    },
    initData() {
      var _this = this;
      this.getRequest("/employee/basic/basicdata").then(resp => {
        if (resp && resp.status == 200) {
          var data = resp.data;
          //console.log(resp)
          _this.nations = data.nations;
          _this.politics = data.politics;
          _this.deps = data.deps;
          _this.positions = data.positions;
          _this.joblevels = data.joblevels;
        }
      });
    },
    emptyAdvkeys() {
      this.advKeys = {
        prePosId: "",
        nowPosId: "",
        preJobLevelId: "",
        nowJobLevelId: "",
        preDepartmentName: "所属部门",
        preDepartmentId: "",
        nowDepartmentName: "所属部门",
        nowDepartmentId: ""
      };
    }
  }
};
</script>
<style>
.el-dialog__body {
  padding-top: 0px;
  padding-bottom: 0px;
}
.el-table th {
  display: table-cell !important;
}

.slide-fade-enter-active {
  transition: all 0.8s ease;
}

.slide-fade-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter,
.slide-fade-leave-to {
  transform: translateX(10px);
  opacity: 0;
}
</style>
