<template>
  <el-menu
    :default-active="activeIndex"
    mode="vertical"
    @select="handleSelect"
    style="margin-top: 10px"
    active-text-color="#409EFF"
  >
  <el-col :span="2">
      <el-menu-item index="dep-mana">
        <span slot="title">部门管理</span>
      </el-menu-item>
      <el-menu-item index="pos-mana">
        <span slot="title">职位管理</span>
      </el-menu-item>
      <el-menu-item index="jobtitle-mana">
        <span slot="title">职称管理</span>
      </el-menu-item>
      <el-menu-item index="menu-role">
        <span slot="title">权限管理</span>
      </el-menu-item>
  </el-col>
    <el-col :span="22" style="padding-left: 10px">
      <dep-mana v-if="dep_mana_visible"></dep-mana>
      <pos-mana v-if="pos_mana_visible"></pos-mana>
      <jobtitle-mana v-if="jobtitle_mana_visible"></jobtitle-mana>
      <menu-role v-if="menu_role_visible"></menu-role>
    </el-col>
  </el-menu>

</template>
<script>
import MenuRole from "./basic/MenuRole.vue";
import DepMana from "./basic/DepMana.vue";
import JobTitleMana from "./basic/JobTitleMana.vue";
import PosMana from "./basic/PosMana.vue";
export default {
  data() {
    return {
      activeIndex: "dep-mana",
      dep_mana_visible: true,
      pos_mana_visible: false,
      jobtitle_mana_visible: false,
      menu_role_visible: false
    };
  },
  methods: {
    handleSelect(key) {
      if (key != "dep-mana") {
        this.dep_mana_visible = false;
      } else {
        this.dep_mana_visible = true;
      }
      if (key != "pos-mana") {
        this.pos_mana_visible = false;
      } else {
        this.pos_mana_visible = true;
        
      }
      if (key != "jobtitle-mana") {
        this.jobtitle_mana_visible = false;
      } else {
        this.jobtitle_mana_visible = true;
        
      }
      if (key != "menu-role") {
        this.menu_role_visible = false;
      } else {
        this.menu_role_visible = true;
      }
      //console.log(key);
    }
  },
  components: {
    "dep-mana": DepMana,
    "pos-mana": PosMana,
    "jobtitle-mana": JobTitleMana,
    "menu-role": MenuRole
  }
};
</script>
