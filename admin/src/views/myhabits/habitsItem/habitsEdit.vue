<template>
    <div class="h-body">
        <button class="save-button" @click="saveHabit()">SAVE</button>
        <button class="add-button" @click="addHabit()">ADD</button>
        <div class="side"></div>
        <div class="habit-container">
            <div class="habit-list">
                <div v-for="(habit_i, index) in habitContents" :key="index">

                    <div class="habit-card"
                        :class="{ deleted: habitContents[index].is_deleted, add_backg: adding_habit }">
                        <div class="habit-name">{{ habit_i.user_habit }}
                        </div>
                        <div class="habit-date">
                            <div class="from">FROM&nbsp;</div>
                            <div class="edit-habit-date"
                                :class="{ selected: cur_edit_index === index && cur_edit_f_or_t === 0 }"
                                @click="editDate(index, 0)">
                                &nbsp;{{ habit_i.habit_begin_date }}&nbsp;
                            </div>
                            <div>&nbsp;TO&nbsp;</div>
                            <div class="edit-habit-date"
                                :class="{ selected: cur_edit_index === index && cur_edit_f_or_t === 1 }"
                                @click="editDate(index, 1)">
                                &nbsp;{{ habit_i.habit_end_date }}&nbsp;
                            </div>
                        </div>
                        <div class="habit-week">
                            <div :class="{ red_day: (habit_i.habit_week & 1) }" @click="editWeek(index, 1)">SUN</div>
                            <div :class="{ red_day: (habit_i.habit_week & 2) }" @click="editWeek(index, 2)">MON</div>
                            <div :class="{ red_day: (habit_i.habit_week & 4) }" @click="editWeek(index, 4)">TUE</div>
                            <div :class="{ red_day: (habit_i.habit_week & 8) }" @click="editWeek(index, 8)">WED</div>
                            <div :class="{ red_day: (habit_i.habit_week & 16) }" @click="editWeek(index, 16)">THU</div>
                            <div :class="{ red_day: (habit_i.habit_week & 32) }" @click="editWeek(index, 32)">FRI</div>
                            <div :class="{ red_day: (habit_i.habit_week & 64) }" @click="editWeek(index, 64)">SAT</div>
                        </div>
                        <div class="habit-when">
                            <div class="habit-start-time" :class="{ selected: cur_edit_time_index === index }"
                                @click="editTime(index)">{{ habit_i.habit_start_time }}</div>
                            <div class="habit-dur-time" :class="{ selected: cur_edit_dur_index === index }"
                                @click="editDur(index)">{{
            habit_i.habit_dur_time }}</div>
                            <div style="font-size: 5vh;">min</div>
                        </div>
                        <div>

                        </div>
                        <div class="habit-delete-contain">
                            <div class="habit-open" @click="openHabitI(index)">OPEN{{ habitContents[index].is_open ?
            '√' : '□' }}</div>
                            <div class="habit-delete" @click="deleteHabitI(index)">{{ habitContents[index].is_deleted ?
            'RESTORE' : 'DELETE' }}</div>
                        </div>

                    </div>


                </div>

            </div>
        </div>
    </div>


    <div class="edit-date-card" v-if="editing_date">
        <div class="edit-date-yyyy">
            <div class="this-year" :class="{ selected: edit_yyyy === today_yyyy }" @click="changeYyyy(false)">{{
            today_yyyy }}</div>
            <div class="next-year" :class="{ selected: edit_yyyy === today_yyyy + 1 }" @click="changeYyyy(true)">{{
            today_yyyy + 1 }}</div>
        </div>
        <div class="edit-date-mm">
            <div class="mm-change" @click="changeMm(false)">
                < </div>
                    <div class="chosen-mm">

                        <div class="mms" :style="mmSelect">
                            <div class="mm-i"></div>
                            <div class="mm-i" :class="{ selected: mm_index === 1 }">Jan</div>
                            <div class="mm-i" :class="{ selected: mm_index === 2 }">Feb</div>
                            <div class="mm-i" :class="{ selected: mm_index === 3 }">Mar</div>
                            <div class="mm-i" :class="{ selected: mm_index === 4 }">Apr</div>
                            <div class="mm-i" :class="{ selected: mm_index === 5 }">May</div>
                            <div class="mm-i" :class="{ selected: mm_index === 6 }">Jun</div>
                            <div class="mm-i" :class="{ selected: mm_index === 7 }">Jul</div>
                            <div class="mm-i" :class="{ selected: mm_index === 8 }">Aug</div>
                            <div class="mm-i" :class="{ selected: mm_index === 9 }">Sep</div>
                            <div class="mm-i" :class="{ selected: mm_index === 10 }">Oct</div>
                            <div class="mm-i" :class="{ selected: mm_index === 11 }">Nov</div>
                            <div class="mm-i" :class="{ selected: mm_index === 12 }">Dec</div>
                            <div class="mm-i"></div>
                        </div>
                        <div class="mm-shadow"></div>
                    </div>
                    <div class="mm-change" @click="changeMm(true)"> > </div>
            </div>
            <div class="edit-date-dd" :style="dd_table">
                <div class="dd-week">Sun</div>
                <div class="dd-week">Mon</div>
                <div class="dd-week">Tue</div>
                <div class="dd-week">Wed</div>
                <div class="dd-week">Thu</div>
                <div class="dd-week">Fri</div>
                <div class="dd-week">Sat</div>
                <div v-for="dd_jndex in (edit_dd_num + edit_dd_first_week < 36 ? 35 : 42)" :key="'dd-j-' + dd_jndex"
                    class="dd-j" @click="chooseDd(dd_jndex -
            edit_dd_first_week)">{{ (dd_jndex -
            edit_dd_first_week > 0) && (dd_jndex -
                edit_dd_first_week <= edit_dd_num) ? (dd_jndex - edit_dd_first_week) : '' }} </div>
                </div>
            </div>
            <div class="edit-time-card" v-if="editing_time">
                <div class="hour-change">
                    <div class="hour-addadd" @click="changeHour(10)"></div>
                    <div class="hour-add" @click="changeHour(1)"></div>
                    <div class="hour-min" @click="changeHour(-1)"></div>
                    <div class="hour-minmin" @click="changeHour(-10)"></div>
                </div>
                <div class="edit-time-back">
                    <div class="edit-time-hour" :style="hourSelect">
                        <div v-for="hour_jndex in 24" class="hour-j"
                            :class="{ selected: hour_index === 24 - hour_jndex }">{{ String(24 - hour_jndex).padStart(2,
            '0') }}
                        </div>
                    </div>
                </div>

                <div class="edit-time-middle">:</div>
                <div class="edit-time-back">
                    <div class="edit-time-minute" :style="minuteSelect">
                        <div v-for="minute_jndex in 60" class="minute-j"
                            :class="{ selected: minute_index === 60 - minute_jndex }">{{ String(60 -
            minute_jndex).padStart(2, '0')
                            }}
                        </div>
                    </div>
                </div>

                <div class="hour-change">
                    <div class="hour-addadd" @click="changeMinute(10)"></div>
                    <div class="hour-add" @click="changeMinute(1)"></div>
                    <div class="hour-min" @click="changeMinute(-1)"></div>
                    <div class="hour-minmin" @click="changeMinute(-10)"></div>
                </div>
                <div class="time-ok" @click="editTimeOK()">&nbsp;OK&nbsp;</div>
            </div>
            <div class="edit-dur-card" v-if="editing_dur">
                <div class="dur-backg"></div>
                <div class="dur-input-container">
                    <input class="dur-input" type="text" maxlength="3" id="input_dur" value="60">
                    <div class="dur-min"> min</div>
                </div>
            </div>
            <div class="edit-dur-ok" v-if="editing_dur" @click="editDurOK()">
                <div class="dur-ok-backg"></div>
                <div class="dur-input-ok">OK
                </div>
            </div>
            <div class="habit-add-card" v-if="adding_habit">
                <div class="name-backg"></div>
                <input class="name-input" placeholder="ENTER A HABIT" id="input_habit_name">
            </div>
            <div class="habit-add-ok" v-if="adding_habit" @click="addHabitOK()">
                <div class="add-ok-backg"></div>
                <div class="add-ok">OK</div>
            </div>
