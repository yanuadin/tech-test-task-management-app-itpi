import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const routes = [
    {
        path: '/',
        name: 'Home',
        component: () => import('@/views/Home.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/boards',
        name: 'Boards',
        component: () => import('@/views/Boards.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/boards/:id',
        name: 'Board',
        component: () => import('@/views/BoardView.vue'),
        meta: { requiresAuth: true },
        props: route => ({
            boardId: parseInt(route.params.id), // Cast to number
        })
    },
    {
        path: '/login',
        name: 'Login',
        component: () => import('@/views/Auth/Login.vue'),
        meta: { requiresGuest: true }
    },
    {
        path: '/register',
        name: 'Register',
        component: () => import('@/views/Auth/Register.vue'),
        meta: { requiresGuest: true }
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

router.beforeEach((to, from, next) => {
    const authStore = useAuthStore();

    if (to.meta.requiresAuth && !authStore.user) {
        next('/login');
    } else if (to.meta.requiresGuest && authStore.user) {
        next('/');
    } else {
        next();
    }
});

export default router;