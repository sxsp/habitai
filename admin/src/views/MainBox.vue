<template>
    <div class="main-container">
        <button class="todolist-button" @click="changeTodayHabit(true)">TODOLIST</button>
        <button v-if="stillCanOpenNowTodo" class="todonow-button" @click="changeShowNowTodo(true)">TODO NOW</button>
        <div v-if="isDone" class="todoNowDoneContain">
            <div class="doneOkContain">
                <div class="doneOk">
                    <div class="okCube" @click="endDoing()">&nbsp;OK&nbsp;</div>
                </div>
            </div>
            <div class="doneContain">
                <div class="done">
                    <div class="doneCube">&nbsp;{{ habitDoing }}&nbsp;DONE!&nbsp;</div>

                </div>
            </div>

        </div>
        <div class="habit-remind-main" v-if="show_now_todo_habit">
            <div class="clock" :style="clockMoveLeft">
                <div class="clock-backg"></div>
                <div class="clock-tik" :style="clock_tik"></div>
                <div class="clock-min" :style="clock_min"></div>
                <div class="clock-hour" :style="clock_hour"></div>

            </div>

            <div class="clock-digit-contain" :style="clockDigitMoveLeft">
                <div class="clock-digit">&nbsp;{{ ('0' + (current_hour)).slice(-2) }}:{{ ('0' + (current_min)).slice(-2)
                    }}:{{
            ('0' + (current_tik)).slice(-2) }}&nbsp;</div>
            </div>
            <div class="todo-now-habit-contain" :style="todoNowHabitMoveBottom">
                <div class="todo-now-habit-backg"></div>
                <div class="todo-now-habit">{{ startDoHabit ? '' : '&nbsp;time&nbsp;to&nbsp;' }}<div
                        style="color: red;">{{
            todo_now_habit }}</div>{{ startDoHabit ? '&nbsp;ing&nbsp;' : '' }}
                    &nbsp;</div>
            </div>
            <div class="exit-contain" :class="{ sure: sureToExit }">
                <div class="exit-backg"></div>
                <div class="exit" @click="readyToExit()">EXIT</div>
                <div v-if="sureToExit" class="exit-yes-no" @click="sureExit(false)">NO</div>
                <div v-if="sureToExit">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>
                <div v-if="sureToExit" class="exit-yes-no" @click="sureExit(true)">YES</div>

            </div>
            <div class="start-contain" @click="startDoing()" :style="startMainMove">
                <div v-if="startDoHabit" class="bot-part">
                    <div class="bot-face">(^_^)&nbsp;</div>
                    <div class="bot-remind">
                        {{ bot_encourage }}
                    </div>
                </div>
                <div class="start-backg"></div>
                <div class="start" :style="startFontChange">{{ startDoHabit ? 'HELD ON FOR ' + keptMin + ' MINS' :
            'START'
                    }}</div>
            </div>
        </div>

        <div class="today-habit" v-if="store.state.show_today_habit">
            <div class="today-habit-backg"></div>
            <div class="todo-list-dec-1">
                <div style="color: rgb(0, 163, 255);">TODO</div>
                <div style="color: white;">LIST</div>
            </div>
            <div class="today-todo-list">
                <div class="habit-all">
                    <div v-for="(habit_i, index) in todayHabitContents" :key="index">
                        <div class="habit-item" :class="{ over: todayHabitContents[index].is_over_now }">
                            <div class="habit-code">&nbsp;{{ todayHabitContents[index].is_done ? '√' : '□' }}</div>
                            <div class="habit-time">{{ habit_i.habit_start_time }}</div>
                            <div class="habit-name">{{ habit_i.user_habit }}</div>
                        </div>
                    </div>

                </div>
            </div>
            <div @click="changeTodayHabit(false)" class="todo-ok">
                <div>OK</div>
            </div>
        </div>
        <div class="header-container">
            <button class="menu-button" @click="toggleSideMenu">
                MENU
            </button>

        </div>
        <div v-if="store.state.is_collapsed" class="overlay" @click="toggleSideMenu">
            <span class="overlay-text-1">STICK
                TO YOUR HABITS</span>
            <div class="menu-back-decorate"></div>
            <div class="menu-back-decorate-tiktok"></div>
        </div>


        <transition name="slide">

            <SideMenu v-if="store.state.is_collapsed" class="side-menu"
                :class="{ 'is-visible': store.state.is_collapsed }" />

        </transition>
        <div class="main-content">
            <router-view></router-view>
        </div>
    </div>