</template>

<script setup>
import axios from 'axios'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { watch, ref, onMounted, computed } from 'vue';
import store from '@/store/index'
const router = useRouter()
const habitContents = ref([])


onMounted(() => {
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
            console.log(res.data);
            for (let i = 0; i < res.data.body.length; i++) {
                habitContents.value.push({
                    user_habit: res.data.body[i].user_habit, habit_id: res.data.body[i].habit_id, habit_week: res.data.body[i].habit_week,
                    habit_begin_date: res.data.body[i].habit_begin_date, habit_end_date: res.data.body[i].habit_end_date, habit_start_time: res.data.body[i].habit_start_time,
                    habit_dur_time: res.data.body[i].habit_dur_time, habit_keep_record: res.data.body[i].habit_keep_record, habit_last_update: res.data.body[i].habit_last_update,
                    is_complete: res.data.body[i].is_complete, is_edited: false, is_deleted: false, is_open: res.data.body[i].is_open
                });
            }
        }
        else {
        }
    })
})


const today = new Date();
const today_yyyy = today.getFullYear()
const today_mm = today.getMonth() + 1
const today_dd = today.getDate()
const today_yyyymmdd = today.getFullYear() + '-' +
    ('0' + (today.getMonth() + 1)).slice(-2) + '-' +
    ('0' + today.getDate()).slice(-2);



let edit_yyyy = ref(today_yyyy)
let edit_mm = ref(0)
let edit_dd_num = ref(0)
let edit_dd_first_week = ref(0)
let edit_dd = ref(0)

