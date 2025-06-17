<template>
  <!-- Overlay: oscurece y difumina el fondo -->
  <div
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      @click.self="cancel">
  <!-- Tarjeta -->
  <div
      class="w-full max-w-md bg-neutral-800 text-white rounded-2xl p-8 space-y-6"
  >
    <h2 class="text-center text-2xl font-bold mb-4">Editar Datos del Perfil</h2>
    
    <!-- FORMULARIO -->
    <div class="space-y-5">
      <InputText placeholder="Nombres"            v-model="form.fullName"         class="w-full h-11 bg-transparent border border-neutral-500 rounded-md px-3 text-white"/>
      <InputText placeholder="Correo"             v-model="form.email"            class="w-full h-11 bg-transparent border border-neutral-500 rounded-md px-3 text-white" type="email" />
      <InputText placeholder="Teléfono"           v-model="form.phone"            class="w-full h-11 bg-transparent border border-neutral-500 rounded-md px-3 text-white"/>
      <InputText placeholder="Especialización"    v-model="form.specialization"   class="w-full h-11 bg-transparent border border-neutral-500 rounded-md px-3 text-white"/>
      <InputText placeholder="Tecnologías"        v-model="form.technologies"     class="w-full h-11 bg-transparent border border-neutral-500 rounded-md px-3 text-white"/>
      <InputText placeholder="Portafolio"         v-model="form.portfolio"        class="w-full h-11 bg-transparent border border-neutral-500 rounded-md px-3 text-white"/>
    </div>
    
    <!-- BOTONES -->
    <div class="flex flex-col sm:flex-row gap-1 pt-4">
      <Button
          label="Descartar Cambios"
          class="flex-1 bg-[#ff7a00] text-black font-semibold border-none h-11"
          @click="cancel"
      />
      <Button
          label="Guardar Cambios"
          class="flex-1 bg-[#ff7a00] text-black font-semibold border-none h-11"
          @click="save"
      />
    </div>
  </div>
  </div>
</template>

<script>
import InputText from "primevue/inputtext";
import Button    from "primevue/button";

export default {
  name: "EditProfileModal",
  components: { InputText, Button, Field: {
      /* Campo reutilizable con v-model */
      props: { label: String, modelValue: [String, Number], type: { default: "text" } },
      emits: ["update:modelValue"],
    } },
  props: {
    user: { type: Object, required: true }
  },
  data() {
    // se hace copia para no mutar hasta que se confirme
    return { form: { ...this.user } };
  },
  methods: {
    cancel() {
      this.$emit("close");                // notifica al padre que cierre sin cambios
    },
    save() {
      this.$emit("save", { ...this.form }); // envía nuevo objeto al padre
    }
  }
};
</script>

<style scoped>
/* sin css extra; Tailwind cubre el diseño */
</style>
