<script>
import axios from "axios";

export default {
  name: "LoginView",
  data() {
    return {
      email: "",
      password: ""
    };
  },
  methods: {
    async login() {
      /* Validación rápida */
      if (!this.email || !this.password) {
        this.$toast.add({
          severity: "warn",
          summary : "Completa los campos",
          life    : 3000
        });
        return;
      }
      
      axios.post('https://contracts.backend.tarket.site:3029/auth/login', {
        email   : this.email,
        password: this.password
      }).then(response => {
        // Aquí podrías guardar el token o usuario en un store o localStorage
        this.$emit("login", response.data);
      }).catch(error =>{
        this.$toast.add({
          severity: "error",
          summary : "Credenciales inválidas",
          life    : 3000
        })
      });
    }
  }
};
</script>

<template>
  <section class="min-h-screen flex">
    <!-- ----- Lado izquierdo (icono grande) ----- -->
    <div class="hidden md:flex w-1/2 bg-neutral-900 items-center justify-center">
      <!-- SVG  (puedes reemplazar por <img src="@/assets/logo-big.svg" />) -->
      <img src="/big%20orange.png" class="mr-3" alt="">
    </div>
    
    <!-- ----- Lado derecho (formulario) ----- -->
    <div class="flex flex-col w-full md:w-1/2 bg-black text-white justify-center items-center px-8 py-12">
      <!-- Logo compacto -->
      <div class="flex items-center mb-12">
        <img src="/big%20orange.png" class="mr-3" alt="" style="width: 60px; height: 60px;">
        <span class="text-4xl font-extrabold text-[#0080ff] tracking-wide">TARKET</span>
      </div>
      
      <form @submit.prevent="login" class="w-full max-w-md space-y-6">
        <!-- Correo -->
        <div class="flex flex-col">
          <label class="mb-1 text-sm font-medium">Correo</label>
          <InputText v-model="email" type="email" class="w-full h-11 bg-transparent border border-neutral-500 rounded-md px-3 text-white focus:border-[#ff7a00]" />
        </div>
        
        <!-- Contraseña -->
        <div class="flex flex-col">
          <label class="mb-1 text-sm font-medium">Contraseña</label>
          <InputText v-model="password" type="password" class="w-full h-11 bg-transparent border border-neutral-500 rounded-md px-3 text-white focus:border-[#ff7a00]" />
        </div>
        
        <!-- Botón ingresar -->
        <Button type="submit" label="Ingresar" class="w-full h-11 bg-[#ff7a00] text-black font-semibold text-lg border-none rounded-md hover:opacity-90" />
      </form>
      
      <!-- Enlace registro -->
      <router-link to="/register" class="mt-10 text-sm text-neutral-300 hover:underline">
        ¿No tienes una cuenta?
      </router-link>
    </div>
  </section>
</template>

<style scoped>

</style>