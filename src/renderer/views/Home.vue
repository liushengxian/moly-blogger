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
        <button class="button is-success" @click="previewSite">
          <span class="icon">
            <i class="fas fa-eye"></i>
          </span>
          <span>Preview</span>
        </button>
      </div>

      <!-- Show selected workspace if exists -->
      <div v-if="$store.getters['workspace/workspacePath']" class="notification is-info is-light mt-3">
        <button class="delete" @click="$store.dispatch('workspace/setWorkspacePath', '')"></button>
        Current workspace: <strong>{{ $store.getters['workspace/workspacePath'] }}</strong>
      </div>
    </div>

    <!-- <div class="recent-posts mt-6">
      <h2 class="title is-4">Recent Posts</h2>
      <div class="columns is-multiline">
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
    </div> -->
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useStore } from 'vuex'
import MarkdownEditor from '../components/MarkdownEditor.vue'

const store = useStore()
const editor = ref(null)
const initialContent = "# Welcome to Moly Blogger\n\nStart writing your blog post here..."
const username = ref('')

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
    if (result) {
      store.dispatch('workspace/setWorkspacePath', result)
    }
  } catch (error) {
    console.error('Failed to open workspace:', error)
  }
}

const previewSite = async () => {
  try {
    const workspacePath = store.getters['workspace/workspacePath']
    if (workspacePath) {
      const runningProcess = await window.api.checkRunningProcess('hugo serve')
      if (runningProcess) {
        console.log('Hugo serve is already running')
      } else {
        await window.api.runCommand('hugo', ['serve'], { cwd: workspacePath })
      }
      await window.api.openExternal('http://localhost:1313')
    } else {
      console.error('Workspace path is not set')
    }
  } catch (error) {
    console.error('Failed to preview site:', error)
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
  transform: translateY(-2px)
}

.notification {
  text-align: left;
  max-width: 600px;
  margin: 0 auto;
}
</style>