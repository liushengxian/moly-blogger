<template>
  <div class="welcome-container">
    <div class="welcome-content">
      <h1 class="title">
        Welcome to Moly Blogger
      </h1>
      <p class="subtitle">
        Let's set up your workspace to get started
      </p>

      <div class="workspace-setup mt-6">
        <div class="box">
          <h2 class="subtitle mb-4">Choose Your Workspace</h2>
          
          <div v-if="recentWorkspaces.length > 0" class="recent-workspaces mb-5">
            <p class="is-size-6 has-text-grey mb-3">Recent workspaces:</p>
            <div class="workspace-list">
              <button 
                v-for="workspace in recentWorkspaces" 
                :key="workspace.path"
                class="button is-light is-fullwidth mb-2 workspace-button"
                @click="selectWorkspace(workspace.path)"
              >
                <span class="icon">
                  <i class="fas fa-folder"></i>
                </span>
                <span class="workspace-path">{{ workspace.path }}</span>
              </button>
            </div>
          </div>

          <div class="buttons is-centered">
            <button class="button is-primary is-medium" @click="openWorkspace">
              <span class="icon">
                <i class="fas fa-folder-open"></i>
              </span>
              <span>Select New Workspace</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

const store = useStore()
const router = useRouter()
const recentWorkspaces = ref([])

const loadRecentWorkspaces = async () => {
  const result = await window.database.getWorkspaces()
  if (result.success) {
    recentWorkspaces.value = result.workspaces
  }
}

const openWorkspace = async () => {
  try {
    const result = await window.workspace.openFolder()
    if (result.success) {
      await selectWorkspace(result.path)
    }
  } catch (error) {
    console.error('Failed to open workspace:', error)
  }
}

const selectWorkspace = async (path) => {
  await store.dispatch('workspace/setWorkspacePath', path)
  router.push('/home')
}

onMounted(() => {
  loadRecentWorkspaces()
})
</script>

<style scoped>
.welcome-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f7fa;
  padding: 2rem;
}

.welcome-content {
  max-width: 600px;
  width: 100%;
  text-align: center;
}

.workspace-setup {
  max-width: 500px;
  margin: 0 auto;
}

.workspace-list {
  max-height: 200px;
  overflow-y: auto;
  margin-bottom: 2rem;
}

.workspace-button {
  justify-content: flex-start;
  text-align: left;
  padding: 1rem;
  transition: all 0.2s ease;
}

.workspace-button:hover {
  background-color: #f0f0f0;
  transform: translateY(-1px);
}

.workspace-path {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.box {
  padding: 2rem;
  background-color: white;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.1);
}
</style> 