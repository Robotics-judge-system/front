<template>
	<v-container fluid class="fill-height fill-width ma-0 pa-0 px-6">
        <ProtocolEditor :show.sync="protocolEditorDialog.show" @protocol-emit="passToFormulaEditor"></ProtocolEditor>
		<FormulaEditor :show.sync="formulaEditorDialog.show" @formula-emit="saveFormulaProtocol" :protocol="protocolEditorDialog.protocol"></FormulaEditor>
        <v-dialog v-model="resultsDialog" width="700px">
            <v-card>
                <v-card-title>
                    Результаты
                    <v-spacer></v-spacer>
                    <v-btn @click="resultsDialog = false" icon>
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </v-card-title>
                <v-card-text>
                    <v-data-table
                        :headers="resultHeaders"
                        :items="attempts"
                        sort-by="attempt_score"
                        sort-desc="false"
                        hide-default-footer
                        items-per-page="50"
                    >
                    </v-data-table>
                </v-card-text>
            </v-card>
        </v-dialog>
        <v-dialog v-model="createRoundDialog.show" width="500px">
            <v-card>
                <v-card-title>
                    Добавить новый раунд
                    <v-spacer></v-spacer>
                    <v-btn @click="closeCreateRoundDialog" icon color="red darken-2"><v-icon>mdi-close</v-icon></v-btn>
                </v-card-title>
                <v-card-text>
	                <v-text-field v-model="createRoundDialog.name" outlined dense label="Название" ></v-text-field>
                    <v-select
                        v-model="createRoundDialog.formula"
                        :items="formulas"
                        item-text="name"
                        item-value="id"
	                    label="Формула-протокол"
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
        <v-dialog v-model="createAttemptDialog.show" width="650px" persistent>
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
                                    label="Команда"
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
                                    label="Раунд"
                                    dense
                                    outlined
                                    @change="getFieldsFromRound"
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
	                            <v-col class="mt-5">
		                            <template v-for="(field, idx) in createAttemptDialog.fields">
			                            <v-row align="center">
				                            <v-text-field
					                            v-if="field.type === 'value' || field.type === 'time'"
					                            v-model="createAttemptDialog.results[field.name]"
					                            :label="field.name"
					                            dense
					                            outlined
					                            type="number"
					                            class="mb-n3"
				                            >
				                            </v-text-field>
				                            <v-checkbox
					                            v-else-if="field.type === 'checkbox'"
					                            v-model="createAttemptDialog.results[field.name]"
					                            :label="field.name"
					                            class="ma-0 mt-2"
				                            >
				                            </v-checkbox>
				                            <div v-else-if="field.type === 'separator'" style="font-size: 21px; width: 100%;">
					                            <v-divider class="mb-2 mt-3"></v-divider>
					                            ⦁   {{field.name}}
					                            <v-divider class="mt-2 mb-3"></v-divider>
				                            </div>
			                            </v-row>
		                            </template>
	                            </v-col>



<!--                                <v-text-field
                                    v-model="createAttemptDialog.results.a"
                                    label="Результат 1"
                                    dense
                                    outlined
                                >
                                </v-text-field>
                                <v-text-field
                                    v-model="createAttemptDialog.results.b"
                                    label="Результат 2"
                                    dense
                                    outlined
                                >
                                </v-text-field>-->
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
                <v-card-text class="my-0 py-0">
                    <v-list>
                        <v-list-item>
                            <v-list-item-icon><v-icon>mdi-card-text</v-icon></v-list-item-icon>
                            <v-list-item-content>
                                <v-text-field
                                    v-model="temp.teamName"
                                    label="Название команды"
                                    outlined
                                    dense
                                >
                                </v-text-field>
                            </v-list-item-content>
                        </v-list-item>
                        <v-divider></v-divider>
                        <perfect-scrollbar style="height: 60vh">
                            <v-list-item v-for="(prt, idx) in temp.participants" :key="idx">
                                <v-list-item-icon><v-icon>mdi-human</v-icon></v-list-item-icon>
                                <v-list-item-content>
                                    <v-text-field
                                        v-model="temp.participants[idx].name"
                                        label="Имя человека"
                                        outlined
                                        dense
                                    >
                                    </v-text-field>
                                    <v-select
                                        v-model="temp.participants[idx].team_role"
                                        :items="prtItems"
                                        item-text="name"
                                        item-value="value"
                                        dense
                                        outlined
                                    >
                                    </v-select>
                                </v-list-item-content>
                            </v-list-item>
                        </perfect-scrollbar>
                        <v-divider></v-divider>
                        <v-list-item class="py-0 my-0">
                            <v-btn block color="white" elevation="0" @click="addParticipant"><v-icon color="green darken-2">mdi-plus</v-icon></v-btn>
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
                                <v-card v-for="team in teams" :key="team.id" class="mb-2">
                                    <v-card-title>
                                        {{team.team_name}}
                                        <v-spacer></v-spacer>
                                        <v-btn color="blue darken-2" icon small><v-icon>mdi-pencil</v-icon></v-btn>
                                    </v-card-title>
                                    <v-card-text>
                                        <div v-for="participant in team.participants" style="font-size: 18px">
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
                            <v-card v-for="round in rounds" :key="round.id" class="mb-2">
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
                            <v-card v-for="formula in formulas" :key="formula.id" class="mb-2">
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
                    <v-card width="100%" color="transparent" elevation="0">
                        <v-card-title class="white--text pr-2">
                            Завершенные попытки по раунду
                            <v-spacer></v-spacer>
