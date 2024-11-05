<template>
    <el-aside>
        <button @click="routeTo('/habitai')">
            <span>HiAI</span>
        </button>
        <button @click="routeTo('/myhabitsmenu')">
            <span>HABITS</span>
        </button>
        <button @click="routeTo('/center')">
            <span>USER</span>
        </button>
        <button @click="routeTo('/hihub')">
            <span>HiHUB</span>
        </button>
        <button @click="signOut">
            <span>SIGN OUT</span>
        </button>
    </el-aside>
</template>

<script setup>
import store from '@/store/index'
import { useRouter } from 'vue-router'

const router = useRouter()

const routeTo = (path) => {
    router.push(path)
    store.commit("changeCollapsed", false)
    store.commit("changeCurPage", path)
}

const signOut = () => {
    localStorage.removeItem('token')
    store.commit("changeCollapsed", false)
    router.push('/login')
}


</script>

<style lang="scss" scoped>
.el-aside {
    height: 100%;
    width: 20vw;
    background: #ffffff;
    position: fixed;
    left: 20%;
    z-index: 1000;
    transform: skew(-21deg);
    box-shadow: 6px 3px 2px rgba(0, 0, 0, 0.3);
    display: flex;
    flex-direction: column;
    justify-content: center;
    overflow-x: hidden;
}

.el-menu {
    background-color: rgb(99, 196, 163);
}

button {
    white-space: nowrap;
    position: relative;
    background: #fff;
    border: none;
    padding: 10px 20px;
    display: inline-block;
    font-size: 3vw;
    font-weight: 600;
    color: rgb(65, 65, 65);
    width: 100%;
    height: 12vh;
    cursor: pointer;
    transform: skew(0deg);
}

span {
    display: inline-block;
}

button::before {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    right: 100%;
    left: 0;
    background: rgb(65, 65, 65);
    opacity: 0;
    z-index: -1;
    transition: all 0.3s;
}

button:hover {
    color: #fff;
}

button:hover::before {
    left: 0;
    right: 0;
    opacity: 1;
}
</style>