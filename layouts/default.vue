<template>
    <v-app>
        <v-main class="app-background">
            <img src="@/static/joust_icon1.svg" style="z-index: 0; position: fixed; top: 10vh; bottom: 0; right: 0; left: 0; width: 100%; height:100%; opacity: 0.15;">
            <topbar></topbar>
            <app-toast></app-toast>
            <nuxt style="height: calc(100vh - 50px)"/>
        </v-main>
    </v-app>
</template>

<script>
export default {
    name: "default.vue"
}
</script>

<style scoped>

</style>
