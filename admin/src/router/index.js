import { createRouter, createWebHashHistory } from 'vue-router'
import Login from '@/views/Login.vue' // @ == src
import MainBox from '@/views/MainBox.vue'
import NotFound from '@/views/notfound/NotFound.vue'
import RoutesConfig from './config'
import store from '@/store/index'


const routes = [
  {
    path: "/login",
    name: "login",
    component: Login,
  },
  {
    path: "/mainbox",
    name: "mainbox",
    component: MainBox,
  },
  {
    path: "/:pathMatch(.*)*",
    name: "Notfound",
    component: NotFound,
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

// check token
router.beforeEach((to, from, next) => {
  if (to.name === "login") {
    store.commit("changeLogin", false)
    next()
  } else {
    if (!localStorage.getItem("token")) {
      next({ path: "/login" })
    } else {
      if (!store.state.is_get_router) {
        configRouter()
        next({ path: to.fullPath })
      } else {
        next()
      }
    }
  }
})

const configRouter = () => {
  RoutesConfig.forEach(item => { router.addRoute("mainbox", item) }) // add router
  store.commit("changeGetRouter", true)
}





export default router
