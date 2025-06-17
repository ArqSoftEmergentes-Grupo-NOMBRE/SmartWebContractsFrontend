<!-- src/components/ViewSubmissions.vue -->
<template>
  <!-- Overlay -->
  <div
      class="text-white absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      @click.self="$emit('close')"
  >
    <div class="bg-neutral-900 rounded-2xl p-8 w-[90vw] max-w-3xl space-y-6">
      <!-- título del contrato -->
      <h1 class="text-2xl md:text-3xl font-bold text-center">
        {{ viewing.title || `Contrato #${viewing.index}` }}
      </h1>
      
      <p class="text-center">{{viewing.description}}</p>
      
      <!-- estado de carga / error -->
      <div v-if="loading" class="text-center text-neutral-400 py-8">
        Cargando entregas…
      </div>
      <div v-else-if="error" class="text-center text-red-400 py-8">
        {{ error }}
      </div>
      
      <!-- CONTENIDO SOLO CUANDO HAY DATA -->
      <template v-else>
        <!-- navegación de hitos -->
        <div class="flex items-center text-xl font-bold">
          <i
              class="pi pi-chevron-left cursor-pointer"
              v-if="milestoneIndex"
              @click="milestoneIndex--"
          />
          <span class="mx-3">Hito {{ milestoneIndex + 1 }}</span>
          <i
              class="pi pi-chevron-right cursor-pointer"
              v-if="milestoneIndex < maxMilestone"
              @click="milestoneIndex++"
          />
          <span class="ml-auto text-sm text-neutral-400">
            Total: {{ currentSubs.length }} entrega(s)
          </span>
        </div>
        
        <hr class="border-neutral-700" />
        
        <!-- lista -->
        <div
            v-if="currentSubs.length"
            class="space-y-4 max-h-[50vh] overflow-y-auto pr-1"
        >
          <div
              v-for="(s, i) in currentSubs"
              :key="i"
              class="bg-neutral-800 rounded-lg p-4 space-y-2"
          >
            <div class="flex justify-between items-center">
              <a
                  :href="s.submission.url"
                  target="_blank"
                  class="text-[#ff7a00] hover:underline break-all"
              >
                {{ s.submission.url }}
              </a>
              <span
                  :class="[
                  'text-xs font-semibold px-2 py-1 rounded',
                  statusColor(s.submission.status)
                ]"
              >
                {{ s.submission.status }}
              </span>
            </div>
            <p class="text-sm text-neutral-300">
              {{ s.submission.comments }}
            </p>
          </div>
        </div>
        
        <div v-else class="text-center text-neutral-400">
          No hay entregas para este hito.
        </div>
      </template>
      
      <!-- botón cerrar -->
      <Button
          label="Cerrar"
          class="w-full bg-[#ff7a00] text-black font-semibold border-none h-11 mt-4"
          @click="$emit('close')"
      />
    </div>
  </div>
</template>

<script>
import axios  from "axios";
import Button from "primevue/button";

export default {
  name: "ViewSubmissions",
  components: { Button },
  
  /** props:
   *  - index  : número/id del contrato (obligatorio)
   *  - title  : título opcional para mostrar
   *  - apiUrl : raíz del backend (opcional, default localhost)
   */
  props: {
    viewing: { type: Object, required: true },
    apiUrl: { type: String, default: "https://contracts.backend.tarket.site:3029" },
  },
  
  data() {
    return {
      submissions   : [],
      milestoneIndex: 0,
      loading: true,
      error  : "",
    };
  },
  
  computed: {
    maxMilestone() {
      return this.submissions.length
          ? Math.max(...this.submissions.map((s) => s.milestone))
          : 0;
    },
    currentSubs() {
      return this.submissions.filter(
          (s) => s.milestone === this.milestoneIndex
      );
    },
  },
  
  methods: {
    statusColor(s) {
      return s === "Approved"
          ? "bg-green-600"
          : s === "Pending"
              ? "bg-[#ff7a00]"
              : "bg-red-600";
    },
    
    fetchSubs() {
      this.loading = true;
      axios
          .get(`${this.apiUrl}/milestones/${this.viewing.index}`)
          .then((r) => {
            this.submissions   = Array.isArray(r.data) ? r.data : [];
            this.milestoneIndex = 0;
            this.loading = false;
          })
          .catch(() => {
            this.error   = "Error al obtener entregas";
            this.loading = false;
          });
    },
  },
  
  watch: {
    /** vuelve a cargar si cambia el índice que recibe */
    index() { this.fetchSubs(); },
  },
  
  created() { this.fetchSubs(); },
};
</script>

<style scoped>
.max-h-\[50vh\]::-webkit-scrollbar { width: 6px; }
.max-h-\[50vh\]::-webkit-scrollbar-thumb { background: #666; border-radius: 3px; }
</style>