<!--                            <v-btn @click="resultsDialog = true" icon color="green darken-2" class="mr-2"><v-icon>mdi-table-check</v-icon></v-btn>-->
                            <v-btn @click="createAttemptDialog.show = true" icon outlined small color="#FBAE3C"><v-icon>mdi-plus</v-icon></v-btn>
                        </v-card-title>
                        <v-card-text class="pa-0 ma-0">
                            <perfect-scrollbar style="height: calc(100vh - 64px - 50px);" class="px-2">
                                <DummyAdd name="Завершенных попыток" v-if="attempts.length===0"></DummyAdd>
                                <v-card v-for="att in attempts" :key="att.id" class="mb-2">
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
import ProtocolEditor from "@/components/ProtocolEditor";
import FormulaEditor from "@/components/FormulaEditor";
export default {
	layout: "default",
	components: {ProtocolEditor, DummyAdd},
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
            results: {},
	        fields: [],
        },
        createRoundDialog:{
            show: false,
            formula: 0,
            roundId: 0,
	        name: '',
        },
        protocolEditorDialog:{
            show: false,
            protocol: {},
        },
		formulaEditorDialog:{
			show: false,
			formula: {},
		},
        resultsDialog: false,
		judges:[],
		teams: [],
		forms: [],
		formulas: [],
        formulaDialog: false,
        rounds: [],
        attempts: [],
		compId: 0,
		catId: 0,
        resultHeaders:[
            {text: 'Команда', value: 'team_id'},
            {text: 'Раунд', value: 'attempt_id'},
            {text: 'Время', value: 'attempt_time'},
            {text: 'Итоговый результат заезда', value: 'attempt_score'},
        ]
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

		log(s){
			console.log(s)
		},

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
        addParticipant(){
		    this.temp.participants.push({name: '', team_role: ''})
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
		    this.protocolEditorDialog.show = true
		},
		passToFormulaEditor(protocol){
			console.log("Result protocol: ", protocol)
			this.protocolEditorDialog.protocol = protocol
			this.formulaEditorDialog.show = true
		},
		saveFormulaProtocol(formula){
			this.formulaEditorDialog.formula = formula
			this.protocolEditorDialog.protocol.fields.forEach(ent => {
				delete ent.icon
			})
			let res = {
				name: this.protocolEditorDialog.protocol.name,
				protocol_description: this.protocolEditorDialog.protocol.fields,
				formula_description: this.formulaEditorDialog.formula
			}
			console.log("Result obj: ", res)
			this.$axios.$post(`/v1/competition/${this.compId}/category/${this.catId}/formula-protocol`, res).then(res=>{
				this.getFormulas(this.compId, this.catId)
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
        addRound(compId, catId, name){
            return this.$axios.$post(`/v1/competition/${compId}/category/${catId}/attempt/`, { name: name})
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
			    name: '',
			    roundId: 0,
            }
        },
        submitRound(){
            this.addRound(this.compId, this.catId, this.createRoundDialog.name).then(res=>{
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
	        Object.entries(this.createAttemptDialog.results).forEach(entry =>{
		        const [key, value] = entry;
				if(typeof(value) === 'string')
					this.createAttemptDialog.results[key] = parseInt(value)
		        else if(typeof(value) === 'boolean')
					this.createAttemptDialog.results[key] = (value ? 1 : 0)
	        })
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

                },
			    fields: [],
            }
        },
		getFieldsFromRound(){
			console.log("getting fields")
			this.createAttemptDialog.fields = []
			this.createAttemptDialog.results = {}
			this.rounds.find(x => x.id===this.createAttemptDialog.round)
				.formula_protocol.protocol_description.forEach(field => {
					//console.log(field)
					if(field.type!=='separator')
						this.createAttemptDialog.results[field.name] = 0
					this.createAttemptDialog.fields.push(field)
			})
			//console.log(this.createAttemptDialog.results)
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