let editing_date = ref(false)
let cur_edit_index = ref(-1)
let cur_edit_f_or_t = ref(-1)
let mm_index = ref(0)
let yyyy_edited = false
let mm_edited = false
let dd_edited = false

const editDate = (i, f_or_t) => {
    if (editing_time.value || editing_dur.value) {
        return;
    }
    if (cur_edit_index.value === i && cur_edit_f_or_t.value === f_or_t) {
        cur_edit_index.value = -1;
        cur_edit_f_or_t.value = -1;
        editing_date.value = false;
    }
    else {
        cur_edit_index.value = i;
        cur_edit_f_or_t.value = f_or_t;
        editing_date.value = true;
        mm_index.value = today_mm;
        edit_yyyy.value = today_yyyy;
        edit_mm.value = today_mm;
    }
}

const editWeek = (i, j) => {
    habitContents.value[i].habit_week ^= j;
    habitContents.value[i].is_edited = true;

}
const changeYyyy = (is_next_year) => {
    if (!is_next_year) {
        edit_yyyy.value = today_yyyy;
    }
    else {
        edit_yyyy.value = today_yyyy + 1;
    }
}


const changeMm = (add) => {
    if (add) {
        mm_index.value = (mm_index.value) % 12 + 1;
    }
    else {
        mm_index.value = (mm_index.value + 10) % 12 + 1;
    }
    edit_mm.value = mm_index.value;
}

const chooseDd = (dd_i) => {

    if (dd_i <= 0) {
        changeMm(0);
        return;
    }
    else if (dd_i > edit_dd_num.value) {
        changeMm(1);
        return;
    }
    edit_dd.value = dd_i;
    edit_mm.value = mm_index.value;
    let chosenDate = new Date(edit_yyyy.value + '-' +
        ('0' + (edit_mm.value)).slice(-2) + '-' +
        ('0' + edit_dd.value).slice(-2));
    if (!cur_edit_f_or_t.value) {
        let endDate = new Date(habitContents.value[cur_edit_index.value].habit_end_date);
        if (chosenDate > endDate) {
            habitContents.value[cur_edit_index.value].habit_begin_date = habitContents.value[cur_edit_index.value].habit_end_date;
        }
        else if (chosenDate < today) {
            habitContents.value[cur_edit_index.value].habit_begin_date = today_yyyymmdd;
        }
        else {
            habitContents.value[cur_edit_index.value].habit_begin_date = edit_yyyy.value + '-' +
                ('0' + (edit_mm.value)).slice(-2) + '-' +
                ('0' + edit_dd.value).slice(-2);
        }
    }
    else {
        let startDate = new Date(habitContents.value[cur_edit_index.value].habit_begin_date);
        if (chosenDate < startDate) {
            habitContents.value[cur_edit_index.value].habit_end_date = habitContents.value[cur_edit_index.value].habit_begin_date;
        }
        else if (chosenDate < today) {
            habitContents.value[cur_edit_index.value].habit_end_date = today_yyyymmdd;
        }
        else {
            habitContents.value[cur_edit_index.value].habit_end_date = edit_yyyy.value + '-' +
                ('0' + (edit_mm.value)).slice(-2) + '-' +
                ('0' + edit_dd.value).slice(-2);
        }
    }
    habitContents.value[cur_edit_index.value].is_edited = true;
    cur_edit_index.value = -1;
    cur_edit_f_or_t.value = -1;
    editing_date.value = false;
}

const mmSelect = computed(() => ({
    transform: `translateX(${-(2 * mm_index.value - 1) / 28 * 100}%)`
}));

const dd_table = computed(() => ({
    'grid-template-rows': `repeat(${edit_dd_num.value + edit_dd_first_week.value < 36 ? 6 : 7}, 1fr)`
}));

const getDaysInMonth = (year, month) => {
    return new Date(year, month, 0).getDate();
}

// gwt weekI
const getDayOfWeek = (year, month) => {
    var date = new Date(year, month - 1, 1);
    return date.getDay()
}


watch([edit_yyyy, edit_mm], ([newYear, newMonth]) => {
    // update edit_dd
    edit_dd_num.value = getDaysInMonth(newYear, newMonth); // getDaysInMonth start from 0
    edit_dd_first_week.value = getDayOfWeek(newYear, newMonth);
    // console.log("how many ", edit_dd_num.value, " first", edit_dd_first_week.value);
});



const editing_time = ref(false)
const cur_edit_time_index = ref(-1)
const hour_index = ref(9)
const minute_index = ref(0)

const hourSelect = computed(() => ({
    transform: `translateY(${-(19 - hour_index.value) / 24 * 100}%)`
}));
const minuteSelect = computed(() => ({
    transform: `translateY(${-(55 - minute_index.value) / 60 * 100}%)`
}));

