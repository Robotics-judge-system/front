<template>
	<v-container fluid class="fill-height fill-width pa-0 ma-0">
		<CreateCategoryDialog :show.sync="createCatDialog" :id="compId"></CreateCategoryDialog>
		<v-row justify="center" no-gutters>
			<v-col cols="11" sm="11" md="6" lg="5" xl="4">
				<v-row justify="center">
					<v-card height="calc(100vh - 50px)" width="100%" color="transparent" elevation="0" rounded class="">
						<v-card-text class="pa-0 ma-0">
							<perfect-scrollbar style="height: calc(100vh - 50px)" class="pr-2">
								<v-card class="ma-2" color="light-green accent-2">
									<v-card-title class="ma-2">
										<v-row align="center" @click="createCatDialog = true">
											Создать категорию
											<v-spacer></v-spacer>
											<v-btn icon><v-icon>mdi-plus</v-icon></v-btn>
										</v-row>
									</v-card-title>
								</v-card>
								<v-card @click="pushToCategory(cat)" v-for="cat in categories" :key="cat.id" rounded class="ma-2">
									<v-card-title>
										<v-icon class="mr-2">mdi-file-jpg-box</v-icon>
										{{cat.name}}
									</v-card-title>
									<v-card-text>
<!--										<div>
											Дата начала: {{moment(cat.date_from).format("dddd, MMMM Do YYYY, hh:mm:ss") }}
										</div>
										<div>
											Дата окончания: {{moment(cat.date_to).format("dddd, MMMM Do YYYY, hh:mm:ss") }}
										</div>-->
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
import CreateCategoryDialog from "@/components/CreateCategoryDialog";


export default {
	layout: "default",
	components:{CreateCategoryDialog},
	data: () => ({
		compId: 0,
		categories: [],
		createCatDialog: false,
	}),
	mounted () {
		this.compId = this.$route.params.compId
		this.getCategories(this.compId)
	},
	methods: {

		viewInfo(comp){
			console.log(comp.name)
		},
		getCategories(id) {
			this.$axios.$get(`/v1/competition/${id}/category`)
				.then(res => {
					this.categories = res
				})
				.catch(err => {
					this.$toast.error(err)
				})
		},
		moment(date) {
			return this.$moment(date);
		},
		pushToCategory(cat){
			this.$store.commit("updateCurrentEntity", cat)
			this.$router.push(this.$route.fullPath + '/' + cat.id)
		}
	},
	watch:{
		createCatDialog(nv){
			if(!nv)
				this.getCategories(this.compId)
		}
	}
}
</script>

<style scoped>

</style>