</template>

<script setup>
import axios from 'axios'
import SideMenu from '../components/mainbox/SideMenu.vue'
import { reactive, ref, onMounted, watch, computed } from 'vue'
import { ElMessage } from 'element-plus'
import store from '@/store/index'

const todayHabitContents = ref([])

const toggleSideMenu = () => {
    if (store.state.is_collapsed)
        store.commit("changeCollapsed", false)
    else
        store.commit("changeCollapsed", true)
}

watch(() => store.state.need_update_today_todo,
    (newVal) => {
        if (newVal) {
            getToDoList()
        }
    });

onMounted(() => {
    getToDoList()
})

const today = new Date();
const today_yyyymmdd = today.getFullYear() + '-' +
    ('0' + (today.getMonth() + 1)).slice(-2) + '-' +
    ('0' + today.getDate()).slice(-2);

const getToDoList = () => {
    axios.get("/adminapi/user/browsehabits", {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem("token")}`
        }
    }).then(res => {
        if (res.data.code === 401) {
            ElMessage.error("User info error! Please sign in again.");
            localStorage.removeItem('token')
            setTimeout(() => {
                router.push('/login');
            }, 1000);
        } else if (res.data) {
            todayHabitContents.value.splice(0, todayHabitContents.value.length);
            for (let i = 0; i < res.data.body.length; i++) {
                const beginDate = new Date(res.data.body[i].habit_begin_date);
                const endDate = new Date(res.data.body[i].habit_end_date);
                const today = new Date();
                beginDate.setHours(0, 0, 0, 0);
                endDate.setHours(0, 0, 0, 0);
                today.setHours(0, 0, 0, 0);
                if (today >= beginDate && today <= endDate && (1 << getTodayWeek() & res.data.body[i].habit_week)) {
                    todayHabitContents.value.push({
                        user_habit: res.data.body[i].user_habit, habit_id: res.data.body[i].habit_id, habit_week: res.data.body[i].habit_week,
                        habit_begin_date: res.data.body[i].habit_begin_date, habit_end_date: res.data.body[i].habit_end_date, habit_start_time: res.data.body[i].habit_start_time,
                        habit_dur_time: res.data.body[i].habit_dur_time, habit_keep_record: res.data.body[i].habit_keep_record, habit_last_update: res.data.body[i].habit_last_update,
                        is_complete: res.data.body[i].is_complete, is_over_now: timeToMinutes(res.data.body[i].habit_start_time) + res.data.body[i].habit_dur_time < currentTimeToMinutes(), is_done: today_yyyymmdd === res.data.body[i].habit_last_update && (res.data.body[i].habit_keep_record & 0b1)
                    });
                }
            }
            todayHabitContents.value.sort((a, b) => {
                return timeToMinutes(a.habit_start_time) - timeToMinutes(b.habit_start_time);
            });
            for (let i = 0; i < todayHabitContents.value.length; i++) {
                if (!todayHabitContents.value[i].is_over_now) {
                    store.commit("changeToDoNext", i);
                    todo_now_habit.value = todayHabitContents.value[i].user_habit;
                    todo_now_time.value = todayHabitContents.value[i].habit_start_time;
                    todo_now_dur.value = todayHabitContents.value[i].habit_dur_time;
                    break;
                }
            }
            store.commit("changeToDo", false)
        }
        else {
        }
    })
}

const getTodayWeek = () => {
    var date = new Date();
    return date.getDay();
}

const changeTodayHabit = (a) => {
    store.commit("changeShowTodo", a)
}

const timeToMinutes = (timeStr) => {
    let [hours, minutes] = timeStr.split(':');
    return parseInt(hours, 10) * 60 + parseInt(minutes, 10);
}

const currentTimeToMinutes = () => {
    const now = new Date();
    return now.getHours() * 60 + now.getMinutes();
}

// -------------------------------------------------------------------------------------- clock module

const current_hour = ref(0)
const current_min = ref(0)
const current_tik = ref(0)
const getCurrentTik = () => {
    let now = new Date();
    current_hour.value = now.getHours();
    current_min.value = now.getMinutes();
    current_tik.value = now.getSeconds();
}
setInterval(getCurrentTik, 1000);

const clock_tik = computed((
) => ({
    transform: `translateY(-50%) rotate(${6 * current_tik.value - 90}deg)`
}));
const clock_min = computed(() => ({
    transform: `translateY(-50%) rotate(${6 * current_min.value - 90}deg)`
}));
const clock_hour = computed(() => ({
    // transform: `rotate(${(30 * (current_hour.value % 12)) + (30 * current_min.value / 60) - 90}deg)`
    transform: `translateY(-50%) rotate(${(60 * (current_hour.value % 12) + current_min.value) / 2 - 90}deg)`
}));

const startDoHabit = ref(false)
const clockMoveLeft = computed(() => {
    return startDoHabit.value ? { left: '5%' } : { left: '20%' };
});
const clockDigitMoveLeft = computed(() => {
    return startDoHabit.value ? { left: '10%' } : { left: '25%' };
});

// --------------------------------------------------------------------------------------
const todoNowHabitMoveBottom = computed(() => {
    return startDoHabit.value ? { top: '75%', transform: 'skewY(-5deg)' } : { top: '65%', transform: 'skewY(-10deg)' };
});

const startMainMove = computed(() => {
    return startDoHabit.value ? { left: '30%', top: '0%', transform: 'rotate(0deg)' } : { left: '60%', top: '-40%', transform: 'rotate(-10deg)' };
});

const startFontChange = computed(() => {
    return startDoHabit.value ? { 'font-size': 'min(8vh, 8vw)', opacity: '0.5' } : { 'font-size': 'min(12vh, 12vw)' };
});

// -------------------------------------------------------------------------------------- todo now module

const todo_now_habit = ref('')
const todo_now_time = ref('')
const todo_now_dur = ref(0)

const show_now_todo_habit = ref(false)                                              // ------------------------------------------
const stillCanOpenNowTodo = ref(false)

const changeShowNowTodo = (a) => {
    show_now_todo_habit.value = a
}
const checkTime = () => {
    console.log(todayHabitContents.value);
    if (!todayHabitContents.value.length) {
        return;
    }
    let nowMin = currentTimeToMinutes();
    if (store.state.today_next_todo_index != -1 && nowMin === timeToMinutes(todayHabitContents.value[store.state.today_next_todo_index].habit_start_time) && current_tik.value === 0) {
        show_now_todo_habit.value = true;
    }

    if (store.state.today_next_todo_index != -1 && nowMin >= timeToMinutes(todayHabitContents.value[store.state.today_next_todo_index].habit_start_time) && nowMin <= timeToMinutes(todayHabitContents.value[store.state.today_next_todo_index].habit_start_time) + 10 && !todayHabitContents.value[store.state.today_next_todo_index].is_done) {
        stillCanOpenNowTodo.value = true;
    } else if (!startDoHabit.value) {
        stillCanOpenNowTodo.value = false;
        show_now_todo_habit.value = false;                                              // ------------------------------------------
    }
    for (let i = 0; i < todayHabitContents.value.length; i++) {
        if (nowMin > timeToMinutes(todayHabitContents.value[i].habit_start_time) + todayHabitContents.value[i].habit_dur_time) {
            todayHabitContents.value[i].is_over_now = true;
        }
    }
}
setInterval(checkTime, 1000);

const keptMin = ref(0);
let intervalId;

const habitDoing = ref('test')

const startNowTodoTimer = (is_start) => {

    if (is_start) {
        // clear Timer
        if (intervalId) {
            clearInterval(intervalId);
        }
        habitDoing.value = todayHabitContents.value[store.state.today_next_todo_index].user_habit
        keptMin.value = 0;
        botSay(false);
        // set a new Timer
        intervalId = setInterval(() => {
            if (keptMin.value < todayHabitContents.value[store.state.today_next_todo_index].habit_dur_time) {
                keptMin.value += 1;
                if (keptMin.value % 5 === 0) {
                    botSay(false);
                }
                if (keptMin.value === todayHabitContents.value[store.state.today_next_todo_index].habit_dur_time / 2) {
                    updateTodayHabitKeep(todayHabitContents.value[store.state.today_next_todo_index].habit_id);
                }
            } else {
                botSay(true);
                isDone.value = true;
                clearInterval(intervalId);
            }
        }, 60000);
    } else {
        if (intervalId) {
            clearInterval(intervalId);
        }
    }
};

const isDone = ref(false)

const endDoing = () => {
    show_now_todo_habit.value = false;
    isDone.value = false;
}

const startDoing = () => {
    if (startDoHabit.value) {
        return;
    }
    startDoHabit.value = true;
    startNowTodoTimer(startDoHabit.value);
}

const updateTodayHabitKeep = (id) => {
    axios.post("/adminapi/user/updatetodayhabit", {
        habit_id: id
    }, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem("token")}`
        },
    }).then(res => {
        if (res.data.code === 0) {
            ElMessage.success("Keep record update success!");
        } else {
            ElMessage.error("Keep record update error!");
        }
    }).catch(error => {
        console.error("Error update habit record: ", error);
        ElMessage.error("Something error...");
        loading.value = false;
    })
}

