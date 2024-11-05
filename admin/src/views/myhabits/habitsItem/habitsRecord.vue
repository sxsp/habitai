<template>
    <div class="side"></div>
    <div class="middle"></div>
    <div class="habit-list">
        <div v-for="(habit_i, index) in habitContents" :key="index">
            <div class="habit-card" :class="{ selected: habit_index === index }" @click="selectHabitI(index)">
                <div class="habit-name">{{ habit_i.user_habit }}

                </div>

            </div>
        </div>

    </div>
    <div class="describe-card" :class="{ hide: now_page_0 }" @click="changePage(false)">
        <div class="des-main" v-if="habitContents && habitContents.length > 0 && habit_index != -1">
            <div class="des-habit"> {{
            habitContents[habit_index].user_habit.toUpperCase() }}
            </div>
            <div class="des-date"> {{
            habitContents[habit_index].habit_begin_date }} -- {{
            habitContents[habit_index].habit_end_date }}</div>
            <div class="des-day">
                <div :class="{ red_day: (habitContents[habit_index].habit_week & 1) }">SUN</div>
                <div :class="{ red_day: (habitContents[habit_index].habit_week & 0b10) }">MON</div>
                <div :class="{ red_day: (habitContents[habit_index].habit_week & 0b100) }">TUE</div>
                <div :class="{ red_day: (habitContents[habit_index].habit_week & 0b1000) }">WED</div>
                <div :class="{ red_day: (habitContents[habit_index].habit_week & 0b10000) }">THU</div>
                <div :class="{ red_day: (habitContents[habit_index].habit_week & 0b100000) }">FRI</div>
                <div :class="{ red_day: (habitContents[habit_index].habit_week & 0b1000000) }">SAT</div>
            </div>
            <div class="des-time">
                <div class="des-when">{{ habitContents[habit_index].habit_start_time.substring(0, 5) }}</div>
                <div class="des-long">{{ habitContents[habit_index].habit_dur_time }}min</div>
            </div>
            <div class="des-keep">KEPT IT UP FOR {{ habitContents[habit_index].habit_keep_record }} DAYS</div>
        </div>

    </div>
    <div class="describe-card" :class="{ hide: !now_page_0 }" @click="changePage(true)">
        <div class="day-item"
            :class="{ done: displayDayCode(day_index) === 1, not_done: displayDayCode(day_index) === 2 }"
            v-for="day_index in day_item_num">&nbsp;{{
            displayDayCode(day_index) === 0 ? ' ' : (displayDayCode(day_index) === 1 ? '√' : '×') }}&nbsp;{{
            displayDayI(day_index) }}&nbsp;{{
            getWeekI(day_index) }}
        </div>

    </div>
</template>

<script setup>
import axios from 'axios'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { reactive, ref, onMounted, onBeforeUnmount } from 'vue';

const router = useRouter()
const habitContents = ref([])
const habit_index = ref(-1)

const today = new Date();
const today_ymd = today.getFullYear() + '-' +
    ('0' + (today.getMonth() + 1)).slice(-2) + '-' +
    ('0' + today.getDate()).slice(-2);

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
                let endDate = new Date(res.data.body[i].habit_end_date)
                if (endDate.getTime() < today.getTime()) {
                    habitContents.value.push({
                        user_habit: res.data.body[i].user_habit, habit_id: res.data.body[i].habit_id, habit_week: res.data.body[i].habit_week,
                        habit_begin_date: res.data.body[i].habit_begin_date, habit_end_date: res.data.body[i].habit_end_date, habit_start_time: res.data.body[i].habit_start_time,
                        habit_dur_time: res.data.body[i].habit_dur_time, habit_keep_record: res.data.body[i].habit_keep_record, habit_last_update: res.data.body[i].habit_last_update,
                        is_complete: res.data.body[i].is_complete
                    });
                }

            }
        }
        else {
        }
    })
})

const selectHabitI = (i) => {
    if (habit_index.value === i) {
        habit_index.value = -1;
    }
    else {
        habit_index.value = i;
        displayIRecord(i);
    }

}

const getWeekI = (i) => {
    const curDay = new Date(displayDayI(i));
    switch (curDay.getDay()) {
        case 0: return 'SUN';
        case 1: return 'MON';
        case 2: return 'TUE';
        case 3: return 'WEN';
        case 4: return 'THU';
        case 5: return 'FRI';
        case 6: return 'SAT';
    }
}

const displayDayI = (i) => {
    if (habit_index.value === -1) {
        return ''
    }
    const displayStartDay = displayIsEnd.value ? habitContents.value[habit_index.value].habit_end_date : today_ymd;
    return getDateBefore(displayStartDay, i - 1);
}

const displayDayCode = (i) => {
    if (habit_index.value === -1) {
        return 0;
    }
    const curDay = new Date(displayDayI(i));
    const lastUpdate = new Date(habitContents.value[habit_index.value].habit_last_update);
    // if (curDay.getTime() > lastUpdate.getTime()) {
    //     return 0;
    // }
    const deltaDateNum = Math.floor((lastUpdate.getTime() - curDay.getTime()) / (24 * 60 * 60 * 1000));
    if ((habitContents.value[habit_index.value].habit_keep_record >> deltaDateNum) & 0b1) {
        return 1;
    }
    else {
        if ((habitContents.value[habit_index.value].habit_week >> curDay.getDay()) & 0b1) {
            return 2;
        }
        return 0;
    }
}

