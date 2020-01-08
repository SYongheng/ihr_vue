<template>
  <div>
    <el-container>
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
            @keyup.enter.native="searchEmp"
            prefix-icon="el-icon-search"
            v-model="keywords"
          ></el-input>
          <el-button
            type="primary"
            size="mini"
            style="margin-left: 5px"
            icon="el-icon-search"
            @click="searchEmp"
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
          <el-button size="mini" type="success" @click="loadEmps" icon="el-icon-refresh"></el-button>
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
                <el-col :span="4">
                  职位:
                  <el-select
                    v-model="emp.posId"
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
                <el-col :span="4">
                  职称:
                  <el-select
                    v-model="emp.jobLevelId"
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
              </el-row>
              <el-row style="margin-top: 10px">
                <el-col :span="5">
                  所属部门:
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
                    >{{emp.departmentName}}</div>
                  </el-popover>
                </el-col>
                <el-col :span="5" :offset="4">
                  <el-button size="mini" @click="cancelSearch">取消</el-button>
                  <el-button icon="el-icon-search" type="primary" size="mini" @click="searchEmp">搜索</el-button>
                </el-col>
              </el-row>
            </div>
          </transition>
          <el-table
            :data="emps"
            v-loading="tableLoading"
            border
            stripe
            @selection-change="handleSelectionChange"
            size="mini"
            style="width: 55%"
          >
            <el-table-column type="selection" width="40" align="center" fixed="left"></el-table-column>
            <el-table-column prop="name" label="姓名" width="90" align="center" fixed="left"></el-table-column>
            <el-table-column prop="workID" label="工号" width="80" align="center" fixed="left"></el-table-column>
            <el-table-column prop="department.name" label="所属部门" width="110" align="center"></el-table-column>
            <el-table-column prop="position.name" label="职位" width="110" align="center"></el-table-column>
            <el-table-column prop="jobLevel.name" label="职称" width="110" align="center"></el-table-column>
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <el-button @click="showEditEmpView(scope.row)" style="padding: 3px" size="mini">调动</el-button>
                <el-button
                  type="danger"
                  style="padding: 3px"
                  size="mini"
                  @click="deleteEmp(scope.row)"
                >离职</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div style="margin-top: 5px;width: 55%">
            <el-button
              type="danger"
              size="mini"
              v-if="emps.length>0"
              :disabled="multipleSelection.length==0"
              @click="deleteManyEmps"
              style="float:left"
            >批量离职</el-button>
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
    </el-container>
    <el-form :model="emp" :rules="rules" ref="addEmpForm" style="margin: 0px;padding: 0px;">
      <div style="text-align: left">
        <el-dialog
          title="员工调动"
          style="padding: 10px"
          :close-on-click-modal="false"
          :visible.sync="dialogVisible"
          width="70%"
        >
          <el-row>
            <el-col :span="6">
              <div>
                <el-form-item label="姓名:" prop="name">
                  <el-input
                    v-model="emp.name"
                    size="mini"
                    disabled
                    style="width: 150px"
                    placeholder="请输入员工姓名"
                  ></el-input>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="6">
              <div>
                <el-form-item label="工号:" prop="workID">
                  <el-input
                    v-model="emp.workID"
                    disabled
                    size="mini"
                    style="width: 150px"
                    placeholder="员工工号..."
                  ></el-input>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="6">
              <div>
                <el-form-item label="调动日期:" prop="mvDate">
                  <el-date-picker
                    v-model="emp.mvDate"
                    size="mini"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    style="width: 150px"
                    type="date"
                    placeholder="调动日期"
                  ></el-date-picker>
                </el-form-item>
              </div>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="6">
              <el-form-item label="职位:" prop="posId">
                <el-select
                  v-model="emp.posId"
                  filterable
                  style="width: 120px"
                  size="mini"
                  placeholder="请选择职位"
                  @change="$forceUpdate()"
                >
                  <el-option
                    v-for="item in positions"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="职称:" prop="jobLevelId">
                <el-select
                  v-model="emp.jobLevelId"
                  filterable
                  style="width: 120px"
                  size="mini"
                  placeholder="请选择职称"
                  @change="$forceUpdate()"
                >
                  <el-option
                    v-for="item in joblevels"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="所属部门:" prop="departmentId">
                <el-popover
                  v-model="showOrHidePop"
                  style="width: 120px"
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
                    style="width: 150px;height: 26px;display: inline-flex;font-size:13px;border: 1px;border-radius: 5px;border-style: solid;padding-left: 13px;box-sizing:border-box;border-color: #dcdfe6;cursor: pointer;align-items: center"
                    @click.left="showDepTree"
                    v-bind:style="{color: depTextColor}"
                  >{{emp.departmentName}}</div>
                </el-popover>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="5">
              <div>
                <el-form-item label="调动原因" prop="mvReason">
                  <el-input
                    v-model="emp.mvReason"
                    size="mini"
                    style="width: 120px"
                    placeholder="调动原因"
                  ></el-input>
                </el-form-item>
              </div>
            </el-col>
          </el-row>

          <span slot="footer" class="dialog-footer">
            <el-button size="mini" @click="cancelEidt">取 消</el-button>
            <el-button size="mini" type="primary" @click="addEmp('addEmpForm')">确 定</el-button>
          </span>
        </el-dialog>
      </div>
    </el-form>
  </div>
