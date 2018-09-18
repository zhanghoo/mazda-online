<template>
    <el-dialog class="user-dialog" title="" :visible.sync="visible" width="23%">
        <div class="my-dialog-container" v-if="userInfo">
            <div class="dialog-main">
                <img class="main-avatar" v-if="userInfo.avatar" :src="userInfo.avatar">
                <img class="main-avatar" v-else src="~@/assets/img/single-avatar.svg">
                <div class="main-nickname" v-if="userInfo.realname || userInfo.nickname">{{userInfo.realname || userInfo.nickname}}</div>
                <div class="main-nickname" v-else>匿名用户{{userInfo.username.slice(0, 4)}}</div>
            </div>
            <div class="dialog-detail">
                <div class="detail-item">
                    <div class="item-label">用 户 名：</div>
                    <div class="item-value">{{userInfo.username}}</div>
                </div>
                <div class="detail-item">
                    <div class="item-label">昵 称：</div>
                    <div class="item-value" v-if="userInfo.nickname">{{userInfo.nickname}}</div>
                    <div class="item-value" v-else>匿名用户{{userInfo.username.slice(0, 4)}}</div>
                </div>
                <div class="detail-item">
                    <div class="item-label">性 别：</div>
                    <div class="item-value" v-if="userInfo.gender">{{userInfo.gender === 1 ? '男' : '女'}}</div>
                    <div class="item-value" v-else>保密</div>
                </div>
                <div class="detail-item">
                    <div class="item-label">地 区：</div>
                    <div class="item-value">{{userInfo.address || '无'}}</div>
                </div>
            </div>
        </div>
    </el-dialog>
</template>

<script>
export default {
    name: 'myDialog',
    props: ['userInfo'],
    data() {
        return {
            visible: true
        }
    },
    watch: {
        visible(val) {
            if (!val) {
                this.$emit('close', false)
            }
        }
    }
}
</script>
<style lang="stylus">
.user-dialog {
    .el-dialog__body {
        padding: 0;
    }
    .my-dialog-container {
        padding: 20px 30px 12px;
        .dialog-main {
            text-align: center;
            padding-bottom: 20px;
            margin-bottom: 14px;
            border-bottom: 1px solid #e3e6eb;
            .main-avatar {
                display: block;
                width: 65px;
                height: 65px;
                margin: 0 auto;
            }
            .main-nickname {
                color: #0B1816;
                font-size: 18px;
                text-align: center;
                margin: 12px 0 6px;
            }
        }
        .dialog-detail {
            .detail-item {
                display: flex;
                font-size: 14px;
                margin-bottom: 12px;
                .item-label {
                    max-width: 56px;
                    color: #808080;
                    white-space: nowrap;
                    margin-right: 12px;
                }
                .item-value {
                    flex: 1;
                    color: #000C0A;
                    white-space: wrap;
                    word-break: break-all;
                }
            }
        }
    }
}
</style>
