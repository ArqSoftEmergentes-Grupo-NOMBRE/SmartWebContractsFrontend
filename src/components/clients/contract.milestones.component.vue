<!-- src/components/ContractMilestonesModal.vue -->
<template>
  <!-- Overlay + blur -->
  <div
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      @click.self="$emit('cancel')"
  >
    <!-- Card -->
    <div class="w-full max-w-4xl bg-neutral-900 text-white rounded-2xl p-8 space-y-8">
      <h2 class="text-2xl font-bold">Definir hitos y pagos</h2>
      
      <!-- Tabla -->
      <div class="bg-neutral-800 rounded-lg p-6 overflow-x-auto">
        <!-- botón añadir -->
        <button
            class="mb-4 flex items-center gap-2 text-[#ff7a00] font-medium hover:underline"
            @click="addRow"
        >
          <i class="pi pi-plus" />
          Añadir hitos +
        </button>
        
        <table class="w-full text-sm whitespace-nowrap">
          <thead>
          <tr class="border-b border-neutral-600 text-left">
            <th class="py-2 px-3 w-12">#</th>
            <th class="py-2 px-3">Nombre del hito</th>
            <th class="py-2 px-3">Fecha límite</th>
            <th class="py-2 px-3">Monto (USDT)</th>
            <th class="py-2 px-3 w-12"></th>
          </tr>
          </thead>
          <tbody>
          <tr
              v-for="(m, i) in milestones"
              :key="i"
              class="border-b border-neutral-700"
          >
            <td class="py-2 px-3">{{ i + 1 }}</td>
            
            <!-- Nombre -->
            <td class="py-2 px-3">
              <InputText
                  v-model="m.name"
                  class="w-full bg-transparent border border-neutral-500 rounded-md px-2 h-9"
              />
            </td>
            
            <!-- Fecha -->
            <td class="py-2 px-3">
              <Calendar
                  v-model="m.deadline"
                  date-format="dd/mm/yy"
                  showIcon
                  class="w-full h-9"
              />
            </td>
            
            <!-- Monto -->
            <td class="py-2 px-3">
              <InputNumber
                  v-model="m.amount"
                  :min="0"
                  :mode="'decimal'"
                  class="w-full h-9"
              />
            </td>
            
            <!-- Eliminar -->
            <td class="py-2 px-3">
              <Button
                  icon="pi pi-trash"
                  class="p-0 w-9 h-9 bg-red-600 border-none"
                  @click="removeRow(i)"
              />
            </td>
          </tr>
          <tr v-if="milestones.length === 0">
            <td colspan="5" class="py-4 text-center text-neutral-400">
              Sin hitos añadidos
            </td>
          </tr>
          </tbody>
        </table>
        
        <!-- total -->
        <p class="mt-6 font-medium">
          Total del contrato:
          <span class="text-[#ff7a00]">{{ total.toLocaleString() }} USDT</span>
        </p>
      </div>
      
      <!-- botones -->
      <div class="flex justify-between pt-2">
        <Button
            label="Cancelar"
            class="bg-[#ff7a00] text-black font-semibold border-none px-6 h-11"
            @click="$emit('cancel')"
        />
        <Button
            label="Siguiente"
            class="bg-[#ff7a00] text-black font-semibold border-none px-6 h-11"
            :disabled="!canContinue"
            @click="next"
        />
      </div>
    </div>
  </div>
</template>

<script>
import Button       from "primevue/button";
import InputText    from "primevue/inputtext";
import Calendar     from "primevue/calendar";
import InputNumber  from "primevue/inputnumber";

export default {
  name: "ContractMilestonesModal",
  components: { Button, InputText, Calendar, InputNumber },
  
  props: {
    contract: { type: Object, required: true }, // paso previo
  },
  
  data() {
    return {
      milestones: this.contract.milestones?this.contract.milestones:[], // { name, deadline, amount }
    };
  },
  
  computed: {
    total() {
      return this.milestones.reduce((sum, m) => sum + (Number(m.amount) || 0), 0);
    },
    canContinue() {
      if (this.milestones.length === 0) return false;
      return this.milestones.every(
          (m) => m.name && m.deadline && m.amount > 0
      );
    },
  },
  
  methods: {
    addRow() {
      this.milestones.push({ name: "", deadline: null, amount: null });
    },
    removeRow(i) {
      this.milestones.splice(i, 1);
    },
    next() {
      this.$emit("save", {
        ...this.contract,
        milestones: this.milestones,
        total: this.total,
      });
    },
  },
};
</script>

<style scoped>
/* sin css adicional */
</style>