const changeHour = (delta) => {
    hour_index.value = (hour_index.value + delta + 24) % 24;
}
const changeMinute = (delta) => {
    minute_index.value = (minute_index.value + delta + 60) % 60;
}
const editTime = (i) => {
    if (editing_date.value || editing_dur.value) {
        return;
    }
    if (cur_edit_time_index.value === i) {
        cur_edit_time_index.value = -1;
        editing_time.value = false;
    }
    else {
        hour_index.value = 9;
        minute_index.value = 0;
        cur_edit_time_index.value = i;
        editing_time.value = true;
    }
}

const editTimeOK = () => {
    habitContents.value[cur_edit_time_index.value].habit_start_time = `${hour_index.value.toString().padStart(2, '0')}:${minute_index.value.toString().padStart(2, '0')}`;
    hour_index.value = 9;
    minute_index.value = 0;
    habitContents.value[cur_edit_time_index.value].is_edited = true;
    cur_edit_time_index.value = -1;
    editing_time.value = false;
}

const editing_dur = ref(false)
const cur_edit_dur_index = ref(-1)
const dur_index = ref(60)

const editDur = (i) => {
    if (editing_date.value || editing_time.value) {
        return;
    }
    if (cur_edit_dur_index.value === i) {
        cur_edit_dur_index.value = -1;
        editing_dur.value = false;
    }
    else {
        dur_index.value = 60;
        cur_edit_dur_index.value = i;
        editing_dur.value = true;
    }
}

const editDurOK = () => {
    habitContents.value[cur_edit_dur_index.value].habit_dur_time = Number(document.getElementById('input_dur').value);
    habitContents.value[cur_edit_dur_index.value].is_edited = true;
    cur_edit_dur_index.value = -1;
    editing_dur.value = false;
}

const deleteHabitI = (i) => {
    if (editing_date.value || editing_time.value || editing_dur.value) {
        return;
    }
    habitContents.value[i].is_deleted = !habitContents.value[i].is_deleted;
}

const openHabitI = (i) => {
    if (editing_date.value || editing_time.value || editing_dur.value) {
        return;
    }
    habitContents.value[i].is_open = !habitContents.value[i].is_open;
    habitContents.value[i].is_edited = true;
}

const saveHabit = () => {
    if (editing_date.value || editing_time.value || editing_dur.value) {
        return;
    }
    let editedHabits = []
    let editedIds = []
    for (let i = 0; i < habitContents.value.length; i++) {
        if (habitContents.value[i].is_edited || habitContents.value[i].is_deleted) {
            editedIds.push(habitContents.value[i].habit_id)
            editedHabits.push({
                habit_id: habitContents.value[i].habit_id, habit_week: habitContents.value[i].habit_week,
                habit_begin_date: habitContents.value[i].habit_begin_date, habit_end_date: habitContents.value[i].habit_end_date, habit_start_time: habitContents.value[i].habit_start_time,
                habit_dur_time: habitContents.value[i].habit_dur_time,
                is_edited: habitContents.value[i].is_edited, is_deleted: habitContents.value[i].is_deleted, is_open: habitContents.value[i].is_open,
            })
        }
    }
    if (!editedHabits.length) {
        ElMessage.error("Nothing need to be saved.");
        return;
    }
    axios.post("/adminapi/user/savehabit", editedHabits, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem("token")}`
        },
    }).then(res => {
        if (!res.data.code) {
            for (let j = 0; j < editedIds.length; j++) {
                if (habitContents.value[habitContents.value.findIndex(item => item.habit_id === editedIds[j])].is_deleted) {
                    habitContents.value.splice(habitContents.value.findIndex(item => item.habit_id === editedIds[j]), 1);
                    continue;
                }
                habitContents.value[habitContents.value.findIndex(item => item.habit_id === editedIds[j])].is_edited = false;
            }
            ElMessage.success("Saved!")
            store.commit("changeToDo", true);
            store.commit("changeToDoNext", -1);
        }
    })
}


const adding_habit = ref(false)

const addHabit = () => {
    if (editing_date.value || editing_time.value || editing_dur.value) {
        return;
    }
    adding_habit.value = !adding_habit.value;
}

const addHabitOK = () => {
    if (!document.getElementById('input_habit_name').value) {
        adding_habit.value = false;
        return;
    }
    for (let i = 0; i < habitContents.value.length; i++) {
        if (document.getElementById('input_habit_name').value === habitContents.value[i].user_habit) {
            ElMessage.error('Repeat habit!')
            return;
        }
    }
    const addedHabitName = document.getElementById('input_habit_name').value;
    console.log(addedHabitName);
    axios.post("/adminapi/user/addhabit", {
        habitName: addedHabitName
    }, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem("token")}`
        },
    }).then(res => {
        if (res.data.code === -1) {
            ElMessage.error("Something error...");
            adding_habit.value = false;
            return;
        }
        var today = new Date();
        var beginDay = new Date();
        var endDay = new Date();
        beginDay.setDate(today.getDate() + 1);
        endDay.setDate(beginDay.getDate() + 21);
        var todayString = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;
        var beginDayString = `${beginDay.getFullYear()}-${(beginDay.getMonth() + 1).toString().padStart(2, '0')}-${beginDay.getDate().toString().padStart(2, '0')}`;
        var endDayString = `${endDay.getFullYear()}-${(endDay.getMonth() + 1).toString().padStart(2, '0')}-${endDay.getDate().toString().padStart(2, '0')}`;
        habitContents.value.push({
            user_habit: addedHabitName, habit_id: res.data.code, habit_week: 127,
            habit_begin_date: beginDayString, habit_end_date: endDayString, habit_start_time: '09:00',
            habit_dur_time: 60, habit_keep_record: 0, habit_last_update: todayString,
            is_complete: false, is_edited: false, is_deleted: false
        })
        adding_habit.value = false;
    })

}

