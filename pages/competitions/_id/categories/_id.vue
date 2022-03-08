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
								<DummyAdd name="Судей"></DummyAdd>
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
								<DummyAdd name="Команд"></DummyAdd>
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
								<DummyAdd name="Форм"></DummyAdd>
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
								<DummyAdd name="Формул"></DummyAdd>
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
							<DummyAdd name="Заездов"></DummyAdd>
						</perfect-scrollbar>
					</v-card-text>
				</v-card>
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
import DummyAdd from "@/components/DummyAdd";

export default {
	layout: "default",
	components: {DummyAdd},
	data: ()=>({

	}),
	mounted(){
		console.log(this.$route.params.id)
	}
}
</script>

<style scoped>
.col{
	padding-bottom: 0;
	padding-top: 0;
}
</style>