<template>
  <div class="container is-max-desktop">
    <!-- Article Header -->
    <div class="article-header mb-4">
      <div class="field is-grouped">
        <div class="control is-expanded">
          <input class="input is-medium" type="text" v-model="articleTitle" placeholder="Enter article title...">
        </div>
        <div class="control">
          <span class="tag" :class="statusClass">
            <span class="icon">
              <i class="fas" :class="statusIcon"></i>
            </span>
            <span>{{ status }}</span>
          </span>
        </div>
      </div>
    </div>

    <!-- Editor -->
    <div class="editor-wrapper">
      <MarkdownEditor ref="editor" :autosave="true" @change="handleEditorChange" @save="handleEditorSave" />
    </div>

    <!-- Action Buttons -->
    <!-- <div class="buttons mt-3">
      <button class="button is-primary" @click="handlePublish">
        <span class="icon">
          <i class="fas fa-upload"></i>
        </span>
        <span>Publish</span>
      </button>
    </div> -->
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import MarkdownEditor from '../components/MarkdownEditor.vue'
import path from 'path'

const editor = ref(null)
const articleTitle = ref('')
const status = ref('Draft')
const lastSaved = ref(null)

const route = useRoute()
const store = useStore()

const initialContent = computed(() => store.getters['content/initialContent'])

// Compute status class and icon based on current status
const statusClass = computed(() => {
  const classes = {
    'Draft': 'is-warning',
    'Saved': 'is-success',
    'Publishing': 'is-info',
    'Published': 'is-primary',
    'Error': 'is-danger'
  }
  return classes[status.value] || 'is-light'
})

const statusIcon = computed(() => {
  const icons = {
    'Draft': 'fa-pencil',
    'Saved': 'fa-check',
    'Publishing': 'fa-spinner fa-pulse',
    'Published': 'fa-cloud-upload-alt',
    'Error': 'fa-exclamation-triangle'
  }
  return icons[status.value] || 'fa-question'
})

const handleEditorChange = (content) => {
  console.log('Content changed:', content)
  status.value = 'Draft'
}

const handleEditorSave = async (content) => {
  try {
    const filePath = route.query.path
    if (filePath) {
      await window.api.writeFile(filePath, content)
      console.log('File saved:', filePath)
      status.value = 'Saved'
      lastSaved.value = new Date()
    } else {
      console.error('File path is not set')
      status.value = 'Error'
    }
  } catch (error) {
    console.error('Failed to save file:', error)
    status.value = 'Error'
  }
}

const handlePublish = async () => {
  if (!articleTitle.value.trim()) {
    alert('Please enter an article title')
    return
  }

  try {
    status.value = 'Publishing'
    const content = editor.value.getContent()
    console.log('Publishing content:', content)
    // Add your publish logic here

    status.value = 'Published'
  } catch (error) {
    console.error('Failed to publish:', error)
    status.value = 'Error'
  }
}

function getLastPart(url) {
  const parts = url.split('/')
  return parts[parts.length - 1]
}

const loadFileContent = async () => {
  const filePath = route.query.path
  if (filePath) {
    await store.dispatch('content/loadContent', filePath)
    articleTitle.value = getLastPart(filePath)
  }
}

onMounted(() => {
  loadFileContent()
})

watch(() => route.query.path, () => {
  loadFileContent()
})
</script>

<style scoped>
.editor-wrapper {
  height: 70vh;
  margin: 0 auto;
  border-radius: 6px;
}

.article-header {
  padding: 1rem 0;
}

.tag {
  font-size: 0.9rem;
  padding: 0.5rem 0.75rem;
}

.tag .icon {
  margin-right: 0.3rem;
}

/* Status-specific animations */
.fa-spinner {
  animation: fa-spin 2s infinite linear;
}

@keyframes fa-spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>