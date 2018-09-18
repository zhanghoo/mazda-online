<template>
    <el-dialog class="setting-dialog" :title="title" :visible.sync="visible" width="25%" :append-to-body="true">
        <el-input type="textarea" v-model="text" :placeholder="placeholder" resize="none" :rows="4" autofocus />
        <div slot="footer" class="dialog-footer">
            <el-button @click="visible = false">取消</el-button>
            <el-button type="primary" @click="onSubmit">确定</el-button>
        </div>
    </el-dialog>
</template>
<script>
export default {
    name: 'myDialog',
    props: {
        title: {
            type: String,
            default: () => '设置'
        },
        placeholder: {
            type: String,
            default: () => '请输入内容'
        },
        content: ''
    },
    data() {
        return {
            visible: true,
            text: ''
        }
    },
    watch: {
        visible(val) {
            if (!val) {
                this.$emit('close', false)
            }
        }
    },
    mounted() {
        this.text = this.content
    },
    methods: {
        onSubmit(type) {
            this.$emit('onSubmit', this.text)
        }
    }
}
</script>
<style lang="stylus">
.setting-dialog {
    .el-dialog__header {
        border-bottom: 1px solid #D9DEE4;
    }
    .el-dialog__body {
        flex-center();
        color: #2C2C2C;
        font-size: 16px;
        min-height: 90px;
        padding: 20px;
    }
    .el-dialog__footer {
        .dialog-footer {
            flex-center();
        }
    }
}
@media screen and (max-width: 980px) {
    .setting-dialog {
        flex-center();
        .el-dialog {
            width: 80% !important;
            margin: 0 !important;
        }
    }
}
</style>
