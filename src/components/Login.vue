<template>
  <div class="login_container"     
    v-loading="loginLoading"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)">
    <div class="login_box">
      <!-- 头像区域 -->
      <div class="avatar_box">
        <img
          src="../assets/login_logo.jpg"
          alt=""
        >
      </div>
      <!-- 表单区域 -->
      <el-form
        ref="loginFormRef"
        label-width="0"
        class="login_from"
        :model="loginForm"
        :rules="rules"
      >
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input
            prefix-icon="iconfont icon-wode"
            v-model="loginForm.username"
          ></el-input>
        </el-form-item>

        <el-form-item prop="password">
          <el-input
            prefix-icon="iconfont icon-mima"
            v-model="loginForm.password"
            type="password"
            @keyup.enter.native="login"
          ></el-input>
        </el-form-item>

        <el-form-item class="btns">
          <el-button
            type="primary"
            @click="login"
            :loading="loginLoading"
          >Login</el-button>
          <el-button
            type="info"
            @click="resetLoginForm"
          >Reset</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loginLoading: false,
      loginForm: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          { required: true, message: 'Username Empty!', trigger: 'blur' }
        ],
        password: [
          { required: true, message: 'Password Empty!', trigger: 'blur' },
          {
            min: 6,
            max: 13,
            message: 'Length should be 6 to 13',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    resetLoginForm() {
      this.$refs.loginFormRef.resetFields()
    },
    login() {
      this.loginLoading = true
      this.$refs.loginFormRef.validate(async valid => {
        if (valid) {
          // eslint-disable-next-line no-undef
          const { data: result } = await this.$http.post(
            'login',
            this.loginForm
          // eslint-disable-next-line handle-callback-err
          ).catch(err => {
            // console.log(err.code)
            // this.loginLoading = false
            // if (err.code === 'ECONNABORTED') {
            //   this.$message.error('oooops!服务器连接出现问题!') 
            // }
          })
          if (result.meta === 'error') {
            this.$message.error('oooops!服务器连接出现问题!')
            this.loginLoading = false 
            return
          }
          if (result.meta.status !== 200) {
            this.loginLoading = false
            this.$message({
              showClose: true,
              message: 'Login Error!',
              type: 'error'
            })
          } else {
            this.$message({
              showClose: true,
              message: 'Login Success',
              type: 'success'
            })
            window.sessionStorage.setItem('token', result.data.token)
            window.sessionStorage.setItem('loginName', this.loginForm.username)
            this.$router.push('/home')
          }
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login_container {
  height: 100%;
  background-color: #2b4b6b;
}

.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -80%);

  .avatar_box {
    width: 140px;
    height: 140px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }
}

.btns {
  display: flex;
  justify-content: flex-end;
}

.login_from {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 25px;
  box-sizing: border-box;
}
</style>
