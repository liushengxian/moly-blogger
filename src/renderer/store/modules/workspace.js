import { createStore } from 'vuex'

const state = {
  workspacePath: '',
  currentFile: null,
  currentContent: ''
}

const mutations = {
  SET_WORKSPACE_PATH(state, path) {
    state.workspacePath = path
  },
  SET_CURRENT_FILE(state, file) {
    state.currentFile = file
  },
  SET_CURRENT_CONTENT(state, content) {
    state.currentContent = content
  }
}

const actions = {
  setWorkspacePath({ commit }, path) {
    commit('SET_WORKSPACE_PATH', path)
  },

  async openFile({ commit }, { path, content }) {
    commit('SET_CURRENT_FILE', path)
    commit('SET_CURRENT_CONTENT', content)
  }
}

const getters = {
  workspacePath: state => state.workspacePath,
  currentFile: state => state.currentFile,
  currentContent: state => state.currentContent
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
} 