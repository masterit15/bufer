<template>
  <div id="sidebar">
    <div class="logo">
      <img src="../assets/logo.png" alt="logo">
      <h2>BUFER</h2>
    </div>
    <div class="search">
      <i class="fa fa-search"></i>
      <input type="search" name="" v-model="query" id="" placeholder="Поиск">
    </div>
    <ul class="dir_list">
      <li v-for="(departament, index) in departamentList" :key="index" :class="activeDir == departament.id ? 'is_active' : ''" @click="departamentClick(departament)">{{departament.name}}</li>
    </ul>
  </div>
</template>
<script>
import {mapGetters, mapActions} from 'vuex'
export default {
  data() {
    return {
      query: '',
      activeDir: ''
    }
  },
  computed: {
    ...mapGetters(['departaments']),
    departamentList(){
      return this.departaments.filter(departament => {
        return departament.name.toLowerCase().indexOf(this.query.toLowerCase()) > -1;
      })
    },
  },
  mounted() {
    this.getDepartaments()
  },
  methods: {
    ...mapActions(['getDepartaments']),
    departamentClick(departament){
      this.activeDir = departament.id
      this.$emit('content', departament)
    }
  },
}
</script>