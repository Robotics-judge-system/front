import Vue from "vue";
import VueWavify from 'vue-wavify';


import { localize, ValidationObserver, ValidationProvider } from 'vee-validate'
import ru from 'vee-validate/dist/locale/ru.json'
import { extend } from 'vee-validate'
import { required, email, min, max, digits, numeric, between, max_value, min_value, regex, confirmed } from 'vee-validate/dist/rules'


localize('ru', ru)
extend('required', required)
extend('email', email)
extend('min', min)
extend('max', max)
extend('digits', digits)
extend('numeric', numeric)
extend('between', between)
extend("max_value", max_value)
extend('min_value', min_value)
extend('regex', regex)
extend('confirmed', confirmed)
Vue.component('ValidationObserver', ValidationObserver)
Vue.component('ValidationProvider', ValidationProvider)

Vue.component('vue-wavify', VueWavify)





