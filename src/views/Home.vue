<template>
  <div class="container">
    <div class="welcome-section">
      <h1 class="title">
        👋 Welcome{{ username ? `, ${username}` : '' }}!
      </h1>
      <p class="subtitle">
        Ready to write your next blog post?
      </p>
      <div class="buttons is-centered">
        <router-link to="/editor" class="button is-primary">
          <span class="icon">
            <i class="fas fa-pen"></i>
          </span>
          <span>New Post</span>
        </router-link>
        <button class="button is-info" @click="openWorkspace">
          <span class="icon">
            <i class="fas fa-folder-open"></i>
          </span>
          <span>Open Workspace</span>
        </button>
      </div>

      <!-- Show selected workspace if exists -->
      <div v-if="workspacePath" class="notification is-info is-light mt-3">
        <button class="delete" @click="workspacePath = ''"></button>
        Current workspace: <strong>{{ workspacePath }}</strong>
      </div>
    </div>

    <div class="recent-posts mt-6">
      <h2 class="title is-4">Recent Posts</h2>
      <div class="columns is-multiline">
        <!-- Placeholder for recent posts -->
        <div class="column is-one-third">
          <div class="box">
            <h3 class="title is-5">Sample Post</h3>
            <p class="subtitle is-6">Last edited: 2 days ago</p>
            <div class="buttons are-small">
              <button class="button is-info">Edit</button>
              <button class="button is-danger is-light">Delete</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import MarkdownEditor from '../components/MarkdownEditor.vue'

const editor = ref(null)
const initialContent = "# Welcome to Moly Blogger\n\nStart writing your blog post here..."
const username = ref('')
const workspacePath = ref('')

const handleEditorChange = (content) => {
  console.log('Content changed:', content)
}

const handleEditorSave = (content) => {
  console.log('Auto-saving content:', content)
}

const handlePublish = () => {
  const content = editor.value.getContent()
  console.log('Publishing content:', content)
}

const openWorkspace = async () => {
  try {
    const result = await window.workspace.openFolder()
    if (result.success) {
      workspacePath.value = result.path
      // You might want to store this in some persistent storage
      console.log('Selected workspace:', result.path)
    }
  } catch (error) {
    console.error('Failed to open workspace:', error)
  }
}

onMounted(async () => {
  const status = await window.github.checkAuth()
  if (status.isLoggedIn) {
    username.value = status.username
  }
})
</script>

<style scoped>
.editor-wrapper {
  height: 70vh;
  margin: 0 auto;
  padding: 20px;
}

.welcome-section {
  text-align: center;
  padding: 2rem 0;
}

.recent-posts {
  margin-top: 2rem;
}

.box {
  transition: transform 0.2s;
}

.box:hover {
  transform: translateY(-2px);
}

.notification {
  text-align: left;
  max-width: 600px;
  margin: 0 auto;
}
</style>