const botSay = (is_end) => {
    sendQuestion(is_end);
}

const questionForm = reactive({
    my_question: "",
});

let loading = ref(false);

let s = ''
const bot_encourage = ref('')
const messageQueue = [];
let isDisplaying = false;

const sendQuestion = (is_end) => {
    let question = '';
    if (is_end) {
        question = 'I\'m done with today\'s ' + todo_now_habit.value + ', please compliment me in 20 words';
    } else {
        let randomInteger = Math.floor(Math.random() * 2);
        if (randomInteger) {
            question = 'I am maintaining the habit of ' + todo_now_habit.value + '.Please encourage me with less than 20 words..';
        }
        else {
            question = 'Speak briefly about the benefits of ' + todo_now_habit.value + ' with less than 20 words.';
        }
    }
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
        bot_encourage.value = '';
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
                loading.value = false;
            };
            eventSource.onclose = () => {
                loading.value = false;
            };
        }
    }).catch(error => {
        loading.value = false;
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
            bot_encourage.value += fullMessage.charAt(currentIndex);
            currentIndex++;
            setTimeout(typeWriter, Math.max(minSpeed, Math.min(maxSpeed, baseSpeed - fullMessage.length * 2)));
        } else {
            displayMessages();
        }
    };

    typeWriter();
};

