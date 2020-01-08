<template>
  <div>
    <el-container>
      <el-header
        style="padding: 0px;display:flex;justify-content:space-between;align-items: center"
      >
        <div style="display: inline">
          <el-input
            placeholder="通过员工名搜索信息,记得回车哦..."
            clearable
            @change="keywordsChange"
            style="width: 270px;margin: 0px;padding: 0px;"
            size="mini"
            @keyup.enter.native="search"
            prefix-icon="el-icon-search"
            v-model="keywords"
          ></el-input>
          <el-select
            size="mini"
            v-model="searchDepId"
            placeholder="请选择"
            clearable
            @change="keywordsChange"
          >
            <el-option v-for="item in deps" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
          <el-date-picker
            v-model="searchDate"
            type="month"
            size="mini"
            value-format="yyyy-MM-dd"
            style="width: 200px;"
            placeholder="选择日期"
            @change="keywordsChange"
            clearable
          ></el-date-picker>
          <el-button
            type="primary"
            size="mini"
            style="margin-left: 5px"
            icon="el-icon-search"
            @click="search"
          >搜索</el-button>
          <!-- <el-button
            @click="dialogVisible = true"
            icon="el-icon-plus"
            type="success"
            size="mini"
          >生成工资表</el-button> -->
        </div>
      </el-header>
      <el-main style="padding-left: 0px;padding-top: 0px">
        <el-table
          :data="historys"
          stripe
          border
          v-loading="tableLoading"
          size="mini"
          @selection-change="handleSelectionChange"
          style="width: 80%"
        >
          <el-table-column type="selection" width="50"></el-table-column>
          <el-table-column width="100" prop="workID" label="员工工号" align="center"></el-table-column>
          <el-table-column width="100" prop="ename" label="员工名称" align="center"></el-table-column>
          <el-table-column width="100" prop="basicSalary" label="基本账套薪资" align="center"></el-table-column>
          <el-table-column width="100" prop="titleLevelCommission" label="职称提成" align="center"></el-table-column>
          <el-table-column width="100" prop="rpCommission" label="奖惩提成" align="center"></el-table-column>
          <el-table-column width="100" prop="allSalary" label="已发工资" align="center"></el-table-column>
          <el-table-column label="日期" align="center">
            <template slot-scope="scope">{{ scope.row.createDate | formatDate}}</template>
          </el-table-column>
        </el-table>
        <div style="margin-top: 5px;width: 80%">
          
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
      </el-main>
    </el-container>
    
  </div>
</template>
<script>
export default {
  data() {
    return {
      depId: 1,
      deps: [],
      dialogVisible: false,
      dialogForm: {
        depId: "",
        date: "",
        subSenior: 2500,
        senior: 3000,
        intermediate: 2000,
        primary: 1500,
        junior: 1000,
        rpScorePer: 1
      },
      //查询
      keywords: "",
      currentPage: 1,
      totalCount: -1,
      searchDate: "",
      searchDepId: "",
      //表格
      historys: [
        // {
        //   workID: "1",
        //   ename: "lzr",
        //   allSalary: 11,
        //   basicSalary: 888,
        //   titleLevelCommission: 500,
        //   rpCommission: 200,
        //   createDate: "2019-01-09"
        // }
      ],
      tableLoading: false,
      multipleSelection: []
    };
  },
  methods: {
    loadDeps() {
      var _this = this;
      this.getRequest("/salary/waiting/deps").then(resp => {
        if (resp && resp.status == 200) {
          _this.deps = resp.data;
        }
      });
    },
    loadhistorys() {
      var _this = this;
      this.getRequest(
        "/salary/history/getHistorySalarySumByPage?page=" +
          this.currentPage +
          "&size=10&keywords=" +
          this.keywords +
          "&date=" +
          this.searchDate +
          "&departmentId=" +
          this.searchDepId
      ).then(resp => {
        if (resp && resp.status == 200) {
          var data = resp.data;
          _this.historys = data.salarySums;
          //_this.searchDepId = data.departmentId;
          _this.totalCount = data.count;
          //_this.searchDate = data.date;
        }
      });
    },
    openDialog() {
      this.dialogForm = {
        depId: "",
        date: "",
        subSenior: 2500,
        senior: 3000,
        intermediate: 2000,
        primary: 1500,
        junior: 1000,
        rpScorePer: 1
      };
      this.dialogForm.depId = this.depId;
      console.log(this.dialogForm);
    },
    closeDialog() {
      // this.searchDate = this.dialogForm.data;
      // this.searchDepId = this.dialogForm.depId;
    },
    create() {
      console.log(this.dialogForm);
      this.searchDate = this.dialogForm.date;
      this.searchDepId = this.dialogForm.depId;
      var _this = this;
      this.dialogVisible = false;
      this.postRequest("/salary/waiting/createSalarySum", {
        departmentId: this.dialogForm.depId,
        date: this.dialogForm.date,
        senior: this.dialogForm.senior,
        subSenior: this.dialogForm.subSenior,
        intermediate: this.dialogForm.intermediate,
        primary: this.dialogForm.primary,
        junior: this.dialogForm.junior,
        rpScorePer: this.dialogForm.rpScorePer
      }).then(resp => {
        if (resp && resp.status == 200) {
          _this.currentPage = 1;

          _this.loadhistorys();
        }
      });
    },
    //查询
    search() {
      //部门和日期
      this.currentPage = 1;
      this.loadhistorys();
    },
    keywordsChange() {
      this.loadhistorys();
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      //console.log( this.multipleSelection);
    },
    handout(index, row) {
      this.$confirm(
        "此操作将发放[" + row.ename + "]的工资, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          this.doHandout(row.id);
        })
        .catch(() => {});
    },
    handoutAll() {
      this.$confirm(
        "此操作将发放[" +
          this.multipleSelection.length +
          "]位员工的工资, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          var ids = "";
          for (var i = 0; i < this.multipleSelection.length; i++) {
            ids += this.multipleSelection[i].id + ",";
          }
          //console.log(ids);
          this.doHandout(ids);
        })
        .catch(() => {});
    },
    doHandout(ids) {
      this.tableLoading = true;
      var _this = this;
      this.putRequest("/salary/waiting/handOutSalarySumByIds/" + ids, {}).then(
        resp => {
          _this.tableLoading = false;
          if (resp && resp.status == 200) {
            //var data = resp.data;
            _this.loadhistorys();
          }
        }
      );
    },
    currentChange(currentChange) {
      this.currentPage = currentChange;
      this.loadhistorys();
    }
  },
  mounted: function() {
    this.loadDeps();
    this.loadhistorys();
  }
};
</script>
<style>
.el-table th {
  display: table-cell !important;
}
</style>
