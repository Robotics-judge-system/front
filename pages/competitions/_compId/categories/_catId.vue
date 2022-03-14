<template>
	<v-container fluid class="fill-height fill-width ma-0 pa-0 px-6">
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
							<v-btn icon outlined small color="#FBAE3C"><v-icon>mdi-plus</v-icon></v-btn>
						</v-card-title>
						<v-card-text class="pa-0 ma-0">
							<perfect-scrollbar style="height: calc(50vh - 64px - 25px);" class="px-2">
								<DummyAdd name="Команд" v-if="teams.length===0"></DummyAdd>
							</perfect-scrollbar>
						</v-card-text>
					</v-card>
				</v-row>
			</v-col>
			<v-col cols="4">
				<v-row justify="center" align="center" class="">
					<v-card width="100%" color="transparent" elevation="0">
						<v-card-title class="white--text pr-2">
							Формы протоколов
							<v-spacer></v-spacer>
							<v-btn icon outlined small color="#FBAE3C"><v-icon>mdi-plus</v-icon></v-btn>
						</v-card-title>
						<v-card-text class="pa-0 ma-0">
							<perfect-scrollbar style="height: calc(50vh - 64px - 25px);" class="px-2">
								<DummyAdd name="(TBD) Форм" v-if="forms.length===0"></DummyAdd>
							</perfect-scrollbar>
						</v-card-text>
					</v-card>
				</v-row>
				<v-row justify="center" align="center" class="">
					<v-card width="100%" color="transparent" elevation="0">
						<v-card-title class="white--text pr-2">
							Формулы рассчета протоколов
							<v-spacer></v-spacer>
							<v-btn icon outlined small color="#FBAE3C"><v-icon>mdi-plus</v-icon></v-btn>
						</v-card-title>
						<v-card-text class="pa-0 ma-0">
							<perfect-scrollbar style="height: calc(50vh - 64px - 25px);" class="px-2">
								<DummyAdd name="Формул" v-if="formulas.length===0"></DummyAdd>
							</perfect-scrollbar>
						</v-card-text>
					</v-card>
				</v-row>
			</v-col>
			<v-col cols="4">
				<v-card height="calc(100vh - 50px)" color="transparent" elevation="0">
					<v-card-title class="white--text pr-2">
						Заезды
						<v-spacer></v-spacer>
						<v-btn icon outlined small color="#FBAE3C"><v-icon>mdi-plus</v-icon></v-btn>
					</v-card-title>
					<v-card-text class="pa-0 ma-0">
						<perfect-scrollbar style="height: calc(100vh - 64px - 50px);" class="px-2">
							<DummyAdd name="Заездов" v-if="attempts.length===0"></DummyAdd>
						</perfect-scrollbar>
					</v-card-text>
				</v-card>
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
		judges:[],
		teams: [],
		forms: [],
		formulas: [],
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
		this.getAttempts(this.compId, this.catId)
		this.getTeams(this.compId, this.catId)
		this.getFormulas(this.compId, this.catId)
	},
	methods:{
		...mapActions({
			getEntity: "getEntity"
		}),

		getTeams(compId, catId){
			this.$axios.$get(`/v1/competition/${compId}/category/${catId}/team`).then(res=>{
				console.log('teams: ', res)
				this.teams = res
			}).catch(err=>{
				this.$toast.error(this.getHumanMessage(err))
			})
		},
		getFormulas(compId, catId){
			this.$axios.$get(`/v1/competition/${compId}/category/${catId}/formula-protocol`).then(res=>{
				console.log('formulas: ', res)
				this.formulas = res
			}).catch(err=>{
				this.$toast.error(this.getHumanMessage(err))
			})
		},
		addFormula(compId, catId){
			this.$axios.$get(`/v1/competition/${compId}/category/${catId}/formula-protocol`).then(res=>{
				this.getFormulas(compId, catId)
			}).catch(err=>{
				this.$toast.error(this.getHumanMessage(err))
			})
		},
		getAttempts(compId, catId){
			this.$axios.$get(`/v1/competition/${compId}/category/${catId}/attempt`).then(res=>{
				console.log('attempts: ', res)
				this.attempts = res
			}).catch(err=>{
				this.$toast.error(this.getHumanMessage(err))
			})
		},


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