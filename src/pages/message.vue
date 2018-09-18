<template>
    <div id="message">
        <div class="message-container">
            <div class="message-header">用心让您更安心，全心管家服务</div>
            <div class="message-main">
                <div class="main-menu">
                    <img src="~@/assets/img/logo.png">
                    <p>一汽马自达</p>
                    <p>竭诚为您服务</p>
                </div>
                <div class="main-box">
                    <div class="box-header">
                        <i class="my-icon-renqun"></i>
                        <div>访客留言（ 非工作时间，请您留言 ）</div>
                    </div>
                    <div class="box-wrap">
                        <div class="wrap-title">
                            <i class="title-icon my-icon-liuyan"></i>
                            <div class="title-label">咨询问题</div>
                        </div>
                        <div class="wrap-content">
                            <el-input type="textarea" v-model="form.content" placeholder="欢迎使用金牌导购服务功能，请在对话框内描述您的问题，我们会尽快与您取得联系哦~(服务时段暂为工作日9:00-16:00)" resize="none" :rows="12" autofocus />
                        </div>
                    </div>
                    <div class="box-wrap form">
                        <div class="wrap-title">
                            <i class="title-icon my-icon-client"></i>
                            <div class="title-label">客户资料</div>
                        </div>
                        <div class="wrap-form">
                            <el-form :model="form">
                                <div class="wrap-form-list">
                                    <div class="wrap-form-item">
                                        <div class="item-label">所在省</div>
                                        <el-select v-model="form.province" placeholder="请选择所在省" @change="getCity">
                                            <el-option :label="item.label" :value="item.value" v-for="(item, index) in provinceOptions" :key="index"></el-option>
                                        </el-select>
                                    </div>
                                    <div class="wrap-form-item">
                                        <div class="item-label">所在市</div>
                                        <el-select v-model="form.city" placeholder="请选择所在市">
                                            <el-option :label="item.label" :value="item.value" v-for="(item, index) in cityOptions" :key="index"></el-option>
                                        </el-select>
                                    </div>
                                    <div class="wrap-form-item">
                                        <div class="item-label">姓名</div>
                                        <el-input v-model="form.name" placeholder="请输入姓名"></el-input>
                                    </div>
                                </div>
                                <div class="wrap-form-list">
                                    <div class="wrap-form-item">
                                        <div class="item-label">手机号</div>
                                        <el-input v-model="form.phone" placeholder="请输入手机号"></el-input>
                                    </div>
                                    <div class="wrap-form-item">
                                        <div class="item-label">性别</div>
                                        <el-select v-model="form.gender" placeholder="请选择性别">
                                            <el-option label="先生" :value="1"></el-option>
                                            <el-option label="女士" :value="0"></el-option>
                                        </el-select>
                                    </div>
                                </div>
                            </el-form>
                        </div>
                        <div class="wrap-tip">必选项</div>
                    </div>
                    <div class="box-tool">
                        <el-button @click="$router.push({name: 'client'})">返回</el-button>
                        <el-button @click="reset">重置</el-button>
                        <el-button type="primary" @click="sendMessage">发送</el-button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { getProvince, getCity, postMessage } from '@/api'
