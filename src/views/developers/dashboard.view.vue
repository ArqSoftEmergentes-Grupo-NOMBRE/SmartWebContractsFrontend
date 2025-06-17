<!-- src/views/DashboardView.vue -->
<template>
  <Navbar :role="role"/>
  
  <!-- ---------- LISTA DE CONTRATOS ---------- -->
  <section class="bg-black text-white p-8">
    <div class="flex flex-wrap gap-2 justify-center">
      <div
          v-for="(c, index) in contracts"
          :key="c.id"
          class="w-72 flex flex-col rounded-lg overflow-hidden bg-neutral-900"
          v-if="contracts && contracts.length"
      >
        <div class="p-8 text-center space-y-6 flex-1 flex flex-col">
          <h2 class="text-2xl font-bold">{{ c.title }}</h2>
          
          <div class="text-sm">
            <p class="text-neutral-400">Desarrollador</p>
            <p class="font-medium">{{ c.developer?c.developer.name:"No hay un desarrollador asociado" }}</p>
          </div>
          
          <p class="mt-auto text-sm">{{ c.date }}</p>
          
          <div class="flex justify-center gap-1">
            <Button label="Ver detalles" class="bg-[#ff7a00] border-none px-4 py-2 text-sm font-semibold" @click="viewing = {...c, index}"/>
            <Button v-if="c.status === 'Activo'"
                    @click="submitting = {...c, index}"
                label="Subir Entrega"
                class="bg-[#ff7a00] border-none px-4 py-2 text-sm font-semibold"
            />
          </div>
        </div>
        
        <div :class="['text-center py-3 font-semibold', statusColor(c.status)]">
          {{ c.status }}
        </div>
      </div>
      <div v-else-if="contracts" class="text-center text-neutral-500 w-full">
        No tienes contratos activos.
      </div>
      <div v-else class="text-center text-neutral-500 w-full">
        <ProgressSpinner/>
        <div>Cargando contratos...</div>
      </div>
    </div>
    <SubmitComponent v-if="submitting" @cancel="submitting = null" :submitting="submitting" @send="submitDelivery"/>
    <ViewSubmissions v-if="viewing" @close="viewing = null" :viewing="viewing"/>
  </section>
</template>

<script>
import axios from "axios";
import Navbar from "@/components/navbar.component.vue";
import SubmitComponent from "@/components/developers/submit.component.vue";
import ViewSubmissions from "@/components/clients/submission.component.vue";

export default {
  name: "DashboardView",
  components: {Navbar, SubmitComponent, ViewSubmissions },
  props: {
    role: {
      type: Boolean,
      required: true,
    }
  },
  data() {
    return {
      /* contratos existentes */
      contracts: null,
      submitting: null,
      viewing: null,
    };
  },
  created() {
    /* Cargar contratos desde el backend */
    this.getContracts();
  },
  methods: {
    /* ---------- helpers ---------- */
    statusColor(status) {
      switch (status) {
        case "Activo":    return "bg-[#ff7a00]";
        case "Pendiente": return "bg-[#0080ff]";
        case "Cancelado": return "bg-red-600";
        default:          return "bg-neutral-700";
      }
    },
    getContracts() {
      axios.get("https://contracts.backend.tarket.site:3029/chain")
      .then(response => {
        this.contracts = response.data.map((x) => x.contract.data);
      })
      .catch(error => {
        console.error("Error al cargar los contratos:", error);
        this.$toast.add({
          severity: "error",
          summary: "Error al cargar contratos",
          detail: "No se pudieron obtener los contratos.",
          life: 3000,
        });
      });
    },
    cancelContract() {
      this.contract.step = 0;
    },
    
    submitDelivery(payload) {
      const url = `https://contracts.backend.tarket.site:3029/milestones/${this.submitting.index}`;
      console.log(url)
      
      axios.post(url, {
        milestone : payload.milestone,
        submission: {
          url     : payload.url,
          status  : payload.status,
          comments: payload.comments,
        },
      })
      .then(() => {
        this.$toast.add({
          severity: "success",
          summary : "Entrega enviada",
          life    : 2500,
        });
        this.submitting = null;   // cierra modal
      })
      .catch(() => {
        this.$toast.add({
          severity: "error",
          summary : "Error al enviar",
          life    : 3000,
        });
      });
    },
  },
};
</script>

<style scoped>
/* Tailwind + PrimeVue cubren estilos */
</style>