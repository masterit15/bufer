import axios from 'axios'
export default {
  state: {
    users: []
  },
  mutations: {
    set_users(state, users){
      state.users = users
    }
  },
  actions: {
    async getusers({commit}, data = false){
      let res = await axios.get('http://localhost:5050/api/departament', data)
      console.log(res)
      commit('set_users', res.data.users)
    }
  },
  getters:{
    users:state=>state.users
  }
}