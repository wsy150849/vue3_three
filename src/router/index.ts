import { createRouter, createWebHashHistory, type RouteRecordRaw } from 'vue-router'
import Solar from '@/views/Solar.vue'
import Portfolio from '@/views/Portfolio.vue'
import About from '@/views/About.vue'
import Contact from '@/views/Contact.vue'

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        component: Solar
    },
    {
        path: '/solar',
        component: Solar
    },
    {
        path: '/portfolio',
        component: Portfolio
    },
    {
        path: '/about',
        component: About
    },
    {
        path: '/contact',
        component: Contact
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router