const getDateBefore = (date, days) => {
    const dateObj = new Date(date);
    dateObj.setDate(dateObj.getDate() - days);

    const year = dateObj.getFullYear();
    const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
    const day = dateObj.getDate().toString().padStart(2, '0');

    return `${year}-${month}-${day}`;
}



const day_item_num = ref(0)
const displayIsEnd = ref(false)

const displayIRecord = (i) => {
    let recordToday = new Date(today_ymd);
    let recordStartDay = new Date(habitContents.value[i].habit_begin_date);
    let recordEndDay = new Date(habitContents.value[i].habit_end_date);
    if (recordStartDay.getTime() > recordToday.getTime()) {
        day_item_num.value = 0;
        displayIsEnd.value = false;
    }
    else if (recordEndDay.getTime() < recordToday.getTime()) {
        day_item_num.value = Math.floor((recordEndDay.getTime() - recordStartDay.getTime()) / (24 * 60 * 60 * 1000)) + 1;
        displayIsEnd.value = true;
    }
    else {
        day_item_num.value = Math.floor((recordToday.getTime() - recordStartDay.getTime()) / (24 * 60 * 60 * 1000)) + 1;
        displayIsEnd.value = false;
    }
    day_item_num.value = day_item_num.value > 30 ? 30 : day_item_num.value;
}

const now_page_0 = ref(true)

const changePage = (page) => {
    now_page_0.value = page
}

</script>

<style lang="scss" scoped>
.side {
    position: fixed;
    width: 2%;
    height: 100%;
    background: rgb(25, 30, 65);
    z-index: 701;
    transform: translateX(50%);
}

.habit-list {
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    overflow-x: hidden;
    white-space: normal;
    z-index: 700;
    transform-origin: 0 0;
}

.habit-card {
    display: flex;
    border-top-right-radius: 1vw;
    border-bottom-right-radius: 1vw;
    border: 0.2vh solid rgb(25, 30, 65);
    margin-top: 1vw;
    margin-bottom: 1vw;
    left: -2px;
    padding: 0px 3% 0px 4%;
    position: relative;
    background: rgb(255, 255, 255);
    color: rgb(50, 54, 90);
    display: inline-block;
    max-width: 50%;
    z-index: 700;
    user-select: none;
    cursor: pointer;

    transition: background-color 0.3s, color 0.3s, padding 0.3s;


    &:hover {
        background: rgb(25, 30, 65);
        color: #ffffff;
        padding: 0px 5% 0px 5%;
        transition: all 0.3s;

        &::before {
            left: 0;
            right: 0;
            opacity: 1;
        }
    }
}

.habit-card.selected {
    background: rgb(25, 30, 65);
    color: #ffffff;
    padding: 0px 5% 0px 5%;
    border-top-right-radius: 0vw;
    border-bottom-right-radius: 0vw;
    box-shadow: 0.3vw 0.3vw 0.5vw rgba(0, 0, 0, 0.4);
}

.habit-name {
    font-size: 5vh;
}



.middle {
    position: fixed;
    left: 30%;
    width: 1%;
    height: 100%;
    background: rgb(231, 231, 231);
    transform: translateX(-50%);
    z-index: 0;

}

.describe-card {
    user-select: none;
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
    overflow-y: auto;
    transition: all 0.5s;
}

.describe-card.hide {
    top: 60%;
    right: 35%;
    z-index: 689;
    transform: translateY(-50%) translateX(50%) rotate(-8deg);
}

.des-main {
    margin-left: 3%;
    height: 100%;
    user-select: none;
}

.des-habit {
    display: flex;
    align-items: center;
    position: relative;
    width: 100%;
    height: 20%;
    font-size: 3vw;
    font-weight: bold;
    color: rgb(55, 56, 66);
}

.des-date {
    display: flex;
    align-items: center;
    position: relative;
    width: 100%;
    height: 8%;
    font-size: 1.5vw;
    color: rgb(55, 56, 66);
}

.des-day {
    display: flex;
    align-items: center;
    flex-wrap: wrap;

    position: relative;
    width: 100%;
    height: 16%;
    color: rgb(55, 56, 66);
    white-space: pre-wrap;
    font-size: max(1.5vw, 12px);
}

.des-day>div {
    margin-right: 2%;
    height: 50%;
    align-items: center;
    display: flex;

    position: relative;
    color: rgb(55, 56, 66);
    white-space: pre-wrap;
    font-size: max(1.5vw, 12px);
}

.des-day>div.red_day {
    background: red;
    color: #ffffff;
    font-weight: bold;
    transform: skew(-5deg);
}

.des-time {
    display: flex;
}

.des-when {
    font-size: max(5vw, 24px);
    margin-right: 8%;
}

.des-long {
    font-size: max(3vw, 16px);
}

.des-keep {
    align-items: center;
    display: flex;
    height: 20%;
    position: relative;
    color: rgb(55, 56, 66);
    white-space: pre-wrap;
    font-size: max(2vw, 12px);
}

.day-item {
    background: rgb(252, 255, 255);
    border-radius: 10px;
    margin-top: 10px;
    margin-left: 10px;
    font-size: min(4vh, 4vw);
}

.day-item.done {
    background: rgb(198, 254, 255);
}

.day-item.not_done {
    background: rgb(255, 230, 230);
}
</style>