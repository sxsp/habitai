<template>
    <div class="header-content">
        <div class="router-name">Header</div>
        <div class="user-name">{{ userName }}</div>
    </div>
</template>

<script setup>
import { useStore } from 'vuex'
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { ElMessage } from 'element-plus'
const store = useStore()
const router = useRouter();
const userName = ref('')
const handleCollapsed = () => {
    store.commit("changeCollapsed")
}
onMounted(() => {
    axios.get("/adminapi/user/info", {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem("token")}`
        }
    }).then(res => {
        if (res.data.code === 401) {
            router.push('/login');
            localStorage.removeItem('token')
        } else if (res.data && res.data.UserName) {
            userName.value = res.data.UserName;
        }
        else {
            ElMessage.error("Get User Info Error!")
        }
    })
})
</script>

<style scoped>
.header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 60px;
}
</style>