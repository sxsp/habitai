<template>
    <div class="rankContain" v-if="show_ranking">
        <div class="command-inter">
            <div class="info-item" :class="{ command: 1 }">HIAI TERMINAL> ranking</div>
            <div class="info-item" v-for="rank_index in ranking_num"
                :class="{ rank1: rank_index === 1, rank2: rank_index === 2, rank3: rank_index === 3 }">rank{{ rank_index
                }}:&nbsp;{{
        ranking[rank_index - 1].user_name }}&nbsp;<div style="color: rgb(231, 235, 0);">★{{ ranking[rank_index -
        1].score }}</div>
                <div v-if="ranking[rank_index - 1].user_name === myName" style="color: lightcoral;">&nbsp;<- ME </div>
                </div>
                <div class="info-item" v-if="!IamInTop20">...
                </div>
                <div v-for="rank_index in 10" class="info-item" v-if="!IamInTop20">rank{{ myRank }}:&nbsp;{{ myName
                    }}&nbsp;<div style="color: rgb(231, 235, 0);">★{{ myScore }}</div>
                    <div style="color: lightcoral;">&nbsp;<- ME </div>
                    </div>
                </div>

            </div>
            <div class="hihubContain">
                <div class="command-inter">
                    <div class="info-item" :class="{ command: 1 }">HIAI TERMINAL> random habit</div>
                    <div class="info-item">USER:&nbsp;&nbsp;{{ other_habit.user_name }}</div>
                    <div class="info-item">HABIT:&nbsp;&nbsp;{{ other_habit.user_habit }}</div>
                    <div class="info-item" :class="{ have_star: isGivenStar }">STAR:&nbsp;&nbsp;{{ other_habit.star_num
                        }}
                    </div>
                </div>
            </div>
            <div class="recordContain">
                <div class="command-inter">
                    <div class="info-item" :class="{ command: 1 }">HIAI TERMINAL> record</div>
                    <div class="day-item"
                        :class="{ done: displayDayCode(day_index) === 1, not_done: displayDayCode(day_index) === 2 }"
                        v-for="day_index in day_item_num">{{
        displayDayI(day_index) }}&nbsp;{{
        displayDayCode(day_index) === 0 ? ' ' : (displayDayCode(day_index) === 1 ? '√' : '×') }}
                    </div>
                </div>
            </div>
            <div class="star-button" @click="giveStar()">&nbsp;&nbsp;STAR&nbsp;&nbsp;</div>
            <div class="next-button" @click="getOthersHabit()">&nbsp;&nbsp;NEXT&nbsp;&nbsp;</div>
            <div class="ranking-button" @click="getRanking()">&nbsp;&nbsp;RANKING&nbsp;&nbsp;</div>

</template>

<script setup>
import { reactive, ref, onMounted, onBeforeUnmount, computed } from 'vue';
import axios from 'axios';
import { ElMessage } from 'element-plus';
import MarkdownIt from 'markdown-it';
import store from '@/store/index'

const other_habit = ref({ user_name: 'NULL', habit_id: 0, user_habit: 'NULL', habit_keep_record: 0, habit_last_update: '', habit_week: 0, star_num: 0, habit_begin_date: '', habit_end_date: '' })

onMounted(() => {
    getOthersHabit()
})

const getOthersHabit = () => {
    isGivenStar.value = false
    // get my username
    axios.get("/adminapi/user/getothers", {
        // jwt token
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
        } else if (res.data.code === 1) {
            other_habit.value = {
                habit_id: res.data.body[0].habit_id, user_habit: res.data.body[0].user_habit, user_name: res.data.body[0].user_name,
                habit_keep_record: res.data.body[0].habit_keep_record, habit_last_update: res.data.body[0].habit_last_update,
                habit_week: res.data.body[0].habit_week,
                star_num: res.data.body[0].star_num, habit_begin_date: res.data.body[0].habit_begin_date, habit_end_date: res.data.body[0].habit_end_date
            };
            displayIRecord()
        }
        else {
        }
    })
}

const today = new Date();
const today_ymd = today.getFullYear() + '-' +
    ('0' + (today.getMonth() + 1)).slice(-2) + '-' +
    ('0' + today.getDate()).slice(-2);

