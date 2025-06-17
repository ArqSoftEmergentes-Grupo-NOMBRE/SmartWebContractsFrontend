<script>
import {desarrollador, cliente} from "@/assets/roles.js";

export default {
  name: 'navbar',
  props: {
    role: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      desarrollador,
      cliente
    };
  },
}
</script>

<template>
  <div class="flex items-center justify-between bg-[#222] text-white p-4">
    <RouterLink :to="role === cliente?'/clients/dashboard':'/developers/dashboard'" class="hover:text-[#0080ff] flex items-center">
      <img src="/big%20orange.png" alt="Logo" class="w-10 h-10 mr-3">
      <span class="text-xl font-bold">TARKET</span>
    </RouterLink>
    <RouterLink :to="role === cliente?'/clients/profile':'/developers/profile'" class="hover:text-[#0080ff] flex items-center space-x-4">
      <i class="pi pi-user"/>
    </RouterLink>
  </div>
</template>

<style scoped>

</style>