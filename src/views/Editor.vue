<template>
  <div class="container is-max-desktop">
    <!-- Article Header -->
    <div class="article-header mb-4">
      <div class="field is-grouped">
        <div class="control is-expanded">
          <input 
            class="input is-medium" 
            type="text" 
            v-model="articleTitle" 
            placeholder="Enter article title..."
          >
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
      <MarkdownEditor 
        ref="editor" 
        :initial-content="initialContent" 
        :autosave="true" 
        @change="handleEditorChange"
        @save="handleEditorSave" 
      />
    </div>

    <!-- Action Buttons -->
    <div class="buttons mt-3">
      <button class="button is-primary" @click="handlePublish">
        <span class="icon">
          <i class="fas fa-upload"></i>
        </span>
        <span>Publish</span>
      </button>
      <button class="button is-info is-light" @click="handleSave">
        <span class="icon">
          <i class="fas fa-save"></i>
        </span>
        <span>Save Draft</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import MarkdownEditor from '../components/MarkdownEditor.vue'

const editor = ref(null)
const articleTitle = ref('')
const status = ref('Draft')
const lastSaved = ref(null)

const initialContent = "# Welcome to Moly Blogger\n\nStart writing your blog post here..."

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

const handleEditorSave = (content) => {
  console.log('Auto-saving content:', content)
  status.value = 'Saved'
  lastSaved.value = new Date()
}

const handleSave = async () => {
  try {
    const content = editor.value.getContent()
    await handleEditorSave(content)
  } catch (error) {
    console.error('Failed to save:', error)
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
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>