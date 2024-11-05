<template>
    <div class="usercenter-contain">
        <div class="command-inter">
            <div class="info-item" :class="{ command: 1 }">HIAI TERMINAL> user info</div>
            <div class="info-item">MY NAME:&nbsp;&nbsp;{{ user_name }}</div>
            <div class="info-item">HILEVEL:&nbsp;&nbsp;Lv{{ score2Level(user_score) }}</div>
            <div class="info-item">FIRST MET:&nbsp;&nbsp;{{ user_re_date }}</div>
            <div class="info-item" :class="{ command: 1 }">HIAI TERMINAL> hiai introduce</div>
            <div class="info-item">{{ intro }} :>
            </div>
        </div>

    </div>
</template>

<script setup>
import axios from 'axios';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { watch, ref, onMounted, onBeforeUnmount, computed } from 'vue';
import store from '@/store/index';

const user_name = ref('')
const user_re_date = ref('')
const user_score = ref(0)
const intro = ref('')
onMounted(() => {
    axios.get("/adminapi/user/info", {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem("token")}`
        }
    }).then(res => {
        if (res.data.code === 401) {
            router.push('/login');
            localStorage.removeItem('token')
        } else if (res.data && res.data.userName) {
            user_name.value = res.data.userName;
            user_re_date.value = res.data.body.register_date;
            user_score.value = res.data.body.score;
            console.log(user_name.value, user_re_date.value, user_score.value);

        }
        else {
            ElMessage.error("Get User Info Error!")
        }
    })
    botIntro()
})

let s = ''
const messageQueue = [];
let isDisplaying = false;

const botIntro = () => {
    let question = 'Briefly introduce yourself with 20 words';

    axios.post("/adminapi/user/sendquestion", {
        question: question
    }, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem("token")}`
        },
    }).then(res => {
        intro.value = '';
        let question_id = res.data.questionId;
        if (question_id) {
            const eventSource = new EventSource(`/adminapi/user/getanswer/${question_id}`);

            eventSource.onmessage = (event) => {
                const fullMessage = decodeURIComponent(event.data);
                console.log(fullMessage);
                messageQueue.push(fullMessage);
                if (!isDisplaying) {
                    displayMessages();
                }
            };

            eventSource.onerror = () => {
                console.log(s);
                eventSource.close();
            };
            eventSource.onclose = () => {
            };
        }
    }).catch(error => {
    }).finally(() => {
        question = '';
    })
};

const displayMessages = () => {
    if (messageQueue.length === 0) {
        isDisplaying = false;
        return;
    }
    isDisplaying = true;
    const fullMessage = messageQueue.shift();
    console.log("mess___________: ", fullMessage);
    let currentIndex = 0;
    const baseSpeed = 30; // Base speed in ms per character
    const minSpeed = 10;  // Minimum speed in ms per character
    const maxSpeed = 70; // Maximum speed in ms per character

    s += fullMessage;
    const typeWriter = () => {
        if (currentIndex < fullMessage.length) {
            intro.value += fullMessage.charAt(currentIndex);
            currentIndex++;
            setTimeout(typeWriter, Math.max(minSpeed, Math.min(maxSpeed, baseSpeed - fullMessage.length * 2)));
        } else {
            displayMessages();
        }
    };

    typeWriter();
};

const score2Level = (s) => {
    if (s >= 1024) {
        return 6;
    }
    else if (s >= 512) {
        return 5;
    }
    else if (s >= 256) {
        return 4;
    }
    else if (s >= 128) {
        return 3;
    }
    else if (s >= 64) {
        return 2;
    }
    else if (s >= 16) {
        return 1;
    }
    else {
        return 0;
    }
}
</script>

<style lang="scss" scoped>
$shell-border-color: rgb(0, 115, 182);

@keyframes terminal-in {
    0% {
        top: 100%;
        left: 50%;
        height: 10%;
        width: 10%;
    }

    100% {
        top: 40%;
        left: 50%;
        height: 50%;
        width: 50%;
    }
}

.usercenter-contain {
    position: fixed;
    top: 40%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
    height: 50%;
    width: 50%;
    background: #2f3341;
    border-top: 4vh solid $shell-border-color;
    border-bottom: 0.2vh solid $shell-border-color;
    border-left: 0.2vh solid $shell-border-color;
    border-right: 1vh solid white;
    box-shadow: 30px 30px 0px 0px rgb(56, 56, 56);
    overflow: hidden;
    animation: terminal-in 0.5s;

}

.command-inter {
    overflow-y: auto;
    height: 100%;
    width: 200%;
}

.info-item {
    color: rgb(0, 255, 157);
    font-size: min(4vh, 4vw);
    width: 48%;
    margin-left: 1%;
}

.info-item.command {
    color: white;
    font-size: min(3vh, 3vw);
    margin-top: 1%;
}

.command-input {
    color: rgb(0, 255, 157);
    background: transparent;
    font-size: min(4vh, 4vw);
    width: 50%;
    margin-left: 1%;
    border: none;
    border-left: 1px solid rgb(0, 255, 157);
    outline: none;
}
</style>