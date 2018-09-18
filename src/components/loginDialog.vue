<template>
    <el-dialog class="login-dialog" title="" :visible.sync="visible" width="22%">
        <img class="login-logo " src="~@/assets/img/client_login_logo.png" alt="">
        <el-form class="login-form" :model="form" @submit.native.prevent="verify">
            <el-form-item class="username">
                <el-input v-model="form.username" placeholder="请输入用户名" />
                <span class="input-icon prepend-icon">
                    <i class="my-icon-username"></i>
                </span>
            </el-form-item>
            <el-form-item class="password">
                <el-input v-model="form.password" placeholder="请输入密码" type="password" />
                <span class="input-icon prepend-icon">
                    <i class="my-icon-lock"></i>
                </span>
            </el-form-item>
            <el-form-item>
                <el-input class="login-btn" type="submit" value="登录" />
            </el-form-item>
            <div class="register">
                没有账号？
                <a href="http://account.faw-mazda.com/register?&appid=kefu" target="_blank">立即注册</a>
            </div>
        </el-form>
    </el-dialog>
</template>

<script>
export default {
    name: 'myDialog',
    data() {
        return {
            visible: true,
            form: {
                username: '',
                password: ''
            }
        }
    },
    watch: {
        visible(val) {
            if (!val) {
                this.$emit('close', false)
            }
        }
    },
    methods: {
        verify() {
            if (!this.form.username) {
                this.$message.error('请输入账号')
            } else if (!this.form.password) {
                this.$message.error('请输入密码')
            } else {
                this.$emit('onSubmit', this.form)
            }
        }
    }
}
</script>
<style lang="stylus">
.login-dialog {
    .el-dialog {
        border-radius: 4px;
    }
    .el-dialog__body {
        padding: 30px;
        .login-logo {
            display: block;
            margin: 0 auto 30px;
        }
        .login-form {
            .el-form-item {
                .el-input__inner {
                    font-size: 12px;
                    padding: 0 36px 0 44px;
                    height: 42px;
                    line-height: 42px;
                    border: 1px solid $borderColor;
                    border-radius: 6px;
                    &:focus {
                        border: 1px solid $appColor;
                    }
                }
                .input-icon {
                    position: absolute;
                    top: 0;
                    display: flex;
                    align-items: center;
                    height: 100%;
                    font-size: 16px;
                    text-align: center;
                    user-select: none;
                    cursor: pointer;
                    padding: 0 14px;
                    &.prepend-icon {
                        left: 0;
                    }
                    &.append-icon {
                        right: 0;
                    }
                }
            }
            .login-btn {
                .el-input__inner {
                    color: #fff;
                    font-size: 16px;
                    height: 42px;
                    line-height: 42px;
                    cursor: pointer;
                    border-color: $appColor;
                    background-color: $appColor;
                }
            }
            .register {
                color: #808080;
                font-size: 12px;
                text-align: center;
                a {
                    color: $appColor;
                }
            }
        }
    }
}
@media screen and (max-width: 980px) {
    .login-dialog {
        display: none;
    }
}
</style>
