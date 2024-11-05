<template>
    <div class="body-bg">
        <div class="formContainer_signin" v-show="is_signin_form">
            <div class="formTitle" style="margin-top: 20px;">Let's begin!</div>
            <el-form ref="signinFormRef" :model="signinForm" status-icon label-width="120px" class="demo-ruleForm">
                <input class="input" style="margin-bottom: 40px; margin-top: 40px;"
                    :class="{ 'input-shake': is_shaking_1 }" @focus="stopShake1" @blur="startShake1"
                    v-model="signinForm.username" autocomplete="off" placeholder="User name" />

                <input class="input" :class="{ 'input-shake': is_shaking_2 }" @focus="stopShake2" @blur="startShake2"
                    v-model="signinForm.password" type="password" autocomplete="off" placeholder="Password" />
            </el-form>
            <div class="button-flex-container" style="margin-top: 60px;">
                <button class="sign_button" style="margin-right: 50px;" type="primary" @click="submitSigninForm()">
                    Sign in
                </button>
                <button class="sign_button" type="primary" @click="flipForm()">
                    Sign up
                </button>
            </div>
        </div>

        <div class="formContainer_signup" v-show="!is_signin_form">
            <div class="formTitle" style="margin-top: 20px;">Sign up first!</div>
            <el-form ref="signupFormRef" :model="signupForm" status-icon label-width="120px" class="demo-ruleForm">
                <input class="input" style="margin-bottom: 20px; margin-top: 20px;"
                    :class="{ 'input-shake': is_shaking_1 }" @focus="stopShake1" @blur="startShake1"
                    v-model="signupForm.signup_username" autocomplete="off" placeholder="User name" />

                <input class="input" style="margin-bottom: 20px;" :class="{ 'input-shake': is_shaking_2 }"
                    @focus="stopShake2" @blur="startShake2" v-model="signupForm.signup_password_1" type="password"
                    autocomplete="off" placeholder="Password" />
                <input class="input" :class="{ 'input-shake': is_shaking_3 }" @focus="stopShake3" @blur="startShake3"
                    v-model="signupForm.signup_password_2" type="password" autocomplete="off"
                    placeholder="Password again" />
            </el-form>
            <div class="button-flex-container" style="margin-top: 30px;">
                <button class="sign_button" style="margin-right: 50px;" type="primary" @click="submitSignupForm()">
                    Ok
                </button>
                <button class="sign_button" type="primary" @click="flipForm()">
                    Back
                </button>

            </div>

        </div>
    </div>
</template>



<script setup>
import { reactive } from 'vue'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { ElMessage } from 'element-plus'
import store from '@/store/index'



// 表单绑定的响应式对象
const signinForm = reactive({
    username: "",
    password: "",
})
const signupForm = reactive({
    signup_username: "",
    signup_password_1: "",
    signup_password_2: "",
})

// 表单的引用对象
const signinFormRef = ref()
const signupFormRef = ref()
let is_shaking_1 = ref(true)
let is_shaking_2 = ref(true)
let is_shaking_3 = ref(true)
let is_signin_form = ref(true)

const router = useRouter()

const submitSigninForm = () => {
    // vheck null
    signinFormRef.value.validate((valid) => {
        if (valid) {
            console.log(signinForm)

            if (!signinForm.password || !signinForm.username) {
                ElMessage.error("Please enter your username and password!")
                return
            }

            axios.post("/adminapi/user/signin", signinForm).then(res => {
                console.log(res.data)
                if (res.data.ActionType === "OK") {
                    store.commit("changeLogin", true)
                    localStorage.setItem("token", res.data.token)
                    router.push("/habitai")
                }
                else {
                    ElMessage.error("Incorrect username or password!")
                }
            })
        }
    })
}

