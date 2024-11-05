<template>
    <div class="card-info">
        <span class="card-info-content">{{ cardInfo }}</span>
    </div>
    <div class="card-5">
    </div>
    <!-- <div class="card-0" :class="{ clicked: cardiClicked[0] }" @click="toggleCardPosition(0)"
        @mouseenter="updateCardInfoContent(historyInfo)" @mouseleave="updateCardInfoContent('')">
        <span class="card-word-0">ANALYSE</span>
    </div> -->
    <div class="card-1" :class="{ clicked: cardiClicked[1] }" @click="toggleCardPosition(1)"
        @mouseenter="updateCardInfoContent(recordInfo)" @mouseleave="updateCardInfoContent('')">
        <span class="card-word-1">HISTORY</span>
    </div>
    <div class="card-2" :class="{ clicked: cardiClicked[2] }" @click="toggleCardPosition(2)"
        @mouseenter="updateCardInfoContent(editInfo)" @mouseleave="updateCardInfoContent('')">
        <span class="card-word-2">EDIT</span>
    </div>
    <div class="card-3" :class="{ clicked: cardiClicked[3] }" @click="toggleCardPosition(3)"
        @mouseenter="updateCardInfoContent(viewInfo)" @mouseleave="updateCardInfoContent('')">
        <span class="card-word-3">VIEW</span>
    </div>
    <div class="card-4">
        <span class="card-word-cover">MY HABITS</span>
    </div>
    <button class="close-button" v-show="isMainCardVisible" @click="closeHabitsCard">CLOSE</button>
    <div class="card-main" v-show="isMainCardVisible">
        <div class="main-content">
            <router-view></router-view>
        </div>
    </div>
</template>

<script setup>

import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const viewInfo = '-- View my habits --'
const editInfo = '-- Edit my habits --'
const recordInfo = '-- View completed habits --'
const historyInfo = '-- View completed habits --'

let cardiClicked = ref([
    false, // card0isClicked
    false, // card1isClicked
    false, // card2isClicked
    false  // card3isClicked
]);

let isMainCardVisible = ref(false)

let cardInfo = ref('')

onMounted(() => {
    // for (let i = 0; i < 4; i++) {

    //     cardiClicked.value[i] = false

    // }
})
const closeHabitsCard = () => {
    isMainCardVisible.value = false;
    for (let i = 0; i < 4; i++) {
        cardiClicked.value[i] = false
    }
}
const updateCardInfoContent = (content) => {
    cardInfo.value = content;
}
const toggleCardPosition = (index) => {
    switch (index) {
        case 3: {
            router.push('/habitsview')
            break;
        }
        case 2: {
            router.push('/habitsedit')
            break;
        }
        case 1: {
            router.push('/habitsrecord')
            break;
        }
        case 0: {
            router.push('/habitshistory')
            break;
        }
        default:
            break;
    }
    for (let i = 0; i < 4; i++) {
        if (i === index) {
            cardiClicked.value[i] = !cardiClicked.value[i]
        }
        else {
            cardiClicked.value[i] = false
        }
    }
    isMainCardVisible.value = cardiClicked.value[0] || cardiClicked.value[1] || cardiClicked.value[2] || cardiClicked.value[3];
}


</script>

<style lang="scss" scoped>
@keyframes mainCardIn {

    0% {
        transform: translateY(-100%) rotate(20deg);
    }

    50% {}

    100% {
        transform: translateX(-50%) translateY(-50%)
    }
}

@keyframes closeButtonIn {

    0% {
        transform: translateX(100%);
    }

    50% {}

    100% {
        transform: translateX(0%)
    }
}

.card-main {
    overflow: hidden;
    width: 80vw;
    height: 90vh;
    position: fixed;
    background: #f3f5f5;
    font-size: 300%;
    line-height: 10vh;
    border: 1vh solid rgb(48, 48, 48);
    left: 50%;
    top: 50%;
    transform: translateX(-50%) translateY(-50%);
    animation: mainCardIn 0.4s cubic-bezier(.36, .07, .19, .97);
}

