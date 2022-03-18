<template>
	<v-container fluid class="fill-height fill-width ma-0 pa-0 px-6">

        <v-dialog v-model="createTeamDialog" width="500px">
            <v-card>
                <v-card-title>
                    Создать команду
                    <v-spacer></v-spacer>
                    <v-btn @click="closeTeamCreationDialog" icon color="red darken-2">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </v-card-title>
                <v-card-text>
                    <v-list>
                        <v-list-item>
                            <v-list-item-icon><v-icon>mdi-card-text</v-icon></v-list-item-icon>
                            <v-list-item-content>
                                <v-text-field
                                    v-model="temp.teamName"
                                    hint="Имя команды"
                                    outline
                                >
                                </v-text-field>
                            </v-list-item-content>
                        </v-list-item>
                        <v-divider></v-divider>
                        <v-list-item>
                            <v-list-item-icon><v-icon>mdi-human</v-icon></v-list-item-icon>
                            <v-list-item-content>
                                <v-text-field
                                    v-model="temp.participants[0].name"
                                    hint="Имя человека"
                                    outline
                                >
                                </v-text-field>
                                <v-text-field
                                    v-model="temp.participants[0].team_role"
                                    hint="Роль"
                                    outline
                                >
                                </v-text-field>
                            </v-list-item-content>
                        </v-list-item>
                    </v-list>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn @click="closeTeamCreationDialog" text>
                        Отмена
                    </v-btn>
                    <v-btn @click="submitTeam">
                        Сохранить
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
<!--
TODO: всю эту мутню загнать в цикл
-->
		<v-row justify="center" align="center">
			<v-col cols="4">
				<v-row justify="center" align="center" class="">
					<v-card width="100%" color="transparent" elevation="0">
						<v-card-title class="white--text pr-2">
							Судьи
							<v-spacer></v-spacer>
							<v-btn icon outlined small color="#FBAE3C"><v-icon>mdi-plus</v-icon></v-btn>
						</v-card-title>
						<v-card-text class="pa-0 ma-0">
							<perfect-scrollbar style="height: calc(50vh - 64px - 25px);" class="px-2">
								<DummyAdd name="(TBD) Судей" v-if="judges.length===0"></DummyAdd>
							</perfect-scrollbar>
						</v-card-text>
					</v-card>
				</v-row>
				<v-row justify="center" align="center" class="">
					<v-card width="100%" color="transparent" elevation="0">
						<v-card-title class="white--text pr-2">
							Команды
							<v-spacer></v-spacer>
							<v-btn @click="createTeamDialog = true" icon outlined small color="#FBAE3C"><v-icon>mdi-plus</v-icon></v-btn>
						</v-card-title>
						<v-card-text class="pa-0 ma-0">
							<perfect-scrollbar style="height: calc(50vh - 64px - 25px);" class="px-2">
								<DummyAdd @click="createTeamDialog = true" name="Команд" v-if="teams.length===0"></DummyAdd>
							</perfect-scrollbar>
						</v-card-text>
					</v-card>
				</v-row>
			</v-col>
			<v-col cols="4">
				<v-card color="transparent" elevation="0">
					<v-card-title class="white--text pr-2">
						Раундов
						<v-spacer></v-spacer>
						<v-btn @click="addRound(compId, catId, 1)" icon outlined small color="#FBAE3C"><v-icon>mdi-plus</v-icon></v-btn>
					</v-card-title>
					<v-card-text class="pa-0 ma-0">
						<perfect-scrollbar style="height: calc(50vh - 64px - 25px);" class="px-2">
							<DummyAdd name="Раундов" v-if="rounds.length===0"></DummyAdd>
                            <v-card v-for="round in rounds" :key="round.id">
                                <v-card-title>
                                    {{round.name}}
                                </v-card-title>
                            </v-card>
						</perfect-scrollbar>
					</v-card-text>
				</v-card>
                <v-card color="transparent" elevation="0">
                    <v-card-title class="white--text pr-2">
                        Завершенные попытки по раунду
                        <v-spacer></v-spacer>
                        <v-btn icon outlined small color="#FBAE3C"><v-icon>mdi-plus</v-icon></v-btn>
                    </v-card-title>
                    <v-card-text class="pa-0 ma-0">
                        <perfect-scrollbar style="height: calc(50vh - 64px - 25px);" class="px-2">
                            <DummyAdd name="Завершенных попыток" v-if="attempts.length===0"></DummyAdd>
                        </perfect-scrollbar>
                    </v-card-text>
                </v-card>
			</v-col>
            <v-col cols="4">
                <v-row justify="center" align="center" class="">
                    <v-card width="100%" height="calc(100vh - 50px)" color="transparent" elevation="0">
                        <v-card-title class="white--text pr-2">
                            Формулы рассчета протоколов
                            <v-spacer></v-spacer>
                            <v-btn @click="addFormula(compId, catId)" icon outlined small color="#FBAE3C"><v-icon>mdi-plus</v-icon></v-btn>
                        </v-card-title>
                        <v-card-text class="pa-0 ma-0">
                            <perfect-scrollbar style="height: calc(50vh - 64px - 25px);" class="px-2">
                                <DummyAdd name="Формул" v-if="formulas.length===0" @click="addFormula(compId, catId)"></DummyAdd>
                                <v-card v-for="formula in formulas" :key="formula.id">
                                    <v-card-title>
                                        {{formula.name}}
                                    </v-card-title>
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
import DummyAdd from "@/components/DummyAdd";
import Util from "@/mixin/Util"
import { mapActions } from "vuex";
export default {
	layout: "default",
	components: {DummyAdd},
	mixins: [Util],
	data: ()=>({
        createTeamDialog: false,
        temp: {
            teamName: '',
            participants: [{name: '', team_role: ''}],
        },
        defaultTemp:{
            teamName: '',
            participants: [{name: '', team_role: ''}],
        },
		judges:[],
		teams: [],
		forms: [],
		formulas: [],
        rounds: [],
        attempts: [],
		compId: 0,
		catId: 0,
	}),
	mounted(){
		console.log("before: ", this.$store.state.current_entity)
		/*if(this.$store.state.current_entity.competition === undefined)
			//TODO: перекрутить это на бредкрамбы
			this.getEntity({ids: [this.$route.params.compId, this.$route.params.catId]}).then(res=>{
				console.log("after: ", this.$store.state.current_entity)
			})*/
		this.compId = this.$route.params.compId
		this.catId = this.$route.params.catId
		this.getRounds(this.compId, this.catId)
		this.getTeams(this.compId, this.catId)
		this.getFormulas(this.compId, this.catId)
	},
	methods:{
		...mapActions({
			getEntity: "getEntity"
		}),

        //Teams
		getTeams(compId, catId){
			this.$axios.$get(`/v1/competition/${compId}/category/${catId}/team`).then(res=>{
				console.log('teams: ', res)
				this.teams = res
			}).catch(err=>{
				this.$toast.error(this.getHumanMessage(err))
			})
		},
        registerTeam(compId, catId, teamName, participants){
            this.$axios.$get(`/v1/competition/${compId}/category/${catId}/team/register`, {team_name: teamName, participants: participants}).then(res=>{
                this.getTeams(compId, catId)
            }).catch(err=>{
                this.$toast.error(this.getHumanMessage(err))
            })
        },
        deleteTeam(compId, catId, teamId){
            this.$axios.$delete(`/v1/competition/${compId}/category/${catId}/team/${teamId}`).then(res=>{
                this.getTeams(compId, catId)
            }).catch(err=>{
                this.$toast.error(this.getHumanMessage(err))
            })
        },
        submitTeam(){
		    this.registerTeam(this.compId, this.catId, this.temp.teamName, this.temp.participants)
            this.closeTeamCreationDialog()
        },
        closeTeamCreationDialog(){
            this.temp = Object.assign({}, this.defaultTemp)
            this.createTeamDialog = false
        },

        //Formulas
		getFormulas(compId, catId){
			this.$axios.$get(`/v1/competition/${compId}/category/${catId}/formula-protocol`).then(res=>{
				console.log('formulas: ', res)
				this.formulas = res
			}).catch(err=>{
				this.$toast.error(this.getHumanMessage(err))
			})
		},
		addFormula(compId, catId){
			this.$axios.$post(`/v1/competition/${compId}/category/${catId}/formula-protocol`, {name: `test${this.formulas.length}`}).then(res=>{
				this.getFormulas(compId, catId)
			}).catch(err=>{
				this.$toast.error(this.getHumanMessage(err))
			})
		},
        deleteFormula(compId, catId, protId){
            this.$axios.$delete(`/v1/competition/${compId}/category/${catId}/formula-protocol/${protId}`).then(res=>{
                this.getFormulas(compId, catId)
            }).catch(err=>{
                this.$toast.error(this.getHumanMessage(err))
            })
        },

        //Attempts and rounds
		getRounds(compId, catId){
			this.$axios.$get(`/v1/competition/${compId}/category/${catId}/attempt`).then(res=>{
				console.log('attempts: ', res)
				this.rounds = res
			}).catch(err=>{
				this.$toast.error(this.getHumanMessage(err))
			})
		},
        addRound(compId, catId, formulaId, name){
            this.$axios.$post(`/v1/competition/${compId}/category/${catId}/attempt/`, {formula_protocol: formulaId, name:`testRound${this.rounds.length}`}).then(res=>{
                this.getRounds(compId, catId)
            }).catch(err=>{
                this.$toast.error(this.getHumanMessage(err))
            })
        },
        deleteRound(compId, catId, attId){
            this.$axios.$delete(`/v1/competition/${compId}/category/${catId}/attempt/${attId}`).then(res=>{
                this.getRounds(compId, catId)
            }).catch(err=>{
                this.$toast.error(this.getHumanMessage(err))
            })
        }



		/*getJudges(compId, catId){
			this.$axios.$get(`/v1/competition/${compId}/category/${catId}/judges`).then(res=>{
				this.judges = res
			}).catch(err=>{
				this.$toast.error(this.getHumanMessage(err))
			})
		},*/
		/*getForms(compId, catId){
			this.$axios.$get(`/v1/competition/${compId}/category/${catId}/judges`).then(res=>{
				this.judges = res
			}).catch(err=>{
				this.$toast.error(this.getHumanMessage(err))
			})
		},*/
	}
}
</script>

<style scoped>
.col{
	padding-bottom: 0;
	padding-top: 0;
}
</style>
