import { createRouter, createWebHashHistory, type RouteRecordRaw } from 'vue-router'
import Solar from '@/views/Solar.vue'
const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        component: Solar
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})
export default router