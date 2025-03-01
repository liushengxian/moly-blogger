<template>
  <aside class="menu sidebar">
    <div class="sidebar-header">
      <p class="menu-label">Moly Blogger</p>
      <button class="button is-small is-ghost hide-button" @click="$emit('hide-navbar')" aria-label="Hide navigation">
        <span class="icon">
          <i class="fas fa-chevron-left"></i>
        </span>
      </button>
    </div>

    <ul class="menu-list">
      <li>
        <router-link to="/" :class="{ 'is-active': $route.path === '/' }">
          <span class="icon-text">
            <span class="icon">
              <i class="fas fa-home"></i>
            </span>
            <span>Home</span>
          </span>
        </router-link>
      </li>
      <li>
        <router-link to="/editor" :class="{ 'is-active': $route.path === '/editor' }">
          <span class="icon-text">
            <span class="icon">
              <i class="fas fa-pen"></i>
            </span>
            <span>Editor</span>
          </span>
        </router-link>
      </li>
      <li>
        <router-link to="/settings" :class="{ 'is-active': $route.path === '/settings' }">
          <span class="icon-text">
            <span class="icon">
              <i class="fas fa-cog"></i>
            </span>
            <span>Settings</span>
          </span>
        </router-link>
      </li>
    </ul>

    <div class="sidebar-footer">
      <div class="user-profile">
        <GitHubLogin />
      </div>
      <p class="version-info">{{ versionInfo }}</p>
    </div>
  </aside>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import GitHubLogin from './GitHubLogin.vue'

const versionInfo = ref('')

onMounted(() => {
  versionInfo.value = `v${versions.electron()}`
})

defineEmits(['hide-navbar'])
</script>

<style scoped>
.sidebar {
  width: 250px;
  background-color: #f5f5f5;
  padding: 1.5rem 1rem;
  display: flex;
  flex-direction: column;
  height: 100vh;
  border-right: 1px solid #dbdbdb;
  position: relative;
}

.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.menu-label {
  font-size: 1rem;
  font-weight: bold;
  margin: 0;
}

.hide-button {
  padding: 0.25rem;
  color: #666;
}

.hide-button:hover {
  color: #485fc7;
}

.menu-list a {
  display: flex;
  align-items: center;
  padding: 0.75rem;
  border-radius: 6px;
}

.menu-list a.is-active {
  background-color: #485fc7;
  color: white;
}

.menu-list .icon {
  margin-right: 0.5rem;
}

.sidebar-footer {
  margin-top: auto;
  padding-top: 1rem;
  border-top: 1px solid #dbdbdb;
}

.user-profile {
  margin-bottom: 1rem;
}

.version-info {
  font-size: 0.8rem;
  color: #666;
  text-align: center;
}
</style>