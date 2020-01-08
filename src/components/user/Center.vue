<template>
  <div>
    <el-container>
      <el-header
        style="padding: 0px;display:flex;justify-content:space-between;align-items: center"
      ></el-header>
      <el-main>
        <div>
          <!-- <img
            :src="info.userface"
            style="width: 100px;height: 100px;margin-right: 5px;margin-left: 5px;border-radius: 40px"
          />-->
          <el-avatar :size="100" :src="info.userface"></el-avatar>
          <el-button type="text" class="el-icon-upload" @click="editUserfaceDialog = true"></el-button>
        </div>
        <el-row type="flex" justify="center">
          <el-col :span="8">
            <el-row style="padding-top: 10px;padding-bottom: 10px">
              登录账号：
              <el-input v-model="info.username" readonly disabled></el-input>
              <el-button type="text" class="el-icon-edit" disabled></el-button>
            </el-row>
            <el-row style="padding-top: 10px;padding-bottom: 10px">
              手机号码：
              <el-input v-model="info.phone" readonly></el-input>
              <el-button type="text" class="el-icon-edit" @click="editPhoneDialog = true"></el-button>
            </el-row>
            <el-row style="padding-top: 10px;padding-bottom: 10px">
              家庭电话：
              <el-input v-model="info.telephone" readonly></el-input>
              <el-button type="text" class="el-icon-edit" @click="editTelephoneDialog = true"></el-button>
            </el-row>
          </el-col>
          <el-col :span="8">
            <el-row style="padding-top: 10px;padding-bottom: 10px">
              账号昵称：
              <el-input v-model="info.name" readonly></el-input>
              <el-button type="text" class="el-icon-edit" @click="editNameDialog = true"></el-button>
            </el-row>
            <el-row style="padding-top: 10px;padding-bottom: 10px">
              账号密码：
              <el-input value="zonghansb" readonly type="password"></el-input>
              <el-button type="text" class="el-icon-edit" @click="editPasswordDialog = true"></el-button>
            </el-row>
            <el-row style="padding-top: 10px;padding-bottom: 10px">
              联系地址：
              <el-input v-model="info.address" readonly></el-input>
              <el-button type="text" class="el-icon-edit" @click="editAddressDialog = true"></el-button>
            </el-row>
          </el-col>
        </el-row>

        <el-row type="flex" justify="center" style="padding-top: 10px;padding-bottom: 10px">
          <el-col :span="16">
            我的备注：
            <el-input v-model="info.remark" readonly style="width:80%"></el-input>
            <el-button type="text" class="el-icon-edit" @click="editRemarkDialog = true"></el-button>
          </el-col>
        </el-row>
      </el-main>
    </el-container>

    <!-- 修改账号昵称对话框 -->
    <el-dialog
      title="修改昵称"
      :visible.sync="editNameDialog"
      @close="editNameClosed"
      @open="editNameOpen"
    >
      <el-form :model="editNameForm" ref="editNameRef" :rules="editNameRules">
        <el-form-item label="新昵称：" prop="name">
          <el-input v-model="editNameForm.name"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editNameDialog = false">取 消</el-button>
        <el-button type="primary" @click="editName">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 修改手机号码对话框 -->
    <el-dialog
      title="修改手机号码"
      :visible.sync="editPhoneDialog"
      @close="editPhoneClosed"
      @open="editPhoneOpen"
    >
      <el-form :model="editPhoneForm" ref="editPhoneRef" :rules="editPhoneRules">
        <el-form-item label="新手机号码：" prop="phone">
          <el-input v-model="editPhoneForm.phone"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editPhoneDialog = false">取 消</el-button>
        <el-button type="primary" @click="editPhone">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 修改家庭电话对话框 -->
    <el-dialog
      title="修改家庭电话"
      :visible.sync="editTelephoneDialog"
      @close="editTelephoneClosed"
      @open="editTelephoneOpen"
    >
      <el-form :model="editTelephoneForm" ref="editTelephoneRef" :rules="editTelephoneRules">
        <el-form-item label="新家庭电话：" prop="telephone">
          <el-input v-model="editTelephoneForm.telephone"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editTelephoneDialog = false">取 消</el-button>
        <el-button type="primary" @click="editTelephone">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 修改联系地址对话框 -->
    <el-dialog
      title="修改联系地址"
      :visible.sync="editAddressDialog"
      @close="editAddressClosed"
      @open="editAddressOpen"
    >
      <el-form :model="editAddressForm" ref="editAddressRef" :rules="editAddressRules">
        <el-form-item label="新联系地址：" prop="address">
          <el-input v-model="editAddressForm.address"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editAddressDialog = false">取 消</el-button>
        <el-button type="primary" @click="editAddress">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 修改我的备注对话框 -->
    <el-dialog
      title="修改我的备注"
      :visible.sync="editRemarkDialog"
      @close="editRemarkClosed"
      @open="editRemarkOpen"
    >
      <el-form :model="editRemarkForm" ref="editRemarkRef" :rules="editRemarkRules">
        <el-form-item label="新备注：" prop="remark">
          <el-input v-model="editRemarkForm.remark"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editRemarkDialog = false">取 消</el-button>
        <el-button type="primary" @click="editRemark">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 修改账号密码对话框 -->
    <el-dialog title="修改账号密码" :visible.sync="editPasswordDialog" @close="editPasswordClosed">
      <el-form :model="editPasswordForm" ref="editPasswordRef" :rules="editPasswordRules">
        <el-form-item label="旧密码：" prop="oldPassword">
          <el-input type="password" v-model="editPasswordForm.oldPassword"></el-input>
        </el-form-item>
        <el-form-item label="新密码：" prop="password">
          <el-input type="password" v-model="editPasswordForm.password"></el-input>
        </el-form-item>
        <el-form-item label="请确认：" prop="newPassword">
          <el-input type="password" v-model="editPasswordForm.newPassword"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editPasswordDialog = false">取 消</el-button>
        <el-button type="primary" @click="editPassword">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 修改头像对话框 -->
    <el-dialog title="修改头像" :visible.sync="editUserfaceDialog" @close="editUserfaceClosed">
      <el-upload
        class="avatar-uploader"
        action="/hrCenter/updateHrUserface"
        :show-file-list="false"
        :before-upload="beforeAvatarUpload"
        :auto-upload="false"
        :on-change="handleChange"
        :on-success="handleAvatarSuccess"
        ref="editUserfaceRef"
        :model="editUserfaceForm"
        :data="uploadData"
      >
        <img v-if="editUserfaceForm.userface" :src="editUserfaceForm.userface" class="avatar" />
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        <!-- <img src="/hrCenter/image/3-1576852137343-8.jpg"> -->
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editUserfaceDialog = false">取 消</el-button>
        <el-button type="primary" @click="editUserface">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getRequest } from "../../utils/api";
