<template>
  <Codemirror ref="editorElement" v-model="content" :extensions="extensions" class="markdown-editor" />
</template>

<script>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { useStore } from 'vuex'
import { Codemirror } from 'vue-codemirror'
import { EditorView, keymap } from '@codemirror/view'
import { markdown } from '@codemirror/lang-markdown'
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands'
import { searchKeymap } from '@codemirror/search'
import { languages } from '@codemirror/language-data'

export default {
  name: 'MarkdownEditor',
  components: {
    Codemirror
  },
  props: {
    autosave: {
      type: Boolean,
      default: true
    }
  },
  emits: ['change', 'save'],
  setup(props, { emit }) {
    const store = useStore()
    const content = ref(store.getters['content/initialContent'])
    const autoSaveTimeout = ref(null)

    const extensions = [
      // Basic editor setup
      EditorView.lineWrapping,
      EditorView.contentAttributes.of({ class: 'cm-content' }),
      history(),

      // Keymaps
      keymap.of([
        ...defaultKeymap,
        ...searchKeymap,
        ...historyKeymap
      ]),

      // Language support
      markdown({
        codeLanguages: languages
      }),

      // Theme
      EditorView.theme({
        "&": {
          height: "100%",
          fontSize: "14px"
        },
        ".cm-content": {
          fontFamily: "'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', monospace",
          padding: "10px 0"
        },
        "&.cm-focused": {
          outline: "none"
        },
        ".cm-line": {
          padding: "0 10px"
        },
        ".cm-gutters": {
          backgroundColor: "#f5f5f5",
          border: "none",
          borderRight: "1px solid #ddd"
        },
        ".cm-activeLineGutter": {
          backgroundColor: "#e2e2e2"
        }
      }),

      // Change listener
      EditorView.updateListener.of(update => {
        if (update.docChanged) {
          handleChange(update.state.doc.toString())
        }
      })
    ]

    // Add autosave listener if enabled
    if (props.autosave) {
      extensions.push(EditorView.updateListener.of(update => {
        if (update.docChanged) {
          autoSave(update.state.doc.toString())
        }
      }))
    }

    const handleChange = (newContent) => {
      content.value = newContent
      emit('change', newContent)
    }

    const autoSave = (newContent) => {
      if (autoSaveTimeout.value) {
        clearTimeout(autoSaveTimeout.value)
      }
      autoSaveTimeout.value = setTimeout(() => {
        emit('save', newContent)
      }, 1000)
    }

    watch(() => store.getters['content/initialContent'], (newContent) => {
      content.value = newContent
    })

    onMounted(() => {
      content.value = store.getters['content/initialContent']
    })

    onBeforeUnmount(() => {
      if (autoSaveTimeout.value) {
        clearTimeout(autoSaveTimeout.value)
      }
    })

    return {
      content,
      extensions
    }
  }
}
</script>

<style scoped>
.markdown-editor {
  height: 100%;
  width: 100%;
}

:deep(.cm-editor) {
  height: 100%;
  border: 1px solid #ddd;
  border-radius: 4px;
}

:deep(.cm-scroller) {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', monospace;
  line-height: 1.6;
  padding: 10px;
}

:deep(.cm-content) {
  white-space: pre-wrap;
  word-break: break-word;
  word-wrap: break-word;
}

:deep(.cm-line) {
  padding: 0 10px;
}
</style>