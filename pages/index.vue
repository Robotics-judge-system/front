<template>
    <v-container fluid class="fill-height fill-width pa-0 ma-0">
        <v-row justify="center" no-gutters>
            <v-col cols="11" sm="11" md="6" lg="5" xl="4">
                <v-row justify="center">
                    <v-card height="calc(100vh)" width="100%" color="transparent" elevation="0" rounded class="">
                        <v-card-title class="white--text justify-center">
                            Соревнования
                        </v-card-title>
                        <v-card-text class="pa-0 ma-0">
                            <perfect-scrollbar style="height: calc(100vh - 64px)" class="pr-2">
                                <v-card class="ma-2" color="light-green accent-2">
                                    <v-card-title class="ma-2">
                                        <v-row align="center">
                                            Создать соревнование
                                            <v-spacer></v-spacer>
                                            <v-btn icon><v-icon>mdi-plus</v-icon></v-btn>
                                        </v-row>
                                    </v-card-title>
                                </v-card>
                                <v-card v-for="comp in competitions" :key="comp.id" rounded class="ma-2">
                                    <v-card-title>
                                        <v-icon class="mr-2">mdi-file-jpg-box</v-icon>
                                        {{comp.name}}
                                    </v-card-title>
                                    <v-card-text>
                                        <div>
                                            Дата начала: {{moment(comp.date_from).format("dddd, MMMM Do YYYY, hh:mm:ss") }}
                                        </div>
                                        <div>
                                            Дата окончания: {{moment(comp.date_to).format("dddd, MMMM Do YYYY, hh:mm:ss") }}
                                        </div>
                                    </v-card-text>
                                </v-card>
                            </perfect-scrollbar>
                        </v-card-text>
                    </v-card>
                </v-row>

            </v-col>
        </v-row>
    </v-container>
</template>

<script>
export default {
    layout: "default",
    name: "index.vue",
    data: () => ({
        competitions: [],
    }),
    mounted () {
        this.getCompetitions()
    },
    methods:{
        getCompetitions(){
            this.$axios.$get("/v1/competition")
                .then(res=>{
                    this.competitions = res
                })
                .catch(err=>{
                    this.$toast.error(err)
                })
        },
        moment(date) {
            return this.$moment(date);
        },
    }
}
</script>

<style scoped>

</style>