</template>
<script>
export default {
  data() {
    return {
      emps: [],
      keywords: "",
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
      dialogVisible: false,
      tableLoading: false,
      advanceSearchViewVisible: false,
      showOrHidePop: false,
      showOrHidePop2: false,
      emp: {
        name: "",
        gender: "",
        //调动日期
        mvDate: "",
        //调动原因
        mvReason: "",
        idCard: "",
        wedlock: "",
        nationId: "",
        nativePlace: "",
        politicId: "",
        email: "",
        phone: "",
        address: "",
        departmentId: "",
        departmentName: "所属部门",
        jobLevelId: "",
        posId: "",
        engageForm: "",
        tiptopDegree: "",
        specialty: "",
        school: "",
        beginDate: "",
        workState: "",
        workID: "",
        contractTerm: "",
        conversionTime: "",
        notWorkDate: "",
        beginContract: "",
        endContract: "",
        workAge: ""
      },
      rules: {
        name: [{ required: true, message: "必填:姓名", trigger: "blur" }],

        departmentId: [
          { required: true, message: "必填:部门", trigger: "change" }
        ],
        jobLevelId: [
          { required: true, message: "必填:职称", trigger: "change" }
        ],
        posId: [{ required: true, message: "必填:职位", trigger: "change" }],
        workID: [{ required: true, message: "必填:工号", trigger: "blur" }],
        mvDate: [{ required: true, message: "必填:调动日期", trigger: "blur" }],
        mvReason: [
          { required: true, message: "必填:调动原因", trigger: "blur" }
        ]
      }
    };
  },
  mounted: function() {
    this.initData();
    this.loadEmps();
  },
  methods: {
    cancelSearch() {
      this.advanceSearchViewVisible = false;
      this.emptyEmpData();
      this.beginDateScope = "";
      this.loadEmps();
    },
    showAdvanceSearchView() {
      this.advanceSearchViewVisible = !this.advanceSearchViewVisible;
      this.keywords = "";
      if (!this.advanceSearchViewVisible) {
        this.emptyEmpData();
        this.beginDateScope = "";
        this.loadEmps();
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    deleteManyEmps() {
      this.$confirm(
        "此操作将离职[" + this.multipleSelection.length + "]位员工, 是否继续?",
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
          this.doDelete(ids);
        })
        .catch(() => {});
    },
    deleteEmp(row) {
      this.$confirm("此操作将[" + row.name + "]离职, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.doDelete(row.id);
        })
        .catch(() => {});
    },
    doDelete(ids) {
      this.tableLoading = true;
      var _this = this;
      this.deleteRequest("/personnel/empRemove/deleteEmployee/" + ids).then(
        resp => {
          _this.tableLoading = false;
          if (resp && resp.status == 200) {
            var data = resp.data;

            _this.loadEmps();
          }
        }
      );
    },
    keywordsChange(val) {
      if (val == "") {
        this.loadEmps();
      }
    },
    searchEmp() {
      this.loadEmps();
    },
    currentChange(currentChange) {
      this.currentPage = currentChange;
      this.loadEmps();
    },
    loadEmps() {
      var _this = this;
      this.tableLoading = true;
      this.getRequest(
        "/personnel/empRemove/getEmployeeByPage?page=" +
          this.currentPage +
          "&size=10&keywords=" +
          this.keywords +
          "&posId=" +
          this.emp.posId +
          "&jobLevelId=" +
          this.emp.jobLevelId +
          "&departmentId=" +
          this.emp.departmentId
      ).then(resp => {
        this.tableLoading = false;
        if (resp && resp.status == 200) {
          var data = resp.data;
          _this.emps = data.emps;
          _this.totalCount = data.count;
          //            _this.emptyEmpData();
        }
      });
    },
    addEmp(formName) {
      var _this = this;
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.emp.id) {
            //更新
            this.tableLoading = true;
            this.putRequest(
              "/personnel/empRemove/updateEmpRemove?&removeDate="+this.emp.mvDate+"&remark="+this.emp.mvReason,
              this.emp
            ).then(resp => {
              _this.tableLoading = false;
              if (resp && resp.status == 200) {
                var data = resp.data;
                _this.dialogVisible = false;
                _this.emptyEmpData();
                _this.loadEmps();
              }
            });
          } else {
            //添加
            this.tableLoading = true;
            this.postRequest("/employee/basic/emp", this.emp).then(resp => {
              _this.tableLoading = false;
              if (resp && resp.status == 200) {
                var data = resp.data;

                _this.dialogVisible = false;
                _this.emptyEmpData();
                _this.loadEmps();
              }
            });
          }
        } else {
          return false;
        }
      });
    },
    cancelEidt() {
      this.dialogVisible = false;
      this.emptyEmpData();
    },
    showDepTree() {
      this.showOrHidePop = !this.showOrHidePop;
    },
    showDepTree2() {
      this.showOrHidePop2 = !this.showOrHidePop2;
    },
    handleNodeClick(data) {
      this.emp.departmentName = data.name;
      this.emp.departmentId = data.id;
      this.showOrHidePop = false;
      this.depTextColor = "#606266";
    },
    handleNodeClick2(data) {
      this.emp.departmentName = data.name;
      this.emp.departmentId = data.id;
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
          _this.emp.workID = data.workID;
        }
      });
    },
    showEditEmpView(row) {
      console.log(row);
      this.dialogTitle = "编辑员工";
      this.disabled = true;
      this.emp = row;
      this.emp.birthday = this.formatDate(row.birthday);
      this.emp.conversionTime = this.formatDate(row.conversionTime);
      this.emp.beginContract = this.formatDate(row.beginContract);
      this.emp.endContract = this.formatDate(row.endContract);
      this.emp.beginDate = this.formatDate(row.beginDate);
      this.emp.nationId = row.nation.id;
      this.emp.politicId = row.politicsStatus.id;
      this.emp.departmentId = row.department.id;
      this.emp.departmentName = row.department.name;
      this.emp.jobLevelId = row.jobLevel.id;
      this.emp.posId = row.position.id;
      //        delete this.emp.department;
      //        delete this.emp.jobLevel;
      //        delete this.emp.position;
      //        delete this.emp.nation;
      //        delete this.emp.politicsStatus;
      delete this.emp.salary;
      delete this.emp.workAge;
      delete this.emp.notWorkDate;
      this.dialogVisible = true;
      this.mvDate = "";
      this.mvReason = "";
      console.log(this.emp);
    },
    showAddEmpView() {
      this.dialogTitle = "添加员工";
      this.dialogVisible = true;
      this.disabled = false;
      var _this = this;
      this.getRequest("/employee/basic/maxWorkID").then(resp => {
        if (resp && resp.status == 200) {
          _this.emp.workID = resp.data;
        }
      });
    },
    emptyEmpData() {
      this.emp = {
        name: "",
        gender: "",
        birthday: "",
        idCard: "",
        wedlock: "",
        nationId: "",
        nativePlace: "",
        politicId: "",
        email: "",
        phone: "",
        address: "",
        departmentId: "",
        departmentName: "所属部门",
        jobLevelId: "",
        posId: "",
        engageForm: "",
        tiptopDegree: "",
        specialty: "",
        school: "",
        beginDate: "",
        workState: "",
        workID: "",
        contractTerm: "",
        conversionTime: "",
        notWorkDate: "",
        beginContract: "",
        endContract: "",
        workAge: ""
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
