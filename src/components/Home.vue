<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header style="height:80px;">
      <div>
        <img
          src="../assets/login_logo.jpg"
          alt=""
        >
        <span>{{loginName}} 管理后台</span>
      </div>
      <el-button
        type="danger"
        @click="logout"
        size="mini"
        round
      >注销</el-button>
    </el-header>
    <el-container>
      <!-- 页面主体 -->
      <el-aside :width="isCollapse ? '65px' : '200px'">
        <div
          class="toggle-button"
          @click="toggleCollapse"
        >
          |||
        </div>
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409bff"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          style="border-right:1px solid"
          router
          :default-active='activePath'
        >
          <!-- 一级菜单 -->
          <el-submenu
            :index="item.id+''"
            v-for="(item) in menulist"
            :key="item.id"
          >
            <!-- 一级菜单模版区域 -->
            <template slot="title">
              <!-- 图标 -->
              <i :class="iconsObj[item.id]"></i>
              <!-- 文本 -->
              <span>{{item.authName}}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item
              :index="'/'+subItem.path"
              v-for="(subItem) in item.children"
              :key="subItem.id"
              @click="saveNavState('/'+subItem.path)"
            >
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-menu"></i>
                <!-- 文本 -->
                <span>{{subItem.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧主体区 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      loginName: '',
      menulist: [],
      iconsObj: {
        125: 'el-icon-s-custom',
        103: 'el-icon-s-open',
        101: 'el-icon-s-cooperation',
        102: 'el-icon-s-order',
        145: 'el-icon-s-promotion'
      },
      isCollapse: false,
      activePath: ''
    }
  },
  created() {
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
    this.loginName = window.sessionStorage.getItem('loginName')
  },
  methods: {
    logout() {
      window.sessionStorage.clear()
      this.$router.push('login')
    },
    async getMenuList() {
      const { data: result } = await this.$http.get('menus')
      if (result.meta.status !== 200) return this.$message.error(result.meta.msg)
      this.menulist = result.data
    },
    // 点击按钮，左侧菜单折叠与展开
    toggleCollapse() {
      this.isCollapse = !this.isCollapse
    },
    saveNavState(activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    }
  }
}
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
}
.el-header {
  padding-left: 25px;
  padding-right: 40px;
  align-items: center;
  color: #fff;
  font-size: 20px;
  display: flex;
  justify-content: space-between;
  background-color: #373d41;
  > div {
    display: flex;
    align-items: center;
    img {
      width: 55px;
      height: 55px;
      border: 1px solid #fff;
      border-radius: 50%;
      box-shadow: 0 0 10px #ddd;
    }
    span {
      margin-left: 15px;
    }
  }
}

.el-aside {
  background-color: #333744;
}

.el-main {
  background-color: #eaedf1;
}

.toggle-button {
  background-color: #4a5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
  border-right: none;
}
</style>
