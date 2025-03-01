<template>
  <div class="github-login">
    <button v-if="!isLoggedIn" class="button is-dark" @click="login">
      <span class="icon">
        <i class="fab fa-github"></i>
      </span>
      <span>Login with GitHub</span>
    </button>
    <div v-else class="user-info">
      <img :src="userAvatar" class="avatar" :alt="username">
      <span class="username">{{ username }}</span>
      <button class="button is-small is-light" @click="logout">Logout</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const isLoggedIn = ref(false)
const username = ref('')
const userAvatar = ref('')

const handleOAuthCallback = async (data) => {
  if (data.code) {
    // Handle the OAuth code
    console.log('Received OAuth code:', data.code)
    // You can now use this code to get the access token
    const result = await window.github.login(data.code)
    if (result.success) {
      isLoggedIn.value = true
      username.value = result.username
      userAvatar.value = result.avatar
    }
  }
}

const login = async () => {
  try {
    const result = await window.github.login()
    if (result.success) {
      isLoggedIn.value = true
      username.value = result.username
      userAvatar.value = result.avatar
    }
  } catch (error) {
    console.error('Login failed:', error)
  }
}

const logout = async () => {
  await window.github.logout()
  isLoggedIn.value = false
  username.value = ''
  userAvatar.value = ''
}

onMounted(async () => {
  // Register OAuth callback handler
  window.github.onOAuthCallback(handleOAuthCallback)

  // Check initial auth status
  const status = await window.github.checkAuth()
  if (status.isLoggedIn) {
    isLoggedIn.value = true
    username.value = status.username
    userAvatar.value = status.avatar
  }
})
</script>

<style scoped>
.github-login {
  padding: 10px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
}

.username {
  font-weight: bold;
}
</style>