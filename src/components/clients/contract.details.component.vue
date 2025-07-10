<template>
  <!-- FONDO DIFUMINADO -->
  <div
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      @click.self="$emit('cancel')"
  >
    <!-- VENTANA -->
    <div class="w-full max-w-3xl bg-neutral-900 text-white rounded-2xl p-8 space-y-8">
      <h2 class="text-2xl font-bold">Detalles de contrato</h2>

      <!-- ---------- FORMULARIO ---------- -->
      <div class="space-y-6">
        <!-- Título -->
        <div>
          <label class="block mb-1 text-sm font-medium">Título del proyecto</label>
          <InputText
              v-model="form.title"
              class="w-full h-11 bg-transparent border border-neutral-500 rounded-md px-3"
          />
        </div>

        <!-- Descripción -->
        <div>
          <label class="block mb-1 text-sm font-medium">Descripción del proyecto</label>
          <InputTextarea
              v-model="form.description"
              rows="4"
              autoResize
              class="w-full bg-transparent border border-neutral-500 rounded-md px-3 py-2"
          />
        </div>

        <!-- Archivos -->
        <div>
          <label class="block mb-2 text-sm font-medium">
            URL de los Archivos de referencia
            <span class="text-neutral-400">(Opcional)</span>
          </label>
          <InputText
              v-model="form.url"
              class="w-full h-11 bg-transparent border border-neutral-500 rounded-md px-3"
          />
        </div>
      </div>

      <!-- ---------- BOTONES ---------- -->
      <div class="flex justify-between pt-4">
        <Button
            label="Cancelar"
            class="bg-[#ff7a00] text-black font-semibold border-none px-6 h-11"
            @click="$emit('cancel')"
        />
        <Button
            label="Siguiente"
            class="bg-[#ff7a00] text-black font-semibold border-none px-6 h-11"
            :disabled="!form.title || !form.description"
            @click="nextStep"
        />
      </div>
    </div>
  </div>
</template>

<script>
import InputText     from "primevue/inputtext";
import InputTextarea from "primevue/textarea";
import FileUpload    from "primevue/fileupload";
import Button        from "primevue/button";

export default {
  name: "ContractDetailsModal",
  components: { InputText, InputTextarea, FileUpload, Button },

  props: {
    contract: { type: Object, required: true }, // objeto de creación recibido del padre
  },

  data() {
    return {
      // copia local para editar hasta confirmar
      form: {
        title:       this.contract.title       || "",
        description: this.contract.description || "",
        url:         this.contract.url         || "",
      },
    };
  },

  methods: {
    nextStep() {
      // envía los datos al padre y avanza
      this.$emit("save", {
        ...this.contract,
        ...this.form,
      });
    },
  },
};
</script>

<style scoped>
/* sin estilos extra; Tailwind + PrimeVue cubren el diseño */
</style>