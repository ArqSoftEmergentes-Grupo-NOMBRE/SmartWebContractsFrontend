<template>
  <div
      class="text-white absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      @click.self="$emit('close')"
  >
    <div class="bg-neutral-900 rounded-2xl p-8 w-[90vw] max-w-3xl space-y-6">
      <h1 class="text-2xl md:text-3xl font-bold text-center">
        Contrato #{{ viewing.index }}
      </h1>

      <!-- Navegación -->
      <div class="flex items-center text-xl font-bold">
        <i
            class="pi pi-chevron-left cursor-pointer"
            v-if="milestoneIndex > 0"
            @click="milestoneIndex--"
        />
        <span class="mx-3">Hito {{ milestoneIndex + 1 }}</span>
        <i
            class="pi pi-chevron-right cursor-pointer"
            v-if="milestoneIndex < viewing.entregables.length - 1"
            @click="milestoneIndex++"
        />
        <span class="ml-auto text-sm text-neutral-400">
          Total: {{ viewing.entregables.length }} entregable(s)
        </span>
      </div>

      <hr class="border-neutral-700" />

      <!-- Entregable actual -->
      <div v-if="currentMilestone" class="space-y-2">
        <div class="bg-neutral-800 rounded-lg p-4">
          <div class="flex justify-between items-center mb-2">
            <span class="text-[#ff7a00] font-semibold">{{ currentMilestone.titulo }}</span>
            <span :class="['text-xs font-semibold px-2 py-1 rounded', statusColor(currentMilestone.estado)]">
              {{ currentMilestone.estado }}
            </span>
          </div>
          <p class="text-sm text-neutral-300 mb-2">{{ currentMilestone.descripcion }}</p>

          <p class="text-xs text-neutral-400">
            Fecha esperada: {{ formatDate(currentMilestone.fechaEntregaEsperada) }}
          </p>

          <div v-if="currentMilestone.archivoEntregadoURL" class="mt-2">
            <a :href="currentMilestone.archivoEntregadoURL" class="text-[#00ccff] text-sm underline" target="_blank">
              Ver archivo entregado
            </a>
          </div>
        </div>
      </div>

      <div v-else class="text-center text-neutral-400">
        No hay entregables en este contrato.
      </div>

      <Button
          label="Cerrar"
          class="w-full bg-[#ff7a00] text-black font-semibold border-none h-11 mt-4"
          @click="$emit('close')"
      />
    </div>
  </div>
</template>

<script>
import Button from "primevue/button";

export default {
  name: "ViewSubmissions",
  components: { Button },
  props: {
    viewing: { type: Object, required: true },
  },
  data() {
    return {
      milestoneIndex: 0,
    };
  },
  computed: {
    currentMilestone() {
      return this.viewing.entregables?.[this.milestoneIndex] || null;
    },
  },
  methods: {
    formatDate(dateStr) {
      if (!dateStr) return "—";
      const d = new Date(dateStr);
      return d.toLocaleDateString("es-PE", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    },
    statusColor(status) {
      switch (status) {
        case "PENDIENTE":
          return "bg-[#ff7a00]";
        case "ENTREGADO":
          return "bg-blue-600";
        case "APROBADO":
          return "bg-green-600";
        case "RECHAZADO":
          return "bg-red-600";
        default:
          return "bg-neutral-600";
      }
    },
  },
};
</script>

<style scoped>
.max-h-\[50vh\]::-webkit-scrollbar { width: 6px; }
.max-h-\[50vh\]::-webkit-scrollbar-thumb { background: #666; border-radius: 3px; }
</style>
