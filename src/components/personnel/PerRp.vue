<template>
  <div>
    <!-- <h1>员工奖惩：列表显示所有(员工名称，工号，奖罚分数，奖罚日期，（奖|罚），备注)，包含分页；高级搜索：员工名称，日期区间，奖罚类型：奖和罚</h1> -->
    <el-container>
      <el-header
        style="display: flex;justify-content: space-between;align-items: center;padding-left: 0px"
      >
        <div style="display: inline">
          <el-input
            placeholder="通过员工名搜索奖惩信息,记得回车哦..."
            clearable
            @change="keywordsChange"
            style="width: 300px;margin: 0px;padding: 0px;"
            size="mini"
            :disabled="advanceSearchViewVisible"
            @keyup.enter.native="searchRP"
            prefix-icon="el-icon-search"
            v-model="keywords"
          ></el-input>
          <el-button
            type="primary"
            size="mini"
            style="margin-left: 5px"
            icon="el-icon-search"
            @click="searchRP"
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
        <div style="margin-left: 5px;margin-right: 20px;display: inline">
          <el-button
            @click="dialogVisible = true"
            icon="el-icon-plus"
            type="primary"
            size="mini"
          >添加记录</el-button>
          <el-button size="mini" type="success" @click="loadRPs" icon="el-icon-refresh"></el-button>
        </div>
      </el-header>
      <el-main style="padding-left: 0px;padding-top: 0px">
        <div>
          <transition name="slide-fade">
            <div
              style="margin-bottom: 10px;border: 1px;border-radius: 5px;border-style: solid;padding: 5px 0px 5px 0px;box-sizing:border-box;border-color: #20a0ff"
              v-show="advanceSearchViewVisible"
            >
              <el-row style="margin-top: 10px">
                <el-col :span="5">
                  奖罚类型:
                  <el-radio v-model="rpType" label="1">奖</el-radio>
                  <el-radio v-model="rpType" label="0">罚</el-radio>
                </el-col>
                <el-col :span="10">
                  奖罚日期:
                  <el-date-picker
                    v-model="beginDateScope"
                    unlink-panels
                    size="mini"
                    type="daterange"
                    value-format="yyyy-MM-dd"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  ></el-date-picker>
                </el-col>
                <el-col :span="5" :offset="4">
                  <el-button size="mini" @click="cancelSearch">取消</el-button>
                  <el-button icon="el-icon-search" type="primary" size="mini" @click="searchRP">搜索</el-button>
                </el-col>
              </el-row>
            </div>
          </transition>

          <el-table
            :data="rps"
            stripe
            v-loading="tableLoading"
            size="mini"
            @selection-change="handleSelectionChange"
            style="width: 100%"
          >
            <el-table-column type="selection" width="40"></el-table-column>
            <el-table-column width="90" prop="workID" label="员工工号" align="center"></el-table-column>
            <el-table-column width="90" prop="ename" label="员工名称" align="center"></el-table-column>
            <el-table-column width="80" prop="rpPoint" label="奖罚分数" align="center"></el-table-column>
            <el-table-column width="90" label="奖罚日期" align="center">
              <template slot-scope="scope">{{ scope.row.rpDate | formatDate}}</template>
            </el-table-column>
            <el-table-column width="80" label="奖罚类型" align="center">
              <template slot-scope="scope">
                  <el-alert
                    v-if="scope.row.rpType == 1"
                    title="奖"
                    type="success"
                    center
                    :closable="false"
                    style="height:30px;width:30px"
                  ></el-alert>
                  <el-alert
                    v-if="scope.row.rpType == 0"
                    title="罚"
                    type="error"
                    center
                    :closable="false"
                    style="height:30px;width:30px"
                  ></el-alert>
              </template>
            </el-table-column>
            <el-table-column
              label="奖罚原因"
              prop="remark"
              align="center"
              :show-overflow-tooltip="true"
            ></el-table-column>
            <el-table-column label="操作" align="center" width="80">
              <el-table-column
                label="编辑"
                align="center"
                style="padding: 3px 4px 3px 4px;margin: 2px"
                size="mini"
                width="80"
              >
                <template slot-scope="scope">
                  <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                </template>
              </el-table-column>
              <el-table-column
                label="删除"
                align="center"
                style="padding: 3px 4px 3px 4px;margin: 2px"
                size="mini"
                width="80"
              >
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    type="danger"
                    @click="handleDelete(scope.$index, scope.row)"
                  >删除</el-button>
                </template>
              </el-table-column>
            </el-table-column>
          </el-table>
        </div>
        <!-- v-if="salaries!=0" -->
        <div style="margin-top: 5px;width: 100%">
          <el-button
            type="danger"
            round
            size="mini"
            v-if="rps.length>0"
            :disabled="multipleSelection.length==0"
            @click="deleteAll"
            style="float:left"
          >批量删除</el-button>
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
    </el-container>
    <div style="text-align: left">
      <el-dialog
        title="添加员工奖惩记录"
        :visible.sync="dialogVisible"
        width="50%"
        @close="dialogClose"
        :close-on-click-modal="false"
      >
        <div style="display: flex;justify-content: flex-start;">
          <el-steps :active="index" direction="vertical">
            <el-step title="员工信息" size="mini"></el-step>
            <el-step title="奖罚信息"></el-step>
            <el-step title="奖罚日期"></el-step>
            <el-step title="奖罚原因"></el-step>
          </el-steps>
          <div
            style="margin-left: 30px;display: flex;justify-content: center;align-items: center;width: 80%;"
          >
            <div v-show="index==0">
              <div>
                员工姓名：
                <el-input placeholder="请输入员工姓名" size="mini" style="width: 200px" v-model="rp.name"></el-input>
              </div>
              <div style="margin-top: 10px">
                员工工号：
                <el-input
                  placeholder="请输入员工工号"
                  size="mini"
                  @keyup.enter.native="next"
                  style="width: 200px"
                  v-model="rp.workId"
                ></el-input>
              </div>
            </div>
            <div v-show="index==1">
              <div>
                <el-radio v-model="rp.type" label="1">奖</el-radio>
                <el-radio v-model="rp.type" label="0">罚</el-radio>
              </div>
              <div>
                奖罚分数：
                <el-input
                  placeholder="请输入奖罚分数"
                  @keyup.enter.native="next"
                  size="mini"
                  style="width: 200px"
                  type="number"
                  v-model="rp.point"
                ></el-input>
              </div>
            </div>
            <div v-show="index==2">
              奖罚日期：
              <el-date-picker
                v-model="rp.date"
                type="date"
                size="mini"
                value-format="yyyy-MM-dd"
                style="width: 200px;"
                placeholder="选择日期"
              ></el-date-picker>
            </div>
            <div v-show="index==3">
              奖罚原因：
              <el-input
                placeholder="请输入奖罚原因"
                size="mini"
                @keyup.enter.native="next"
                style="width: 200px"
                type="textarea"
                v-model="rp.reason"
              ></el-input>
            </div>
          </div>
        </div>
        <div
          style="display: flex;align-items: center;justify-content: center;padding: 0px;margin: 0px;"
        >
          <el-button round size="mini" v-if="index!=0" @click="index--">上一步</el-button>
          <el-button type="primary" style="margin:5px" round size="mini" @click="next" v-text="index==3?'完成':'下一步'"></el-button>
        </div>
      </el-dialog>
    </div>
    <!-- 修改奖罚信息对话框 -->
    <el-dialog title="修改奖罚信息" :visible.sync="editDialog" @close="editClosed">
      <el-form :model="editForm" ref="editRef">
        <el-form-item label="员工名称：" prop="ename">
          <el-input v-model="editForm.ename" type="text" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="奖罚分数：" prop="rpPoint">
          <el-input v-model="editForm.rpPoint" type="number"></el-input>
        </el-form-item>
        <el-form-item label="奖罚类型：" prop="rpType">
          <el-radio v-model="editForm.rpType" label="1">奖</el-radio>
          <el-radio v-model="editForm.rpType" label="0">罚</el-radio>
        </el-form-item>
        <el-form-item label="奖罚日期" prop="rpDate">
          <el-date-picker
            v-model="editForm.rpDate"
            type="date"
            size="mini"
            value-format="yyyy-MM-dd"
            style="width: 200px;"
            placeholder="选择日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="奖罚原因：" prop="remark">
          <el-input v-model="editForm.remark" type="textarea"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialog = false">取 消</el-button>
        <el-button type="primary" @click="edit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      dialogVisible: false,
      tableLoading: false,
      editDialog: false,
      advanceSearchViewVisible: false,
      keywords: "",
      rpType: "",
      beginDateScope: "",
      faangledoubleup: "fa-angle-double-up",
      faangledoubledown: "fa-angle-double-down",
      currentPage: 1,
      totalCount: -1,
      rps: [],
      index: 0,
      //奖罚对象
      rp: {
        name: "",
        workId: "",
        type: "1",
        point: "",
        date: "",
        reason: "",
        id: ""
      },
      multipleSelection: [],
      editForm: {
        id: "",
        eid: "",
        workID: "",
        ename: "",
        rpDate: "",
        rpPoint: "",
        rpType: "",
        remark: ""
      }
    };
  },
  mounted: function() {
    this.loadRPs();
  },
  methods: {
    next() {
      var _this = this;
      if (this.index == 0) {
        //验证员工
        var url =
          "/personnel/rp/verifyWorkIDAndName?workID=" +
          this.rp.workId +
          "&name=" +
          this.rp.name;
        _this.getRequest(url).then(resp => {
          var data = resp.data;
          if (data && data.status == 200) {
            _this.rp.id = data.obj.eid;
            _this.index++;
          }
        });
      } else if (this.index == 3) {
        //提交添加,关闭对话框
        //console.log(this.rp);
        var url = "/personnel/rp/addRP";
        this.postRequest(url, {
          eid: this.rp.id,
          rpDate: this.rp.date,
          rpPoint: this.rp.point,
          rpType: this.rp.type,
          remark: this.rp.reason
        }).then(resp => {
          var data = resp.data;
          if (data && data.status == 200) {
            this.dialogVisible = false;
            this.loadRPs();
          }
        });
      } else {
        //步骤条增加
        this.index++;
      }
    },
    dialogClose() {
      this.rp = {
        name: "",
        workId: "",
        type: "1",
        point: "",
        date: "",
        reason: ""
      };
      this.index = 0;
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      //console.log( this.multipleSelection);
    },
    handleEdit(index, row) {
      this.editDialog = true;
      //this.editForm = row;
      this.editForm.id = row.id;
      this.editForm.eid = row.eid;
      this.editForm.workID = row.workID;
      this.editForm.ename = row.ename;
      this.editForm.rpDate = row.rpDate;
      this.editForm.rpPoint = row.rpPoint;
      this.editForm.rpType = row.rpType + "";
      this.editForm.remark = row.remark;
      //console.log(this.editForm);
    },
    handleDelete(index, row) {
      this.$confirm("此操作将永久删除[" + row.ename + "], 是否继续?", "提示", {
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
      this.deleteRequest("/personnel/rp/deleteRPByIds/" + ids).then(resp => {
        _this.tableLoading = false;
        if (resp && resp.status == 200) {
          var data = resp.data;
          _this.loadRPs();
        }
      });
    },
    deleteAll() {
      this.$confirm(
        "此操作将删除[" + this.multipleSelection.length + "]条数据, 是否继续?",
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
    loadRPs() {
      var _this = this;
      this.tableLoading = true;
      this.getRequest(
        "/personnel/rp/getRPByPage?page=" +
          this.currentPage +
          "&size=5&keywords=" +
          this.keywords +
          "&rpType=" +
          this.rpType +
          "&beginDateScope=" +
          this.beginDateScope
      ).then(resp => {
        _this.tableLoading = false;
        if (resp && resp.status == 200) {
          var data = resp.data;
          _this.rps = data.rps;
          _this.totalCount = data.count;
          // console.log(_this.rps);
        }
      });
    },
    keywordsChange(val) {
      if (val == "") {
        this.loadRPs();
      }
    },
    searchRP() {
      this.loadRPs();
    },
    showAdvanceSearchView() {
      this.advanceSearchViewVisible = !this.advanceSearchViewVisible;
      this.keywords = "";
      if (!this.advanceSearchViewVisible) {
        this.rpType = "";
        this.beginDateScope = "";
        this.loadRPs();
      }
    },
    cancelSearch() {
      this.advanceSearchViewVisible = false;
      //console.log(this.rpType);
      //console.log(this.beginDateScope);
      this.rpType = "";
      this.beginDateScope = "";
      this.loadRPs();
    },
    currentChange(currentChange) {
      this.currentPage = currentChange;
      this.loadRPs();
    },
    editClosed() {
      this.editForm = {
        id: "",
        eid: "",
        workID: "",
        ename: "",
        rpDate: "",
        rpPoint: "",
        rpType: "",
        remark: ""
      };
    },
    editOpen() {
      console.log(this.editForm.id);
      console.log(this.editForm.eid);
      console.log(this.editForm.workID);
      console.log(this.editForm.ename);
      console.log(this.editForm.rpDate);
      console.log(this.editForm.rpPoint);
      console.log(this.editForm.rpType);
      console.log(this.editForm.remark);
    },
    edit() {
      //console.log(this.editForm);
      var _this = this;
      this.putRequest("/personnel/rp/updateRP", this.editForm).then(resp => {
        if (resp && resp.status == 200) {
          var data = resp.data;
          _this.editDialog = false;
          _this.loadRPs();
        }
      });
    }
  }
};
</script>
<style lang="css">
.el-table th {
	display: table-cell!important; 
}
.el-tooltip__popper {
  max-width: 40%;
}
</style>