<script>
import { RouterLink, RouterView } from 'vue-router'
import {desarrollador, cliente} from "@/assets/roles.js";
export default {
  name: 'App',
  components: { RouterLink, RouterView },
  data(){
    return {
      role: false,
      user: null,
    }
  },
  methods: {
    login(user) {
      this.$toast.add({
        severity: 'success',
        summary: `Bienvenido ${user.user.fullName}`,
        life: 2000
      });
      console.log('Usuario autenticado:', user);
      localStorage.setItem('user', JSON.stringify(user));
      
      this.role = user.user.role;
      this.user = user.user;
      
      if(this.role === cliente) this.$router.push('/clients/dashboard');
      else this.$router.push('/developers/dashboard');
    }
  },
  created() {
    if(!localStorage.getItem('user')) {
      this.$router.push('/login');
    } else {
      const user = JSON.parse(localStorage.getItem('user'));
      this.login(user);
    }
  }
}
</script>

<template>
  <Toast/>
  <div class="min-h-screen bg-black">
    <RouterView @login="login" :role="role" :user="user"/>
  </div>
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}
</style>