</script>

<style lang="scss" scoped>
.h-body {
    position: fixed;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: flex-start;
    flex-wrap: nowrap;
    height: 100%;
    width: 100%;
    background: rgb(25, 30, 65);
}


.habit-container {
    display: flex;
    background: #f3f5f5;
    transform: skew(5deg) translateX(5%);
    overflow-y: auto;
    overflow-x: hidden;
    height: 100%;
    width: 100%;
}

.habit-list {

    flex-direction: column;

    white-space: normal;
    z-index: 700;
    transform-origin: 0 0;
    width: 100%;
    height: 100%;
}

.habit-card {
    display: flex;
    flex-direction: column;
    border-top-right-radius: 1vw;
    border-bottom-right-radius: 1vw;
    border: 0.2vh solid rgb(25, 30, 65);
    margin-top: 1vw;
    margin-bottom: 1vw;
    padding: 0px 3% 0px 1%;
    position: relative;
    background: rgb(255, 255, 255);
    color: rgb(50, 54, 90);
    display: inline-block;
    height: 45vh;
    z-index: 700;
    user-select: none;
}

.habit-card.deleted {
    opacity: 30%;
    pointer-events: none;
}

.habit-card.add_backg {
    opacity: 60%;
    pointer-events: none;
}

.habit-card .habit-delete-contain {
    pointer-events: auto;
}

.habit-card.add_backg .habit-delete-contain {
    pointer-events: none;
}

.habit-name {
    font-size: 6vh;
}

.habit-date {
    font-size: 3vh;
    display: flex;
    align-items: center;
    height: 6vh;
}

.from {
    height: 100%;
    display: flex;
    align-items: center;
}

$unedit-date-color: rgb(130, 211, 207);
$toedit-date-color: rgb(255, 128, 44);
$editing-date-color: rgb(187, 52, 52);

.edit-habit-date {
    height: 80%;
    display: flex;
    align-items: center;
    color: rgb(255, 255, 255);
    background: $unedit-date-color;
    white-space: nowrap;
    transform: skew(-5deg);

    box-shadow: 0 0 0 50px $unedit-date-color;
    clip-path: polygon(0 0, 100% 0%, 100% 100%, 0 100%);
    transition: clip-path 1s;
    cursor: pointer;
}

.edit-habit-date.selected {
    background: $editing-date-color;
    color: #ffffff;
    box-shadow: 0 0 0 50px $editing-date-color;
    animation: clip-path-animation 0.5s infinite;
}

@keyframes clip-path-animation {
    0% {
        clip-path: polygon(-3% 0, 102% 0, 100% 106%, 0 100%);
    }

    25% {
        clip-path: polygon(0% 3%, 99% -1%, 100% 103%, 2% 100%);
    }

    50% {
        clip-path: polygon(2% 7%, 100% -5%, 103% 100%, 3% 100%);
    }

    75% {
        clip-path: polygon(0% 5%, 99% -3%, 100% 103%, 2% 100%);
    }

    100% {
        clip-path: polygon(-3% 0, 102% 0, 100% 106%, 0 100%);
    }
}

.edit-habit-date:hover {
    background: $toedit-date-color;
}



.edit-date-card {
    position: fixed;
    top: 50%;
    right: 25%;
    width: 35%;
    height: 80%;
    border: 0.2vh solid rgb(25, 30, 65);
    background: rgb(255, 253, 249);
    box-shadow: 0.3vw 0.3vw 0.5vw rgba(0, 0, 0, 0.4);
    transform: translateY(-50%) translateX(50%) rotate(-5deg);
    z-index: 690;
    user-select: none;
    animation: date-card-in 0.2s cubic-bezier(.36, .07, .19, .97);
}

@keyframes date-card-in {
    0% {
        transform: translateY(100%) translateX(100%) rotate(-45deg);
    }


    100% {
        transform: translateY(-50%) translateX(50%) rotate(-5deg);
    }
}

.edit-date-yyyy {
    display: flex;
    height: 20%;
    border-bottom: 0.2vh solid #000000;
}

