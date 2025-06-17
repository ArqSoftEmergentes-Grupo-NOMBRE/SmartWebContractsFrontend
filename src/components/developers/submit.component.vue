<template>
  <div class="text-white absolute flex flex-col items-center justify-center w-[100%] h-[100%] left-0 top-0 bg-black/60 backdrop-blur-sm"
       @click.self="$emit('cancel')">
    
      <div class="bg-neutral-900 rounded-2xl p-8 space-y-6">
        <h1 class="text-2xl md:text-3xl font-bold text-center flex-1">
          {{ submitting.title }}
        </h1>
        
        <div class="flex items-center text-xl font-bold">
          <i class="pi pi-chevron-left text-xl" v-if="milestone.index" @click="milestone.index--"/>
          <span class="mr-2">Hito {{ milestone.index + 1}}:</span>
          <span class="text-[#bfa8a8] flex-1 truncate">{{ milestone.name }}</span>
          <i class="pi pi-chevron-right text-xl" v-if="milestone.index < submitting.milestones.length - 1" @click="milestone.index++"/>
        </div>
        
        <!-- estado + fecha -->
        <div class="flex flex-wrap gap-2 text-sm font-medium">
          <div>
            Estado: <span class="text-[#ff7a00]">{{ milestone.status }}</span>
          </div>
          <div>
            Fecha de entrega:
            <span class="text-[#ff7a00]">{{ milestone.deadline }}</span>
          </div>
        </div>
        
        <hr class="border-neutral-700" />
        
        <!-- FORMULARIO -->
        <div class="grid md:grid-cols-2 gap-2">
          <!-- comentarios -->
          <div>
            <p class="font-medium mb-2">Comentarios:</p>
            <InputTextarea
                v-model="form.comment"
                rows="5"
                autoResize
                class="w-full bg-transparent border border-neutral-500 rounded-md p-3"
            />
          </div>
          
          <!-- archivos -->
          <div>
            <p class="font-medium mb-2">Adjuntar URLs con los archivos:</p>
            
            <InputTextarea
                v-model="form.url"
                rows="5"
                autoResize
                class="w-full bg-transparent border border-neutral-500 rounded-md p-3"
            
            />
          </div>
        </div>
        
        <!-- checkbox final -->
        <div class="flex items-center gap-1 mt-4">
          <Checkbox v-model="form.final" binary id="checkbox"/>
          <label class="text-sm select-none cursor-pointer" for="checkbox">
            Marcar como entrega final de este hito
          </label>
        </div>
        
        <!-- botones -->
        <div class="flex flex-col sm:flex-row gap-1 mt-8">
          <Button
              label="Enviar entrega"
              class="flex-1 bg-[#ff7a00] text-black font-semibold border-none h-11"
              :disabled="!canSend"
              @click="send"
          />
          <Button
              label="Cancelar"
              class="flex-1 bg-[#ff7a00] text-black font-semibold border-none h-11"
              @click="cancel"
          />
        </div>
      </div>
  </div>
</template>

<script>
import Button        from "primevue/button";
import InputTextarea from "primevue/textarea";
import Checkbox      from "primevue/checkbox";

export default {
  name: "SubmitComponent",
  components: { Button, InputTextarea, Checkbox },
  
  props: { submitting: { type: Object, required: true } },
  
  data() {
    const m0 = this.submitting.milestones[0];   // primer hito a editar
    return {
      milestone: {
        index   : 0,
        name    : m0.name,
        status  : "En progreso",
        deadline: new Date(m0.deadline).toLocaleDateString("es-PE", {
          day: "2-digit", month: "2-digit", year: "numeric",
        }),
      },
      form: { comment: "", url: "", final: false },
    };
  },
  
  computed: {
    canSend() {
      return this.form.comment.trim() && this.form.url.trim();
    },
  },
  
  methods: {
    send() {
      /* emite datos mínimos para el backend */
      this.$emit("send", {
        milestone: this.milestone.index,
        url      : this.form.url,
        comments : this.form.comment,
        final    : this.form.final,
        status   : "Pending",
        index    : this.submitting.index,
      });
    },
    cancel() { this.$emit("cancel"); },
  },
};
</script>

<style scoped>
/* Tailwind + PrimeVue cubren el estilo */
</style>
