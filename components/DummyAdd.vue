<template>
	<v-card>
		<v-card-title>
			{{name}} пока нет
		</v-card-title>
		<v-card-text>Вы можете добавить нажав по кнопке в строке заголовка</v-card-text>
	</v-card>
</template>

<script>
export default {
	name: "DummyAdd",
	props: ["name"]
}
</script>

<style scoped>

</style>
