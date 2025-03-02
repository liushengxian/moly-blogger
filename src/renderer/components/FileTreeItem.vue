<template>
  <div class="file-tree-item" :class="{ 'is-active': isActive }">
    <div class="file-item-content" @click="handleClick">
      <span class="icon">
        <i :class="icon"></i>
      </span>
      <span class="file-name">{{ item.name }}</span>
    </div>
    <div v-if="isDirectory && isExpanded" class="sub-items">
      <FileTreeItem v-for="child in children" :key="child.path" :item="child" :current-file="currentFile"
        @select="$emit('select', $event)" @open-file="$emit('open-file', $event)" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  item: {
    type: Object,
    required: true
  },
  currentFile: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['select', 'open-file'])
const isExpanded = ref(false)
const children = ref([])

const isDirectory = computed(() => props.item.isDirectory)
const isActive = computed(() => props.item.path === props.currentFile)

const icon = computed(() => {
  if (isDirectory.value) {
    return isExpanded.value ? 'fas fa-folder-open' : 'fas fa-folder'
  }
  if (props.item.name.toLowerCase().endsWith('.md')) {
    return 'fas fa-file-alt'
  }
  return 'fas fa-file'
})

const handleClick = async () => {
  if (isDirectory.value) {
    if (!isExpanded.value) {
      const result = await window.workspace.readDir(props.item.path)
      children.value = result.sort((a, b) => {
        if (a.isDirectory !== b.isDirectory) {
          return a.isDirectory ? -1 : 1
        }
        return a.name.localeCompare(b.name)
      })
    }
    isExpanded.value = !isExpanded.value
  } else {
    const content = await window.workspace.readFile(props.item.path)
    emit('open-file', { path: props.item.path, content })
  }
}
</script>

<style scoped>
.file-tree-item {
  margin: 2px 0;
}

.file-item-content {
  display: flex;
  align-items: center;
  padding: 0.5rem;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.file-item-content:hover {
  background-color: rgba(72, 95, 199, 0.1);
  color: #485fc7;
}

.file-tree-item.is-active>.file-item-content {
  background-color: #485fc7;
  color: white;
}

.icon {
  margin-right: 0.5rem;
  width: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.file-name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.sub-items {
  margin-left: 1.5rem;
  border-left: 1px solid #dbdbdb;
  padding-left: 0.5rem;
}
</style>