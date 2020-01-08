<template>
  <div>
    <div style="text-align: left">
      <el-input
        placeholder="请输入职位名称"
        size="mini"
        @keyup.enter.native="addPosition"
        style="width: 200px"
        v-model="positionName"
      ></el-input>
      <el-button type="primary" icon="el-icon-plus" size="mini" @click="addPosition">添加</el-button>
    </div>
    <div style="margin-top: 10px">
      <el-table
        v-loading="loading"
        :data="posData"
        size="mini"
        stripe
        border
        @selection-change="handleSelectionChange"
        style="width: 45%"
      >
        <el-table-column type="selection" width="40" align="center"></el-table-column>
        <el-table-column prop="id" label="编号" width="60" align="center"></el-table-column>
        <el-table-column prop="name" label="职位名称" width="120" align="center"></el-table-column>
        <el-table-column width="120" label="创建时间" align="center">
          <template slot-scope="scope">{{ scope.row.createDate | formatDate}}</template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div style="text-align: left;margin-top: 10px">
      <el-button
        type="danger"
        size="mini"
        v-if="posData.length>0"
        :disabled="multipleSelection.length==0"
        @click="deleteMany"
      >批量删除</el-button>
    </div>
    <div style="text-align: center">
      <el-dialog title="职位编辑" :visible.sync="dialogVisible" width="25%">
        职位名称：
        <el-input
          v-model="updatePosName"
          size="mini"
          style="margin-top: 10px; width: 60%"
          placeholder="请输入新的职位名称"
        ></el-input>
        <span slot="footer" class="dialog-footer">
          <el-button size="mini" @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" size="mini" @click="updatePosNameExec">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
export default {
  mounted: function() {
    this.loadTableData();
  },
  methods: {
    updatePosNameExec() {
      if (!this.isNotNullORBlank(this.updatePosName)) {
        this.$message.warning("职位名称不能为空!");
        return;
      }
      this.loading = true;
      var _this = this;
      this.putRequest("/system/basic/position", {
        name: this.updatePosName,
        id: this.updatePosId
      }).then(resp => {
        _this.loading = false;
        if (resp && resp.status == 200) {
          this.dialogVisible = false;
          var data = resp.data;

          _this.loadTableData();
        }
      });
    },
    deleteMany() {
      var _this = this;
      this.$confirm(
        "删除" + this.multipleSelection.length + "条数据, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          var multipleSelection = _this.multipleSelection;
          var ids = "";
          multipleSelection.forEach(row => {
            ids = ids + row.id + ",";
          });
          _this.doDelete(ids);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    addPosition() {
      if (!this.isNotNullORBlank(this.positionName)) {
        this.$message.warning("职位名称不能为空!");
        return;
      }
      var _this = this;
      this.loading = true;
      this.postRequest("/system/basic/position", {
        name: this.positionName,
      }).then(resp => {
        _this.loading = false;
        if (resp && resp.status == 200) {
          var data = resp.data;

          _this.loadTableData();
          _this.positionName = "";
          _this.titleLevel = "";
        }
      });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleEdit(index, row) {
      this.updatePosName = row.name;
      this.updatePosId = row.id;
      this.dialogVisible = true;
    },
    handleDelete(index, row) {
      var _this = this;
      this.$confirm("删除[" + row.name + "], 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          _this.doDelete(row.id);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    doDelete(ids) {
      var _this = this;
      _this.loading = true;
      var url = "/system/basic/position/";
      this.deleteRequest(url + ids).then(resp => {
        _this.loading = false;
        if (resp && resp.status == 200) {
          _this.loadTableData();
        }
      });
    },
    loadTableData() {
      var _this = this;
      this.loading = true;
      this.getRequest("/system/basic/positions").then(resp => {
        _this.loading = false;
        if (resp && resp.status == 200) {
          _this.posData = resp.data;
        }
      });
    }
  },
  data() {
    return {
      positionName: "",
      updatePosName: "",
      updatePosId: -1,
      loading: false,
      dialogVisible: false,
      multipleSelection: [],
      type: [],
      nameLabelName: "职位名称",
      posData: []
    };
  }
};
</script>
