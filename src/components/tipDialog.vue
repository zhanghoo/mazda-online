<template>
    <el-dialog class="tip-dialog" title="提示" :visible.sync="visible" width="25%" :append-to-body="true">
        <div>{{tipText[type]}}</div>
        <div slot="footer" class="dialog-footer">
            <el-button type="info" @click="onSubmit('logOut')" v-if="[0].some(showType => showType === type)">退出</el-button>
            <el-button type="primary" @click="onSubmit('reLogin')" v-if="[0, 1].some(showType => showType === type)">重新登录</el-button>
            <el-button type="primary" @click="onSubmit" v-if="[2].some(showType => showType === type)">确定</el-button>
        </div>
    </el-dialog>
</template>
<script>
export default {
    name: 'myDialog',
    props: {
        type: ''
    },
    data() {
        return {
            visible: true,
            tipText: {
                0: '网络断线，请检查网络或重新登陆',
                1: '您的账号在其他设备登录'
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
        onSubmit(type) {
            this.visible = false
            if (type === 'logOut') {
                this.$emit('logOut', '')
            } else if (type === 'reLogin') {
                this.$emit('reLogin', '')
            } else {
                this.$emit('onSubmit', '')
            }
        }
    }
}
</script>
<style lang="stylus">
.tip-dialog {
    .el-dialog__header {
        border-bottom: 1px solid #D9DEE4;
    }
    .el-dialog__body {
        flex-center();
        color: #2C2C2C;
        font-size: 16px;
        min-height: 90px;
    }
    .el-dialog__footer {
        padding-bottom: 30px;
        .dialog-footer {
            flex-center();
        }
    }
}
@media screen and (max-width: 980px) {
    .tip-dialog {
        flex-center();
        .el-dialog {
            width: 80% !important;
            margin: 0 !important;
            .el-dialog__header {
                padding: toRem(10) toRem(20);
            }
            .el-dialog__body {
                padding: toRem(20);
            }
        }
    }
}
</style>