// --------------------------------------------------------------------------------------

const sureToExit = ref(false)

const readyToExit = () => {
    sureToExit.value = true;
}

const sureExit = (really) => {
    sureToExit.value = false;
    show_now_todo_habit.value = really ? false : true;
    startDoHabit.value = really ? false : startDoHabit.value;
}
</script>

<style lang="scss" scoped>
:root {
    --tik-initial-rotation: 0deg;
}

@keyframes menuIn {

    0% {
        transform: translateY(-100%);
        width: 0%;
    }

    50% {
        transform: translateY(0);
        width: 1%;
    }

    100% {
        transform: skew(-21deg);
        width: 20vw;
    }
}

@keyframes fadeInBackground {

    0% {
        background-color: rgba(1, 36, 78, 0);
    }

    50% {
        background-color: rgba(1, 36, 78, 0.8);
    }

}

@keyframes fadeIn {

    0%,
    50% {
        color: rgba(255, 255, 255, 0);
        text-shadow: 6px 3px 2px rgba(0, 0, 0, 0);
    }

    100% {
        color: #ffffff;
        text-shadow: 6px 3px 2px rgba(0, 0, 0, 0.432);
    }
}

.menu-button {
    border: 0.2vw solid rgba(7, 133, 138, 0.8);
    position: fixed;
    top: 2%;
    left: 2%;
    height: 8vh;
    width: 10vw;
    overflow: hidden;
    background-color: rgb(255, 255, 255);
    text-align: center;
    font-size: min(4vh, 4vw);
    font-weight: bold;
    transition: .3s;
    z-index: 0;
    font-family: inherit;
    color: rgba(1, 36, 78, 0.8);
    opacity: 0.5;
}

