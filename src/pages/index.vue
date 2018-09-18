<template>
    <div id="index">
        <div class="index-container" v-loading="loading" element-loading-background="rgba(0, 0, 0, 0.5)">
            <!-- menu -->
            <div class="index-menu">
                <div class="menu-user" @click="userVisible = true">
                    <img class="user-avatar" v-if="$store.state.userInfo.avatar" :src="$store.state.userInfo.avatar">
                    <img class="user-avatar" v-else src="~@/assets/img/custormer_avatar.jpg">
                    <div class="user-status">在线</div>
                </div>
                <div class="menu-tabs">
                    <el-badge v-for="(item, index) in tabOptions" :key="index" :value="item.count" :hidden="!item.count || item.count === 0">
                        <div class="tabs-item" :class="{'active': tabActive === index}" @click="handleTabActive(item, index)">
                            <div :class="[item.icon, 'item-icon']"></div>
                            <div class="item-label">{{item.label}}</div>
                        </div>
                    </el-badge>
                    <el-dropdown trigger="click" class="tabs-dropdown">
                        <div class="tabs-item">
                            <div class="item-icon my-icon-menu"></div>
                            <div class="item-label">更多</div>
                        </div>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item @click.native="settingWelcomeVisible = true">欢迎语</el-dropdown-item>
                            <el-dropdown-item @click.native="settingBusyVisible = true">忙碌语</el-dropdown-item>
                            <el-dropdown-item @click.native="logOut">退出登录</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </div>
            </div>
            <div class="index-right">
                <div class="index-title">马自达在线顾问</div>
                <div class="right-container">
                    <my-chat v-if="initChat" chatType="kfu" :initData="$store.state.initData" :userInfo="$store.state.userInfo" :json="conversationList" @unreadCount="(val) => tabOptions[0].count = val"></my-chat>
                </div>
            </div>
        </div>
        <!-- 用户弹框 -->
        <user-dialog v-if="userVisible" @close="userVisible = false" :userInfo="$store.state.userInfo"></user-dialog>
        <!-- 试驾弹框 -->
        <drive-dialog v-if="driveVisible" @close="handleDriveDialogClose"></drive-dialog>
        <!-- 欢迎语弹框 -->
        <setting-dialog v-if="settingWelcomeVisible" @close="settingWelcomeVisible = false" title="设置欢迎语" placeholder="请输入欢迎语" :content="$store.state.userInfo.welcome" @onSubmit="settingWelcome"></setting-dialog>
        <!-- 忙碌语弹框 -->
        <setting-dialog v-if="settingBusyVisible" @close="settingBusyVisible = false" title="设置忙碌语" placeholder="请输入忙碌语" :content="$store.state.userInfo.replay" @onSubmit="settingBusy"></setting-dialog>
    </div>
