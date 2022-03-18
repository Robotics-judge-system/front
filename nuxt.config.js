import colors from 'vuetify/es5/util/colors'

export default {
    ssr: false,
    // Global page headers (https://go.nuxtjs.dev/config-head)
    head: {
        titleTemplate: 'front',
        title: 'front',
        meta: [
            {charset: 'utf-8'},
            {name: 'viewport', content: 'width=device-width, initial-scale=1'},
            {hid: 'description', name: 'description', content: ''}
        ],
        link: [
            {rel: 'icon', type: 'image/x-icon', href: '/favicon.ico'}
        ]
    },

    // Global CSS (https://go.nuxtjs.dev/config-css)
    css: [
        "~/assets/main.css"
    ],

    // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
    plugins: [
        '~/plugins/axios',
        '~/plugins/plugins',
        '~/plugins/toast'
    ],

    // Auto import components (https://go.nuxtjs.dev/config-components)
    components: true,

    // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
    buildModules: [
        // https://go.nuxtjs.dev/vuetify
        '@nuxtjs/vuetify',
        '@nuxtjs/moment',
    ],

    moment: {
        defaultLocale: 'ru',
        locales: ['ru']
    },
    // Modules (https://go.nuxtjs.dev/config-modules)
    modules: [
        // https://go.nuxtjs.dev/axios
        '@nuxtjs/axios',
        '@nuxtjs/auth-next'
    ],

    // Axios module configuration (https://go.nuxtjs.dev/config-axios)
    // baseURL: "http://192.168.0.101:8080/api/",
    axios: {
        baseURL: "http://80.89.192.250:8080/api/",

        credentials: true
    },
    auth: {
        strategies: {
            local: {
                scheme: 'refresh',
                token: {
                    property: 'token',
                    type: "Bearer "
                },
                refreshToken: {
                    property: 'refresh_token',
                    data: 'refresh',
                    maxAge: 60 * 60 * 24 * 30
                },
                user: {
                    property: false,
                    autoFetch: true,
                },
                endpoints: {
                    login: {url: '/v1/auth/login', method: 'post'},
                    refresh: {url: '/v1/auth/refresh', method: 'post'},
                    user: {url: '/v1/self', method: 'get'},
                    logout: false
                }
            }
        }
    },
    router: {
        middleware: ['auth']
    },

    // Vuetify module configuration (https://go.nuxtjs.dev/config-vuetify)
    vuetify: {
        customVariables: ['~/assets/variables.scss'],
        theme: {
            dark: false,
            themes: {
                dark: {
                    primary: colors.blue.darken2,
                    accent: colors.grey.darken3,
                    secondary: colors.amber.darken3,
                    info: colors.teal.lighten1,
                    warning: colors.amber.base,
                    error: colors.deepOrange.accent4,
                    success: colors.green.accent3
                }
            }
        }
    },


    // Build Configuration (https://go.nuxtjs.dev/config-build)
    build: {}
}
