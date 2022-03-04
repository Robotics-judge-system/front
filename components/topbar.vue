<template>
    <v-toolbar height="50px"
               color="transparent"
               elevation="0"
               style="position: fixed;
                      top: 1vh;
                      bottom: 0;
                      right: 1vw;
                      left: 0;
                      z-index: 2"
    >
        <v-spacer></v-spacer>
        <v-menu
            v-model="menu"
            :close-on-content-click="false"
            :close-on-click="true"
            :nudge-width="300"
            offset-y
            nudge-top="-10"
        >
            <template v-slot:activator="{ on, attrs }">
                <v-btn
                    icon
                    color="#FBAE3C"
                    v-bind="attrs"
                    v-on="on"
                >
                    <v-icon>
                        mdi-account
                    </v-icon>
                </v-btn>
            </template>

            <v-card>
<!--
TODO: Может лист и не нужен, но на будущее
-->
                <v-list>
                    <v-list-item>
                        <v-list-item-avatar>
                            <v-icon>
                                mdi-human
                            </v-icon>
                        </v-list-item-avatar>

                        <v-list-item-content>
                            <v-list-item-title>{{$auth.user.name}}</v-list-item-title>
                            <v-list-item-subtitle>{{$auth.user.email}}</v-list-item-subtitle>
                        </v-list-item-content>

                        <v-list-item-action>
                            <v-btn icon @click="logout">
                                <v-icon color="red darken-2">mdi-exit-run</v-icon>
                            </v-btn>
                        </v-list-item-action>
                    </v-list-item>
                </v-list>


            </v-card>
        </v-menu>

    </v-toolbar>
</template>

<script>
export default {
    name: "topbar.vue",
    data: () => ({
        menu: false,
    }),
    methods: {
        logout(){
            this.$auth.logout().then(() => {
                this.$router.push("/login");
            }).catch((err)=>{
                this.$toast.error(err)
            })
        }
    }
}
</script>

<style scoped>

</style>