.this-year {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    width: 50%;
    background: rgb(255, 255, 255);
    box-shadow: 0 0 0 50px rgb(255, 255, 255);
    clip-path: polygon(0 0, 105% 0%, 95% 100%, 0 100%);
    color: rgb(198, 224, 214);
    font-size: 6vh;
    transition: all 0.3s;
}

.this-year.selected {
    background: $unedit-date-color;
    box-shadow: 0 0 0 50px $unedit-date-color;
    color: white;
    font-size: 8vh;
}

.next-year {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    width: 50%;
    background: rgb(255, 255, 255);
    box-shadow: 0 0 0 50px rgb(255, 255, 255);
    clip-path: polygon(5% 0%, 100% 0%, 100% 100%, -5% 100%);
    color: rgb(198, 224, 214);
    font-size: 6vh;
    transition: all 0.3s;
}

.next-year.selected {
    background: $unedit-date-color;
    box-shadow: 0 0 0 50px $unedit-date-color;
    color: white;
    font-size: 8vh;
}

.edit-date-mm {
    display: flex;
    height: 20%;
    border-bottom: 0.2vh solid #000000;
}

.mm-change {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20%;
    background: rgb(226, 252, 255);
    font-size: 5vh;
    font-weight: bold;
}

.chosen-mm {
    width: 60%;
    overflow: hidden;
    box-shadow: inset 0px 0px 0px 0px rgba(0, 0, 0, 0.5);
}

.mms {
    z-index: 10;
    display: flex;
    background: rgb(255, 255, 255);
    width: 700%;
    height: 100%;
    transition: transform 0.3s ease;
}

.mm-i {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1/14 * 100%;
    color: #164457;
    font-size: min(6vh, 6vw);
    font-weight: bold;
}

.mm-i.selected {
    color: #59bbe6;
}

.mm-shadow {
    z-index: 100;
    width: 100%;
    height: 100%;
    box-shadow: inset 0px 0px 10px 3px rgba(0, 0, 0, 0.5);
    transform: translateY(-100%);
}

.edit-date-dd {
    width: 100%;
    height: 60%;
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    grid-template-rows: repeat(7, 1fr);
}

.dd-week {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    max-height: 100%;
    background: #164457;
    color: white;
    border: 1px solid #616161;
    font-size: min(2.5vh, 2.5vw);
    line-height: 1;
}

.dd-j {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    max-height: 100%;
    background-color: #ffffff;
    border: 1px solid #616161;
    font-size: min(2.5vh, 2.5vw);
    line-height: 1;
}

.dd-j:hover {
    background: $unedit-date-color;
    color: white;
}

.habit-week {
    display: flex;
    align-items: flex-start;
    flex-wrap: wrap;
    position: relative;
    width: 100%;
    height: 15%;
    margin-top: 4%;
    color: rgb(55, 56, 66);
    font-size: 3vh;
    flex-wrap: nowrap;
    align-items: center;
}

.habit-week>div {
    margin-right: 2%;
    height: 50%;
    align-items: center;
    display: flex;

    position: relative;
    color: rgb(55, 56, 66);
    white-space: pre-wrap;
}


.habit-week>div.red_day {
    transform: skew(-5deg);
    background: $unedit-date-color;
    color: #ffffff;
}

.habit-when {
    display: flex;
    height: 20%;
}

.habit-start-time {
    color: $unedit-date-color;
    margin-right: 10%;
    font-size: 6vh;
    font-weight: bold;
}

.habit-start-time.selected {
    color: $editing-date-color;
}

.habit-dur-time {
    color: $unedit-date-color;
    font-size: 5vh;
}

.habit-dur-time.selected {
    color: $editing-date-color;
}

.habit-delete-contain {
    display: flex;
    flex-direction: row;
    width: 100%;
    height: 15%;
}

.habit-delete {
    color: rgb(201, 129, 129);
    width: 50%;
    height: 100%;
    display: flex;
    font-size: 5vh;

    justify-content: center;
    align-items: center;
    animation: all 1s;
}

.habit-delete:hover {
    background: red;
    color: white;
}

.habit-open {
    color: $unedit-date-color;
    width: 50%;
    height: 100%;
    display: flex;
    font-size: 5vh;
    justify-content: center;
    align-items: center;
    animation: all 1s;
}

.habit-open:hover {
    background: $unedit-date-color;
    color: white;
}


.edit-time-card {
    position: fixed;
    display: flex;
    overflow: hidden;
    background: rgba(0, 0, 0, 0);
    right: 5%;
    width: 36%;
    height: 100%;
    user-select: none;
    transform: skew(-3deg);
    animation: time-card-in 0.3s cubic-bezier(.36, .07, .19, .97);
}

@keyframes time-card-in {
    0% {
        transform: skew(-60deg);
        width: 0%;
    }


    100% {
        width: 36%;
        transform: skew(-3deg);
    }
}