export default {
    name: 'message',
    data() {
        return {
            provinceOptions: [],
            cityOptions: [],
            form: {
                id: 0,
                content: '',
                province: '',
                city: '',
                name: '',
                phone: '',
                gender: ''
            }
        }
    },
    mounted() {
        let id = this.$route.query.id
        if (id) {
            this.form.id = id
        }
        this.getProvince()
    },
    methods: {
        getProvince() {
            getProvince().then(res => {
                // console.log('省：', res)
                if (res.data) {
                    let arr = []
                    Object.keys(res.data).forEach(key => {
                        let obj = {
                            label: res.data[key],
                            value: key
                        }
                        arr.push(obj)
                    })
                    this.provinceOptions = arr
                }
            })
        },
        getCity(id) {
            getCity(id).then(res => {
                // console.log('市：', res)
                if (res.data) {
                    let arr = []
                    Object.keys(res.data).forEach(key => {
                        let obj = {
                            label: res.data[key],
                            value: key
                        }
                        arr.push(obj)
                    })
                    this.cityOptions = arr
                }
            })
        },
        sendMessage() {
            if (!this.form.content) {
                this.$message.error('请填写留言信息')
            } else if (!this.form.province || !this.form.city) {
                this.$message.error('请选择地址')
            } else if (!this.form.name) {
                this.$message.error('请填写姓名')
            } else if (!this.form.phone) {
                this.$message.error('请填写手机号')
            } else if (!this.form.gender) {
                this.$message.error('请选择性别')
            } else {
                postMessage(this.form).then(res => {
                    console.log('留言：', res)
                    this.$message.success('留言成功，我们会尽快联系你')
                })
            }
        },
        reset() {
            this.form = {
                content: '',
                province: '',
                city: '',
                name: '',
                phone: '',
                gender: ''
            }
        }
    }
}
</script>
<style lang='stylus'>
#message {
    position: relative;
    width: 100%;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    .message-container {
        display: flex;
        flex-direction: column;
        width: 1000px;
        margin: 0 auto;
        max-height: 800px;
        min-height: 550px;
        .message-header {
            height: 53px;
            line-height: 52px;
            background: url('~@/assets/img/index_title_bg.png') no-repeat;
            background-size: 100%;
            font-size: 18px;
            color: #fff;
            text-align: right;
            padding-right: 25px;
            border-radius: 5px 5px 0 0;
        }
        .message-main {
            flex: 1;
            display: flex;
            width: 100%;
            overflow: hidden;
            .main-menu {
                width: 140px;
                color: #fff;
                font-size: 14px;
                background: #000;
                text-align: center;
                img {
                    display: block;
                    margin: 30px auto 8px;
                }
                p {
                    color: #fff;
                    font-size: 15px;
                    text-align: center;
                    margin: 0;
                }
            }
            .main-box {
                flex: 1;
                background: url('~@/assets/img/message-bg.png') left top no-repeat;
                background-size: cover;
                overflow: hidden;
                .box-header {
                    display: flex;
                    align-items: center;
                    justify-content: flex-end;
                    height: 48px;
                    color: #000;
                    font-size: 16px;
                    padding: 0 20px;
                    background: #f2f2f2;
                    i {
                        color: #5c5b66;
                        font-size: 24px;
                        margin-right: 8px;
                    }
                }
                .box-wrap {
                    .wrap-title {
                        display: flex;
                        align-items: center;
                        justify-content: flex-end;
                        height: 50px;
                        color: #141414;
                        font-size: 16px;
                        padding: 0 24px;
                        i {
                            color: #d03632;
                            font-size: 20px;
                            margin-right: 8px;
                        }
                    }
                    .wrap-content {
                        border-top: 1px solid #0C0C0C;
                        border-bottom: 1px solid #0C0C0C;
                        .el-textarea__inner {
                            color: #1F1F1F;
                            font-size: 14px;
                            padding: 20px 30px;
                            border: none;
                            background: transparent;
                            &::placeholder {
                                color: #666;
                            }
                        }
                    }
                    .wrap-form {
                        padding: 20px 40px 0;
                        .wrap-form-list {
                            display: flex;
                            align-items: center;
                            margin-bottom: 20px;
                            .wrap-form-item {
                                display: flex;
                                align-items: center;
                                margin: 0 15px;
                                .item-label {
                                    position: relative;
                                    color: #464646;
                                    font-size: 15px;
                                    white-space: nowrap;
                                    margin-right: 10px;
                                    min-width: 60px;
                                    text-align: right;
                                    &:before {
                                        content: '*';
                                        color: $appColor;
                                        font-size: 20px;
                                        margin-right: 5px;
                                    }
                                }
                                .el-input {
                                    .el-input__inner {
                                        font-size: 14px;
                                        color: #fff;
                                        border-radius: 20px;
                                        background: #979797;
                                        border: none;
                                        &::placeholder {
                                            color: #fff;
                                        }
                                    }
                                }
                            }
                        }
                    }
                    .wrap-tip {
                        display: flex;
                        align-items: center;
                        justify-content: flex-end;
                        font-size: 14px;
                        color: #2B2B2B;
                        margin: 10px 30px;
                        &:before {
                            content: '*';
                            color: $appColor;
                            font-size: 20px;
                            margin-right: 5px;
                        }
                    }
                }
                .box-tool {
                    display: flex;
                    align-items: center;
                    justify-content: flex-end;
                    height: 70px;
                    background: #fff;
                    padding: 0 20px;
                    .el-button {
                        min-width: 90px;
                        padding: 8px 20px;
                        margin-left: 24px;
                    }
                }
            }
        }
    }
}
@media screen and (max-width: 980px) {
    #message {
        width: 100%;
        min-height: 100vh;
        overflow-y: auto;
        .message-container {
            width: 100%;
            height: 100%;
            .message-header {
                display: flex;
                align-items: center;
                justify-content: flex-end;
                font-size: toRem(14);
                height: toRem(40);
            }
            .message-main {
                .main-menu {
                    display: none;
                }
                .main-box {
                    display: flex;
                    flex-direction: column;
                    .box-header {
                        height: fit-content;
                        padding: toRem(8) 0;
                        color: #666;
                        font-size: toRem(13);
                        i {
                            color: inherit;
                            font-size: toRem(20);
                        }
                    }
                    .box-wrap {
                        &.form {
                            position: relative;
                            flex: 1;
                            .wrap-form {
                                padding: toRem(10) toRem(20);
                                .wrap-form-list {
                                    display: flex;
                                    align-items: flex-start;
                                    justify-content: flex-start;
                                    flex-direction: column;
                                    margin-bottom: 0;
                                    .wrap-form-item {
                                        width: 100%;
                                        padding: toRem(5) 0;
                                        margin: 0;
                                        .item-label {
                                            font-size: toRem(14);
                                            text-align: left;
                                        }
                                        .el-input .el-input__inner {
                                            color: #333;
                                            height: toRem(36);
                                            line-height: toRem(36);
                                            background: #fff;
                                            border-radius: toRem(6);
                                            &::placeholder {
                                                color: #333;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        .wrap-title {
                            height: toRem(32);
                            font-size: toRem(12);
                            i {
                                font-size: toRem(18);
                            }
                        }
                        .el-textarea {
                            height: toRem(125);
                            .el-textarea__inner {
                                height: 100%;
                                line-height: 1.8;
                                padding: toRem(10) toRem(25);
                            }
                        }
                        .wrap-tip {
                            width: 100%;
                            padding: 0 toRem(20) toRem(6);
                            margin: 0;
                        }
                    }
                    .box-tool {
                        min-height: toRem(50);
                    }
                }
            }
        }
    }
}
</style>
