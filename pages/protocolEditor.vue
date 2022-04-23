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
                        <v-text-field outlined dense></v-text-field>
                        <v-text-field outlined dense></v-text-field>
                        <v-text-field outlined dense></v-text-field>
                        <v-btn icon><v-icon color="red darken-2">mdi-close</v-icon></v-btn>
                    </v-card-title>

                </v-card>
                <v-btn-toggle style="width: 100%;" v-model="toggle" @change="toggle=[]">
                    <v-btn width="33%">Число<v-icon right>mdi-counter</v-icon></v-btn>
                    <v-btn width="33%">Чекбокс<v-icon right>mdi-checkbox-outline</v-icon></v-btn>
                    <v-btn width="33%">Время<v-icon right>mdi-clock-outline</v-icon></v-btn>
                </v-btn-toggle>
            </v-card-text>
        </v-card>
    </v-container>
</template>

<script>
export default {
    name: "protocolEditor",
    layout: "default",
    data:()=>({
        fields: [
            {}, {}
        ],
        toggle:[],
    }),
}
</script>

<style scoped>
.field-text-field .v-input{
    width: 25%;
    margin: 0 10px -26px 0 !important;
    padding: 0;
}
</style>
