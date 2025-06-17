<!-- src/views/DashboardView.vue -->
<template>
  <Navbar :role="role"/>
  
  <!-- ---------- LISTA DE CONTRATOS ---------- -->
  <section class="bg-black text-white p-8">
    <div class="flex flex-wrap gap-2 justify-center">
      <div
          v-for="c in contracts"
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
            <Button label="Ver detalles" class="bg-[#ff7a00] border-none px-4 py-2 text-sm font-semibold" />
            <Button v-if="c.status === 'Activo'"
                label="Ver Entrega"
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
      
      
      
      <div class="text-center text-neutral-500 w-full text-button" @click="getContracts">
        <i class="pi pi-refresh"/> Actualizar contratos
      </div>
    </div>
    
    <!-- ---------- BOTÓN NUEVO CONTRATO ---------- -->
    <div class="mt-8 flex justify-center">
      <Button
          icon="pi pi-plus"
          label="Crear nuevo contrato"
          class="bg-[#ff7a00] border-none px-6 py-3 text-lg font-semibold"
          @click="newContract"
      />
    </div>
  </section>
  
  <!-- ---------- PASO 1 · SELECCIONAR DESARROLLADOR ---------- -->
  <DeveloperPicker
      v-if="contract.step === 1"
      :developers="developers"
      :contract="contract"
      @select="selectDeveloper"
      @confirm="confirmDeveloper"
      @close="cancelContract"
  />
  <ContractDetailsModal
      v-if="contract.step === 2"
      :contract="contract"
      @save="saveDetails"
      @cancel="cancelContract"
  />
  <ContractMilestonesModal
      v-if="contract.step === 3"
      :contract="contract"
      @save="confirmMilestones"
      @cancel="cancelContract"
  />
  <ContractConfirmComponent
      :contract="contract"
      v-if="contract.step === 4"
      @cancel="cancelContract"
      @next="saveNewContract"/>
</template>

<script>
import axios from "axios";
import DeveloperPicker from "@/components/clients/developer.picker.component.vue";
import ContractDetailsModal from "@/components/clients/contract.details.component.vue";
import ContractConfirmComponent from "@/components/clients/contract.confirm.component.vue";
import ContractMilestonesModal from "@/components/clients/contract.milestones.component.vue";
import ViewSubmissions from "@/components/clients/submission.component.vue";
import Navbar from "@/components/navbar.component.vue";

function getDefaultContract() {
  return { step: 0, title: "", description: "", developer: null, url: "", status: "Activo", date: new Date().toLocaleDateString() };
}

export default {
  name: "DashboardView",
  components: {Navbar, DeveloperPicker, ContractDetailsModal, ContractConfirmComponent, ContractMilestonesModal, ViewSubmissions },
  props: {
    role: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      /* contratos existentes */
      contracts: null,
      
      /* lista de devs para el picker */
      developers: [
        { id: 101, name: "Javier Carlos Pachas Torres", rating: 4.8, contracts: 12 },
        { id: 102, name: "María López",                 rating: 4.9, contracts:  8 },
        { id: 103, name: "Pedro Ramírez",               rating: 4.7, contracts: 15 },
        // …cargar desde API en producción
      ],
      
      /* contrato en creación; step 0 = oculto, 1 = elegir dev */
      contract: localStorage.getItem("contract")?
        JSON.parse(localStorage.getItem("contract")) :
        getDefaultContract(),
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
    
    /* ---------- flujo creación ---------- */
    cancelContract() {
      this.contract.step = 0;
    },
    newContract() {
      this.contract.step = 1;
    },
    selectDeveloper(dev) {
      this.contract.developer = dev;
    },
    confirmDeveloper(){
      this.contract.step = 2;
    },
    saveDetails(updated) {
      this.contract = { ...updated };
      this.contract.step = 3;
    },
    confirmMilestones(updated) {
      this.contract = { ...updated, step: 4 };
    },
    saveNewContract(){
      this.contract.step = 5;
      axios.post("https://contracts.backend.tarket.site:3029/contracts", {
        data: this.contract,
        owner: "Javier Perez"
      })
        .then(response => {
          this.contract = getDefaultContract();
          localStorage.removeItem("contract");
          this.$emit("contractCreated", response.data);
          
          this.$toast.add({
            severity: "success",
            summary: "Contrato guardado",
            detail: "El contrato se ha creado correctamente.",
            life: 3000,
          });
          
          this.contract = { step: 0, title: "", description: "", developer: null, url: "", status: "Pendiente", date: new Date().toLocaleDateString() };
        })
        .catch(error => {
          console.error("Error al guardar el contrato:", error);
        });
    }
  },
  watch: {
    /* Si se cierra el modal, reiniciar el contrato */
    contract: {
      handler(newVal) {
        localStorage.setItem("contract", JSON.stringify(newVal));
      },
      deep: true,
    },
  },
};
</script>

<style scoped>
.text-button{
  cursor: pointer;
  user-select: none;
}
</style>