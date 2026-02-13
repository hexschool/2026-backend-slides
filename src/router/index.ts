import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/course/:courseId',
      name: 'course',
      component: () => import('../views/CourseView.vue'),
    },
    {
      path: '/course/:courseId/slide/:id',
      name: 'slide',
      component: () => import('../views/SlideView.vue'),
    },
  ],
})
