import { createStore } from 'vuex'
import workspace from './modules/workspace'
import content from './modules/content'

export default createStore({
  modules: {
    workspace,
    content,
  }
}) 