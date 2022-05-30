<template>
	<v-container fluid class="fill-height fill-width pa-0 ma-0">
		<v-row justify="center" align="center">
			<v-col cols="1">
				<v-btn large @click="$router.push('/competitions')">
					Соревнования
				</v-btn>
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
export default {
	layout: "default",
	name: "index.vue"
}
</script>

<style scoped>

</style>
