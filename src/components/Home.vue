<template>
    <el-container class="home">
     <el-header>
         <div class="logo"></div>
         <div class="logout">
             <span>欢迎光临</span>
             <a href="javascript:;" @click="logout">退出</a>
         </div>
         <div class="title">
             <h3>电商后台管理系统</h3>
         </div>
     </el-header>
     <el-container>
       <el-aside width="200px">
           <el-menu
            :default-active="$route.path.slice(1).split('-')[0]"
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#ffd04b"
            unique-opened
            router>
            <el-submenu v-for="menu in menuList" :key="menu.id" :index="menu.path">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>{{menu.authName}}</span>
              </template>
                <el-menu-item v-for="item in menu.children" :key="item.id" :index="item.path">
                <i class="el-icon-menu"></i>
                <span slot="title">{{item.authName}}</span>
                </el-menu-item>
            </el-submenu>
         </el-menu>
       </el-aside>
       <el-main>
           <router-view></router-view>
       </el-main>
     </el-container>
    </el-container>
</template>

<script>
export default {
  data () {
    return {
      menuList: []
    }
  },
  methods: {
    async logout() {
      try {
        await this.$confirm('你确定要退出吗?', '温馨提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        localStorage.removeItem('token')
        this.$router.push('/login')
        this.$message.success('退出成功')
      } catch (e) {
        this.$message.error('取消退出')
      }
    }
  },
  async created() {
    let res = await this.axios.get('menus')
    let {meta: {status}, data} = res.data
    if (status === 200) {
      this.menuList = data
      // console.log(this.menuList)
    }
  }
}
</script>

<style lang="" scoped>
    .home{
        height: 100%;
    }
    .el-header{
    background-color: #b3c1cd;
    }
    .logo{
        width: 180px;
        height: 60px;
         background: url('../assets/logo.png') no-repeat center center;
         background-size: contain;
        float: left;
    }
    .logout{
        width: 180px;
        height: 60px;
        float: right;
        font-weight: 700;
        line-height: 60px;
        text-align: right;
    }
    .logout a{
        color: #f80;
    }
    .title{
        overflow: hidden;
        height: 60px;
        line-height: 60px;
        text-align: center;
        color: #fff;
        font-size: 20px;
    }
    .el-aside{
        background-color: rgb(84,92,100);
    }
    .el-submenu{
        width: 200px;
    }
    .el-main{
        background-color: #d4dfe4;
    }
</style>