.menu-button::before {
    content: '';
    width: 0;
    height: 100vh;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(21deg);
    background: rgba(7, 133, 138, 0.8);
    transition: .5s ease;
    display: block;
    z-index: -1;
    opacity: 1;
}

.menu-button:hover::before {
    width: 120%;
    opacity: 1;
}

.menu-button:hover {
    color: #111;
    opacity: 1;
}


.side-menu {
    animation: menuIn 0.5s cubic-bezier(.36, .07, .19, .97);
    transform-origin: 50% 50%;
}

.overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(1, 36, 78, 0.8);
    z-index: 500;
    animation: fadeInBackground 0.5s cubic-bezier(.36, .07, .19, .97);

}


.overlay-text-1 {
    color: #ffffff;
    position: absolute;
    top: 25%;
    left: 48%;
    transform: translate(-50%, -50%);
    font-size: 10vh;
    font-weight: bold;
    text-shadow: 6px 3px 2px rgba(0, 0, 0, 0.432);

    z-index: 1000;
    transform: skew(-21deg);
    animation: fadeIn 0.5s cubic-bezier(.36, .07, .19, .97);
}

.slide-enter-active,
.slide-leave-active {
    transition: opacity 0.3s;
}

.slide-enter,
.slide-leave-to {
    opacity: 0;
}

.main-container {
    position: fixed;
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    background: #52616b;
}

.header-container {
    user-select: none;
    flex: 0 1 auto;
    height: 10vh;
}

@keyframes menuBackDecorateIn {

    0% {
        transform: translateY(-100%);
        ;
        width: 0%;
    }

    50% {
        width: 1%;
        transform: translateY(0);
    }

    100% {}
}

.menu-back-decorate {
    height: 100%;
    width: 5%;
    left: 19%;
    background: rgb(65, 65, 65);
    position: fixed;
    z-index: 502;
    transform: skew(-21deg);
    animation: menuBackDecorateIn 0.5s cubic-bezier(.36, .07, .19, .97);

}

.menu-back-decorate-tiktok {
    height: 100%;
    width: 5%;
    left: 19%;
    background: rgb(0, 166, 172);
    position: fixed;
    z-index: 501;
    transform: skew(-100deg);
    animation: menuBackDecorateIn 0.5s cubic-bezier(.36, .07, .19, .97);

}


.todo-ok {
    position: fixed;

    font-size: 10vh;
    font-weight: bold;
    color: rgb(48, 48, 48);
    top: 60%;
    left: 80%;
    width: 20vw;
    background: #f9fcff;
    box-shadow: calc(min(3vh, 3vw)) calc(min(2vh, 2vw)) 0px 0px rgb(0, 174, 255);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2;
    transform: skewY(-5deg);
    animation: todo-ok-in 0.8s;
    transition: all 0.3s;
}

.todo-ok:hover {
    background: rgb(0, 174, 255);
    box-shadow: calc(min(3vh, 3vw)) calc(min(2vh, 2vw)) 0px 0px rgb(255, 255, 255);
}

@keyframes todo-ok-in {

    0% {
        left: 100%;
        transform: skewY(0deg);
        opacity: 0;
    }


    100% {
        left: 80%;
        transform: skewY(-5deg);
        opacity: 100%;
    }
}


.todo-list-dec-1 {
    position: fixed;
    display: flex;
    z-index: -1;
    font-size: 12vh;
    font-weight: bold;
    top: 30%;
    left: 70%;
    transform: translateX(-50%) translateY(-50%) skew(5deg);
    white-space: nowrap;
}

.today-habit {
    user-select: none;
    z-index: 1000;
    position: fixed;
    height: 100%;
    width: 100%;
    background: rgba(141, 219, 255, 0.452);
    animation: today-habit-in 0.5s;
}

@keyframes today-habit-in {
    0% {
        clip-path: circle(5% at 70% 25%);
        background: rgba(255, 255, 255, 0.452);
    }

    100% {
        clip-path: circle(100% at 70% 25%);
        background: rgba(141, 219, 255, 0.452);
    }
}

