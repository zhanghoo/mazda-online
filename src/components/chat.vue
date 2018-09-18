<template>
    <div class="chat">
        <!-- 对话框列表 -->
        <div class="chat-user">
            <div class="nothing" v-if="!conversationList || !(conversationList.length > 0)">暂无联系人</div>
            <div class="user-item" v-if="item" v-for="(item, index) in conversationList" :key="index" :class="{'active': conversationActiveIndex === index}" @click="handleHistoryActive(item, index)">
                <el-badge :value="item.unread_msg_count" :hidden="item.unread_msg_count === 0">
                    <img class="item-avatar" src="~@/assets/img/mazidakefu.png">
                </el-badge>
                <div class="item-info">
                    <div class="info-header">
                        <div class="info-username">{{item.nickName || item.username}}</div>
                        <div class="info-time" v-if="item.retractTime">{{item.retractTime | formatTime}}</div>
                        <div class="info-time" v-else-if="item.msgs">{{item.msgs[item.msgs.length - 1].ctime_ms | formatTime}}</div>
                    </div>
                    <div class="info-lastMsg" v-if="item.msgs">
                        <div class="lastMsg-read" :class="item.msgs[item.msgs.length - 1].read ? '' : 'unread'" v-if="!item.retractText && item.msgs[item.msgs.length - 1].content.from_id === userInfo.username">{{item.msgs[item.msgs.length - 1].read ? '[已读]' : '[未读]'}}</div>
                        <div class="lastMsg-content" v-if="item.retractText">{{item.retractText}}</div>
                        <div class="lastMsg-content" v-else>{{item.msgs[item.msgs.length - 1].content.msg_body.text || '[图片]'}}</div>
                    </div>
                </div>
            </div>
        </div>
        <!-- 对话框界面 -->
        <div class="chat-conversation" :class="{'active': conversationActiveData}">
            <div class="conversation-backBtn" @click="conversationActiveIndex = -1">
                <div class="backBtn-icon my-icon-back"></div>
                <div class="backBtn-label">返回列表</div>
            </div>
            <div class="conversation-container" v-if="conversationActiveData">
                <div class="conversation-avatar">
                    <img src="~@/assets/img/mazidakefu.png">
                </div>
                <div class="conversation-main">
                    <div class="conversation-title">{{conversationActiveData.nickName || conversationActiveData.username}}</div>
                    <div class="conversation-content">
                        <div class="content-list">
                            <div class="content-item-wrap" v-for="(item, index) in conversationActiveData.msgs" :key="index">
                                <div class="item-time" v-if="!item.ctime_ms_hide">
                                    <div class="time-value">{{item.ctime_ms | formatTime}}</div>
                                </div>
                                <div class="item-text" v-if="item.content.from_id === conversationActiveData.username">
                                    <img class="item-avatar" src="~@/assets/img/mazidakefu.png">
                                    <div class="item-content" v-if="item.content.msg_body.text">
                                        <div class="item-content-drive" v-if="item.content.msg_body.text === driveText">
                                            <div class="drive-header">预约试驾</div>
                                            <div class="drive-content">
                                                <img src="~@/assets/img/logo.png">
                                                <div class="content-text">
                                                    邀请您留下资料到店试驾
                                                    <br> 我们会尽快给您安排
                                                </div>
                                            </div>
                                        </div>
                                        <div class="item-content-value" v-else>{{item.content.msg_body.text}}</div>
                                    </div>
                                    <div class="item-image" v-else-if="item.local_url">
                                        <img :src="item.local_url" @click="handlePreviewImage(item, index)">
                                    </div>
                                    <div class="item-more" v-if="item.content.msg_body.text">
                                        <el-dropdown trigger="click" placement="bottom">
                                            <div class="el-icon-more"></div>
                                            <el-dropdown-menu slot="dropdown">
                                                <el-dropdown-item v-clipboard:copy="item.content.msg_body.text">复制</el-dropdown-item>
                                            </el-dropdown-menu>
                                        </el-dropdown>
                                    </div>
                                </div>
                                <div class="item-text self" v-else>
                                    <div class="item-more">
                                        <el-dropdown trigger="click">
                                            <div class="el-icon-more"></div>
                                            <el-dropdown-menu slot="dropdown">
                                                <el-dropdown-item @click.native="handleMsgRetract(item.msg_id, index)">撤回</el-dropdown-item>
                                                <el-dropdown-item v-clipboard:copy="item.content.msg_body.text">复制</el-dropdown-item>
                                            </el-dropdown-menu>
                                        </el-dropdown>
                                        <div class="item-read" :class="[item.read ? '' : 'unread']">{{item.read ? '已读' : '未读'}}</div>
                                    </div>
                                    <div class="item-content" v-if="item.content.msg_body.text">
                                        <div class="item-content-drive" v-if="item.content.msg_body.text === driveText">
                                            <div class="drive-header">预约试驾</div>
                                            <div class="drive-content">
                                                <img src="~@/assets/img/logo.png">
                                                <div class="content-text">
                                                    邀请您留下资料到店试驾
                                                    <br> 我们会尽快给您安排
                                                </div>
                                            </div>
                                        </div>
                                        <div class="item-content-value" v-else>{{item.content.msg_body.text}}</div>
                                    </div>
                                    <div class="item-image" v-else-if="item.local_url">
                                        <img :src="item.local_url" @click="handlePreviewImage(item, index)">
                                    </div>
                                    <img class="item-avatar" :src="userInfo.avatar">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="conversation-publish">
                    <div class="publish-tool">
                        <my-emoji @selected="handleEmojiSelected"></my-emoji>
                        <label class="tool-item my-icon-picture" for="upload-pic">
                            <input id="upload-pic" style="display: none;" type="file" accept="image/*" @change="handleSendSinglePic($event)">
                        </label>
                        <a v-if="isKfu" class="tool-item my-icon-car" title="预约试驾" @click="handleSendSingleMsg(driveText)"></a>
                    </div>
                    <el-input class="publish-content" v-model="content" placeholder="请输入文字" type="textarea" resize="none" :rows="2"></el-input>
                    <el-button class="publish-button" :loading="sendLoading" @click="handleSendSingleMsg('')">发送</el-button>
                    <div class="publish-icon my-icon-share" @click="handleSendSingleMsg('')"></div>
                </div>
            </div>
            <div class="conversation-nothing">
                <div class="nothing-content">
                    <img class="nothing-image" src="~@/assets/img/welcome.svg">
                    <div class="nothing-text">欢迎使用 Mazda JChat</div>
                </div>
            </div>
        </div>
        <my-preview v-if="previewDialogVisible" :imageList=previewImageList :previewIndex="previewIndex" @close="previewDialogVisible = false"></my-preview>
        <!-- tip -->
        <tip-dialog v-if="tipDialogVisible" @close="tipDialogVisible = false" :type="tipDialogType" @reLogin="reLogin" @logOut="$store.dispatch('kfuLoginOut')"></tip-dialog>
    </div>
