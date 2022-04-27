<template>
    <v-container fluid class="fill-height fill-width ma-0 pa-0 px-6">
        <v-card height="100%" width="60%">
            <v-card-title>
                Название:
                <v-text-field dense class="ma-0 pa-0 ml-2 mb-n5"></v-text-field>
                <v-spacer></v-spacer>
                <v-btn icon><v-icon>mdi-close</v-icon></v-btn>
            </v-card-title>
            <v-card-text>
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
                        <v-btn icon @click="fields.splice(idx,1)"><v-icon color="red darken-2">mdi-close</v-icon></v-btn>
                    </v-card-title>

                </v-card>
                <v-btn-toggle style="width: 100%;" v-model="toggle" @change="addRow(toggle); toggle=[]">
                    <v-btn v-for="(btn, idx) in entityButtons" :key="idx" width="25%">
                        {{btn.name}}
                        <v-icon right>{{btn.icon}}</v-icon>
                    </v-btn>
                </v-btn-toggle>
            </v-card-text>
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
                obj.max = 120
            }
            this.fields.push(obj)
            console.log(this.fields)
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
