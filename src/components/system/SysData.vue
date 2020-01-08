<template>
  <div>
    <el-header style="padding: 0px;display:flex;justify-content:space-between;align-items: center">
      <div style="display: inline">
        <el-date-picker
          v-model="searchDate"
          type="month"
          size="mini"
          value-format="yyyy-MM-dd"
          style="width: 200px;"
          placeholder="选择日期"
          clearable
          @change="search"
        ></el-date-picker>
        <el-button
          type="primary"
          size="mini"
          style="margin-left: 5px"
          icon="el-icon-search"
          @click="search"
        >搜索</el-button>
        <el-button type="primary" size="mini" style="margin-left: 5px" @click="backup">备份</el-button>
      </div>
    </el-header>
    <div style="margin-top: 10px">
      <el-table
        v-loading="loading"
        :data="data"
        size="mini"
        stripe
        border
        @selection-change="handleSelectionChange"
        style="width: 55%"
      >
        <el-table-column type="selection" width="40" align="center"></el-table-column>
        <el-table-column prop="id" label="编号" width="60" align="center"></el-table-column>
        <el-table-column prop="name" label="备份名称" width="180" align="center"></el-table-column>
        <el-table-column width="120" label="创建时间" align="center">
          <template slot-scope="scope">{{ scope.row.createDate | formatDate}}</template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="success" size="mini" @click="recover(scope.$index, scope.row)">恢复</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div style="margin-top:5px;width: 55%">
      <el-button
        style="float:left"
        type="danger"
        size="mini"
        v-if="data.length>0"
        :disabled="multipleSelection.length==0"
        @click="deleteMany"
      >批量删除</el-button>
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
</template>
<script>
export default {
  data() {
    return {
      searchDate: "",
      currentPage: 1,
      totalCount: -1,
      loading: false,
      data: [
        //  {
        //     "id": 7,
        //     "name": "ihr-sql-2020-01-02 17:23:51",
        //     "url": "ihr-sql-1577957031804.sql",
        //     "createDate": "2020-01-02T00:00:00.000+0800"
        // }
      ],
      multipleSelection: []
    };
  },
  methods: {
    loadData() {
      var _this = this;
      this.loading = true;
      if(this.searchDate == null){
        this.searchDate = ""
      }
      this.getRequest(
        "/system/database/getSqlFileByPage?page=" +
          this.currentPage +
          "&size=10&createDate=" +
          this.searchDate
      ).then(resp => {
        this.loading = false;
        if (resp && resp.status == 200) {
          var data = resp.data;
          _this.data = data.databases;
          _this.totalCount = data.count;
          //            _this.emptyEmpData();
        }
      });
    },
    backup() {
      var _this = this;
      var ms = this.$message({
        message: "正在备份中...",
        type: "warning",
        duration: 0,
        showClose:true
      });
      //setTimeout(()=>ms.close(),100)
      //ms.close();
      //this.$message.close();
      this.postRequest("/system/database/backup", {}).then(resp => {
        _this.loading = false;
        if (resp && resp.status == 200) {
          setTimeout(() => ms.close(), 100);
          _this.loadData();
        }
      });
    },
    recover(index, row) {
      console.log(row);
      var _this = this;
      var ms = this.$message({
        message: "正在恢复中...",
        type: "warning",
        duration: 0,
        showClose:true
      });
      //setTimeout(()=>ms.close(),100)
      //ms.close();
      //this.$message.close();
      this.postRequest("/system/database/recover?id="+row.id, {}).then(resp => {
        _this.loading = false;
        if (resp && resp.status == 200) {
          setTimeout(() => ms.close(), 1000);
          _this.loadData();
        }
      });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleDelete(index, row) {
      this.$message.close();
      this.$confirm("删除此条数据库备份, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.doDelete(row.id);
        })
        .catch(() => {});
    },
    deleteMany() {
      this.$confirm(
        "此操作将删除[" +
          this.multipleSelection.length +
          "]条备份记录, 是否继续?",
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
    doDelete(ids) {
      var _this = this;
      this.deleteRequest("/system/database/deleteSqlFileByIds/" + ids).then(
        resp => {
          _this.loading = false;
          if (resp && resp.status == 200) {
            var data = resp.data;
            _this.loadData();
          }
        }
      );
    },
    search() {
      this.loadData();
    },
    currentChange(currentChange) {
      this.currentPage = currentChange;
      this.loadData();
    }
  },
  mounted: function() {
    this.loadData();
  }
};
</script>