import Home from '@/views/home/Home.vue'
import Center from '@/views/center/Center.vue'
import HiHub from '@/views/hub/hihub.vue'
import MyhabitsMenu from '@/views/myhabits/MyHabitsMenu.vue'
import HabitsView from '@/views/myhabits/habitsItem/habitsView.vue'
import HabitsEdit from '@/views/myhabits/habitsItem/habitsEdit.vue'
import HabitsRecord from '@/views/myhabits/habitsItem/habitsRecord.vue'
import HabitsHistory from '@/views/myhabits/habitsItem/habitsHistory.vue'


const routes = [
    {
        path: "/habitai",  //  /: from the root directory
        component: Home,
    },
    {
        path: "/center",
        component: Center,
    },
    {
        path: "/hihub",
        component: HiHub,
    },
    {
        path: "/myhabitsmenu",
        component: MyhabitsMenu,
        children: [
            {
                path: "/habitsview",
                component: HabitsView,
            },
            {
                path: "/habitsedit",
                component: HabitsEdit,
            },
            {
                path: "/habitsrecord",
                component: HabitsRecord,
            },
            {
                path: "/habitshistory",
                component: HabitsHistory,
            },
        ]
    },
    {
        path: "/",
        redirect: "/habitai",
    },

    {
        path: "/habitsview",
        component: HabitsView,
    },

]

export default routes
