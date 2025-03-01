<template>
  <div class="container is-max-desktop">
    <h1>👋Hello from Moly!</h1>
    <nav class="level">
      <div class="level-item has-text-centered">
        <div>
          <p class="heading">Posts</p>
          <p class="title">{{ stats.posts }}</p>
        </div>
      </div>
      <div class="level-item has-text-centered">
        <div>
          <p class="heading">Drafts</p>
          <p class="title">{{ stats.drafts }}</p>
        </div>
      </div>
    </nav>
    <div class="level-right">
      <GitHubLogin />
    </div>
    <p id="info">{{ versionInfo }}</p>
    <div class="editor-wrapper">
      <MarkdownEditor ref="editor" :initial-content="initialContent" :autosave="true" @change="handleEditorChange"
        @save="handleEditorSave" />
    </div>
    <div class="buttons mt-3">
      <button class="button is-primary" @click="handlePublish">Publish</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import MarkdownEditor from './components/MarkdownEditor.vue'
import GitHubLogin from './components/GitHubLogin.vue'

const editor = ref(null)
const versionInfo = ref('')
const initialContent = "# Welcome to Moly Blogger\n\nStart writing your blog post here..."
const stats = reactive({
  posts: 3456,
  drafts: 123
})

onMounted(() => {
  versionInfo.value = `Using Chrome (v${versions.chrome()}), Node.js (v${versions.node()}), and Electron (v${versions.electron()})`
})

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
</script>

<style scoped>
.editor-wrapper {
  height: 70vh;
  margin: 0 auto;
  padding: 20px;
}
</style>