$time_edit_button_color: $editing-date-color;
$time_back_color: rgb(255, 255, 255);

.edit-time-hour {
    display: flex;
    flex-direction: column;
    align-items: center;
    background: $time_back_color;
    color: #444444;
    width: 100%;
    height: 267%;
    font-size: 5vw;
    transition: transform 0.3s ease;
}

.edit-time-back {
    background: $time_back_color;
    width: 30%;
    height: 100%;
}

.edit-time-middle {
    display: flex;

    justify-content: center;
    align-items: center;
    color: $time_edit_button_color;
    clip-path: polygon(-100% 0%, 100% 0%, 100% 100%, 0% 100%);
    height: 1/9*100%;
    width: 5%;
    transform: translateY(400%);
    font-size: 5vw;
}

.edit-time-minute {
    display: flex;
    flex-direction: column;
    align-items: center;
    background: $time_back_color;
    color: #444444;
    width: 100%;
    height: 667%;
    font-size: 5vw;
    transition: transform 0.3s ease;
}

.hour-change {
    height: 40%;
    width: 8%;
    transform: translateY(75%);
    display: flex;
    flex-direction: column;
}

.hour-add {
    height: 50%;
    width: 100%;
    background: $time_edit_button_color;
    clip-path: polygon(50% 30%, 50% 30%, 100% 80%, 0% 80%);
}

.hour-min {
    height: 50%;
    width: 100%;
    background: $time_edit_button_color;
    clip-path: polygon(0% 20%, 100% 20%, 50% 70%, 50% 70%);
}

.hour-addadd {
    height: 50%;
    width: 100%;
    background: $time_edit_button_color;
    clip-path: polygon(50% 0%, 50% 0%, 100% 100%, 0% 100%);
}

.hour-minmin {
    height: 50%;
    width: 100%;
    background: $time_edit_button_color;
    clip-path: polygon(0% 0%, 100% 0%, 50% 100%, 50% 100%);
}

.hour-j.selected {
    color: $time_edit_button_color;
}

.minute-j.selected {
    color: $time_edit_button_color;
}

.time-ok {
    display: flex;

    justify-content: center;
    align-items: center;
    height: 1/9*100%;
    width: 19%;
    font-size: 3vw;
    color: #444444;
    font-weight: bold;
    transform: translateY(400%);
    transition: all 0.1s;
}

.time-ok:hover {
    background: $time_edit_button_color;
    color: white;
}

.edit-dur-card {
    position: fixed;
    display: flex;

    align-items: center;

    overflow: hidden;
    top: 40%;
    right: 5%;
    width: 50%;
    height: 30%;
    user-select: none;
    transform: skew(-2deg) translateY(-50%);
    animation: dur-card-in 0.2s cubic-bezier(.36, .07, .19, .97);
}

@keyframes dur-card-in {
    0% {
        transform: rotate(0deg) skew(-2deg) translateY(-50%);
        width: 20%;
        height: 0%;
    }


    100% {
        transform: rotate(0deg) skew(-2deg) translateY(-50%);
        width: 50%;
        height: 30%;
    }
}

.dur-backg {
    z-index: -1;
    position: absolute;
    height: 100%;
    width: 100%;
    clip-path: polygon(0% 50%, 100% 0%, 90% 100%, 0% 50%);
    background: red;
    animation: dur-backg-animation 0.5s infinite;
}

@keyframes dur-backg-animation {
    0% {
        clip-path: polygon(0% 50%, 100% 0%, 90% 100%, 0% 50%);
    }

    25% {
        clip-path: polygon(0% 48%, 99% 1%, 90% 99%, 0% 48%);
    }

    50% {
        clip-path: polygon(2% 46%, 100% 2%, 90% 100%, 2% 46%);
    }

    75% {
        clip-path: polygon(0% 48%, 99% 1%, 90% 99%, 0% 48%);
    }

    100% {
        clip-path: polygon(0% 50%, 100% 0%, 90% 100%, 0% 50%);
    }
}

.dur-input-container {
    display: flex;
    position: absolute;
    right: 0%;
    width: 90%;
    height: 70%;
    align-items: center;
    justify-content: right;
}

.dur-input {
    width: 50%;
    height: 80%;
    background: transparent;

    border: none;
    border-bottom: 1vh solid #000000;
    outline: none;
    color: rgb(0, 0, 0);

    font-size: 20vh;
    text-align: right;
    right: 0%;

}

.dur-min {
    height: 100%;
    font-size: 10vh;
    display: flex;
    align-items: center;
    color: rgb(0, 0, 0);
}

.edit-dur-ok {
    position: fixed;
    display: flex;
    align-items: center;

    overflow: hidden;
    top: 65%;
    right: 10%;
    width: 20%;
    height: 20%;
    user-select: none;
    transform: rotate(5deg) skew(-2deg) translateY(-50%);
    color: white;
    font-size: 10vh;
    animation: dur-ok-in 0.2s cubic-bezier(.36, .07, .19, .97);
}

