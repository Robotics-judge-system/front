<template>
    <v-snackbar v-model="show" bottom right :timeout="6000" :color="color" elevation="1" class="toast subtitle-1">
        <v-icon dark class="mr-3">{{ icon }}</v-icon>
        {{ content }}
    </v-snackbar>
</template>

<script>
export default {
    data() {
        return {
            show: false,
            icon: "",
            content: "",
            color: ""
        };
    },
    created() {
        this.$store.subscribe((mutation, state) => {
            if (mutation.type === "showToast") {
                this.icon = state.toast.icon;
                this.content = state.toast.content;
                this.color = state.toast.color;
                this.show = true;
            }
        });
    }
};
</script>

<style>
@media only screen and (min-width: 600px) {
    .toast {
        bottom: 30px !important;
        right: 30px !important;
    }
    .toast .v-snack__wrapper {
        min-width: auto !important;
    }
}
</style>
