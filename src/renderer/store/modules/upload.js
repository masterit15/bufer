import axios from 'axios'
export default {
  state: {
    // departaments: []
  },
  mutations: {
    // set_departaments(state, departaments){
    //   state.departaments = departaments
    // }
  },
  actions: {
    async upload({commit}, data = false){
      let formData = new FormData();
      formData.append("files", data);
      axios.post('http://localhost:5050/api/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
      })
    }
  },
  getters:{
    // departaments:state=>state.departaments
  }
}