<script>
import axios from "axios";
import InputText from "primevue/inputtext";
import Button    from "primevue/button";
import roles, {cliente, desarrollador} from "@/assets/roles.js";
export default {
  name: "RegisterView",
  components: { InputText, Button },
  
  data() {
    return {
      fullName: "",
      email   : "",
      password: "",
      role    : undefined,
      avatar  : "https://randomuser.me/api/portraits/men/75.jpg",
      phone   : "",
      linkedin: "",
      
      // solo para cliente
      wallet  : "",
      
      // solo para desarrollador
      specialization: "",
      technologies:   "",
      portfolio:      "",
      
      roles,
      cliente,
      desarrollador,
    };
  },
  
  methods: {
    async register() {
      if (!this.fullName || !this.email || !this.password || this.role === undefined) {
        this.$toast.add({
          severity: "warn",
          summary : "Completa los campos",
          life    : 3000
        });
        return;
      }
      
      // Ejemplo backend:
      // await axios.post("/api/register", { fullName: this.fullName, email: this.email, password: this.password, role: this.role });
      axios.post("https://contracts.backend.tarket.site:3029/auth/register", {
        fullName: this.fullName,
        email   : this.email,
        password: this.password,
        role    : this.role,
        avatar  : this.avatar,
        phone   : this.phone,
        linkedin: this.linkedin,
        wallet  : "Wallet conectada: " + this.wallet,
        specialization: this.specialization,
        technologies: this.technologies,
        portfolio: this.portfolio,
      }).then(response => {
        this.$emit("login", response.data);
      }).catch(error=>{
        if(error.response && error.response.data){
          this.$toast.add({
            severity: "error",
            summary : error.response.data.error || "Error al registrar",
            life    : 3000
          });
        } else {
          this.$toast.add({
            severity: "error",
            summary : "Error de conexión",
            life    : 3000
          });
        }
      })
    }
  }
};
</script>

<template>
  <section class="min-h-screen flex">
    <div class="flex flex-col w-full md:w-1/2 bg-black text-white justify-center items-center px-8 py-12">
      <!-- logo -->
      <div class="flex items-center mb-12">
        <!-- tiny icon -->
        <img src="/big%20blue.png" class="mr-3" alt="" style="width: 60px; height: 60px;">
        <span class="text-4xl font-extrabold text-[#0080ff] tracking-wide">TARKET</span>
      </div>
      
      <form @submit.prevent="register" class="w-full max-w-md space-y-6">
        <!-- Nombres -->
        <div>
          <label class="mb-1 text-sm font-medium block">Nombres</label>
          <InputText v-model="fullName" class="w-full h-11 bg-transparent border border-neutral-500 rounded-md px-3 text-white focus:border-[#ff7a00]" />
        </div>
        
        <!-- Correo -->
        <div>
          <label class="mb-1 text-sm font-medium block">Correo</label>
          <InputText v-model="email" type="email" class="w-full h-11 bg-transparent border border-neutral-500 rounded-md px-3 text-white focus:border-[#ff7a00]" />
        </div>
        
        <!-- Contraseña -->
        <div>
          <label class="mb-1 text-sm font-medium block">Contraseña</label>
          <InputText v-model="password" type="password" class="w-full h-11 bg-transparent border border-neutral-500 rounded-md px-3 text-white focus:border-[#ff7a00]" />
        </div>
        
        <!-- Rol -->
        <div>
          <label class="mb-1 text-sm font-medium block">Rol</label>
          <Select v-model="role" class="w-full h-11 bg-transparent border border-neutral-500 rounded-md px-3 text-white focus:border-[#ff7a00]" :options="roles" option-label="label" option-value="value"/>
        </div>
        
        <!-- Teléfono -->
        <div>
          <label class="mb-1 text-sm font-medium block">Teléfono (opcional)</label>
          <InputText v-model="phone" class="w-full h-11 bg-transparent border border-neutral-500 rounded-md px-3 text-white focus:border-[#ff7a00]" v-keyfilter.int/>
        </div>
        
        <!-- LinkedIn -->
        <div>
          <label class="mb-1 text-sm font-medium block">LinkedIn (opcional)</label>
          <InputText v-model="linkedin" class="w-full h-11 bg-transparent border border-neutral-500 rounded-md px-3 text-white focus:border-[#ff7a00]" />
        </div>
        
        <!-- Wallet -->
        <div v-if="role === cliente">
          <label class="mb-1 text-sm font-medium block">Wallet (opcional)</label>
          <InputText v-model="wallet" class="w-full h-11 bg-transparent border border-neutral-500 rounded-md px-3 text-white focus:border-[#ff7a00]" />
        </div>
        
        <!-- Especialización -->
        <div v-if="role === desarrollador">
          <label class="mb-1 text-sm font-medium block">Especialización (opcional)</label>
          <InputText v-model="specialization" class="w-full h-11 bg-transparent border border-neutral-500 rounded-md px-3 text-white focus:border-[#ff7a00]" />
        </div>
        
        <!-- Tecnologías -->
        <div v-if="role === desarrollador">
          <label class="mb-1 text-sm font-medium block">Tecnologías (opcional)</label>
          <InputText v-model="technologies" class="w-full h-11 bg-transparent border border-neutral-500 rounded-md px-3 text-white focus:border-[#ff7a00]" />
        </div>
        
        <!-- Portafolio -->
        <div v-if="role === desarrollador">
          <label class="mb-1 text-sm font-medium block">Portafolio (opcional)</label>
          <InputText v-model="portfolio" class="w-full h-11 bg-transparent border border-neutral-500 rounded-md px-3 text-white focus:border-[#ff7a00]" />
        </div>
        
        <!-- Botón registrar -->
        <Button label="Ingresar" type="submit" class="w-full h-11 bg-[#ff7a00] text-black font-semibold text-lg border-none rounded-md hover:opacity-90" />
      </form>
      
      <!-- link a login -->
      <router-link to="/login" class="mt-10 text-sm text-neutral-300 hover:underline">
        ¿Ya tienes una cuenta?
      </router-link>
    </div>
    
    <!-- -------- LADO DERECHO (icono grande) -------- -->
    <div class="hidden md:flex w-1/2 bg-neutral-900 items-center justify-center">
      <img src="/big%20blue.png" class="mr-3" alt="">
    </div>
  </section>
</template>

<style scoped>
/* Nada extra; Tailwind + PrimeVue cubren los estilos */
</style>