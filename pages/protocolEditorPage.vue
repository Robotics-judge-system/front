<template>
    <v-container fluid class="fill-height fill-width ma-0 pa-0 px-6">
        <v-card height="100%" width="60%">
            <v-card-title>
                Название:
                <v-text-field dense class="ma-0 pa-0 ml-2 mb-n5" v-model="protocolName"></v-text-field>
                <v-spacer></v-spacer>
                <v-btn icon><v-icon>mdi-close</v-icon></v-btn>
            </v-card-title>
            <v-card-text class="pa-0 ma-0">
	            <perfect-scrollbar style="height: calc(100vh - 68px - 50px - 52px)">
		            <v-card v-for="(field, idx) in fields" :key="idx" elevation="0">
			            <v-card-title class="field-text-field">
				            <v-col cols="1" class="ma-0 pa-0">
					            <v-row class="ma-0 pa-0">
						            <v-btn icon x-small @click="swap(idx, idx - 1)">
							            <v-icon>
								            mdi-chevron-up
							            </v-icon>
						            </v-btn>
					            </v-row>
					            <v-row class="ma-0 pa-0">
						            <v-btn icon x-small @click="swap(idx, idx + 1)">
							            <v-icon>
								            mdi-chevron-down
							            </v-icon>
						            </v-btn>
					            </v-row>
				            </v-col>
				            <v-text-field
					            outlined
					            dense
					            v-model="field.name"
					            :label="field.type==='separator'?'Текст сепаратора':'Название'"
					            :prepend-inner-icon="field.icon"
				            ></v-text-field>
				            <v-text-field
					            v-if="field.min!==undefined"
					            outlined
					            dense
					            v-model="field.min"
					            label="Минимум"
				            ></v-text-field>
				            <v-text-field
					            v-if="field.max!==undefined"
					            outlined
					            dense
					            v-model="field.max"
					            label="Максимум"
				            ></v-text-field>
				            <v-btn icon @click="removeRow(idx)"><v-icon color="red darken-2">mdi-close</v-icon></v-btn>
			            </v-card-title>
		            </v-card>
		            <v-btn-toggle style="width: 100%;" v-model="toggle" @change="addRow(toggle); toggle=[]">
			            <v-btn v-for="(btn, idx) in entityButtons" :key="idx" width="25%">
				            {{btn.name}}
				            <v-icon right>{{btn.icon}}</v-icon>
			            </v-btn>
		            </v-btn-toggle>
	            </perfect-scrollbar>
            </v-card-text>
	        <v-card-actions>
		        <v-spacer></v-spacer>
		        <v-btn text color="grey lighten-1">Отмена</v-btn>
		        <v-btn text color="green darken-2">Сохранить</v-btn>
	        </v-card-actions>
        </v-card>
    </v-container>
</template>

<script>
import Vue from 'vue'
export default {
    name: "protocolEditor",
    layout: "default",
    data:()=>({
        fields: [],
        entityButtons:[
            {name:'Число', icon:'mdi-counter', type: 'value'},
            {name:'Чекбокс', icon:'mdi-checkbox-outline', type: 'checkbox'},
            {name:'Время', icon:'mdi-clock-outline', type: 'time'},
            {name:'Сепаратор', icon:'mdi-view-day-outline', type: 'separator'},
        ],
        toggle: null,
	    timePresence: false,
	    protocolName: '',
    }),
    methods:{
        addRow(entIdx){
            let ent = this.entityButtons[entIdx]
            let obj = {
                name: ent.name,
                icon: ent.icon,
                type: ent.type
            }
            if(ent.type === 'value'){
                obj.max = 0
                obj.min = 0
            }
            if(ent.type === 'time'){
				if(!this.timePresence){
					obj.max = 120
					this.timePresence = true
	            }
                else{
					this.$toast.error("Может быть только одно поле времени")
					return
				}

            }
            this.fields.push(obj)
            console.log(this.fields)
        },
	    removeRow(idx){
			if(this.fields[idx].type === 'time')
				this.timePresence=false
		    this.fields.splice(idx,1)
	    },
        swap(idx1, idx2){
            if( idx2 >= this.fields.length ||
                idx1 >= this.fields.length ||
                idx2 < 0 ||
                idx1 < 0
            )
                return null
            let buf = this.fields[idx1]
            Vue.set(this.fields, idx1, this.fields[idx2])// this.fields[idx1] = this.fields[idx2]
            Vue.set(this.fields, idx2, buf)
        }
    }
}
</script>

<style scoped>
.field-text-field .v-input{
    width: 25%;
    margin: 0 10px -26px 0 !important;
    padding: 0;
}
</style>
