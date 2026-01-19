import { createRouter, createWebHashHistory, type RouteRecordRaw } from 'vue-router'
import Solar from '@/views/Solar.vue'

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        component: Solar
    },
    {
        path: '/solar',
        component: () => import('@/views/Solar.vue')
    },
    {
        path: '/clock',
        component: () => import('@/views/Clock.vue')
    },
    {
        path: '/portfolio',
        component: () => import('@/views/Portfolio.vue')
    },
    {
        path: '/about',
        component: () => import('@/views/About.vue')
    },
    {
        path: '/contact',
        component: () => import('@/views/Contact.vue')
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router