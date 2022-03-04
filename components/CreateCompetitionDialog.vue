<template>
    <v-dialog
        v-model="show"
        persistent
        width="600"
        :fullscreen="$vuetify.breakpoint.xsOnly">
        <v-card>
            <v-card-title>
                Создать соревнование
                <v-spacer></v-spacer>
                <v-btn icon @click="close"></v-btn>
            </v-card-title>
            <v-card-text>
                <v-list>
                    <v-list-item>
                        <v-list-item-content>
                            <ValidationObserver ref="dataFields">
                                <ValidationProvider name="Название" vid="name" rules="required" v-slot="{ errors, valid }">
                                    <v-text-field
                                        v-model="name"
                                        outlined
                                        :error-messages="errors"
                                        :success="valid"
                                        :readonly="loading"
                                        label="Название">
                                    </v-text-field>
                                </ValidationProvider>
                                <ValidationProvider name="Даты" vid="dates" rules="required" v-slot="{ errors, valid }">
                                    <v-date-picker
                                        width="100%"
                                        v-model="dates"
                                        :allowed-dates="allowedDates"
                                        header-color="#5B1F37"
                                        color="#F29841"
                                        locale="ru-RU"
                                        :readonly="loading"
                                        range>
                                    </v-date-picker>
                                    <span style="color: red">{{ errors[0] }}</span>
                                </ValidationProvider>
                            </ValidationObserver>
                        </v-list-item-content>
                    </v-list-item>
                </v-list>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn @click="close" text color="red" :loading="loading">Отмена</v-btn>
                <v-btn @click="send" text color="green darken-2" :loading="loading">Сохранить</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
import Util from "@/mixin/Util"

export default {
    name: "CreateCompetitionDialog",
    props:["show"],
    data: ()=>({
        name: '',
        dates: [],
        loading: false,
    }),
    methods:{
        close(){
            this.name = ''
            this.dates = []
            this.$emit('update:show', false)
        },
        send(){
            this.$refs.dataFields.validate().then((res)=>{
                if(res){
                    this.loading = true
                    this.$axios.$post("/v1/competition/create", {
                        name: this.name,
                        date_from: this.$moment(this.dates[0]),
                        date_to: this.$moment(this.dates[1])
                    }).then((res)=>{
                        this.loading = false
                        this.$toast.success(this.getHumanMessage(res))
                        this.close()
                    }).catch(err=>{
                        this.loading = false
                        this.$toast.error(this.getHumanMessage(res))
                    })
                }
            }).catch((err)=>{console.error(err)})

        },
        allowedDates(date){
            return this.$moment(date).isAfter(this.$moment().subtract(1, "days"))
        }
    },
    watch:{

    }
}
</script>

<style scoped>

</style>
