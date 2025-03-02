<template>
  <aside class="menu sidebar">
    <div class="sidebar-header">
      <p class="menu-label">{{ workspaceName }}</p>
      <button class="button is-small is-ghost hide-button" @click="$emit('hide-navbar')" aria-label="Hide navigation">
        <span class="icon">
          <i class="fas fa-chevron-left"></i>
        </span>
      </button>
    </div>

    <!-- Workspace Explorer -->
    <div class="workspace-explorer">
      <div v-if="!workspacePath" class="no-workspace">
        <p class="has-text-grey">No workspace selected</p>
      </div>
      <div v-else>
        <div class="file-tree">
          <div class="file-tree-scroll">
            <FileTreeItem v-for="item in fileTree" :key="item.path" :item="item" :current-file="currentFile"
              @select="handleSelect" @open-file="handleOpenFile" />
          </div>
        </div>
      </div>
    </div>

    <!-- Settings at Bottom -->
    <div class="sidebar-footer">
      <p class="version-info">{{ versionInfo }}</p>
    </div>
  </aside>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import FileTreeItem from './FileTreeItem.vue'

const store = useStore()
const router = useRouter()
const versionInfo = ref('')
const fileTree = ref([])

const workspacePath = computed(() => store.getters['workspace/workspacePath'])
const currentFile = computed(() => store.getters['workspace/currentFile'])
const editorContent = ref('')
const workspaceName = computed(() =>
  // workspacePath.value ? path.basename(workspacePath.value) :
  'Moly Blogger'
)

const handleSelect = (path) => {
  currentFile.value = path
}

const handleOpenFile = ({ path, content }) => {
  currentFile.value = path
  editorContent.value = content
  router.push('/editor')
}

const loadWorkspaceFiles = async () => {
  if (!workspacePath.value) return

  console.log("load workspace files", workspacePath.value)

  const result = await window.workspace.readDir(workspacePath.value)
  if (result.length > 0) {
    fileTree.value = result;
    // result.sort((a, b) => {
    //   // Directories first, then files
    //   if (a.isDirectory !== b.isDirectory) {
    //     return a.isDirectory ? -1 : 1
    //   }
    //   // Then alphabetically
    //   return a.name.localeCompare(b.name)
    // })
  }
}

const handleFileSelect = async (filePath) => {
  // if (await window.workspace.isMarkdown(filePath)) {
  //   const result = await window.workspace.readFile(filePath)
  //   if (result.success) {
  //     store.dispatch('workspace/openFile', {
  //       path: filePath,
  //       content: result.content
  //     })
  //   }
  // }
}

watch(() => workspacePath.value, loadWorkspaceFiles, { immediate: true })

onMounted(() => {
  versionInfo.value = `v${versions.electron()}`
  loadWorkspaceFiles()
})

defineEmits(['hide-navbar'])
</script>

<style scoped>
.sidebar {
  width: 250px;
  background-color: #f5f5f5;
  padding: 1.5rem 1rem;
  display: flex;
  flex-direction: column;
  height: 100vh;
  border-right: 1px solid #dbdbdb;
  position: relative;
}

.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.menu-label {
  font-size: 1rem;
  font-weight: bold;
  margin: 0;
}

.hide-button {
  padding: 0.25rem;
  color: #666;
  background: transparent;
  border: none;
  transition: all 0.2s ease;
}

.hide-button:hover {
  color: #485fc7;
  background-color: rgba(72, 95, 199, 0.1);
}

.workspace-explorer {
  flex: 1;
  overflow: hidden;
}

.file-tree {
  height: 100%;
}

.file-tree-scroll {
  max-height: 100%;
  overflow-y: auto;
}

.menu-list a {
  display: flex;
  align-items: center;
  padding: 0.75rem;
  border-radius: 6px;
  background: transparent;
  transition: all 0.2s ease;
}

.menu-list a:hover {
  background-color: rgba(72, 95, 199, 0.1);
  color: #485fc7;
}

.menu-list a.is-active {
  background-color: #485fc7;
  color: white;
}

.menu-list a.is-active:hover {
  background-color: #3e55b9;
  color: white;
}

.menu-list .icon {
  margin-right: 0.5rem;
}

.sidebar-footer {
  margin-top: auto;
  padding-top: 1rem;
  border-top: 1px solid #dbdbdb;
}

.user-profile {
  margin-bottom: 1rem;
}

.version-info {
  font-size: 0.8rem;
  color: #666;
  text-align: center;
  margin-top: 1rem;
}
</style>