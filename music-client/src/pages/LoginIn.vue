<template>
<div class="login-in">
  <login-logo/>
  <div class="login">
    <div class="login-head">
      <span>帐号登录</span>
    </div>
    <el-form :model="loginForm" status-icon :rules="rules" ref="loginForm" class="demo-ruleForm" >
      <el-form-item prop="username">
        <el-input placeholder="用户名" v-model="loginForm.username"></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input type="password" placeholder="密码" v-model="loginForm.password" @keyup.enter.native="handleleLoginIn"></el-input>
      </el-form-item>
       <el-form-item>
       <el-col :span="11">
      <el-form-item prop="verifyCode">
        <el-input type="text" placeholder="验证码" v-model="loginForm.verifyCode" @keyup.enter.native="handleleLoginIn"></el-input>
      </el-form-item>
       </el-col>
        <el-col :span="2"><div style="height:40px;width:100%"></div></el-col>
         <el-col :span="11">
            <el-image  :src="url" fit="fill" style="width:100%;height:40px" @click="updateVerifyCode"></el-image>
         </el-col>
         </el-form-item>
      <div class="login-btn">
        <el-button @click="goSignUp">注册</el-button>
        <el-button type="primary" @click="handleleLoginIn">登录</el-button>
      </div>
    </el-form>
  </div>
</div>
</template>

<script>
import LoginLogo from "../components/LoginLogo";
import mixin from "../mixins";
import { loginIn, getVerifyCode } from "../api/index";

export default {
  name: "login-in",
  mixins: [mixin],
  components: {
    LoginLogo
  },
  data: function() {
    let validateName = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("用户名不能为空"));
      } else {
        callback();
      }
    };
    let validatePassword = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        callback();
      }
    };
    let validateVerifyCode = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入验证码"));
      } else if(value != this.rightCode){
        callback(new Error("验证码错误"));
      }else {
        callback();
      }
    };
    return {
      url:'http://localhost:8888/a-soul/杜向晚2.0.jpg',
      loginForm: {
        // 登录用户名密码
        username: "",
        password: "",
        verifyCode: "",
        rightCode:""
      },
      rules: {
        username: [
          { validator: validateName, message: "请输入用户名", trigger: "blur" }
        ],
        password: [
          {
            validator: validatePassword,
            message: "请输入密码",
            trigger: "blur"
          }
        ],
        verifyCode: [
          {
            validator: validateVerifyCode,
            // message: "请输入验证码",
            trigger: "blur"
          }
        ]
      }
    };
  },
  created(){
    this.updateVerifyCode()

  },
  mounted() {
    this.changeIndex("登录");
  },
  methods: {
    updateVerifyCode(){
       let _this = this;
      let randomStr = Date.now();
      getVerifyCode(randomStr)
      .then(res =>{
        if(res.code === 1){
          _this.url=res.image
          _this.rightCode = res.verifyCode
        }
      }).catch(failResponse => {});
    },
    changeIndex(value) {
      this.$store.commit("setActiveName", value);
    },
    handleleLoginIn() {
      let _this = this;
       if (this.loginForm.password === ""||this.loginForm.username==="") {
           this.notify( "用户名或密码错误","error");
        return;
      }
      if (this.loginForm.verifyCode != this.rightCode) {
           this.notify( "验证码错误","error");
        return;
      }
      let params = new URLSearchParams();
      params.append("username", this.loginForm.username);
      params.append("password", this.loginForm.password);

      loginIn(params)
        .then(res => {
          // console.log('-----------获取登录信息---------------')
          if (res.code === 1) {
            _this.$message({
              message: "登录成功",
              type: "success"
            });
            _this.setUserMsg(res.userMsg[0]);
            _this.$store.commit("setLoginIn", true);
            setTimeout(function() {
              _this.changeIndex("首页");
              _this.$router.push({ path: "/" });
            }, 2000);
          } else {
            _this.notify("用户名或密码错误", "error");
          }
        })
        .catch(failResponse => {});
    },
    setUserMsg(item) {
      this.$store.commit("setUserId", item.id);
      this.$store.commit("setUsername", item.username);
      this.$store.commit("setAvator", item.avator);
    },
    goSignUp() {
      this.$router.push({ path: "/sign-up" });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../assets/css/login-in.scss";
</style>