const submitSignupForm = () => {
    signupFormRef.value.validate((valid) => {
        if (valid) {
            console.log(signupForm)
            if (!signupForm.signup_username || !signupForm.signup_password_1 || !signupForm.signup_password_2) {
                ElMessage.error("Please enter your username and password!")
                return
            }
            if (signupForm.signup_password_1 !== signupForm.signup_password_2) {
                ElMessage.error("Please enter the same password!")
                return
            }

            if (signupForm.signup_username.length > 20 || signupForm.signup_username.length > 20) {
                ElMessage.error("Limitation: 20 characters")
                return
            }

            axios.post("/adminapi/user/signup", signupForm).then(res => {
                console.log(res.data)
                if (res.data.ActionType === "OK") {
                    ElMessage.success("Sign up success! Please sign in again.")
                    setTimeout(() => {
                        is_signin_form.value = true;
                    }, 1000);
                }
                else if (res.data.ActionType === "REPEAT") {
                    ElMessage.error("This username is already taken.")
                }
            })

        }
    })
}

const startShake1 = () => {
    is_shaking_1.value = true;
}
const stopShake1 = () => {
    is_shaking_1.value = false;
}
const startShake2 = () => {
    is_shaking_2.value = true;
}
const stopShake2 = () => {
    is_shaking_2.value = false;
}
const startShake3 = () => {
    is_shaking_3.value = true;
}
const stopShake3 = () => {
    is_shaking_3.value = false;
}

const flipForm = () => {
    is_signin_form.value = !is_signin_form.value;
}

</script>

<style lang="scss" scoped>
@keyframes shake {

    0%,
    100% {
        transform: translateX(0);
    }

    25% {
        transform: translateX(-5px);
    }

    75% {
        transform: translateX(5px);
    }
}


.input-shake {
    animation: shake 4.00s cubic-bezier(.36, .07, .19, .97) infinite;
    transform-origin: 50% 50%;
}

.input {
    width: 75%;
    height: 40px;
    border-radius: 5px;
    border: 2px solid #323232;
    background-color: #f5f5f5;
    box-shadow: 4px 4px #323232;
    font-size: 15px;
    font-weight: 600;
    color: #000000;
    padding: 5px 10px;
    outline: none;
}

.input::placeholder {
    color: #838383;
    opacity: 0.8;
}

.input:focus {
    border: 2px solid #7bcfff;
}


.body-bg {
    position: relative;
    width: 100vw;
    padding: 0;
    margin: 0;
    height: 100vh;
    font-size: 16px;
    background-position: left top;
    background-color: #31746b;
    color: #301c1c;
    font-family: "Source Sans Pro";
    position: relative;
}

.body-bg::before {
    content: "Welcome to habitAI\A (^_^)";
    white-space: pre;
    text-align: center;
    position: absolute;
    top: 20%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: white;
    font-size: 4vh;
    font-weight: bold;
}

.formTitle {
    font-size: 24px;
    color: #252525;
    font-weight: bold;
}

.formContainer_signin {
    display: flex;
    width: 20%;
    min-width: 400px;
    height: 40%;
    min-height: 400px;
    position: relative;
    flex-direction: column;
    left: 50%;
    top: 55%;
    transform: translate(-50%, -50%);
    background: rgba($color: #abcfc6, $alpha: 1);
    color: white;
    border: 2px solid #323232;
    box-shadow: 4px 4px #323232;
    text-align: center;
    padding: 20px;
    border-radius: 15px;

    transition: transform 0.5s ease;
    position: absolute;
    backface-visibility: hidden;
}

.formContainer_signup {
    display: flex;
    width: 20%;
    min-width: 400px;
    height: 40%;
    min-height: 400px;
    position: relative;
    flex-direction: column;
    left: 50%;
    top: 55%;
    transform: translate(-50%, -50%);
    background: rgba($color: #a8c2ce, $alpha: 1);
    color: white;
    border: 2px solid #323232;
    box-shadow: 4px 4px #323232;
    text-align: center;
    padding: 20px;
    border-radius: 15px;

    transition: transform 0.5s ease;
    position: absolute;
    backface-visibility: hidden;
}



.button-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
}

.sign_button {
    width: 120px;
    height: 50px;
    border-radius: 10px;
    border: 2px solid #323232;
    background-color: #f0db21;
    box-shadow: 4px 4px #323232;
    font-size: 17px;
    font-weight: 600;
    color: #000000;
    cursor: pointer;
    transition: background-color 0.3s;
}

.sign_button:hover {
    background-color: #41c774;
}

::v-deep .el-form-item__label {
    color: white;
}
</style>