const displayDayI = (i) => {
    const displayStartDay = displayIsEnd.value ? other_habit.value.habit_end_date : today_ymd;
    return getDateBefore(displayStartDay, i - 1);
}

const displayDayCode = (i) => {
    const curDay = new Date(displayDayI(i));
    const lastUpdate = new Date(other_habit.value.habit_last_update);

    const deltaDateNum = Math.floor((lastUpdate.getTime() - curDay.getTime()) / (24 * 60 * 60 * 1000));
    if ((other_habit.value.habit_keep_record >> deltaDateNum) & 0b1) {
        return 1;
    }
    else {
        if ((other_habit.value.habit_week >> curDay.getDay()) & 0b1) {
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

const displayIsEnd = ref(false)
const day_item_num = ref(0)

const displayIRecord = () => {
    let recordToday = new Date(today_ymd);
    let recordStartDay = new Date(other_habit.value.habit_begin_date);
    let recordEndDay = new Date(other_habit.value.habit_end_date);
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
    day_item_num.value = day_item_num.value > 7 ? 7 : day_item_num.value;
}

const isGivenStar = ref(false)
const giveStar = () => {
    if (isGivenStar.value || !other_habit.value.habit_id || other_habit.value.star_num >= 256) {
        return;
    }
    isGivenStar.value = true;

    other_habit.value.star_num++;
    axios.post("/adminapi/user/givestar", {
        habit_id: other_habit.value.habit_id,
        star_num: other_habit.value.star_num
    }, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem("token")}`
        },
    }).then(res => {
        if (res.data.code === 0) {
        } else {
            ElMessage.error("Something error...");
        }
    }).catch(error => {
        console.error("Error give star: ", error);
        ElMessage.error("Something error...");
        loading.value = false;
    })
}

const show_ranking = ref(false)

const gotRankInfo = ref(false)
const ranking_num = ref([0])
const ranking = ref([])
const myScore = ref(0)
const myRank = ref(0)
const myName = ref('')
const IamInTop20 = ref(false)

const getRanking = () => {
    if (gotRankInfo.value) {
        show_ranking.value = !show_ranking.value;
        return;
    }
    axios.get("/adminapi/user/getranking", {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem("token")}`
        }
    }).then(res => {
        gotRankInfo.value = true;
        ranking_num.value = res.data.code;
        myName.value = res.data.myName;
        myScore.value = res.data.myScore.score;
        myRank.value = res.data.myRank.myRank;
        for (let i = 0; i < ranking_num.value; i++) {
            if (res.data.body[i].user_name === myName.value) {
                IamInTop20.value = true;
            }
            ranking.value.push({ user_name: res.data.body[i].user_name, score: res.data.body[i].score })
        }
        show_ranking.value = !show_ranking.value;
    })
}

</script>

<style lang="scss" scoped>
$shell-border-color: rgb(0, 115, 182);

.rankContain {
    z-index: 1;
    position: fixed;
    top: 50%;
    left: 40%;
    height: 70%;
    width: 40%;
    transform: translateX(-50%) translateY(-50%);
    background: #2f3341;
    border-top: 4vh solid $shell-border-color;
    border-bottom: 0.2vh solid $shell-border-color;
    border-left: 0.2vh solid $shell-border-color;
    border-right: 0.2vh solid $shell-border-color;
    box-shadow: 10px 10px 0px 0px rgb(56, 56, 56);
    overflow: hidden;
    animation: rank-terminal-in 0.5s;
}

@keyframes rank-terminal-in {
    0% {
        height: 10%;
        width: 10%;
    }

    100% {
        top: 50%;
        left: 40%;
        height: 70%;
        width: 40%;
    }
}

.hihubContain {
    position: fixed;
    top: 40%;
    left: 35%;
    height: 40%;
    width: 40%;
    transform: translateX(-50%) translateY(-50%);
    background: #2f3341;
    border-top: 4vh solid $shell-border-color;
    border-bottom: 0.2vh solid $shell-border-color;
    border-left: 0.2vh solid $shell-border-color;
    border-right: 0.2vh solid $shell-border-color;
    box-shadow: 10px 10px 0px 0px rgb(56, 56, 56);
    overflow: hidden;
    animation: hihub-terminal-in 0.5s;
}

