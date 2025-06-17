<!-- src/components/DeveloperPicker.vue -->
<template>
  <!-- Overlay -->
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
       @click.self="$emit('close')">
    
    <!-- Modal -->
    <div class="w-full max-w-4xl bg-neutral-900 text-white rounded-2xl p-8 space-y-6">
      
      <!-- Cabecera -->
      <h2 class="text-2xl font-bold">Buscar desarrollador</h2>
      
      <!-- Barra de búsqueda y botón filtro (solo decorativo) -->
      <div class="flex gap-1">
        <InputText
            v-model="search"
            placeholder="Buscar…"
            class="flex-1 h-11 bg-transparent border border-neutral-500 rounded-md px-3"
        />
        <Button icon="pi pi-filter" label="Filtrar" class="bg-[#ff7a00] text-black border-none h-11 px-4"/>
      </div>
      
      <!-- LISTA -->
      <div class="space-y-4 overflow-y-auto">
        <div
            v-for="dev in paginated"
            :key="dev.id"
            class="flex items-center justify-between bg-neutral-800 rounded-lg p-4"
        >
          <div class="flex flex-col gap-1">
            <span class="font-medium">{{ dev.name }}</span>
            <div class="text-sm flex items-center gap-2 text-neutral-300">
              <i class="pi pi-star text-[#ff7a00]" /> {{ dev.rating }}
              <span class="mx-2 border-l border-neutral-500 h-4"></span>
              {{ dev.contracts }} Contratos
            </div>
          </div>
          
          <Button
              label="Seleccionar"
              class="bg-[#ff7a00] text-black border-none px-4 py-2"
              @click="$emit('select', dev)"
          />
        </div>
      </div>
      
      
      <Paginator :rows="rows" :totalRecords="filtered.length" :first="first" @page="onPage($event)" class="justify-center" :rowsPerPageOptions="[5, 10, 20]" v-if="filtered.length > rows">
        <template #container="{ first, last, page, pageCount, prevPageCallback, nextPageCallback, totalRecords }">
          <div class="flex items-center gap-4 border border-primary bg-transparent rounded-full w-full py-1 px-2 justify-between">
            <Button icon="pi pi-chevron-left" rounded text @click="prevPageCallback" :disabled="page === 0" />
            <div class="text-color font-medium">
              <span class="hidden sm:block text-center">Listando {{ first }} a {{ last }} ({{ totalRecords }} encontrados)</span>
              <span class="block sm:hidden text-center">Página {{ page + 1 }} de {{ pageCount }}</span>
            </div>
            <Button icon="pi pi-chevron-right" rounded text @click="nextPageCallback" :disabled="page === pageCount - 1" />
          </div>
        </template>
      </Paginator>
      
      <div v-if="contract && contract.developer" class="mt-4 p-4 bg-neutral-800 rounded-lg">
        <h3 class="text-lg font-semibold mb-2">Desarrollador seleccionado:</h3>
        <p class="text-sm">{{ contract.developer.name }}</p>
        <p class="text-xs text-neutral-300">{{ contract.developer.rating }} ★</p>
      </div>
      
      <!-- Botones inferiores -->
      <div class="flex justify-between pt-6">
        <Button label="Cancelar" class="bg-[#ff7a00] text-black border-none px-6 h-11"
                @click="$emit('close')" />
        <Button label="Siguiente" class="bg-[#ff7a00] text-black border-none px-6 h-11"
                :disabled="!contract.developer"
                @click="$emit('confirm', contract.developer)" />
      </div>
    </div>
  </div>
</template>

<script>
import InputText  from "primevue/inputtext";
import Button     from "primevue/button";
import Paginator  from "primevue/paginator";

export default {
  name: "DeveloperPicker",
  components: { InputText, Button, Paginator },
  
  props: {
    developers: { type: Array, required: true },
    rows: { type: Number, default: 5 },
    contract: { type: Object, default: null } // para v-model
  },
  
  data() {
    return {
      search : "",
      first  : 0,
      selected: null
    };
  },
  
  computed: {
    filtered() {
      const term = this.search.toLowerCase();
      return this.developers.filter(d => d.name.toLowerCase().includes(term));
    },
    paginated() {
      const start = this.first;
      return this.filtered.slice(start, start + this.rows);
    }
  },
  
  methods: {
    onPage(ev) {
      this.first = ev.first;
    }
  },
  
  watch: {
    // guarda el último seleccionado al pulsar "Seleccionar"
    '$listeners.select'(dev) { this.selected = dev; },
    // actualiza el contrato seleccionado
  }
};
</script>

<style scoped>
/* scrollbar minimal para la lista */
div[h-96]::-webkit-scrollbar {
  width: 6px;
}
div[h-96]::-webkit-scrollbar-thumb {
  background-color: #555;
  border-radius: 3px;
}
</style>