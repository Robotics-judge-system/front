<template>
	<v-container fluid class="fill-height fill-width ma-0 pa-0 px-6">

        <v-dialog v-model="createRoundDialog.show" width="500px">
            <v-card>
                <v-card-title>
                    Добавить новый раунд
                    <v-spacer></v-spacer>
                    <v-btn @click="closeCreateRoundDialog" icon color="red darken-2"><v-icon>mdi-close</v-icon></v-btn>
                </v-card-title>
                <v-card-text>
                    <v-select
                        v-model="createRoundDialog.formula"
                        :items="formulas"
                        item-text="name"
                        item-value="id"
                        hint="Формула-протокол"
                        dense
                        outlined
                    >
                    </v-select>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn @click="closeCreateRoundDialog" text color="grey">отмена</v-btn>
                    <v-btn @click="submitRound" text color="green darken-2">сохранить</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog v-model="createAttemptDialog.show" width="500px">
            <v-card>
                <v-card-title>
                    Добавить попытку в раунде команде
                    <v-spacer></v-spacer>
                    <v-btn @click="closeCreateAttemptDialog" icon color="red darken-2"><v-icon>mdi-close</v-icon></v-btn>
                </v-card-title>
                <v-card-text>
                    <v-list>
                        <v-list-item>
                            <v-list-item-icon>
                                <v-icon>mdi-account-multiple</v-icon>
                            </v-list-item-icon>
                            <v-list-item-content>
                                <v-select
                                    v-model="createAttemptDialog.team"
                                    :items="teams"
                                    item-text="team_name"
                                    item-value="id"
                                    hint="Команда"
                                    dense
                                    outlined
                                >
                                </v-select>
                            </v-list-item-content>
                        </v-list-item>
                        <v-list-item>
                            <v-list-item-icon>
                                <v-icon>mdi-flag-checkered</v-icon>
                            </v-list-item-icon>
                            <v-list-item-content>
                                <v-select
                                    v-model="createAttemptDialog.round"
                                    :items="rounds"
                                    item-text="name"
                                    item-value="id"
                                    hint="Раунд"
                                    dense
                                    outlined
                                >
                                </v-select>
                            </v-list-item-content>
                        </v-list-item>
                        <v-divider></v-divider>
                        <v-list-item>
                            <v-list-item-icon>
                                <v-icon>mdi-list-status</v-icon>
                            </v-list-item-icon>
                            <v-list-item-content>
                                <v-text-field
                                    v-model="createAttemptDialog.results.a"
                                    hint="Результат 1"
                                    dense
                                    outlined
                                >
                                </v-text-field>
                                <v-text-field
                                    v-model="createAttemptDialog.results.b"
                                    hint="Результат 2"
                                    dense
                                    outlined
                                >
                                </v-text-field>
                            </v-list-item-content>
                        </v-list-item>
                    </v-list>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn @click="closeCreateAttemptDialog" text color="grey">отмена</v-btn>
                    <v-btn @click="submitAttempt" text color="green darken-2">сохранить</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
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
                                    outlined
                                    dense
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
                                    outlined
                                    dense
                                >
                                </v-text-field>
                                <v-select
                                    v-model="temp.participants[0].team_role"
                                    :items="prtItems"
                                    item-text="name"
                                    item-value="value"
                                    dense
                                    outlined
                                >
                                </v-select>
                            </v-list-item-content>
                        </v-list-item>
                    </v-list>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn @click="closeTeamCreationDialog" text color="grey">
                        Отмена
                    </v-btn>
                    <v-btn @click="submitTeam" text color="green darken-2">
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
                                <v-card v-for="team in teams" :key="team.id" class="my-2">
                                    <v-card-title>
                                        {{team.team_name}}
                                    </v-card-title>
                                    <v-card-text>
                                        <div v-for="participant in team.participants">
                                            {{participant.name}} - {{convertTextToEnum(participant.team_role)}}
                                        </div>
                                    </v-card-text>
                                </v-card>
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
						<v-btn @click="createRoundDialog.show=true" icon outlined small color="#FBAE3C"><v-icon>mdi-plus</v-icon></v-btn>
					</v-card-title>
					<v-card-text class="pa-0 ma-0">
						<perfect-scrollbar style="height: calc(50vh - 64px - 25px);" class="px-2">
							<DummyAdd name="Раундов" v-if="rounds.length===0"></DummyAdd>
                            <v-card v-for="round in rounds" :key="round.id" class="my-2">
                                <v-card-title>
                                    {{round.name}}
                                    <v-spacer></v-spacer>
                                    <v-btn @click="deleteRound(compId, catId, round.id)" icon color="red darken-2">
                                        <v-icon>mdi-close</v-icon>
                                    </v-btn>
                                </v-card-title>
                            </v-card>
						</perfect-scrollbar>
					</v-card-text>
				</v-card>
                <v-card color="transparent" elevation="0">
                    <v-card-title class="white--text pr-2">
                        Формулы рассчета протоколов
                        <v-spacer></v-spacer>
                        <v-btn @click="addFormula(compId, catId)" icon outlined small color="#FBAE3C"><v-icon>mdi-plus</v-icon></v-btn>
                    </v-card-title>
                    <v-card-text class="pa-0 ma-0">
                        <perfect-scrollbar style="height: calc(50vh - 64px - 25px);" class="px-2">
                            <DummyAdd name="Формул" v-if="formulas.length===0" @click="addFormula(compId, catId)"></DummyAdd>
                            <v-card v-for="formula in formulas" :key="formula.id" class="my-2">
                                <v-card-title>
                                    {{formula.name}}
                                    <v-spacer></v-spacer>
                                    <v-btn @click="deleteFormula(compId, catId, formula.id)" icon color="red darken-2">
                                        <v-icon>mdi-close</v-icon>
                                    </v-btn>
                                </v-card-title>
                            </v-card>
                        </perfect-scrollbar>
                    </v-card-text>
                </v-card>
			</v-col>
            <v-col cols="4">
                <v-row justify="center" align="center" class="">
                    <v-card width="100%" height="calc(100vh - 50px)" color="transparent" elevation="0">
                        <v-card-title class="white--text pr-2">
                            Завершенные попытки по раунду
                            <v-spacer></v-spacer>
                            <v-btn @click="createAttemptDialog.show = true" icon outlined small color="#FBAE3C"><v-icon>mdi-plus</v-icon></v-btn>
                        </v-card-title>
                        <v-card-text class="pa-0 ma-0">
                            <perfect-scrollbar style="height: calc(100vh - 64px - 50px);" class="px-2">
                                <DummyAdd name="Завершенных попыток" v-if="attempts.length===0"></DummyAdd>
                                <v-card v-for="att in attempts" :key="att.id" class="my-2">
                                    <v-card-title>
                                        {{teams.find(t => t.id === att.team_id).team_name}} - {{rounds.find(t=>t.id === att.attempt_id).name}}
                                    </v-card-title>
                                    <v-card-text>
                                        <div>Результат 1: {{att.attempt_data.a}}</div>
                                        <div>Результат 2: {{att.attempt_data.b}}</div>
                                        <div>Время: {{att.attempt_time}}</div>
                                        <v-divider></v-divider>
                                        <div>Итоговый результат: {{att.attempt_score}}</div>
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
        prtItems:[
            {name: "Тренер", value: "COACH"},
            {name: "Участник", value: "PARTICIPANT"}
        ],
        defaultTemp:{
            teamName: '',
            participants: [{name: '', team_role: ''}],
        },
        createAttemptDialog:{
            show: false,
            team: 0,
            round: 0,
            results: {
                a: 0,
                b: 0,
            }
        },
        createRoundDialog:{
            show: false,
            formula: 0,
            roundId: 0,
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
                this.attempts = []
                res.forEach(team=>{
                    this.getAttemptsForTeam(this.compId, this.catId, team.id)
                })
			}).catch(err=>{
				this.$toast.error(this.getHumanMessage(err))
			})
		},
        registerTeam(compId, catId, teamName, participants){
            console.log("Sending participants: ", participants)
            this.$axios.$post(`/v1/competition/${compId}/category/${catId}/team/register`, {team_name: teamName, participants: participants}).then(res=>{
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
        convertTextToEnum(value){ //TODO: нормально сделать наверное?
		    switch (value){
		        case 'COACH': return 'Тренер'
                case 'PARTICIPANT': return 'Участник'
                case 'Участник': return 'PARTICIPANT'
                case 'Тренер': return 'COACH'
            }
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
				console.log('rounds: ', res)
				this.rounds = res
			}).catch(err=>{
				this.$toast.error(this.getHumanMessage(err))
			})
		},
        addRound(compId, catId, formulaId, name){
            return this.$axios.$post(`/v1/competition/${compId}/category/${catId}/attempt/`, { name:`testRound${this.rounds.length}`})
        },
        deleteRound(compId, catId, attId){
            this.$axios.$delete(`/v1/competition/${compId}/category/${catId}/attempt/${attId}`).then(res=>{
                this.getRounds(compId, catId)
            }).catch(err=>{
                this.$toast.error(this.getHumanMessage(err))
            })
        },
        activateRound(compId, catId, attId){
		    return this.$axios.$post(`/v1/competition/${compId}/category/${catId}/attempt/${attId}/activate`).then(res=>{
		        this.getRounds(compId, catId)
            })
        },
        attachFormulaToRound(compId, catId, roundId, formulaId){
		    return this.$axios.$post(`/v1/competition/${compId}/category/${catId}/attempt/${roundId}/attach/formula-protocol/${formulaId}`)
        },
        closeCreateRoundDialog(){
		    this.createRoundDialog = {
		        show: false,
                formula: 0,
            }
        },
        submitRound(){
            this.addRound(this.compId, this.catId).then(res=>{
                this.attachFormulaToRound(this.compId, this.catId, res.id, this.createRoundDialog.formula).then(res=>{
                    this.activateRound(this.compId, this.catId, res.id).then(res=>{
                        this.getRounds(this.compId, this.catId)
                        this.closeCreateRoundDialog()
                    })
                })
            })
        },

        addAttempt(compId, catId, teamId, roundId, results){
		    this.$axios.$post(`/v1/competition/${compId}/category/${catId}/team/${teamId}/attempt/${roundId}`, results).then(res=>{
		        this.getTeams(compId, catId)
            })
        },
        getAttemptsForTeam(compId, catId, teamId){
		    this.$axios.$get(`/v1/competition/${compId}/category/${catId}/team/${teamId}/attempt`).then(attempts=>{
		        console.log("Got attempts for: ", teamId, attempts)
                this.attempts.push.apply(this.attempts, attempts)
            })
        },
        deleteAttempt(){
		    this.$axios.$delete(`/v1/competition/:competition_id/category/:category_id/team/:team_id/attempt/:attempt_id`)
        },
        submitAttempt(){
		    this.addAttempt(
		        this.compId,
                this.catId,
                this.createAttemptDialog.team,
                this.createAttemptDialog.round,
                this.createAttemptDialog.results
            )
            this.closeCreateAttemptDialog()
        },
        closeCreateAttemptDialog(){
		    this.createAttemptDialog = {
		        show: false,
                team: 0,
                round: 0,
                results: {
		            a: 0,
                    b: 0,
                }
            }
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
