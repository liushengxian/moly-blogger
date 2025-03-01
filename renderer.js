import { MarkdownEditor } from './src/enhanced-editor.js';

const information = document.getElementById('info')
information.innerText = `本应用正在使用 Chrome (v${versions.chrome()}), Node.js (v${versions.node()}), 和 Electron (v${versions.electron()})`

const func = async () => {
  const response = await window.versions.ping()
  console.log(response) // 打印 'pong'
}

func()

// Wait for the DOM to be loaded
document.addEventListener('DOMContentLoaded', () => {
  // Initialize the editor
  const editor = new MarkdownEditor(document.getElementById('editor'), {
    initialContent: "# Welcome to Moly Blogger\n\nStart writing your blog post here...",
    autosave: true,
    onChange: (content) => {
      console.log('Content changed:', content);
      // You can add local storage saving here if needed
    },
    onSave: (content) => {
      console.log('Auto-saving content:', content);
      // Implement your save logic here
    }
  });

  // Handle publish button click
  const publishButton = document.querySelector('.button.is-primary');
  publishButton.addEventListener('click', () => {
    const content = editor.getContent();
    console.log('Publishing content:', content);
    // Implement your publish logic here
  });
});


