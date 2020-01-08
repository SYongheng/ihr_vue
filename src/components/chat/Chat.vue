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
        <el-menu-item index="friendchat">
          <span slot="title">好友聊天</span>
        </el-menu-item>
        <el-menu-item index="notification">
          <span slot="title">系统通知</span>
        </el-menu-item>
      </el-col>
      <el-col :span="22" style="padding-left: 10px">
        <fc v-if="fc_visible"></fc>
        <nf v-if="nf_visible"></nf>
      </el-col>
    </el-menu>
    <!-- <el-tabs v-model="activeName" @tab-click="handleClick" style="margin-top: 10px">
      <el-tab-pane label="系统通知" name="notification">
        <nf></nf>
      </el-tab-pane>
      <el-tab-pane label="好友聊天" name="chat">
        <fc></fc>
      </el-tab-pane>
    </el-tabs>-->
  </div>
</template>
<script>
import FriendChat from "@/components/chat/FriendChat";
import Notification from "@/components/chat/Notification";
export default {
  data() {
    return {
      //activeName: "notification",
      fc_visible: true,
      nf_visible: false,
      activeIndex:"friendchat"
    };
  },
  methods: {
    handleSelect(key) {
      if (key != "friendchat") {
        this.fc_visible = false;
      } else {
        this.fc_visible = true;
      }
      if (key != "notification") {
        this.nf_visible = false;
      } else {
        this.nf_visible = true;
      }
    }
  },
  components: {
    fc: FriendChat,
    nf: Notification
  },
  created() {
    console.log("init");
  }
};
</script>
