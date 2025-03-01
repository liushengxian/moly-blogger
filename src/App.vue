<template>
  <div class="app-container">
    <!-- Left Sidebar Navigation -->
    <transition name="slide">
      <Navbar v-if="showNavbar" @hide-navbar="toggleNavbar" />
    </transition>

    <!-- Toggle button when navbar is hidden -->
    <button v-if="!showNavbar" class="button is-small navbar-toggle" @click="toggleNavbar" aria-label="Show navigation">
      <span class="icon">
        <i class="fas fa-bars"></i>
      </span>
    </button>

    <!-- Main Content Area -->
    <main class="main-content" :class="{ 'full-width': !showNavbar }">
      <div class="container">
        <router-view></router-view>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Navbar from './components/Navbar.vue'

const showNavbar = ref(true)

const toggleNavbar = () => {
  showNavbar.value = !showNavbar.value
}
</script>

<style scoped>
.app-container {
  display: flex;
  height: 100vh;
  overflow: hidden;
  position: relative;
}

.main-content {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
  background-color: #fafafa;
  transition: all 0.3s ease;
  margin-left: 0;
}

.navbar-toggle {
  position: fixed;
  top: 1rem;
  left: 1rem;
  z-index: 30;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #485fc7;
  color: white;
  border: none;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
}

.navbar-toggle:hover {
  background-color: #3e55b9;
  transform: scale(1.05);
}

/* Transition animations */
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(-100%);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}
</style>