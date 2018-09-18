<template>
    <div id="login">
        <div class="login-container" v-loading="loading" element-loading-background="rgba(0, 0, 0, 0.5)">
            <div class="login-title"></div>
            <el-form class="login-form" :model="form" @submit.native.prevent="verify">
                <el-form-item class="username">
                    <el-input v-model="form.username" placeholder="请输入用户名" auto-complete />
                    <span class="input-icon prepend-icon">
                        <i class="my-icon-username"></i>
                    </span>
                </el-form-item>
                <el-form-item class="password">
                    <el-input v-model="form.password" placeholder="请输入密码" type="password"/>
                    <span class="input-icon prepend-icon">
                        <i class="my-icon-lock"></i>
                    </span>
                </el-form-item>
                <!-- <div class="cacheInfo">
                    <el-checkbox v-model="cacheInfo">记住用户名</el-checkbox>
                </div> -->
                <el-input class="login-btn" :class="{'active': form.username && form.password}" type="submit" value="登录" />
            </el-form>
        </div>
    </div>
</template>
<script>
export default {
    name: 'login',
    data() {
        return {
            form: {
                username: '',
                password: ''
            },
            loading: false
            // cacheInfo: false
        }
    },
    methods: {
        verify() {
            if (!this.form.username) {
                this.$message.error('请输入账号')
            } else if (!this.form.password) {
                this.$message.error('请输入密码')
            } else {
                this.loading = true
                this.$store.dispatch('kfuLogin', this.form).then(() => {
                    this.loading = false
                    this.$router.push({ name: 'index' })
                    this.$message.success('登录成功')
                }).catch(err => {
                    console.log('登录失败', err)
                    this.$message.error('登录失败：' + err)
                })
            }
        }
    }
}
</script>
<style lang='stylus'>
#login {
    position: relative;
    width: 100%;
    height: 100vh;
    .login-container {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 100;
        width: 460px;
        min-height: 400px;
        border-radius: 6px;
        padding: 0 45px 32px;
        margin: 0 auto;
        background: url('~@/assets/img/login_bg.png') top left no-repeat;
        background-size: 100% 100%;
        overflow: hidden;
        .login-title {
            flex-center();
            width: 100%;
            height: 145px;
            background: url('~@/assets/img/login_logo.png') no-repeat center center;
            background-size: 66%;
        }
        .login-form {
            .el-form-item {
                &.password {
                    margin-bottom: 10px;
                }
                .el-input__inner {
                    font-size: 12px;
                    padding: 0 36px 0 44px;
                    height: 42px;
                    line-height: 42px;
                    border: 1px solid #6D6D6D;
                    border-radius: 50px;
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
            .cacheInfo {
                padding: 0 6px;
                .el-checkbox {
                    font-size: 12px;
                    .el-checkbox__label {
                        font-size: inherit;
                    }
                }
            }
            .login-btn {
                margin-top: 22px;
                &.active {
                    input {
                        color: #fff;
                        cursor: pointer;
                        border-color: $appColor;
                        background-color: $appColor;
                    }
                }
                input {
                    color: #9E9E9E;
                    font-size: 14px;
                    height: 42px;
                    line-height: 42px;
                    background-color: #DCDCDC;
                    border-color: #AFAFAF;
                    border-radius: 100px;
                }
            }
        }
    }
}
@media screen and (max-width: 980px) {
    #login {
        .login-container {
            width: 100%;
            min-height: auto;
            padding: toRem(30) toRem(16) toRem(50);
            .login-title {
                height: toRem(80);
                margin-bottom: toRem(20);
            }
        }
    }
}
</style>
