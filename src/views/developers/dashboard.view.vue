<template>
  <Navbar :role="role" />

  <section class="bg-black text-white p-8">
    <div class="flex flex-wrap gap-4 justify-center">
      <div
          v-for="(c, index) in contracts"
          :key="c.id"
          class="w-72 flex flex-col rounded-lg overflow-hidden bg-neutral-900 shadow"
      >
        <div class="p-6 text-center space-y-4 flex-1 flex flex-col">
          <h2 class="text-xl font-bold">
            Contrato {{ c.id?.slice(0, 6) || "Sin ID" }}
          </h2>

          <div class="text-sm">
            <p class="text-neutral-400">Desarrollador</p>
            <p class="font-medium">
              {{ c.developerId?.slice(0, 8) || "No hay desarrollador" }}
            </p>
          </div>

          <div class="text-xs text-neutral-400">
            <p>Inicio: {{ formatDate(c.fechaInicio) }}</p>
            <p>Fin: {{ formatDate(c.fechaFin) }}</p>
          </div>

          <a
              v-if="c.contractExplorerUrl"
              :href="c.contractExplorerUrl"
              target="_blank"
              class="text-sm text-[#00ccff] underline"
          >
            Ver en Etherscan
          </a>

          <div class="flex flex-col gap-2 mt-auto">
            <Button
                label="Ver detalles"
                class="w-full bg-[#ff7a00] border-none px-4 py-2 text-sm font-semibold"
                @click="viewing = { ...c, index }"
            />
            <template v-if="c.status === 'CREADO'">
              <Button
                  label="Aceptar"
                  class="w-full bg-green-600 border-none px-4 py-2 text-sm font-semibold"
                  @click="updateContractStatus(c.id, 'APROBADO')"
              />
              <Button
                  label="Rechazar"
                  class="w-full bg-red-600 border-none px-4 py-2 text-sm font-semibold"
                  @click="updateContractStatus(c.id, 'RECHAZADO')"
              />
            </template>
            <template v-if="c.status === 'APROBADO' && Array.isArray(c.entregables)">
              <template v-for="entregable in c.entregables" :key="entregable?.id">
                <Button
                    v-if="!entregable?.archivoEntregadoURL"
                    label="Subir Entrega"
                    class="w-full bg-[#ff7a00] border-none px-4 py-2 text-sm font-semibold"
                    @click="submitting = { entregable, contractId: c.id }"
                />
              </template>
            </template>
          </div>


        </div>

        <div :class="['text-center py-2 font-semibold', statusColor(c.status)]">
          {{ c.status }}
        </div>
      </div>

      <div v-if="contracts === null" class="text-center text-neutral-500 w-full">
        <ProgressSpinner />
        <div>Cargando contratos...</div>
      </div>

      <div v-else-if="Array.isArray(contracts) && contracts.length === 0" class="text-center text-neutral-500 w-full">
        No tienes contratos registrados.
      </div>
    </div>

    <SubmitComponent
        v-if="submitting"
        :entregable="submitting.entregable"
        :contractId="submitting.contractId"
        @cancel="submitting = null"
        @send="submitDelivery"
    />


    <ViewSubmissions
        v-if="viewing"
        @close="viewing = null"
        :viewing="viewing"
    />
  </section>
</template>

<script>
import axios from "axios";
import Navbar from "@/components/navbar.component.vue";
import SubmitComponent from "@/components/developers/submit.component.vue";
import ViewSubmissions from "@/components/clients/submission.component.vue";

export default {
  name: "DashboardView",
  components: { Navbar, SubmitComponent, ViewSubmissions },
  props: {
    role: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      contracts: null,
      submitting: null,
      viewing: null,
    };
  },
  created() {
    this.getContracts();
  },
  methods: {
    getContracts() {
      axios
          .get("http://localhost:8080/api/contracts")
          .then((response) => {
            console.log("[DEBUG] Respuesta del backend:", response.data);
            this.contracts = Array.isArray(response.data)
                ? response.data.filter((c) => c && c.id)
                : [];
          })
          .catch((error) => {
            console.error("Error al cargar los contratos:", error);
            this.$toast.add({
              severity: "error",
              summary: "Error al cargar contratos",
              detail: "No se pudieron obtener los contratos.",
              life: 3000,
            });
          });
    },
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
        case "CREADO":
          return "bg-[#0080ff]";
        case "ACTIVO":
          return "bg-[#ff7a00]";
        case "FINALIZADO":
          return "bg-green-600";
        case "CANCELADO":
          return "bg-red-600";
        default:
          return "bg-neutral-700";
      }
    },
    submitDelivery(payload) {
      const { entregableId, contractId, url, comments, final } = payload;

      axios
          .put(`http://localhost:8080/api/contracts/${contractId}/deliverables/${entregableId}/submission`, {
            archivoEntregadoURL: url,
            descripcion: comments, // ✅ correcto ahora
            estado: "ENTREGADO",   // ✅ siempre marcar como entregado
          })
          .then(() => {
            this.$toast.add({
              severity: "success",
              summary: "Entrega enviada",
              detail: "El entregable ha sido actualizado correctamente.",
              life: 2500,
            });
            this.submitting = null;
            this.getContracts(); // Refrescar contratos
          })
          .catch((error) => {
            console.error(error);
            this.$toast.add({
              severity: "error",
              summary: "Error al subir entrega",
              detail: "No se pudo enviar el entregable.",
              life: 3000,
            });
          });
    },

    updateContractStatus(contractId, status) {
      axios
          .put(`http://localhost:8080/api/contracts/${contractId}/status`, null, {
            params: { status },
          })
          .then(() => {
            this.$toast.add({
              severity: "success",
              summary: `Contrato ${status}`,
              detail: `El contrato ha sido ${status.toLowerCase()}`,
              life: 2500,
            });
            this.getContracts(); // recargar lista
          })
          .catch(() => {
            this.$toast.add({
              severity: "error",
              summary: "Error al actualizar estado",
              detail: "No se pudo cambiar el estado del contrato.",
              life: 3000,
            });
          });
    }

  },
};
</script>

<style scoped>
/* Tailwind + PrimeVue cubren estilos */
</style>