</template>
<script>
import JIM from '@/api/jim'
import md5 from '@/utils/md5'
import { compare } from '@/utils'
import driveDialog from '@/components/driveDialog'
import settingDialog from '@/components/settingDialog'
export default {
    name: 'index',
    components: { driveDialog, settingDialog },
    data() {
        return {
            tabOptions: [
                {
                    icon: 'my-icon-message',
                    label: '历史会话',
                    count: 0
                },
                {
                    icon: 'my-icon-searchFile',
                    label: '预约试驾'
                }
            ],
            tabActive: 0,
            initChat: false,
            userVisible: false,
            driveVisible: false,
            settingWelcomeVisible: false,
            settingBusyVisible: false,
            loading: false,
            conversationList: []
        }
    },
    mounted() {
        this.handleRefreshLogin().then(() => {
            this.initChat = true
            this.syncConversation()
        })
    },
    methods: {
        // 处理刷新登录
        handleRefreshLogin() {
            this.loading = true
            return new Promise((resolve, reject) => {
                if (!JIM.isLogin()) {
                    let form = {
                        'username': this.$cache.getLocal(md5.usernameKey),
                        'password': this.$cache.getLocal(md5.passwordKey),
                        'is_md5': true
                    }
                    this.$store.dispatch('kfuLogin', form).then(() => {
                        resolve()
                    })
                } else {
                    resolve()
                }
            })
        },
        // 获取漫游信息
        syncConversation() {
            JIM.getConversation().then(list => {
                console.log('同步会话列表 syncConversationList', list)
                this.conversationList = list.conversations
                // 会话内容
                let contents = this.$store.state.conversationContent
                this.conversationList.forEach(item => {
                    contents.forEach(content => {
                        // 同步已读消息
                        content.receipt_msgs.forEach(receipt_msg => {
                            content.msgs.some(msg => {
                                if (receipt_msg.msg_id === msg.msg_id) {
                                    this.$set(msg, 'read', true)
                                    return true
                                }
                            })
                        })
                        if (item.username === content.from_username) {
                            let msgs = content.msgs.map(msg => {
                                // 获取图片资源路径
                                if (msg.content.msg_body.media_id) {
                                    JIM.getResource(msg.content.msg_body.media_id).then(url => {
                                        this.$set(msg, 'local_url', url)
                                    })
                                }
                                return msg
                            })
                            // 合并短时间消息
                            for (let index = msgs.length - 1; index > 0; index--) {
                                if (msgs[index].ctime_ms - msgs[index - 1].ctime_ms <= this.mergeTime_ms) {
                                    this.$set(msgs[index], 'ctime_ms_hide', true)
                                }
                            }
                            this.$set(item, 'msgs', msgs)
                        }
                    })
                })
                // 排序
                this.conversationList.sort(compare('des', 'mtime'))
                this.loading = false
            })
        },
        // tabs切换
        handleTabActive(item, index) {
            this.tabActive = index
            if (index === 1) {
                this.driveVisible = true
            }
        },
        // 试驾弹框关闭
        handleDriveDialogClose() {
            this.driveVisible = false
            this.tabActive = 0
        },
        // 设置欢迎语
        settingWelcome(text) {
            console.log('欢迎语', text)
            this.$store.dispatch('kfuSetting', { 'welcome': text }).then(() => {
                this.settingWelcomeVisible = false
                this.$message.success('设置成功')
            })
        },
        // 设置忙碌语
        settingBusy(text) {
            console.log('忙碌语', text)
            this.$store.dispatch('kfuSetting', { 'replay': text }).then(() => {
                this.settingBusyVisible = false
                this.$message.success('设置成功')
            })
        },
        // 退出登录
        logOut() {
            this.$store.dispatch('kfuLoginOut').then(() => {
                this.$router.push({ name: 'login' })
            })
        }
    }
}
</script>
<style lang='stylus'>
$chatHeight = 710px;
$chatTitleHeight = 50px;
@media screen and (min-width: 981px) {
    #index {
        position: relative;
        width: 100%;
        min-height: 100vh;
        display: flex;
        align-items: center;
        .index-container {
            position: relative;
            display: flex;
            width: 100%;
            max-width: 980px;
            height: $chatHeight;
            margin: 0 auto;
            border-radius: 4px;
            background: #fff;
            overflow: hidden;
            .index-menu {
                position: relative;
                width: 88px;
                height: 100%;
                background: #0D0D0E;
                padding-top: $chatTitleHeight;
                .menu-user {
                    flex-center();
                    flex-direction: column;
                    padding-top: 10px;
                    margin: 10px 0 50px;
                    cursor: pointer;
                    .user-avatar {
                        display: block;
                        width: 44px;
                        height: 44px;
                    }
                    .user-status {
                        color: #fff;
                        font-size: 12px;
                        margin: 10px 0;
                    }
                }
                .menu-tabs {
                    .el-badge {
                        width: 100%;
                        height: 100%;
                        .el-badge__content.is-fixed {
                            right: 25px;
                        }
                    }
                    .tabs-dropdown {
                        width: 100%;
                        position: absolute;
                        bottom: 40px;
                        left: 0;
                    }
                    .tabs-item {
                        flex-center();
                        color: #fff;
                        font-size: 24px;
                        cursor: pointer;
                        height: 46px;
                        margin-bottom: 15px;
                        &.active {
                            background: $appColor;
                        }
                        &:hover {
                            background: $appColor;
                        }
                        .item-label {
                            display: none;
                        }
                    }
                }
            }
            .index-right {
                position: relative;
                flex: 1;
                height: 100%;
                overflow: hidden;
                .index-title {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    display: flex;
                    align-items: center;
                    width: 100%;
                    height: $chatTitleHeight;
                    color: #fff;
                    font-size: 18px;
                    font-family: SourceHanSerifCN-Regular;
                    font-weight: 100;
                    padding-left: 20px;
                    background: url('~@/assets/img/index_title_bg.png') no-repeat left center;
                    background-size: 100% 100%;
                }
                .right-container {
                    display: flex;
                    height: 100%;
                    padding-top: $chatTitleHeight;
                    .index-user {
                        position: relative;
                        width: 310px;
                        height: 100%;
                        border-right: 1px solid $borderColor;
                        background: $bgColor;
                        overflow-y: auto;
                        .user-item {
                            display: flex;
                            width: 100%;
                            padding: 15px 0 10px 20px;
                            cursor: pointer;
                            &.active {
                                background: #fff;
                            }
                            .item-avatar {
                                display: block;
                                width: 44px;
                                height: 44px;
                                margin-right: 10px;
                            }
                            .item-info {
                                flex: 1;
                                .info-header {
                                    display: flex;
                                    align-items: center;
                                    width: 100%;
                                    margin: 2px 0 6px;
                                    .info-username {
                                        text-ellipsis();
                                        font-size: 16px;
                                    }
                                    .info-time {
                                        color: #C8C8C8;
                                        font-size: 12px;
                                        margin-left: auto;
                                        margin-right: 8px;
                                    }
                                }
                                .info-content {
                                    text-ellipsis();
                                    width: 170px;
                                    color: #9D9D9D;
                                    font-size: 12px;
                                }
                            }
                        }
                    }
                    .index-conversation {
                        flex: 1;
                        height: 100%;
                        .conversation-container {
                            position: relative;
                            display: flex;
                            flex-direction: column;
                            height: 100%;
                            .conversation-main {
                                display: flex;
                                flex-direction: column;
                                height: 450px;
                                .conversation-title {
                                    text-ellipsis();
                                    display: flex;
                                    align-items: center;
                                    width: 100%;
                                    height: 40px;
                                    font-size: 16px;
                                    padding-left: 20px;
                                }
                                .conversation-content {
                                    width: 100%;
                                    height: 410px;
                                    border-bottom: 1px solid #D9DEE4;
                                    overflow-y: auto;
                                    padding: 0 20px;
                                    .content-item {
                                        display: flex;
                                        margin: 20px 0;
                                        .item-avatar {
                                            display: block;
                                            width: 40px;
                                            height: 40px;
                                        }
                                        .item-content {
                                            color: $contentColor;
                                            font-size: 14px;
                                            padding: 9px 11px;
                                            border: 1px solid #8E8E8E;
                                            background: #F3F3F3;
                                        }
                                        .item-more {
                                            display: none;
                                            margin-left: 12px;
                                        }
                                        &.text {
                                            display: flex;
                                            align-items: center;
                                            &:hover {
                                                .item-more {
                                                    display: block;
                                                }
                                            }
                                            .item-avatar {
                                                margin-right: 12px;
                                            }
                                            .item-content {
                                                border-radius: 2px 12px 12px 12px;
                                            }
                                        }
                                        &.self {
                                            display: flex;
                                            align-items: center;
                                            justify-content: flex-end;
                                            &:hover {
                                                .item-more {
                                                    display: block;
                                                }
                                            }
                                            .item-avatar {
                                                margin-left: 12px;
                                            }
                                            .item-content {
                                                border-radius: 12px 12px 2px 12px;
                                            }
                                            .item-more {
                                                margin-right: 12px;
                                            }
                                        }
                                        &.time {
                                            flex-center();
                                            margin: 30px 0 20px;
                                            &:first-child {
                                                margin: 10px 0 20px;
                                            }
                                            .item-time {
                                                font-size: 12px;
                                                color: #999;
                                                text-align: center;
                                                padding: 2px 9px;
                                                background: #F2F6FB;
                                                border-radius: 5px;
                                            }
                                        }
                                    }
                                }
                            }
                            .conversation-publish {
                                height: 260px;
                                overflow-y: auto;
                                .publish-tool {
                                    display: flex;
                                    align-items: center;
                                    margin: 8px 0 12px;
                                }
                                .publish-content {
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
@media screen and (max-width: 980px) {
    #index {
        position: relative;
        width: 100%;
        height: 100vh;
        display: flex;
        align-items: center;
        overflow: hidden;
        .index-container {
            width: 100%;
            height: 100%;
            overflow: hidden;
            .index-menu {
                position: fixed;
                bottom: 0;
                left: 0;
                right: 0;
                z-index: 99;
                width: 100%;
                height: toRem(55);
                background: #0D0D0E;
                .menu-user {
                    display: none;
                }
                .menu-tabs {
                    display: flex;
                    align-items: center;
                    justify-content: space-around;
                    width: 100%;
                    height: 100%;
                    .el-badge {
                        height: 100%;
                        .el-badge__content.is-fixed {
                            right: toRem(25);
                        }
                    }
                    .tabs-item {
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        text-align: center;
                        height: 100%;
                        padding: 0 toRem(18);
                        color: #fff;
                        font-size: toRem(24);
                        &.active {
                            background: $appColor;
                        }
                        .item-label {
                            white-space: nowrap;
                            font-size: toRem(12);
                            margin-top: toRem(2);
                        }
                    }
                }
            }
            .index-right {
                height: 100vh;
                padding-top: toRem(62);
                background: #000 url('~@/assets/img/mazidalogo.png') no-repeat top left;
                background-size: toRem(56) auto;
                overflow: hidden;
                .index-title {
                    display: none;
                }
                .right-container {
                    width: 100%;
                    height: 100%;
                    background: #fff;
                    border-top-left-radius: toRem(8);
                    border-top-right-radius: toRem(8);
                    overflow: hidden;
                }
            }
        }
    }
}
</style>