</template>
<script>
import JIM from '@/api/jim'
import { formatTime } from '@/utils'
import { saveMsg, kfuLoginStatus, KfuId } from '@/api'
import myEmoji from '@/components/emoji'
export default {
    name: 'chat',
    components: { myEmoji },
    props: {
        chatType: {
            type: String,
            default: () => ''
        },
        json: '',
        initData: null,
        userInfo: null,
        activeUser: null,
        mergeTime_ms: {
            type: Number,
            default: () => 3 * 60 * 1000
        }
    },
    data() {
        return {
            emojiHtml: '',
            conversationList: [],
            conversationActiveIndex: -1,
            content: '',
            previewDialogVisible: false,
            previewIndex: 0,
            previewImageList: [],
            wecomeBefore: '感谢您关注官方体验平台，平台为您提供操作简洁的在线赏车订车服务，并可通过金牌导购答疑解惑，使您在家中就能轻松选择预订爱车。',
            tipDialogType: 0,
            tipDialogVisible: false,
            driveText: '[[[预约试驾]]]',
            sendLoading: false
        }
    },
    computed: {
        // 当前对话框数据
        conversationActiveData() {
            if (this.conversationList) {
                return this.conversationList[this.conversationActiveIndex]
            } else {
                return ''
            }
        },
        // 是否客服chat
        isKfu() {
            if (this.chatType) {
                return this.chatType === 'kfu'
            } else {
                return false
            }
        }
    },
    watch: {
        json(val) {
            this.conversationList = val
        },
        activeUser(val) {
            this.handleHistoryActive(val)
        },
        conversationList() {
            // 合并短时间消息
            if (this.conversationActiveData) {
                let msgs = this.conversationActiveData.msgs
                for (let index = msgs.length - 1; index > 0; index--) {
                    if (msgs[index].ctime_ms - msgs[index - 1].ctime_ms <= this.mergeTime_ms) {
                        this.$set(msgs[index], 'ctime_ms_hide', true)
                    }
                }
            }
        }
    },
    filters: {
        formatTime
    },
    mounted() {
        this.conversationList = this.json
        this.handleHistoryActive(this.activeUser)
        this.onMsgReceive()
        this.onMsgReceiptChange()
        this.onEventNotification()
    },
    methods: {
        // 监听接收消息
        onMsgReceive() {
            JIM.onMsgReceive(res => {
                console.log('接收到1条消息: onMsgReceive', res)
                if (res.rid) {
                    let msg = res.messages[0]
                    let conversation = this.conversationFind(msg.from_username)
                    if (conversation) {
                        if (conversation.retractText) {
                            this.$set(conversation, 'retractText', '')
                            this.$set(conversation, 'retractTime', '')
                        }
                        this.mergeMessage(conversation, msg)
                        // 当前对话框 ？已读回执 ： 未读 +1
                        if (this.conversationActiveData && conversation.username === this.conversationActiveData.username) {
                            this.handleMsgReport(conversation.username, [res.rid])
                            this.scrollBottom()
                        } else {
                            this.$set(conversation, 'unread_msg_count', ++conversation.unread_msg_count)
                        }
                    } else {
                        // 新建对话框
                        let nowTime = new Date().getTime()
                        JIM.getUserInfo(msg.from_username, this.initData.appkey).then(res => {
                            console.log('获取用户信息', res)
                            let userInfo = res.user_info
                            let newConversation = {
                                ...userInfo,
                                'nickName': userInfo.nickname || userInfo.username,
                                'mtime': nowTime,
                                msgs: [
                                    msg
                                ]
                            }
                            this.conversationList.unshift(newConversation)
                        })
                    }
                }
                this.handleUnread_count()
            })
        },
        // 监听已读数变更（针对自己）
        onMsgReceiptChange() {
            JIM.onMsgReceiptChange(res => {
                console.log('已读数变更 onMsgReceiptChange : ', res)
                this.comparisonMessage([res])
            })
        },
        // 业务事件监听
        onEventNotification() {
            JIM.onEventNotification(res => {
                console.log('业务事件监听 onEventNotification : ', res)
                let event_type = res.event_type
                // 被迫下线
                if (event_type === 1) {
                    this.tipDialogType = 1
                    this.tipDialogVisible = true
                }
                // 消息撤回事件
                if (event_type === 55) {
                    let conversation = this.conversationFind(res.from_username)
                    if (conversation) {
                        conversation.msgs.some((item, index) => {
                            if (item.msg_id === res.msg_ids[0]) {
                                conversation.msgs.splice(index, 1)
                            }
                        })
                        this.$set(conversation, 'retractText', '对方撤回了一条信息')
                        this.$set(conversation, 'retractTime', res.ctime_ms)
                    }
                }
            })
        },
        onDisconnect() {
            JIM.onDisconnect(res => {
                this.tipDialogType = 0
                this.tipDialogVisible = true
            })
        },
        // 发送文字消息
        handleSendSingleMsg(content = '') {
            if (!this.sendLoading) {
                this.sendLoading = true
                let text = ''
                if (content) {
                    text = content
                } else {
                    text = this.content
                }
                if (text) {
                    JIM.sendSingleMsg(this.initData.appkey, this.conversationActiveData.username, text).then(data => {
                        console.log('发送文字消息：sendSingleMsg', data)
                        if (this.conversationActiveData.retractText) {
                            this.$set(this.conversationActiveData, 'retractText', '')
                            this.$set(this.conversationActiveData, 'retractTime', '')
                        }
                        let msg = data.msg
                        this.$set(msg, 'ctime_ms', data.res.ctime_ms)
                        this.mergeMessage(this.conversationActiveData, msg)
                        this.scrollBottom()
                        if (!content) {
                            this.content = ''
                        }
                        // 保存信息
                        let params = {
                            'kfusername': this.conversationActiveData.username,
                            'username': this.userInfo.username,
                            'message': text,
                            'msg_type': 1,
                            'user_type': 1,
                            'timestamp': (new Date()).getTime()
                        }
                        saveMsg(params).then(res => {
                        })
                        this.sendLoading = false
                    })
                }
            }
        },
        // 发送图片消息
        handleSendSinglePic(ev) {
            let imgFile = ev.target.files[0]
            JIM.sendSinglePic(this.initData.appkey, this.conversationActiveData.username, imgFile).then(data => {
                console.log('发送图片消息：sendSinglePic', data)
                let msg = data.msg
                JIM.getResource(msg.content.msg_body.media_id).then(URL => {
                    msg['local_url'] = URL
                    if (this.conversationActiveData.retractText) {
                        this.$set(conversation, 'retractText', '')
                        this.$set(conversation, 'retractTime', '')
                    }
                    this.$set(msg, 'ctime_ms', data.res.ctime_ms)
                    this.mergeMessage(this.conversationActiveData, msg).then(() => {
                        this.scrollBottom()
                    })
                    // 保存信息
                    let params = {
                        'kfusername': this.conversationActiveData.username,
                        'username': this.userInfo.username,
                        'image': msg.content.msg_body.media_id,
                        'msg_type': 2,
                        'user_type': 1,
                        'timestamp': (new Date()).getTime()
                    }
                    saveMsg(params).then(res => {
                    })
                })
            })
        },
        // 消息已读回执
        handleMsgReport(username, unread_msgs) {
            let conversation = this.conversationFind(username)
            this.$set(conversation, 'unread_msg_count', 0)
            JIM.addSingleReceiptReport(username, unread_msgs).then(res => {
                console.log('已读回执 addSingleReceiptReport : ', res)
                // 重置未读数
                JIM.resetUnreadCount(username)
            })
            this.handleUnread_count()
        },
        // 合并短间隔消息
        mergeMessage(conversation, msg) {
            return new Promise((resolve, reject) => {
                let msgs = conversation.msgs
                for (let index = msgs.length - 1; index > 0; index--) {
                    if (!msgs[index].ctime_ms_hide) {
                        if (msg.ctime_ms - msgs[index].ctime_ms < this.mergeTime_ms) {
                            this.$set(msg, 'ctime_ms_hide', true)
                        }
                        break
                    }
                }
                msgs.push(msg)
                this.$set(conversation, 'msgs', msgs)
                resolve()
            })
        },
        // 设置已读（针对自己）
        comparisonMessage(readMsgs) {
            readMsgs.forEach(readMsg => {
                let conversation = this.conversationFind(readMsg.username)
                if (conversation) {
                    readMsg.receipt_msgs.forEach(receipt_msg => {
                        conversation.msgs.some(msg => {
                            if (receipt_msg.msg_id === msg.msg_id) {
                                this.$set(msg, 'read', true)
                                return true
                            }
                        })
                    })
                }
            })
        },
        // 打开对话框
        handleHistoryActive(activeUser) {
            if (activeUser && activeUser.username) {
                if (!this.isKfu) {
                    kfuLoginStatus(activeUser.username).then(status => {
                        console.log('客服状态查询', status)
                        if (status && !status.online) {
                            KfuId(activeUser.username).then(res => {
                                let id = res.responseBody
                                this.$message.warning('客服不在线，请您留言')
                                this.$router.push({ path: '/message', query: { 'id': id } })
                            })
                        }
                    })
                }
                let conversation = this.conversationFind(activeUser.username)
                let index = this.conversationList.findIndex(item => item.username === activeUser.username)
                if (conversation && index > -1) {
                    this.conversationActiveIndex = index
                    this.scrollBottom()
                    if (conversation.unread_msg_count > 0) {
                        let kefuMsgs = conversation.msgs.filter(msg => msg.content.from_id === conversation.username)
                        let msgs_id = kefuMsgs.map(kuMsgs => kuMsgs.msg_id)
                        this.handleMsgReport(conversation.username, msgs_id)
                    }
                } else {
                    // 新建对话框
                    let nowTime = new Date().getTime()
                    let newConversation = {
                        ...activeUser,
                        'nickName': activeUser.nickname,
                        'mtime': nowTime,
                        msgs: [
                            {
                                'ctime_ms': nowTime,
                                'msg_id': 0,
                                'content': {
                                    'from_name': activeUser.username,
                                    'from_id': activeUser.username,
                                    'msg_body': {
                                        'text': this.wecomeBefore
                                    }
                                }
                            },
                            {
                                'ctime_ms': nowTime,
                                'msg_id': 0,
                                'content': {
                                    'from_name': activeUser.username,
                                    'from_id': activeUser.username,
                                    'msg_body': {
                                        'text': activeUser.welcome
                                    }
                                }
                            }
                        ]
                    }
                    this.conversationList.unshift(newConversation)
                    this.conversationActiveIndex = 0
                }
            }
        },
        // 消息撤回
        handleMsgRetract(msg_id, index) {
            JIM.msgRetract(msg_id).then(res => {
                console.log('消息撤回 msgRetract：', res)
                this.conversationActiveData.msgs.splice(index, 1)
                this.$set(this.conversationActiveData, 'retractText', '您撤回了一条信息')
                this.$set(this.conversationActiveData, 'retractTime', new Date().getTime())
            }).catch(err => {
                if (err.code === 881401) {
                    this.$message.error('时间过长，不能撤回')
                }
            })
        },
        // 图片预览
        handlePreviewImage(item, index) {
            this.getImageList().then(res => {
                this.previewImageList = res
                this.previewImageList.findIndex((image, activeIndex) => {
                    if (image.index === index) {
                        this.previewIndex = activeIndex
                    }
                })
                this.previewDialogVisible = true
            })
        },
        // 获取当前对话框的图片列表
        getImageList() {
            return new Promise((resolve, reject) => {
                let arr = []
                let count = 0
                let imageArr = this.conversationActiveData.msgs.filter(item => item.local_url)
                this.conversationActiveData.msgs.forEach((item, index) => {
                    if (item.local_url) {
                        let img = new Image()
                        img.src = item.local_url
                        let set = setInterval(() => {
                            if (img.width > 0 || img.height > 0) {
                                count += 1
                                if (count === imageArr.length) {
                                    resolve(arr)
                                }
                                clearInterval(set)
                            }
                        }, 40)
                        img.onload = () => {
                            let obj = {
                                src: item.local_url,
                                w: img.width,
                                h: img.height,
                                index: index
                            }
                            arr.push(obj)
                        }
                    }
                })
            })
        },
        // 查找对话框
        conversationFind(username) {
            return this.conversationList.find(item => item.username === username)
        },
        // 对话框滚动到底部
        scrollBottom() {
            this.$nextTick().then(res => {
                let conversationHeight = this.$el.querySelector('.content-list').offsetHeight
                this.$el.querySelector('.conversation-content').scrollTop = conversationHeight
            })
        },
        // 处理选中表情
        handleEmojiSelected(emoji) {
            this.content += emoji
        },
        // 重新登录
        reLogin() {
            JIM.loginOut()
            window.location.reload()
        },
        // 所有会话未读数
        handleUnread_count() {
            let count = 0
            if (this.conversationList) {
                this.conversationList.forEach(item => {
                    if (item.unread_msg_count) count += item.unread_msg_count
                })
                this.$emit('unreadCount', count)
            }
        }
    }
}
</script>
<style lang='stylus'>
$publishHeight = toRem(100);
@media screen and (min-width: 981px) {
    .chat {
        display: flex;
        width: 100%;
        height: 100%;
        .chat-user {
            position: relative;
            width: 310px;
            height: 100%;
            border-right: 1px solid $borderColor;
            background: $bgColor;
            overflow-y: auto;
            .nothing {
                color: #aaa;
                font-size: 14px;
                margin-top: 20px;
                text-align: center;
            }
            .user-item {
                display: flex;
                width: 100%;
                padding: 15px 0 10px 20px;
                cursor: pointer;
                &.active {
                    background: #fff;
                }
                .el-badge__content {
                    border: none;
                }
                .item-avatar {
                    display: block;
                    width: 44px;
                    height: 44px;
                }
                .item-info {
                    width: 245px;
                    padding-left: 10px;
                    .info-header {
                        display: flex;
                        align-items: center;
                        width: 100%;
                        margin: 2px 0 6px;
                        .info-username {
                            text-ellipsis();
                            width: 80%;
                            font-size: 16px;
                        }
                        .info-time {
                            color: #C8C8C8;
                            font-size: 12px;
                            margin-left: auto;
                            margin-right: 8px;
                        }
                    }
                    .info-lastMsg {
                        display: flex;
                        align-items: center;
                        color: #9d9d9d;
                        font-size: 12px;
                        .lastMsg-read {
                            white-space: nowrap;
                            margin-right: 4px;
                            &.unread {
                                color: #CE1B10;
                            }
                        }
                        .lastMsg-content {
                            white-space: nowrap;
                            text-overflow: ellipsis;
                            overflow: hidden;
                            width: 170px;
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
        .chat-conversation {
            flex: 1;
            height: 100%;
            overflow: hidden;
            .conversation-container {
                position: relative;
                display: flex;
                flex-direction: column;
                width: 100%;
                height: 100%;
                .conversation-main {
                    display: flex;
                    flex-direction: column;
                    width: 100%;
                    height: 500px;
                    overflow: hidden;
                    .conversation-title {
                        text-ellipsis();
                        display: flex;
                        align-items: center;
                        width: 100%;
                        height: 40px;
                        font-size: 16px;
                        padding: 0 20px;
                    }
                    .conversation-content {
                        width: 100%;
                        flex: 1;
                        padding: 0 20px;
                        overflow-y: auto;
                        overflow-X: hidden;
                        .content-list {
                            width: 100%;
                            .content-item-wrap {
                                &:first-child {
                                    .item-time {
                                        margin-top: 20px;
                                    }
                                }
                                .item-time {
                                    flex-center();
                                    margin-top: 30px;
                                    .time-value {
                                        font-size: 12px;
                                        color: #999;
                                        text-align: center;
                                        line-height: 17px;
                                        padding: 2px 9px;
                                        background: #F2F6FB;
                                        border-radius: 5px;
                                    }
                                }
                                .item-text {
                                    display: flex;
                                    padding: 20px 0;
                                    .item-avatar {
                                        display: block;
                                        width: 40px;
                                        height: 40px;
                                        margin-right: 12px;
                                    }
                                    .item-content {
                                        .item-content-drive {
                                            border-radius: 2px 12px 12px 12px;
                                            overflow: hidden;
                                            background-color: #dedede;
                                            font-size: 14px;
                                            cursor: pointer;
                                            .drive-header {
                                                display: flex;
                                                align-items: center;
                                                width: 100%;
                                                height: 26px;
                                                background-color: #CE1B10;
                                                padding: 3px 12px;
                                                color: #fff;
                                            }
                                            .drive-content {
                                                display: flex;
                                                align-items: center;
                                                padding: 10px;
                                                background: url('~@/assets/img/yuyuebj.png') top left no-repeat;
                                                background-size: 100% 100%;
                                                img {
                                                    display: block;
                                                    width: 60px;
                                                    height: 60px;
                                                }
                                                .content-text {
                                                    color: #000;
                                                    margin-left: 10px;
                                                }
                                            }
                                        }
                                        .item-content-value {
                                            color: $contentColor;
                                            font-size: 14px;
                                            line-height: 20px;
                                            word-break: break-all;
                                            padding: 10px 12px;
                                            border: 1px solid #8E8E8E;
                                            background: #F3F3F3;
                                            border-radius: 2px 12px 12px 12px;
                                        }
                                    }
                                    .item-image {
                                        cursor: zoom-in;
                                        img {
                                            display: block;
                                            max-width: 200px;
                                            max-height: 300px;
                                            border-radius: 5px;
                                        }
                                    }
                                    .item-more {
                                        margin-left: 12px;
                                        align-self: flex-end;
                                        .el-icon-more {
                                            cursor: pointer;
                                            visibility: hidden;
                                            width: 100%;
                                            text-align: center;
                                            font-size: 16px;
                                            color: #fff;
                                            padding: 1px 2px;
                                            background: #ccc;
                                            border-radius: 5px;
                                            margin-bottom: 5px;
                                        }
                                        .item-read {
                                            color: #A3A3A3;
                                            font-size: 12px;
                                            display: block;
                                            white-space: nowrap;
                                            &.unread {
                                                color: #CE1B10;
                                            }
                                        }
                                    }
                                    &:hover {
                                        .item-more {
                                            .el-icon-more {
                                                visibility: visible;
                                            }
                                        }
                                    }
                                    &.self {
                                        justify-content: flex-end;
                                        .item-avatar {
                                            margin-left: 12px;
                                            margin-right: 0;
                                        }
                                        .item-content-value {
                                            border-radius: 12px 12px 2px 12px;
                                        }
                                        .item-content-drive {
                                            border-radius: 12px 12px 2px 12px;
                                        }
                                        .item-more {
                                            margin-right: 12px;
                                            margin-left: 0;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                .conversation-publish {
                    flex: 1;
                    overflow: hidden;
                    border-top: 1px solid #D9DEE4;
                    .publish-tool {
                        display: flex;
                        align-items: center;
                        height: 24px;
                        margin: 8px 0 12px;
                        .tool-item {
                            color: #888;
                            font-size: 24px;
                            margin-left: 18px;
                            cursor: pointer;
                            &:hover {
                                color: #56c7c6;
                            }
                            &.active {
                                color: #56c7c6;
                            }
                        }
                    }
                    .publish-content {
                        textarea {
                            border: none;
                        }
                    }
                    .publish-button {
                        position: absolute;
                        bottom: 20px;
                        right: 20px;
                        width: 90px;
                        font-size: 14px;
                        color: #2C2C2C;
                        cursor: pointer;
                        background: #fff;
                        border-radius: 3px;
                    }
                    .publish-icon {
                        display: none;
                    }
                }
            }
            .conversation-nothing {
                flex-center();
                position: relative;
                width: 100%;
                height: 100%;
                display: flex;
                .nothing-content {
                    flex-center();
                    flex-direction: column;
                    .nothing-image {
                        width: 69.7px;
                        height: 57px;
                    }
                    .nothing-text {
                        font-size: 14px;
                        color: #d0d0d0;
                        margin-top: 12px;
                    }
                }
            }
            .conversation-avatar, .conversation-backBtn {
                display: none;
            }
        }
    }
}
@media screen and (max-width: 980px) {
    .chat {
        width: 100%;
        height: 100%;
        background: #fff;
        .chat-user {
            position: relative;
            height: 100%;
            background: #fff;
            overflow-y: auto;
            padding: 0 toRem(18);
            .nothing {
                color: #aaa;
                font-size: toRem(14);
                margin-top: toRem(20);
                text-align: center;
            }
            .user-item {
                display: flex;
                width: 100%;
                padding: toRem(15) 0 toRem(10);
                border-bottom: 1px solid #eee;
                .el-badge__content {
                    border: none;
                }
                .item-avatar {
                    display: block;
                    width: toRem(44);
                    height: toRem(44);
                }
                .item-info {
                    flex: 1;
                    margin-left: toRem(10);
                    .info-header {
                        display: flex;
                        align-items: center;
                        width: 100%;
                        margin: toRem(2) 0 toRem(6);
                        .info-username {
                            text-ellipsis();
                            font-size: toRem(16);
                        }
                        .info-time {
                            color: #C8C8C8;
                            font-size: toRem(12);
                            margin-left: auto;
                            margin-right: toRem(8);
                        }
                    }
                    .info-lastMsg {
                        display: flex;
                        align-items: center;
                        color: #9d9d9d;
                        font-size: toRem(12);
                        .lastMsg-read {
                            white-space: nowrap;
                            margin-right: toRem(4);
                            &.unread {
                                color: #CE1B10;
                            }
                        }
                        .lastMsg-content {
                            white-space: nowrap;
                            text-overflow: ellipsis;
                            overflow: hidden;
                            width: toRem(170);
                        }
                    }
                    .info-content {
                        text-ellipsis();
                        width: toRem(170);
                        color: #9D9D9D;
                        font-size: toRem(12);
                    }
                }
            }
        }
        .chat-conversation {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: -1;
            width: 100%;
            height: 100%;
            padding-top: toRem(62);
            padding-bottom: $publishHeight;
            &.active {
                z-index: 222;
            }
            .conversation-nothing {
                display: none;
            }
            .conversation-backBtn {
                flex-center();
                flex-direction: column;
                position: absolute;
                top: toRem(10);
                right: 0;
                color: #fff;
                font-size: toRem(12);
                padding: 0 toRem(15);
                .backBtn-icon {
                    font-size: toRem(26);
                    margin-bottom: toRem(2);
                }
            }
            .conversation-container {
                position: relative;
                display: flex;
                flex-direction: column;
                width: 100%;
                height: 100%;
                background: #fff;
                box-shadow: inset toRem(0 toRem(10) 10) toRem(-5) #000;
                .conversation-avatar {
                    position: absolute;
                    left: 50%;
                    top: 0%;
                    transform: translate3d(-50%, -75%, 0);
                    img {
                        display: block;
                        width: toRem(46);
                        height: toRem(46);
                        border-radius: 100%;
                    }
                }
                .conversation-main {
                    width: 100%;
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    background: #fff;
                    .conversation-title {
                        flex-center();
                        width: 100%;
                        height: toRem(55);
                        font-size: toRem(16);
                    }
                    .conversation-content {
                        position: relative;
                        flex: 1;
                        overflow-y: auto;
                        .content-list {
                            position: absolute;
                            top: 0;
                            left: 0;
                            right: 0;
                            padding: 0 toRem(20);
                        }
                        .content-item-wrap {
                            &:first-child {
                                .item-time {
                                    margin-top: toRem(10);
                                }
                            }
                            .item-time {
                                flex-center();
                                margin-top: toRem(15);
                                .time-value {
                                    font-size: toRem(12);
                                    color: #999;
                                    text-align: center;
                                    line-height: toRem(17);
                                    padding: toRem(2) toRem(9);
                                    background: #F2F6FB;
                                    border-radius: toRem(5);
                                }
                            }
                            .item-text {
                                display: flex;
                                padding: toRem(20) 0;
                                .item-avatar {
                                    display: none;
                                }
                                .item-content-value {
                                    color: $contentColor;
                                    font-size: toRem(14);
                                    line-height: toRem(20);
                                    word-break: break-all;
                                    padding: toRem(10) toRem(12);
                                    border: 1px solid #8E8E8E;
                                    background: #F3F3F3;
                                    border-radius: toRem(2) toRem(12) toRem(12) toRem(12);
                                }
                                .item-image {
                                    img {
                                        display: block;
                                        max-width: toRem(200);
                                        max-height: toRem(300);
                                        border-radius: toRem(5);
                                    }
                                }
                                .item-more {
                                    margin-left: toRem(12);
                                    align-self: flex-end;
                                    .el-icon-more {
                                        visibility: hidden;
                                        width: 100%;
                                        text-align: center;
                                        font-size: toRem(16);
                                        color: #fff;
                                        padding: toRem(1) toRem(2);
                                        background: #ccc;
                                        border-radius: toRem(5);
                                        margin-bottom: toRem(5);
                                    }
                                    .item-read {
                                        color: #A3A3A3;
                                        font-size: toRem(12);
                                        display: block;
                                        white-space: nowrap;
                                        &.unread {
                                            color: #CE1B10;
                                        }
                                    }
                                }
                                .item-content-drive {
                                    border-radius: toRem(2) toRem(12) toRem(12) toRem(12);
                                    overflow: hidden;
                                    background-color: #dedede;
                                    font-size: toRem(14);
                                    cursor: pointer;
                                    .drive-header {
                                        display: flex;
                                        align-items: center;
                                        width: 100%;
                                        height: toRem(26);
                                        background-color: #CE1B10;
                                        padding: toRem(3) toRem(12);
                                        color: #fff;
                                    }
                                    .drive-content {
                                        display: flex;
                                        align-items: center;
                                        padding: toRem(10);
                                        background: url('~@/assets/img/yuyuebj.png') top left no-repeat;
                                        background-size: 100% 100%;
                                        img {
                                            display: block;
                                            width: toRem(60);
                                            height: toRem(60);
                                        }
                                        .content-text {
                                            color: #000;
                                            margin-left: toRem(10);
                                        }
                                    }
                                }
                                &:hover, &:active {
                                    .item-more {
                                        .el-icon-more {
                                            visibility: visible;
                                        }
                                    }
                                }
                                &.self {
                                    justify-content: flex-end;
                                    .item-content-value {
                                        border-radius: toRem(12) toRem(12) toRem(2) toRem(12);
                                    }
                                    .item-content-drive {
                                        cursor: none;
                                        border-radius: toRem(12) toRem(12) toRem(2) toRem(12);
                                    }
                                    .item-more {
                                        margin-right: toRem(12);
                                        margin-left: 0;
                                    }
                                }
                            }
                        }
                    }
                }
                .conversation-publish {
                    position: fixed;
                    bottom: 0;
                    z-index: 99;
                    display: flex;
                    flex-direction: column;
                    width: 100%;
                    height: $publishHeight;
                    font-size: 0;
                    border-top: 1px solid #dcdfe6;
                    background: #fff;
                    overflow: hidden;
                    .publish-tool {
                        position: absolute;
                        top: 0;
                        width: 100%;
                        min-height: fit-content;
                        margin: toRem(10) 0;
                        line-height: 1;
                        .tool-item {
                            display: inline-block;
                            color: #888;
                            font-size: toRem(24);
                            margin-left: toRem(18);
                            &.active {
                                color: #56c7c6;
                            }
                        }
                    }
                    .publish-content {
                        width: 100%;
                        height: 100%;
                        padding-top: toRem(44);
                        textarea {
                            width: 82%;
                            font-size: toRem(16);
                            padding: 0 toRem(18);
                            border: none;
                        }
                    }
                    .publish-button {
                        display: none;
                    }
                    .publish-icon {
                        position: absolute;
                        bottom: toRem(20);
                        right: toRem(20);
                        color: #888888;
                        font-size: toRem(32);
                    }
                }
            }
        }
    }
}
</style>
