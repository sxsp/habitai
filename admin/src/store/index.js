import { createStore } from 'vuex'

export default createStore({
  state: {
    is_login: false,
    is_get_router: false,
    is_collapsed: false,
    cur_page: '/habitai',
    need_update_today_todo: true,
    today_next_todo_index: -1,
    show_today_habit: false,
  },
  getters: {
  },
  mutations: {
    changeLogin(state, value) {
      state.is_login = value
      localStorage.removeItem('chatContents')
    },
    changeGetRouter(state, value) {
      state.is_get_router = value
    },
    changeCollapsed(state, value) {
      state.is_collapsed = value
    },
    changeCurPage(state, value) {
      state.cur_page = value
    },
    changeToDo(state, value) {
      state.need_update_today_todo = value;
    },
    changeToDoNext(state, value) {
      state.today_next_todo_index = value;
    },
    changeShowTodo(state, value) {
      state.show_today_habit = value;
    },
  },
  actions: {
  },
  modules: {
  }
})
