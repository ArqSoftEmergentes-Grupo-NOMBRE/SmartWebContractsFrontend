<template>
  <div class="text-white absolute flex flex-col items-center justify-center w-[100%] h-[100%] left-0 top-0 bg-black/60 backdrop-blur-sm"
       @click.self="$emit('cancel')">

    <div class="bg-neutral-900 rounded-2xl p-8 space-y-6">
      <h1 class="text-2xl md:text-3xl font-bold text-center flex-1">
        Subir Entrega
      </h1>

      <!-- Info del entregable -->
      <div class="flex items-center text-xl font-bold">
        <span class="mr-2">Hito:</span>
        <span class="text-[#bfa8a8] flex-1 truncate">{{ entregable.titulo }}</span>
      </div>

      <div class="flex flex-wrap gap-2 text-sm font-medium">
        <div>
          Estado: <span class="text-[#ff7a00]">{{ entregable.estado }}</span>
        </div>
        <div>
          Fecha de entrega:
          <span class="text-[#ff7a00]">{{ formatDate(entregable.fechaEntregaEsperada) }}</span>
        </div>
      </div>

      <hr class="border-neutral-700" />

      <!-- FORMULARIO -->
      <div class="grid md:grid-cols-2 gap-2">
        <div>
          <p class="font-medium mb-2">Comentarios:</p>
          <InputTextarea v-model="form.comment" rows="5" autoResize class="w-full bg-transparent border border-neutral-500 rounded-md p-3" />
        </div>

        <div>
          <p class="font-medium mb-2">Adjuntar URLs con los archivos:</p>
          <InputTextarea v-model="form.url" rows="5" autoResize class="w-full bg-transparent border border-neutral-500 rounded-md p-3" />
        </div>
      </div>

      <div class="flex items-center gap-1 mt-4">
        <Checkbox v-model="form.final" binary id="checkbox"/>
        <label class="text-sm select-none cursor-pointer" for="checkbox">
          Marcar como entrega final de este hito
        </label>
      </div>

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
import Button from "primevue/button";
import InputTextarea from "primevue/textarea";
import Checkbox from "primevue/checkbox";

export default {
  name: "SubmitComponent",
  components: { Button, InputTextarea, Checkbox },

  props: {
    entregable: { type: Object, required: true },
  },

  data() {
    return {
      form: {
        comment: "",
        url: "",
        final: false,
      },
    };
  },

  computed: {
    canSend() {
      return this.form.comment.trim() && this.form.url.trim();
    },
  },

  methods: {
    send() {
      this.$emit("send", {
        entregableId: this.entregable.id,
        url: this.form.url,
        comments: this.form.comment,
        final: this.form.final,
      });
    },
    cancel() {
      this.$emit("cancel");
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
  },
};
</script>
