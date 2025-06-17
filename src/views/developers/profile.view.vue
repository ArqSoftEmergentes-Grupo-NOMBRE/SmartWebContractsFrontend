<!-- src/views/ProfileView.vue -->
<template>
  <NavbarComponent :role="role"/>
  <section class="bg-black text-white flex justify-center py-16 px-4">
    <div class="w-full max-w-5xl bg-neutral-900 rounded-lg p-8 grid gap-2">
      
      <!-- Avatar -->
      <div class="w-full flex justify-center">
        <img
            :src="user.avatar"
            class="w-40 h-40 rounded-full object-cover border-4 border-neutral-700"
            alt="avatar"
        />
      </div>
      
      <!-- Grid de campos -->
      <div class="grid md:grid-cols-2 gap-2">
        <!-- Columna izquierda -->
        <div class="space-y-6">
          <div
              v-for="item in leftFields"
              :key="item.label"
          >
            <label class="block mb-1 text-sm font-medium">{{ item.label }}</label>
            <InputText
                :modelValue="item.value"
                readonly
                class="w-full h-11 bg-transparent border border-neutral-500 rounded-md px-3 text-white"
            />
          </div>
        </div>
        
        <!-- Columna derecha -->
        <div class="space-y-6">
          <div
              v-for="item in rightFields"
              :key="item.label"
          >
            <label class="block mb-1 text-sm font-medium">{{ item.label }}</label>
            <InputText
                :modelValue="item.value"
                readonly
                class="w-full h-11 bg-transparent border border-neutral-500 rounded-md px-3 text-white"
            />
          </div>
        </div>
      </div>
      
      <!-- Botones -->
      <div class="flex flex-col md:flex-row gap-1 justify-center mt-4">
        <Button
            label="Cerrar Sesión"
            class="flex-1 bg-[#ff7a00] text-black font-semibold border-none h-12"
            @click="logout"
        />
        <Button
            label="Editar perfil"
            class="flex-1 bg-[#ff7a00] text-black font-semibold border-none h-12"
            @click="editProfile"
        />
      </div>
    </div>
  </section>
  
  
  <EditProfile
      v-if="open"
      :user="user"
      @save="applyChanges"
      @close="open = false"
  />
</template>

<script>
import EditProfile from "@/components/developers/edit.profile.vue";
import NavbarComponent from "@/components/navbar.component.vue";

export default {
  name: "ProfileView",
  components: { EditProfile, NavbarComponent },
  props: {
    role: {
      type: Boolean,
      required: true,
    },
    user: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      open: false,
    };
  },
  
  computed: {
    leftFields() {
      return [
        { label: "Nombres",  value: this.user.fullName },
        { label: "Correo",   value: this.user.email },
        { label: "Teléfono", value: this.user.phone },
      ];
    },
    rightFields() {
      return [
        { label: "Especialización",     value: this.user.specialization },
        { label: "Tecnologías",         value: this.user.technologies },
        { label: "Portafolio",          value: this.user.portfolio },
      ];
    },
  },
  
  methods: {
    logout() {
      this.$toast?.add({ severity: "info", summary: "Sesión cerrada", life: 2000 });
      this.$router.push("/login");
      localStorage.removeItem("user");
    },
    editProfile() { this.open = true; },
    applyChanges(updated) { this.user = updated; this.open = false; }
  },
};
</script>

<style scoped>
/* Sin estilos extra: Tailwind + PrimeVue cubren todo */
</style>