.today-habit-backg {
    z-index: -3;
    position: fixed;
    height: 100%;
    width: 100%;
    background: linear-gradient(to top right, #1e2236, #3a6dafdc);
    animation: today-habit-backg-in 0.8s;
}

@keyframes today-habit-backg-in {
    0% {
        clip-path: circle(1% at 70% 25%);
    }

    100% {
        clip-path: circle(100% at 70% 25%);

    }
}

.today-todo-list {
    display: flex;
    align-items: center;
    position: fixed;
    height: 80%;
    width: 40%;
    top: 50%;
    left: 10%;
    transform: translateY(-50%) skew(5deg);
    background: #f3f5f5;
    color: #4b4b4b;
    overflow-x: hidden;
    overflow-y: auto;
    animation: todo-list-ani 0.8s cubic-bezier(.36, .07, .19, .97);
}

@keyframes todo-list-ani {
    0% {
        left: 80%;
        height: 8%;
        width: 4%;
    }

    /* 25% {
        clip-path: polygon(0% 0%, 99.5% 0.5%, 100% 100%, 0.5% 99.5%);
    }

    50% {
        clip-path: polygon(0% 0%, 100% 0, 100% 100%, 0 100%);
    }

    75% {
        clip-path: polygon(1% 1%, 100% 0%, 99% 99%, 0% 100%);
    } */

    100% {
        left: 10%;
        height: 80%;
        width: 40%;
    }
}

.habit-all {
    width: 100%;

}

.habit-item {
    height: 30%;
    width: 50%;
    border-bottom: 0.5vh solid rgb(44, 44, 44);
    display: flex;
}

.habit-item.over {
    height: 30%;
    width: 50%;
    border-bottom: 0.5vh solid rgb(44, 44, 44);
    display: flex;
    color: rgb(197, 197, 197);
}


.habit-code {
    display: flex;
    align-items: center;
    font-size: 8vh;
}

.habit-time {
    display: flex;
    align-items: center;
    font-size: 8vh;
    margin-left: 10%;
    margin-right: 10%;
}

.habit-name {
    display: flex;
    align-items: center;
    font-size: 5vh;
    white-space: nowrap;
}

$clock-in-ani-time: 0.5s;
$clock-tiks-in-ani-time: 0.5s;

.habit-remind-main {
    user-select: none;
    position: fixed;
    z-index: 1001;
    height: 100%;
    width: 100%;
    background: #2c4c75e8;
    animation: remind-main-in $clock-in-ani-time;
}

@keyframes remind-main-in {
    0% {
        background: #2c4c7500;
    }

    100% {
        background: #2c4c75e8;
    }
}

.clock {
    position: fixed;
    height: min(20vh, 20vw);
    width: min(20vh, 20vw);
    top: 40%;
    transform: translateX(-50%) translateY(-50%) rotate3d(20deg);
    transform-origin: 50% 50%;
    transition: all 0.5s;
}

.clock-backg {
    position: absolute;
    height: 400%;
    width: 400%;
    background: rgb(236, 236, 236);
    transform: translateX(-37.5%) translateY(-37.5%);
    clip-path: circle(0% at 50% 50%);
}

.clock-tik {
    position: absolute;
    width: 350%;
    height: 3%;
    background: rgb(255, 255, 255);
    left: 50%;
    top: 50%;
    transform-origin: 0 50%;
    transform: translateY(-50%) rotate(-90deg);
    box-shadow: calc((-1)*min(10vh, 10vw)) 0px 0px 0px rgb(255, 255, 255);
    animation: appear-tik $clock-tiks-in-ani-time;
}

@keyframes appear-tik {
    0% {
        width: 0%;
    }

    100% {
        width: 350%;
    }
}


.clock-min {
    position: absolute;
    width: 250%;
    height: 8%;
    background: rgb(0, 0, 0);
    left: 50%;
    top: 50%;
    transform-origin: 0 50%;
    transform: translateY(-50%) rotate(-90deg);
    box-shadow: calc((-1)*min(8vh, 8vw)) 0px 0px 0px rgb(0, 0, 0);
    animation: appear-min $clock-tiks-in-ani-time;
}

@keyframes appear-min {
    0% {
        width: 0%;
    }

    100% {
        width: 250%;
    }
}

.clock-hour {
    position: absolute;
    width: 150%;
    height: 15%;
    background: rgb(95, 191, 255);
    left: 50%;
    top: 50%;
    transform-origin: 0 50%;
    transform: translateY(-50%) rotate(-90deg);
    box-shadow: calc((-1)*min(6vh, 6vw)) 0px 0px 0px rgb(95, 191, 255);
    animation: appear-hour $clock-tiks-in-ani-time;
}

@keyframes appear-hour {
    0% {
        width: 0%;
    }


    100% {
        width: 150%;
    }
}

.clock-digit-contain {
    z-index: -2;
    position: fixed;
    top: 35%;
    animation: clock-digit-in-ani $clock-in-ani-time;
    transition: all 0.5s;
}

@keyframes clock-digit-in-ani {
    0% {
        transform: translateX(300%) translateY(-500%) rotate(90deg);
    }

    100% {
        transform: translateX(0%) translateY(0%) rotate(0deg);
    }
}

$clock-digit-persp: perspective(100vh);

/* X: —— Y: | */
.clock-digit {
    background: rgb(121, 228, 187);
    color: #ffffff;
    font-size: 8vh;
    font-weight: bold;
    transform: $clock-digit-persp rotateY(-50deg) rotateZ(5deg);
    animation: clock-digit-backg-ani 3s infinite;
}

@keyframes clock-digit-backg-ani {
    0% {
        clip-path: polygon(0% 0%, 100% 0, 100% 100%, 0 100%);
        transform: $clock-digit-persp rotateY(-50deg) rotateZ(5deg);
    }



    50% {
        clip-path: polygon(2% 1%, 95% 4%, 97% 100%, 2% 100%);
        transform: $clock-digit-persp rotateY(-50deg) rotateZ(6deg);
    }


    100% {
        clip-path: polygon(0% 0%, 100% 0, 100% 100%, 0 100%);
        transform: $clock-digit-persp rotateY(-50deg) rotateZ(5deg);
    }
}

.todo-now-habit-contain {
    z-index: -2;
    position: fixed;
    width: 100vw;
    top: 65%;
    border-bottom: 100vh solid rgb(255, 255, 255);
    color: rgb(255, 255, 255);
    display: flex;
    align-items: center;
    justify-content: center;
    transform: skewY(-10deg);
    animation: todo-now-habit-contain-in-ani 0.5s;
    transition: all 0.5s;
}

@keyframes todo-now-habit-contain-in-ani {
    0% {
        top: 100%;
        transform: skewY(0deg);
    }

    100% {
        top: 65%;
        transform: skewY(-10deg);
    }
}

.todo-now-habit {
    position: relative;
    left: 10%;
    transform: skewX(10deg);
    font-weight: bold;
    font-size: min(12vh, 12vw);
    display: flex;
    flex-wrap: nowrap;
    white-space: normal;
    animation: habit-name-in $clock-in-ani-time;
}

@keyframes habit-name-in {
    0% {
        left: -50%;
    }

    100% {
        left: 10%;
    }
}

.exit-contain {
    z-index: -1;
    position: fixed;
    height: 100%;
    width: 150%;
    top: 70%;
    left: 0%;
    background: rgb(94, 94, 94);
    font-size: min(12vh, 12vw);
    display: flex;
    justify-content: left;
    transform: rotate(20deg);
    animation: exit-contain-in-ani 0.5s;
    transform-origin: 0% 0%;
    transition: all 0.3s;
    box-shadow: -10vw 0px 0px 0px red;
}

@keyframes exit-contain-in-ani {
    0% {
        top: 100%;
    }

    100% {
        top: 70%;
    }
}

.exit-contain:hover {
    z-index: 0;
    background: red;

}

.exit-contain.sure {
    z-index: 0;
    background: red;
    transform: rotate(-10deg);
    font-size: min(12vh, 12vw);
    box-shadow: -10vw 0px 0px 0px red;

}

.exit {
    color: rgb(255, 255, 255);
    position: relative;
    font-weight: bold;
    display: flex;
    left: 5%;
    flex-wrap: nowrap;
    white-space: normal;
}

.exit-yes-no {
    font-size: min(16vh, 16vw);
    color: rgb(0, 0, 0);
    position: relative;
    font-weight: bold;
    display: flex;
    flex-wrap: nowrap;
    white-space: none;
    left: 10%;
    height: 20%;
}

.start-contain {
    z-index: -2;
    position: fixed;
    background: rgb(95, 191, 255);
    height: 70%;
    width: 70%;
    display: flex;
    align-items: end;
    justify-content: left;
    animation: start-contain-in-ani 0.5s;
    transition: all 0.5s;

}

@keyframes start-contain-in-ani {
    0% {
        transform: rotate(0deg);
        top: -70%;
    }

    50% {
        transform: rotate(0deg);
        top: -70%;
    }

    100% {
        transform: rotate(-10deg);
        top: -40%;
    }
}

.start {

    color: rgb(255, 255, 255);
    position: relative;
    font-weight: bold;
    display: flex;
    left: 5%;
    font-size: min(12vh, 12vw);
    flex-wrap: nowrap;
    white-space: normal;
    animation: exit-in $clock-in-ani-time;
}

.bot-part {
    position: absolute;
    display: flex;
    left: 10%;
    top: 20%;
    width: 80%;
}

.bot-face {
    color: white;
    font-size: min(8vh, 8vw);
    position: relative;
}

.bot-remind {
    padding: 0.6vw;
    border-top-right-radius: 1vw;
    border-bottom-right-radius: 1vw;
    border-bottom-left-radius: 1vw;
    background: rgb(255, 255, 255);
    display: inline-block;
    max-width: 80%;
    min-width: 10%;
    font-size: min(5vh, 5vw);
    box-shadow: 0.1vw 0.1vh 0 rgba(0, 0, 0, 0.5);
}

.todolist-button {
    border: none;
    position: fixed;
    top: 20vh;
    right: 0%;
    height: 8vh;
    width: 14vw;
    font-size: 4vh;
    font-weight: bold;
    background: rgb(42, 220, 233);
    color: white;
    z-index: 1;
    animation: closeButtonIn 0.5s cubic-bezier(.36, .07, .19, .97);
    box-shadow: 6px 4px 2px rgba(0, 0, 0, 0.3);

}

.todonow-button {
    border: none;
    position: fixed;
    top: 30vh;
    right: 0%;
    height: 8vh;
    width: 14vw;
    font-size: 4vh;
    font-weight: bold;
    background: rgb(255, 84, 84);
    color: white;
    z-index: 400;
    animation: closeButtonIn 0.5s cubic-bezier(.36, .07, .19, .97);
    box-shadow: 6px 4px 2px rgba(0, 0, 0, 0.3);
}

.todoNowDoneContain {
    z-index: 1002;
    position: fixed;
    height: 100%;
    width: 100%;
    background: rgba(45, 128, 139, 0.699);
    user-select: none;
    animation: appearDoneBackg 0.5s;
}

@keyframes appearDoneBackg {
    0% {
        opacity: 0;
    }

    100% {
        opacity: 1;
    }
}

@keyframes appearLeft {
    0% {
        transform: translateX(-100%);
    }

    100% {
        transform: translateX(0);
    }
}

@keyframes appearRight {
    0% {
        transform: translateX(100%);
    }

    100% {
        transform: translateX(0);
    }
}

.doneContain {
    position: absolute;
    height: 20vh;
    width: 100%;
    top: 20%;
    transform: skewY(-5deg);

}

.done {
    font-size: 10vh;
    font-weight: bold;
    color: #004797;
    display: flex;
    align-items: end;
    justify-content: center;
    height: 100%;
    width: 100%;
    animation: appearLeft 0.5s;
}

.doneOkContain {
    position: absolute;
    height: 20vh;
    width: 100%;
    top: 50%;
    transform: skewY(5deg);
}

.doneCube {
    background: white;
}

.doneOk {
    font-size: 10vh;
    font-weight: bold;
    color: #ffffff;
    display: flex;
    align-items: end;
    justify-content: center;
    height: 100%;
    width: 100%;
    animation: appearRight 0.5s;
}

.okCube {
    background: #004797;
}
</style>