@keyframes dur-ok-in {
    0% {
        transform: rotate(5deg) skew(-2deg) translateY(-50%);
        width: 20%;
        height: 0%;
    }


    100% {
        transform: rotate(5deg) skew(-2deg) translateY(-50%);
        width: 20%;
        height: 20%;
    }
}

.dur-ok-backg {
    z-index: -1;
    position: absolute;
    height: 100%;
    width: 100%;
    clip-path: polygon(0% 20%, 100% 40%, 100% 40%, 0% 100%);
    background: rgb(0, 0, 0);
    animation: dur-ok-backg-animation 0.4s infinite;
}

@keyframes dur-ok-backg-animation {
    0% {
        clip-path: polygon(0% 20%, 100% 40%, 100% 40%, 0% 100%);
    }

    25% {
        clip-path: polygon(1% 20%, 100% 42%, 100% 42%, 0% 100%);
    }

    50% {
        clip-path: polygon(2% 20%, 100% 43%, 100% 43%, 0% 100%);
    }

    75% {
        clip-path: polygon(1% 20%, 100% 42%, 100% 42%, 0% 100%);
    }

    100% {
        clip-path: polygon(0% 20%, 100% 40%, 100% 40%, 0% 100%);
    }
}

.save-button {
    border: none;
    position: fixed;
    bottom: 5vh;
    right: 0%;
    height: 8vh;
    width: 12vw;
    font-size: 4vh;
    font-weight: bold;
    background: rgb(71, 247, 144);
    color: white;
    z-index: 400;
    animation: closeButtonIn 0.5s cubic-bezier(.36, .07, .19, .97);
    box-shadow: 6px 4px 2px rgba(0, 0, 0, 0.3);
}

.add-button {
    border: none;
    position: fixed;
    bottom: 15vh;
    right: 0%;
    height: 8vh;
    width: 12vw;
    font-size: 4vh;
    font-weight: bold;
    background: rgb(39, 240, 247);
    color: white;
    z-index: 400;
    animation: closeButtonIn 0.5s cubic-bezier(.36, .07, .19, .97);
    box-shadow: 6px 4px 2px rgba(0, 0, 0, 0.3);
}

.habit-add-card {
    position: fixed;
    display: flex;

    align-items: center;
    justify-content: center;
    z-index: 30;

    top: 40%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
    height: 30%;
    width: 80%;
    animation: name-in 0.2s;
}

@keyframes name-in {
    0% {
        height: 0%;
        width: 80%;
    }

    50% {
        height: 35%;
        width: 85%;
    }

    100% {
        height: 30%;
        width: 80%;
    }
}

.name-backg {
    z-index: -1;
    position: absolute;
    height: 100%;
    width: 100%;
    clip-path: polygon(0% 20%, 100% 40%, 100% 40%, 0% 100%);
    background: rgb(42, 165, 165);
    animation: name-backg-animation 0.8s infinite;
}

@keyframes name-backg-animation {
    0% {
        clip-path: polygon(1% 3%, 99% 7%, 98% 96%, 0% 95%);
    }

    50% {
        clip-path: polygon(3% 5%, 97% 5%, 96% 94%, 2% 95%);
    }

    100% {
        clip-path: polygon(1% 3%, 99% 7%, 98% 96%, 0% 95%);
    }
}

.name-input {
    width: 90%;
    height: 80%;
    background: transparent;

    border: none;
    border-bottom: 1vh solid #ffffff;
    outline: none;
    color: rgb(255, 255, 255);

    font-size: 10vh;
    text-align: center;
    right: 0%;

}

.name-input::placeholder {
    color: #ffffff9d;
}

.habit-add-ok {
    position: fixed;
    display: flex;

    align-items: center;
    justify-content: center;
    z-index: 30;
    top: 65%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
    height: 25%;
    width: 20%;
    animation: add-ok-in 0.2s;
}

@keyframes add-ok-in {
    0% {
        height: 0%;
        width: 20%;
    }

    50% {
        height: 27%;
        width: 22%;
    }

    100% {
        height: 25%;
        width: 20%;
    }
}

.add-ok-backg {
    z-index: -1;
    position: absolute;
    height: 100%;
    width: 100%;
    clip-path: polygon(0% 15%, 100% 15%, 100% 85%, 0% 85%);
    background: rgb(87, 216, 195);
    animation: name-backg-animation 1s infinite;
}

@keyframes name-backg-animation {
    0% {
        clip-path: polygon(0% 15%, 100% 15%, 100% 85%, 0% 85%);
    }

    50% {
        clip-path: polygon(2% 13%, 100% 17%, 98% 85%, 2% 83%);
    }

    100% {
        clip-path: polygon(0% 15%, 100% 15%, 100% 85%, 0% 85%);
    }
}

.add-ok {
    user-select: none;
    font-size: 10vh;
    color: white;
}
</style>