<template>
  <div class="login-container">
    <div class="login-logo">
      <div class="box">
        <div class="name">考勤管理系统</div>
      </div>
    </div>
    <el-form class="login-form" autoComplete="on" :model="loginForm" :rules="loginRules" ref="loginForm" label-position="left">
      <el-form-item prop="loginName">
        <el-input type="text" v-model="loginForm.loginName" autoComplete="on" placeholder="用户名">
          <svg-icon slot="prepend" icon-class="user" />
        </el-input>
      </el-form-item>
      <el-form-item prop="password" style="marginBottom: 0">
        <el-input type="password" @keyup.enter.native="handleLogin" v-model="loginForm.password" autoComplete="on" placeholder="密码">
          <svg-icon slot="prepend" icon-class="key" />
        </el-input>
      </el-form-item>
      <div class="forger">
        <span class="txt" @click="onMessage">忘记密码</span>
      </div>
      <el-button type="primary" @click.native.prevent="handleLogin">登录</el-button>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "login",
  data() {
    const validatePass = (rule, value, callback) => {
      if (value.length < 5 || value.length > 20) {
        callback(new Error("密码长度为6-20位"));
      } else {
        callback();
      }
    };
    return {
      loginForm: {
        loginName: "",
        password: "",
        loginIp: null
      },
      loginRules: {
        loginName: [
          { required: true, message: "账号不能为空" },
          { min: 3, max: 20, message: "长度在 3 到 20 个字符" }
        ],
        password: [
          { required: true, message: "密码不能为空" },
          { min: 6, max: 20, message: "密码长度为6-20位" }
        ]
      },
      place: "",
      year:new Date().getFullYear()
    };
  },
  methods: {
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (!valid) return;
        this.loginForm.loginName = this.loginForm.loginName.trim();
        this.$store.dispatch("login", this.loginForm).then(() => {
          this.$router.push("/");
        }).catch(err => {
          this.$message.error(err);
        });
      });
    },
    onMessage() {
      this.$notify({
        title: "提示",
        message: '请联系管理员重置密码！',
        type: "info",
        duration: 2000
      });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "src/styles/mixin.scss";

.login-container {
  background: no-repeat center center url(~@/assets/bg.png);
  background-size: cover;
  @include relative;
  .login-logo {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 50%;
    background: no-repeat center center url(~@/assets/login/bg.png);
    width: 420px;
    transform: translateX(-100%);
    .box {
      position: absolute;
      left: 0;
      width: 100%;
      padding: 60px 30px 60px 55px;
      @include ct;
    }
    .name {
      text-shadow: 2px 2px 10px rgba(0, 0, 0, 0.3);
      letter-spacing: 2px;
      font-size: 34px;
      font-weight: bold;
      color: #fff;
    }
    .place {
      line-height: 26px;
      font-size: 16px;
      color: #ffc600;
    }
    .svg-icon {
      display: inline-block;
      height: 26px;
      line-height: 26px;
      margin-right: 4px;
      vertical-align: top;
      font-size: 18px;
    }
  }

  .login-form {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 306px;
    padding: 0 0 0 88px;
    border-left: 1px solid gainsboro;
    transform: translate(0, -50%);
    /deep/ {
      .el-form-item__content {
        line-height: 30px;
      }
    }
    .el-input {
      /deep/ {
        .el-input-group__prepend {
          height: 30px;
          line-height: 28px;
          padding: 0 10px;
        }
        input {
          height: 30px;
          line-height: 30px;
          font-size: 13px;
        }
      }
    }
    .svg-icon {
      position: relative;
      top: 2px;
      font-size: 18px;
    }
    .show-pwd {
      position: absolute;
      top: 0;
      right: 10px;
      height: 30px;
      line-height: 30px;
      font-size: 20px;
      color: #666;
      user-select: none;
      cursor: pointer;
    }
    .el-button {
      background: #0abf08;
      width: 100%;
      height: 30px;
      line-height: 30px;
      padding: 0 20px;
      border-color: #0abf08;
      letter-spacing: 4px;
      font-size: 14px;
      &:hover {
        background: #13d011;
        border-color: #13d011;
      }
    }
  }
  .copyright {
    position: absolute;
    right: 0;
    bottom: 40px;
    left: 0;
    text-align: center;
    font-size: 13px;
    color: #fff;
    p {
      line-height: 30px;
      margin: 0;
      font-size: 12px;
      color: #8cb4d6;
    }
  }
  .forger {
    text-align: right;
    color: gainsboro;
    margin: 8px 0;
    font-size: 14px;
    .txt {
      cursor: pointer;
    }
  }
}
</style>
