import "./assets/main.css";

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import preset from "@/assets/preset.js";

import '@fortawesome/fontawesome-svg-core/styles.css'
import 'primeicons/primeicons.css'

import Vue3Marquee from 'vue3-marquee'

import Select from "primevue/select";
import Button from "primevue/button";
import Card from "primevue/card";
import Divider from "primevue/divider";

import InputText from "primevue/inputtext";
import InputNumber from "primevue/inputnumber";
import InputMask from 'primevue/inputmask';
import DatePicker from "primevue/datepicker";
import Password from "primevue/password";
import Textarea from "primevue/textarea";
import Checkbox from "primevue/checkbox";

import Toast from "primevue/toast";
import ToastService from "primevue/toastservice";
import Dialog from "primevue/dialog";
import ProgressSpinner from "primevue/progressspinner";
import Galleria from 'primevue/galleria';
import FloatLabel from "primevue/floatlabel";
import SpeedDial from 'primevue/speeddial';
import Drawer from 'primevue/drawer';

import ConfirmDialog from "primevue/confirmdialog";
import ConfirmationService from "primevue/confirmationservice";

import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Row from "primevue/row";

import Badge from 'primevue/badge';

import Tooltip from 'primevue/tooltip';

import {MotionPlugin} from "@vueuse/motion";
import ToggleButton from "primevue/togglebutton";
import Rating from "primevue/rating";
import PrimeVue from "primevue/config";
import {Carousel, IconField, InputIcon, KeyFilter, MultiSelect, ProgressBar, RadioButton} from "primevue";


const app = createApp(App)
app.use(PrimeVue, {
    theme: {
        preset,
        options: { darkModeSelector: true }
    }
});
app.use(router)
app.use(ToastService)
app.use(ConfirmationService)
app.use(MotionPlugin);
app.use(Vue3Marquee);

app.directive('tooltip', Tooltip);

app.component("Toast", Toast);
app.component("Button", Button)
app.component("Card", Card)

app.component("InputText", InputText)
app.component("InputNumber", InputNumber)
app.component('InputMask', InputMask)
app.component("Password", Password)
app.component("DatePicker", DatePicker)
app.component("MultiSelect", MultiSelect)

app.component("FloatLabel", FloatLabel)

app.component("Carousel",Carousel)
app.component("ProgressSpinner",ProgressSpinner)
app.component("ProgressBar",ProgressBar)
app.component("Divider",Divider)
app.component("Image", Image)

app.component("Checkbox",Checkbox)
app.component("Select",Select)
app.component("RadioButton",RadioButton)

app.component("Drawer",Drawer)
app.component("Dialog",Dialog)

app.component("IconField",IconField)
app.component("InputIcon",InputIcon)

app.component('DataTable', DataTable);
app.component('Column', Column)

app.component('ConfirmDialog', ConfirmDialog)

app.component('Galleria', Galleria)
app.component('Textarea', Textarea)
app.component('SpeedDial', SpeedDial)
app.component('ToggleButton', ToggleButton)
app.component('Rating', Rating)
app.component('Row', Row)

app.directive('keyfilter', KeyFilter);

app.component('Badge', Badge)
app.mount('#app')