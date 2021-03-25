import axios from 'axios'
export default {
  state: {
    departaments: []
  },
  mutations: {
    set_departaments(state, departaments){
      state.departaments = departaments
    }
  },
  actions: {
    async getDepartaments({commit}, data = false){
      let res = await axios.get('http://localhost:5050/api/departament', data)
      commit('set_departaments', res.data.departaments)
    }
  },
  getters:{
    departaments:state=>state.departaments
  }
}