@keyframes hihub-terminal-in {
    0% {
        top: 100%;
        left: 50%;
        height: 10%;
        width: 10%;
    }

    100% {
        top: 40%;
        left: 35%;
        height: 40%;
        width: 40%;
    }
}

.recordContain {
    position: fixed;
    top: 60%;
    left: 65%;
    height: 40%;
    width: 30%;
    transform: translateX(-50%) translateY(-50%);
    background: #2f3341;
    border-top: 4vh solid $shell-border-color;
    border-bottom: 0.2vh solid $shell-border-color;
    border-left: 0.2vh solid $shell-border-color;
    border-right: 0.2vh solid $shell-border-color;
    box-shadow: 10px 10px 0px 0px rgb(56, 56, 56);
    overflow: hidden;
    animation: record-terminal-in 0.5s;
}

@keyframes record-terminal-in {
    0% {
        top: 100%;
        left: 50%;
        height: 10%;
        width: 10%;
    }

    100% {
        top: 60%;
        left: 65%;
        height: 40%;
        width: 30%;
    }
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
    transition: all 0.2s;
    display: flex;
}

.info-item.have_star {
    color: #e5ff00;
}

.info-item.command {
    color: white;
    font-size: min(3vh, 3vw);
    margin-top: 1%;
}

.info-item.rank1 {
    color: rgb(215, 0, 223);
}

.info-item.rank2 {
    color: rgb(0, 84, 229);
}

.info-item.rank3 {
    color: rgb(0, 198, 216);
}

.day-item {
    color: rgb(194, 255, 232);
    font-size: min(4vh, 4vw);
    width: 48%;
    margin-left: 1%;
}

.day-item.done {
    color: rgb(0, 255, 157);
}

.day-item.not_done {
    color: rgb(255, 106, 106);
}

.next-button {
    user-select: none;
    position: fixed;
    top: 75%;
    left: 40%;
    transform: translateX(-50%) translateY(-50%);
    height: 10%;
    background: #2f3341;
    color: rgb(255, 255, 255);
    border-top: 0.2vh solid $shell-border-color;
    border-bottom: 0.2vh solid $shell-border-color;
    border-left: 0.2vh solid $shell-border-color;
    border-right: 0.2vh solid $shell-border-color;
    box-shadow: 10px 10px 0px 0px rgb(56, 56, 56);
    font-size: min(5vh, 5vw);
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    animation: button-in 0.5s;
}

.star-button {
    user-select: none;
    position: fixed;
    top: 75%;
    left: 25%;
    transform: translateX(-50%) translateY(-50%);
    height: 10%;
    background: #2f3341;
    color: rgb(229, 255, 0);
    border-top: 0.2vh solid $shell-border-color;
    border-bottom: 0.2vh solid $shell-border-color;
    border-left: 0.2vh solid $shell-border-color;
    border-right: 0.2vh solid $shell-border-color;
    box-shadow: 10px 10px 0px 0px rgb(56, 56, 56);
    font-size: min(5vh, 5vw);
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    animation: button-in 0.5s;
}

@keyframes button-in {
    0% {
        top: 120%;
    }

    100% {
        top: 75%;
    }
}

.ranking-button {
    user-select: none;
    position: fixed;
    top: 25%;
    left: 70%;
    transform: translateX(-50%) translateY(-50%);
    height: 10%;
    background: #2f3341;
    color: rgb(255, 255, 255);
    border-top: 0.2vh solid $shell-border-color;
    border-bottom: 0.2vh solid $shell-border-color;
    border-left: 0.2vh solid $shell-border-color;
    border-right: 0.2vh solid $shell-border-color;
    box-shadow: 10px 10px 0px 0px rgb(56, 56, 56);
    font-size: min(5vh, 5vw);
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    animation: ranking-button-in 0.5s;
}

@keyframes ranking-button-in {
    0% {
        top: 120%;
    }

    100% {
        top: 25%;
    }
}
</style>