.card-info {
    overflow: hidden;
    width: 120VW;
    height: 10vh;
    top: 30vh;
    position: fixed;
    background: #ffffff;
    transform: rotate(-20deg) skew(-20deg);
    transform-origin: 0% 50%;
    font-size: 300%;
    line-height: 10vh;
    border-top: 1vh solid rgb(155, 155, 155);
    border-bottom: 1vh solid rgb(155, 155, 155);
}


@mixin card {
    overflow: hidden;
    width: 60vw;
    height: 70vh;
    right: 5vw;
    bottom: 1vh;
    position: fixed;
    background: #f3f5f5;
    border: 0.4vh solid rgb(46, 46, 46);
    box-shadow: 1vh 1vw 0.6vh rgba(0, 0, 0, 0.5);
    transition: transform 0.3s ease;
    user-select: none;
    cursor: pointer;

    &::before {
        content: '';
        position: absolute;
        top: 0;
        bottom: 0;
        right: 100%;
        left: 0;
        background: rgb(139, 255, 236);
        color: white;
        opacity: 0;
        z-index: -1;
    }

    &:hover {
        color: #fff;

        &::before {
            color: white;
            left: 0;
            right: 0;
            opacity: 1;
        }
    }
}

@mixin card-cover {
    user-select: none;
    overflow: hidden;
    width: 60vw;
    height: 70vh;
    right: 5vw;
    bottom: 1vh;
    position: fixed;
    background: #16373d;
    border: 0.4vh solid rgb(46, 46, 46);
    box-shadow: 1vh 1vw 0.6vh rgba(0, 0, 0, 0.5);
}

.card-0.clicked {
    transform: translateX(-20vw) translateY(-10vh);
}

.card-1.clicked {
    transform: translateX(-20vw) translateY(-10vh);
}

.card-2.clicked {
    transform: translateX(-20vw) translateY(-10vh);
}

.card-3.clicked {
    transform: translateX(-20vw) translateY(-10vh);
}

.card-0 {
    @include card;
    transform: translateY(-1vh) rotate(3deg);
    transform-origin: 90% 85%;
}

.card-1 {
    @include card;
    transform: rotate(5deg);
    transform-origin: 90% 85%;
}

.card-2 {
    @include card;
    transform: rotate(20deg);
    transform-origin: 90% 85%;
}

.card-3 {
    @include card;
    transform: rotate(35deg);
    transform-origin: 90% 85%;
}

.card-4 {
    @include card-cover;
    transform: rotate(50deg);
    transform-origin: 90% 85%;
}

.card-5 {
    @include card-cover;
    transform: rotate(-8deg);
    transform-origin: 90% 85%;
}


@mixin card-word {
    display: inline-block;
    position: absolute;
    font-size: min(10vh, 6vw);
    color: rgb(61, 61, 61);
    left: 2%;
    bottom: 2%;

}

.card-word-0 {
    @include card-word()
}

.card-word-1 {
    @include card-word()
}

.card-word-2 {
    @include card-word()
}

.card-word-3 {
    @include card-word()
}

.card-word-cover {
    display: inline-block;
    position: absolute;
    font-size: min(10vh, 6vw);
    color: rgb(255, 255, 255);
    left: 2%;
    bottom: 2%;

}

.main-content {
    overflow-y: auto;
    height: 100%;
    min-width: 100%;
    position: relative;
}

.main-content::-webkit-scrollbar {
    width: 0;
}

.main-content {
    scrollbar-width: none;
}

.main-content {
    -ms-overflow-style: none;
}

.close-button {
    border: none;
    position: fixed;
    top: 10vh;
    right: 0%;
    height: 8vh;
    width: 12vw;
    font-size: 4vh;
    font-weight: bold;
    background: rgb(255, 33, 33);
    color: white;
    z-index: 400;
    animation: closeButtonIn 0.5s cubic-bezier(.36, .07, .19, .97);
    box-shadow: 6px 4px 2px rgba(0, 0, 0, 0.3);

}
</style>