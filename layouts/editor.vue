<template>
    <v-app>
        <v-main class="app-background">
            <topbar></topbar>
            <app-toast></app-toast>
            <nuxt style="height: calc(100vh - 50px)"/>
        </v-main>
    </v-app>
</template>

<script>
export default {
name: "editor"
}
</script>

<style scoped>

</style>
