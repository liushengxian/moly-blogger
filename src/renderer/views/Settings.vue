<template>
  <div class="container is-max-desktop">
    <h2 class="title is-4">Settings</h2>
    <div class="box">
      <h3 class="subtitle">GitHub Configuration</h3>
      <GitHubLogin />
    </div>
  </div>
</template>

<script setup>
import GitHubLogin from '../components/GitHubLogin.vue'
</script>