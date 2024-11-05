<template>
    <div class="input-and-send">
        <input class="question-input" type="textarea" placeholder="" v-model="questionForm.my_question" maxlength="500"
            show-word-limit :autosize="{ minRows: 2 }" resize="none" />
        <button class="question-button" @click="sendQuestion" type="primary" :loading="loading">{{
                loading ?
                    '...' : 'send' }}</button>
    </div>
    <div class="chat-list">
        <div v-for="(chat, index) in chatContents" :key="index">
            <div>
                <div class="message-me">me: </div>
                <div class="me-message">{{ chat.user }}</div>
            </div>
            <div style="height: 1vh;"></div>
            <div>
                <div class="message-bot">habitAI:</div>
                <div class="bot-message" v-html="chat.ui"></div>
            </div>
            <div style="height: 1vh;"></div>
        </div>
    </div>

</template>

<script setup>
import { reactive, ref, onMounted, onBeforeUnmount } from 'vue';
import axios from 'axios';
import { ElMessage } from 'element-plus';
import MarkdownIt from 'markdown-it';
import store from '@/store/index'



const md = new MarkdownIt();
let loading = ref(false);

const questionForm = reactive({
    my_question: "",
});

let s = ''
const chatContents = ref([]);
const messageQueue = [];
let isDisplaying = false;


onMounted(() => {
    const storedChatContents = localStorage.getItem('chatContents');
    if (storedChatContents) {
        chatContents.value = JSON.parse(storedChatContents);
    }
});

onBeforeUnmount(() => {
    localStorage.setItem('chatContents', JSON.stringify(chatContents.value));
});

window.addEventListener('beforeunload', () => {
    localStorage.removeItem('chatContents');
});

const sendQuestion = () => {

    let question = questionForm.my_question.trim();
    if (!question || loading.value) {
        return;
    }
    questionForm.my_question = '';

    loading.value = true;
    axios.post("/adminapi/user/sendquestion", {
        question: question
    }, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem("token")}`
        },
    }).then(res => {
        let question_id = res.data.questionId;
        if (question_id) {
            let answer = ref('');
            let ui = ref('');
            chatContents.value.push({ user: question, ai: answer, ui: ui });
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
                loading.value = false;
            };
            eventSource.onclose = () => {
                loading.value = false;
            };
        }
    }).catch(error => {
        console.error("Error sending question: ", error);
        ElMessage.error("Something error...");
        loading.value = false;
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

    const answerRef = chatContents.value[chatContents.value.length - 1];
    s += fullMessage;
    const typeWriter = () => {
        if (currentIndex < fullMessage.length) {
            answerRef.ai += fullMessage.charAt(currentIndex);
            answerRef.ui = md.render(answerRef.ai);
            currentIndex++;
            setTimeout(typeWriter, Math.max(minSpeed, Math.min(maxSpeed, baseSpeed - fullMessage.length * 2)));
        } else {
            displayMessages();
        }
    };

    typeWriter();
};

const changeTodayHabit = (a) => {
    store.commit("changeShowTodo", a)
}
</script>

<style lang="scss" scoped>
$message-font-size: 0.8vw;


.input-and-send {
    position: fixed;
    bottom: 3vh;
    left: 50%;
    transform: translateX(-50%);
    margin-bottom: 30px;
    z-index: 100;
    display: flex;
}

.question-input {
    position: relative;
    width: 30vw;
    min-width: 600px;
    height: 4vh;
    border: 1px solid #000000;
    font-family: "Gochi Hand";
    font-size: 20px;
    box-shadow: 2px 4px 0 #353535;
}

.question-button {
    background: #d4fbff;
    position: relative;
    width: 6vw;
    height: 4.3vh;
    border: 1px solid #000000;
    transform: rotate(5deg);
    transform-origin: center;
    font-family: "Gochi Hand";
    font-size: min(2vh, 2vw);
    font-weight: bold;
    border-radius: 0.2vh;
    transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.question-button:active {
    transform: translateY(5px);
    outline: 0;
}

.chat-list {
    padding: 0.8vw;
    border-radius: 0.2vw;
    width: 30vw;
    min-width: 600px;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    top: 3vh;
    bottom: 15vh;
    margin: 0 auto;
    background: #e6fdff;
    box-shadow: inset 0 0 0.5vw rgba(0, 0, 0, 0.5);
    overflow-y: auto;
}



.message-me {
    color: rgb(36, 36, 36);
    font-size: 1vw;
}

.me-message {
    padding: 0.6vw;
    border-top-right-radius: 0.6vw;
    border-bottom-right-radius: 0.6vw;
    border-bottom-left-radius: 0.6vw;

    background: rgb(0, 74, 158);
    color: #ffffff;
    display: inline-block;
    max-width: 25vw;
    font-size: $message-font-size;
    box-shadow: 0.1vw 0.1vh 0 rgba(0, 0, 0, 0.5);
}

.message-bot {
    color: rgb(36, 36, 36);
    font-size: 1vw;
}

.bot-message {
    padding: 0.6vw;
    border-top-right-radius: 0.6vw;
    border-bottom-right-radius: 0.6vw;
    border-bottom-left-radius: 0.6vw;
    background: rgb(255, 255, 255);
    display: inline-block;
    max-width: 25vw;
    font-size: $message-font-size;
    box-shadow: 0.1vw 0.1vh 0 rgba(0, 0, 0, 0.5);
}
</style>