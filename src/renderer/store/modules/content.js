const state = {
  initialContent: "# Welcome to Moly Blogger\n\nStart writing your blog post here..."
}

const getters = {
  initialContent: (state) => state.initialContent
}

const mutations = {
  setInitialContent(state, content) {
    state.initialContent = content
  }
}

const actions = {
  async loadContent({ commit }, filePath) {
    try {
      const content = await window.workspace.readFile(filePath)
      commit('setInitialContent', content)
    } catch (error) {
      console.error('Failed to load file content:', error)
    }
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}