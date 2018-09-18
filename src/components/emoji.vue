<template>
    <el-popover popper-class="emoji-web" placement="top-start" width="474" trigger="click">
        <div class="tool-item my-icon-emoji" slot="reference"></div>
        <div id="emoji">
            <ul class="emoji-list">
                <li class="emoji-item">😄</li>
                <li class="emoji-item">😃</li>
                <li class="emoji-item">😀</li>
                <li class="emoji-item">😊</li>
                <li class="emoji-item">☺️</li>
                <li class="emoji-item">😉</li>
                <li class="emoji-item">😍</li>
                <li class="emoji-item">😘</li>
                <li class="emoji-item">😚</li>
                <li class="emoji-item">😗</li>
                <li class="emoji-item">😙</li>
                <li class="emoji-item">😜</li>
                <li class="emoji-item">😝</li>
                <li class="emoji-item">😛</li>
                <li class="emoji-item">😳</li>
                <li class="emoji-item">😁</li>
                <li class="emoji-item">😔</li>
                <li class="emoji-item">😌</li>
                <li class="emoji-item">😒</li>
                <li class="emoji-item">😞</li>
                <li class="emoji-item">😣</li>
                <li class="emoji-item">😢</li>
                <li class="emoji-item">😂</li>
                <li class="emoji-item">😭</li>
                <li class="emoji-item">😪</li>
                <li class="emoji-item">😥</li>
                <li class="emoji-item">😰</li>
                <li class="emoji-item">😅</li>
                <li class="emoji-item">😓</li>
                <li class="emoji-item">😩</li>
                <li class="emoji-item">😫</li>
                <li class="emoji-item">😨</li>
                <li class="emoji-item">😱</li>
                <li class="emoji-item">😠</li>
                <li class="emoji-item">😡</li>
                <li class="emoji-item">😤</li>
                <li class="emoji-item">😖</li>
                <li class="emoji-item">😆</li>
                <li class="emoji-item">😋</li>
                <li class="emoji-item">😷</li>
                <li class="emoji-item">😎</li>
                <li class="emoji-item">😴</li>
                <li class="emoji-item">😵</li>
                <li class="emoji-item">😲</li>
                <li class="emoji-item">😟</li>
                <li class="emoji-item">😦</li>
                <li class="emoji-item">😧</li>
                <li class="emoji-item">👿</li>
                <li class="emoji-item">😮</li>
                <li class="emoji-item">😬</li>
                <li class="emoji-item">🙈</li>
                <li class="emoji-item">👄</li>
                <li class="emoji-item">👍</li>
                <li class="emoji-item">👎</li>
                <li class="emoji-item">👌</li>
                <li class="emoji-item">👊</li>
                <li class="emoji-item">✊</li>
                <li class="emoji-item">✌</li>️
                <li class="emoji-item">👋</li>
                <li class="emoji-item">✋</li>
                <li class="emoji-item">👐</li>
                <li class="emoji-item">👆</li>
                <li class="emoji-item">👇</li>
                <li class="emoji-item">👉</li>
                <li class="emoji-item">👈</li>
                <li class="emoji-item">🙌</li>
                <li class="emoji-item">🙏</li>
                <li class="emoji-item">☝</li>️
                <li class="emoji-item">👏</li>
                <li class="emoji-item">💪</li>
                <li class="emoji-item">🚶</li>
                <li class="emoji-item">🏃</li>
                <li class="emoji-item">💃</li>
                <li class="emoji-item">👫</li>
                <li class="emoji-item">👪</li>
                <li class="emoji-item">👬</li>
                <li class="emoji-item">👭</li>
                <li class="emoji-item">💏</li>
                <li class="emoji-item">💑</li>
                <li class="emoji-item">👯</li>
                <li class="emoji-item">🙆</li>
                <li class="emoji-item">🙅</li>
                <li class="emoji-item">💁</li>
                <li class="emoji-item">🙋</li>
                <li class="emoji-item">💆</li>
                <li class="emoji-item">💇</li>
                <li class="emoji-item">💅</li>
                <li class="emoji-item">👰</li>
                <li class="emoji-item">🙎</li>
                <li class="emoji-item">🙍</li>
                <li class="emoji-item">1️⃣</li>
                <li class="emoji-item">2️⃣</li>
                <li class="emoji-item">3️⃣</li>
                <li class="emoji-item">4️⃣</li>
                <li class="emoji-item">5️⃣</li>
                <li class="emoji-item">6️⃣</li>
                <li class="emoji-item">7️⃣</li>
                <li class="emoji-item">8️⃣</li>
                <li class="emoji-item">9️⃣</li>
                <li class="emoji-item">0️⃣</li>
                <li class="emoji-item">🔟</li>
                <li class="emoji-item">⬆️</li>
                <li class="emoji-item">⬇️</li>
                <li class="emoji-item">⬅️</li>
                <li class="emoji-item">➡️</li>
            </ul>
        </div>
    </el-popover>
</template>
<script>
export default {
    name: 'emoji',
    mounted() {
        this.$nextTick(() => {
            var elArr = this.$el.querySelectorAll('.emoji-item')
            elArr.forEach(item => {
                item.addEventListener('click', (ev) => {
                    this.$emit('selected', item.innerHTML)
                })
            })
        })
    }
}
</script>
<style lang='stylus'>
#emoji {
    position: relative;
    width: 450px;
    overflow: hidden;
    &:after {
        position: absolute;
        left: 0;
        bottom: 0;
        display: block;
        width: 100%;
        height: 1px;
        background: #fff;
        content: '';
    }
    .emoji-list {
        position: relative;
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        &:before {
            position: absolute;
            top: 0;
            right: 0;
            display: block;
            width: 1px;
            height: 100%;
            background: #fff;
            content: '';
        }
        .emoji-item {
            flex-center();
            width: 30px;
            height: 30px;
            border-bottom: 1px solid #f0f0f0;
            border-right: 1px solid #f0f0f0;
            cursor: pointer;
        }
    }
}
@media screen and (max-width: 980px) {
    #emoji {
        width: 100%;
        height: toRem(210);
        padding: 0 toRem(12);
        overflow-y: auto;
        .emoji-list {
            width: 100%;
            .emoji-item {
                width: 10%;
                min-height: toRem(30);
            }
        }
    }
    .emoji-web {
        width: 100% !important;
        left: 0 !important;
        padding: toRem(12) 0 !important;
    }
}
</style>
