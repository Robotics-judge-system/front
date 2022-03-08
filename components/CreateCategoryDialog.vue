<template>
    <v-dialog
        v-model="show"
        persistent
        width="600"
        :fullscreen="$vuetify.breakpoint.xsOnly">
        <v-card>
            <v-card-title>
                Создать категорию
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
	//TODO: это все большой CTRL C из диалогового от соревнований, если параметров больше не будет, то надо смерджить
    name: "CreateCategoryDialog",
    props:["show", "id"],
	mixins:[Util],
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
                    this.$axios.$post(`/v1/competition/${this.id}/category`, {
                        name: this.name,
                        date_from: this.$moment(this.getDateOrder(-1, this.dates[0], this.dates[1])),
                        date_to: this.$moment(this.getDateOrder(0, this.dates[0], this.dates[1]))
                    }).then((res)=>{
                        this.loading = false
                        this.$toast.success(`Категория ${this.name} создана`)
                        this.close()
                    }).catch(err=>{
                        this.loading = false
                        this.$toast.error(this.getHumanMessage(res))
                    })
                }
            }).catch((err)=>{console.error(err)})

        },
        allowedDates(date){
			//TODO: ограничитель по датам соревнований
            return this.$moment(date).isAfter(this.$moment().subtract(1, "days"))
        },
	    getDateOrder(which, date1, date2){ //which - >=0 return bigger| <0 smaller
			if(this.$moment(date1).isAfter(this.$moment(date2)))
				return which>=0?date1:date2
			else
				return which>=0?date2:date1

	    }
    },
    watch:{

    }
}
</script>

<style scoped>

</style>
