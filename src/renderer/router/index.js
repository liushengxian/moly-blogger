import { createRouter, createWebHashHistory } from 'vue-router'
import Welcome from '../views/Welcome.vue'
import Home from '../views/Home.vue'
import Settings from '../views/Settings.vue'
import Editor from '../views/Editor.vue'
import { useStore } from 'vuex'

const routes = [
  {
    path: '/',
    name: 'Welcome',
    component: Welcome
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    meta: { requiresWorkspace: true }
  },
  {
    path: '/editor',
    name: 'Editor',
    component: Editor,
    meta: { requiresWorkspace: true }
  },
  {
    path: '/settings',
    name: 'Settings',
    component: Settings
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

// Navigation guard to check for workspace
router.beforeEach((to, from, next) => {
  const store = useStore()
  const workspacePath = store.getters['workspace/workspacePath']

  console.log("workspacePath", workspacePath, to.meta.requiresWorkspace)

  if (to.meta.requiresWorkspace && !workspacePath) {
    next('/')
  } else if (to.path === '/' && workspacePath) {
    next('/home')
  } else {
    next()
  }
})

export default router 