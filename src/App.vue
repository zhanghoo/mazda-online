<template>
    <div id="app">
        <transition name="el-fade-in-linear" mode="out-in">
            <router-view />
        </transition>
    </div>
</template>

<script>
export default {
    name: 'App'
}
</script>

<style lang='stylus'>
#app {
    position: relative;
    width: 100%;
    background: url('~@/assets/img/body_bg.jpg') left top no-repeat;
    background-size: cover;
    a {
        text-decoration: none;
        outline: none;
    }
}
</style>