export default {
  data() {
    // 验证手机号的规则
    var checkMobile = (rule, value, cb) => {
      // 验证手机号的正则表达式
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;

      if (regMobile.test(value)) {
        return cb();
      }
      cb(new Error("请输入合法的手机号"));
    };
    var checkTelephone = (rule, value, cb) => {
      // 验证家庭电话的正则表达式
      const regTelephone = /^[0][1-9]{2,3}-[0-9]{5,10}$/;

      if (regTelephone.test(value)) {
        return cb();
      }
      cb(new Error("请输入合法的家庭电话或请添加区号"));
    };
    var validatePass = (rule, value, callback) => {
      // console.log("验证")
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.editPasswordForm.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    var validateOldNew = (rule, value, callback) => {
      // console.log("验证")
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value === this.editPasswordForm.oldPassword) {
        callback(new Error("旧密码与新密码不能一致！"));
      } else {
        callback();
      }
    };
    return {
      info: {
        userface: "",
        username: "",
        phone: "",
        telephone: "",
        name: "",
        address: "",
        remark: ""
      },
      //修改昵称相关属性
      editNameDialog: false,
      editNameForm: { name: "" },
      editNameRules: {
        name: [
          { required: true, message: "昵称不能为空！", trigger: "blur" },
          {
            min: 3,
            max: 12,
            message: "用户名的长度在3~12个字符之间",
            trigger: "blur"
          }
        ]
      },
      //修改手机号码相关属性
      editPhoneDialog: false,
      editPhoneForm: { phone: "" },
      editPhoneRules: {
        phone: [
          { required: true, message: "手机号码不能为空！", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" }
        ]
      },
      //修改家庭电话相关属性
      editTelephoneDialog: false,
      editTelephoneForm: { telephone: "" },
      editTelephoneRules: {
        telephone: [
          { required: true, message: "家庭电话不能为空！", trigger: "blur" },
          { validator: checkTelephone, trigger: "blur" }
        ]
      },
      //修改联系地址相关属性
      editAddressDialog: false,
      editAddressForm: { address: "" },
      editAddressRules: {
        address: [
          { required: true, message: "联系地址不能为空！", trigger: "blur" },
          {
            min: 4,
            max: 50,
            message: "联系地址长度在4~50个字符之间",
            trigger: "blur"
          }
        ]
      },
      //修改我的备注相关属性
      editRemarkDialog: false,
      editRemarkForm: { remark: "" },
      editRemarkRules: {
        remark: [
          {
            min: 0,
            max: 256,
            message: "备注长度小于256个字符",
            trigger: "blur"
          }
        ]
      },
      //修改账号密码相关属性
      editPasswordDialog: false,
      editPasswordForm: { oldPassword: "", password: "", newPassword: "" },
      editPasswordRules: {
        oldPassword: [
          { required: true, message: "密码为空！", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "密码长度在3~10个字符之间",
            trigger: "blur"
          }
        ],
        password: [
          { required: true, message: "密码为空！", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "密码长度在3~10个字符之间",
            trigger: "blur"
          },
          { validator: validateOldNew, trigger: "blur" }
        ],
        newPassword: [
          { required: true, message: "密码为空！", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "密码长度在3~10个字符之间",
            trigger: "blur"
          },
          { validator: validatePass, trigger: "blur" }
        ]
      },
      //上传头像相关属性
      editUserfaceDialog: false,
      editUserfaceForm: { userface: "" },
      uploadData:{id:''}
    };
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
    routes() {
      //console.log(this.$store.state.routes);
      return this.$store.state.routes;
    }
  },
  created() {
    this.getInfo();
  },
  methods: {
    getInfo() {
      var _this = this;
      // console.log(_this.$store.state.user.id);
      _this
        .getRequest("/hrCenter/basicPage?id=" + _this.$store.state.user.id)
        .then(resp => {
          console.log(resp.data);
          var data = resp.data;
          _this.info.userface = data.userface;
          _this.info.username = data.username;
          _this.info.phone = data.phone;
          _this.info.telephone = data.telephone;
          _this.info.name = data.name;
          _this.info.address = data.address;
          _this.info.remark = data.remark;
        });
    },

    //修改昵称对话框
    editName() {
      this.$refs.editNameRef.validate(async valid => {
        if (!valid) return;
        // 发起修改用户昵称的数据请求
        //console.log("验证通过")
        const { data: res } = await this.putRequest("/hrCenter/updateHr", {
          id: this.$store.state.user.id,
          name: this.editNameForm.name
        });
        //更新数据
        this.$store.commit("updateUserName", this.editNameForm.name);
        this.info.name = this.editNameForm.name;
        // 关闭对话框
        this.editNameDialog = false;
      });
    },
    editNameClosed() {
      this.$refs.editNameRef.resetFields();
    },
    editNameOpen() {
      this.editNameForm.name = this.info.name;
    },
    //修的手机号码
    editPhoneClosed() {
      this.$refs.editPhoneRef.resetFields();
    },
    editPhone() {
      //console.log("手机号码");
      this.$refs.editPhoneRef.validate(async valid => {
        if (!valid) return;
        // 发起修改手机号码的数据请求
        //console.log("验证通过")
        const { data: res } = await this.putRequest("/hrCenter/updateHr", {
          id: this.$store.state.user.id,
          phone: this.editPhoneForm.phone
        });
        //更新数据
        this.info.phone = this.editPhoneForm.phone;
        // 关闭对话框
        this.editPhoneDialog = false;
      });
    },
    editPhoneOpen() {
      this.editPhoneForm.phone = this.info.phone;
    },
    //修的家庭电话
    editTelephoneClosed() {
      this.$refs.editTelephoneRef.resetFields();
    },
    editTelephone() {
      //console.log("家庭电话");
      this.$refs.editTelephoneRef.validate(async valid => {
        if (!valid) return;
        // 发起修改家庭号码的数据请求
        //console.log("验证通过")
        const { data: res } = await this.putRequest("/hrCenter/updateHr", {
          id: this.$store.state.user.id,
          telephone: this.editTelephoneForm.telephone
        });
        //更新数据
        this.info.telephone = this.editTelephoneForm.telephone;
        // 关闭对话框
        this.editTelephoneDialog = false;
      });
    },
    editTelephoneOpen() {
      this.editTelephoneForm.telephone = this.info.telephone;
    },
    //修的联系地址
    editAddressClosed() {
      this.$refs.editAddressRef.resetFields();
    },
    editAddress() {
      //console.log("联系地址");
      this.$refs.editAddressRef.validate(async valid => {
        if (!valid) return;
        // 发起修改联系地址的数据请求
        //console.log("验证通过")
        const { data: res } = await this.putRequest("/hrCenter/updateHr", {
          id: this.$store.state.user.id,
          address: this.editAddressForm.address
        });
        //更新数据
        this.info.address = this.editAddressForm.address;
        // 关闭对话框
        this.editAddressDialog = false;
      });
    },
    editAddressOpen() {
      this.editAddressForm.address = this.info.address;
    },
    //修改我的备注
    editRemarkClosed() {
      this.$refs.editRemarkRef.resetFields();
    },
    editRemark() {
      //console.log("我的备注");
      this.$refs.editRemarkRef.validate(async valid => {
        if (!valid) return;
        // 发起修改我的备注的数据请求
        //console.log("验证通过")
        const { data: res } = await this.putRequest("/hrCenter/updateHr", {
          id: this.$store.state.user.id,
          remark: this.editRemarkForm.remark
        });
        //更新数据
        this.info.remark = this.editRemarkForm.remark;
        // 关闭对话框
        this.editRemarkDialog = false;
      });
    },
    editRemarkOpen() {
      this.editRemarkForm.remark = this.info.remark;
    },
    //修改我的密码
    editPasswordClosed() {
      this.$refs.editPasswordRef.resetFields();
    },
    editPassword() {
      //console.log("我的密码");
      //console.log(this.editPasswordForm);
      this.$refs.editPasswordRef.validate(async valid => {
        if (!valid) return;
        // 发起修改账号密码的数据请求
        //console.log("验证通过")
        const { data: res } = await this.putRequest(
          "/hrCenter/updateHrPassword",
          {
            oldPassword: this.editPasswordForm.oldPassword,
            id: this.$store.state.user.id,
            password: this.editPasswordForm.password
          }
        );
        //更新数据
        //this.info.remark = this.editRemarkForm.remark;
        // 关闭对话框
        this.getRequest("/logout");
        this.$store.commit("logout");
        this.$router.replace({ path: "/" });
        this.editPasswordDialog = false;
      });

      //this.editPasswordDialog = false;
    },
    //上传头像
    handleAvatarSuccess(res, file) {
      console.log("上传成功")
      this.editUserfaceForm.userface = res.obj.url;
      this.info.userface = res.obj.url;
      this.$store.commit("updateUserface", this.info.userface);
      this.editUserfaceDialog = false;
      //this.editUserfaceForm.userface = URL.createObjectURL(file.raw);
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      // if(!(isJPG && isLt2M)){
      //   this.editUserfaceDialog = true
      // }
      this.uploadData.id = this.$store.state.user.id
      return isJPG && isLt2M;
    },
    editUserface() {
      //console.log("上传头像");
      this.$refs.editUserfaceRef.submit();
      
    },
    editUserfaceClosed() {
      //console.log("关闭头像对话框");
      //console.log(this.editUserfaceForm);
      this.editUserfaceForm.userface = '';
      //this.$refs.editPasswordRef.resetFields();
    },
    handleChange(file, fileList) {
      this.editUserfaceForm.userface = URL.createObjectURL(file.raw);
    }
  }
};
</script>

<style>
.el-input {
  width: 60%;
  /*outline: medium;*/
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>