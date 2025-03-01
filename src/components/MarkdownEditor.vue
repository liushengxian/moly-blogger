<template>
  <div ref="editorElement" class="markdown-editor"></div>
</template>

<script>
import { EditorState } from "@codemirror/state"
import { EditorView, keymap } from "@codemirror/view"
import { markdown } from "@codemirror/lang-markdown"
import { defaultKeymap, history, historyKeymap } from "@codemirror/commands"
import { searchKeymap } from "@codemirror/search"
import { languages } from "@codemirror/language-data"

export default {
  name: 'MarkdownEditor',
  props: {
    initialContent: {
      type: String,
      default: ''
    },
    autosave: {
      type: Boolean,
      default: true
    }
  },
  emits: ['change', 'save'],
  data() {
    return {
      editor: null,
      autoSaveTimeout: null
    }
  },
  mounted() {
    this.initEditor()
  },
  beforeUnmount() {
    this.destroy()
  },
  methods: {
    initEditor() {
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
            this.handleChange(update)
          }
        })
      ]

      // Add autosave listener if enabled
      if (this.autosave) {
        extensions.push(EditorView.updateListener.of(update => {
          if (update.docChanged) {
            this.autoSave(update.state.doc.toString())
          }
        }))
      }

      const startState = EditorState.create({
        doc: this.initialContent,
        extensions
      })

      this.editor = new EditorView({
        state: startState,
        parent: this.$refs.editorElement
      })
    },
    handleChange(update) {
      const content = update.state.doc.toString()
      this.$emit('change', content)
    },
    autoSave(content) {
      if (this.autoSaveTimeout) {
        clearTimeout(this.autoSaveTimeout)
      }
      this.autoSaveTimeout = setTimeout(() => {
        this.$emit('save', content)
      }, 1000)
    },
    getContent() {
      return this.editor ? this.editor.state.doc.toString() : ''
    },
    setContent(content) {
      if (this.editor) {
        const transaction = this.editor.state.update({
          changes: {
            from: 0,
            to: this.editor.state.doc.length,
            insert: content
          }
        })
        this.editor.dispatch(transaction)
      }
    },
    destroy() {
      if (this.editor) {
        this.editor.destroy()
      }
      if (this.autoSaveTimeout) {
        clearTimeout(this.autoSaveTimeout)
      }
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