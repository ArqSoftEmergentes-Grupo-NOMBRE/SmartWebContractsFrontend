<!-- src/components/ContractConfirmModal.vue -->
<template>
  <!-- Overlay difuminado -->
  <div
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      @click.self="$emit('cancel')"
  >
    <!-- Ventana -->
    <div class="w-full max-w-3xl bg-neutral-900 text-white rounded-2xl p-8 space-y-8">
      <h2 class="text-2xl font-bold">Confirmación y firma</h2>
      
      <!-- ---------- RESUMEN ---------- -->
      <div class="bg-neutral-800 rounded-lg p-6 leading-relaxed space-y-1">
        <p><span class="font-semibold">Desarrollador:</span> {{ contract.developer.name }}</p>
        <p><span class="font-semibold">Fecha de inicio:</span> {{ startDate }}</p>
        <p><span class="font-semibold">Título:</span> {{ contract.title }}</p>
        <p><span class="font-semibold">Monto total:</span> {{ contract.total }} USDT</p>
        <p><span class="font-semibold">Blockchain:</span> Polygon</p>
      </div>
      
      <!-- ---------- CHECKBOX ---------- -->
      <div class="bg-neutral-800 rounded-lg p-6 space-y-4">
        <p class="font-medium">¿Desea firmar el contrato?</p>
        <div class="flex items-center gap-3">
          <Checkbox v-model="agreed" binary />
          <label class="text-sm cursor-pointer select-none"
          >Confirmo que revisé la información y acepto firmar.</label
          >
        </div>
        
        <Button
            label="Firmar contrato y enviar al desarrollador"
            class="w-full bg-[#ff7a00] text-black font-semibold border-none h-11"
            :disabled="!agreed"
            @click="sign"
        />
      </div>
      
      <!-- ---------- BOTONES INFERIORES ---------- -->
      <div class="flex justify-between pt-4">
        <Button
            label="Cancelar"
            class="bg-[#ff7a00] text-black font-semibold border-none px-6 h-11"
            @click="$emit('cancel')"
        />
        <Button
            label="Siguiente"
            class="bg-[#ff7a00] text-black font-semibold border-none px-6 h-11"
            :disabled="!agreed"
            @click="next"
        />
      </div>
    </div>
  </div>
</template>

<script>
import Button    from "primevue/button";
import Checkbox  from "primevue/checkbox";

export default {
  name: "ContractConfirmModal",
  components: { Button, Checkbox },
  
  props: {
    contract: { type: Object, required: true }, // debe incluir title, developer, total, etc.
  },
  
  data() {
    return { agreed: false };
  },
  
  computed: {
    startDate() {
      const d = new Date();
      return d.toLocaleDateString("es-PE", { day: "2-digit", month: "2-digit", year: "numeric" });
    },
  },
  
  methods: {
    sign() {
      /* aquí invocarías el hash + backend si aplica */
      this.$toast?.add({ severity: "success", summary: "Contrato firmado", life: 2000 });
      this.next();
    },
    next() {
      this.$emit("next"); // avisa al padre que el contrato está firmado y puede avanzar
    },
  },
};
</script>

<style scoped></style>
