<template>
  <div class="container is-max-desktop">
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
import { ref } from 'vue'
import MarkdownEditor from '../components/MarkdownEditor.vue'

const editor = ref(null)
const initialContent = "# Welcome to Moly Blogger\n\nStart writing your blog post here..."

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