<template>
    <v-container fluid class="fill-height">
        <img src="@/static/joust_icon1.svg" style="z-index: 0; position: fixed; top: 10vh; bottom: 0; right: 0; left: 0; width: 100%; height:100%; opacity: 0.075;">
        <v-toolbar height="50px" color="transparent" elevation="0"
                   style="position: fixed; top: 1vh; bottom: 0; right: 1vw; left: 0; z-index: 2">
            <v-spacer></v-spacer>
            <v-btn
                :disabled="reqLoading"
                text
                color="#eb934b"
                @click="state = !state"
            >
                {{ state ? "Регистрация" : "Вход" }}
            </v-btn>
        </v-toolbar>
        <v-row no-gutters justify="center" align="center">
            <img src="@/static/joust.svg" :style="`height: ${state? '45vh': '25vh'}`"
                 style="min-width: 400px; max-width: 850px; margin-bottom: 20px; z-index: 1">
        </v-row>
        <v-row no-gutters style="z-index: 2; position: relative; height: 50vh" justify="center">
            <v-form>
                <ValidationObserver ref="regFields">
                    <ValidationProvider name="Email" rules="email|required" v-slot="{ errors, valid }">
                        <v-text-field
                            v-model="email"
                            solo
                            background-color="#eb934b"
                            color="black"
                            label="E-mail"
                            autocomplete="email"
                            prepend-inner-icon="mdi-at"
                            :error-messages="errors"
                            :success="valid"
                        ></v-text-field>
                    </ValidationProvider>
                    <ValidationProvider v-if="!state" name="Имя Фамилия" rules="required|regex:^[A-Z][a-z]+\s[A-Z][a-z]+$" v-slot="{ errors, valid }">
                        <v-text-field
                            v-model="name"
                            solo
                            background-color="#eb934b"
                            color="black"
                            label="Имя Фамилия"
                            prepend-inner-icon="mdi-card-account-details-outline"
                            :error-messages="errors"
                            :success="valid"
                        ></v-text-field>
                    </ValidationProvider>
                    <ValidationProvider v-if="!state" name="Никнейм" rules="required|min: 3|max: 20" v-slot="{ errors, valid }">
                        <v-text-field
                            v-model="username"
                            solo
                            background-color="#eb934b"
                            color="black"
                            autocomplete="username"
                            label="Никнейм"
                            prepend-inner-icon="mdi-account"
                            :error-messages="errors"
                            :success="valid"
                        ></v-text-field>
                    </ValidationProvider>
                    <ValidationProvider name="Пароль" rules="required|min: 1" v-slot="{errors, valid}" vid="pass">
                        <v-text-field
                            v-model="pass"
                            solo
                            background-color="#eb934b"
                            color="black"
                            type="password"
                            label="Пароль"
                            autocomplete="current-password"
                            prepend-inner-icon="mdi-form-textbox-password"
                            :error-messages="errors"
                            :success="valid"
                        ></v-text-field>
                    </ValidationProvider>
                    <ValidationProvider v-if="!state" name="повтор пароля" rules="required|confirmed:pass" v-slot="{errors, valid}">
                        <v-text-field
                            v-model="pass2"
                            solo
                            background-color="#eb934b"
                            color="black"
                            type="password"
                            label="Повтор пароля"
                            autocomplete="second-password"
                            prepend-inner-icon="mdi-form-textbox-password"
                            :error-messages="errors"
                            :success="valid"
                        ></v-text-field>
                    </ValidationProvider>
                </ValidationObserver>
                <v-row class="mr-0 mt-1">
                    <v-btn
                        :disabled="reqLoading"
                        depressed
                        v-if="state"
                        text
                        style="font-size: 12px"
                        height="15px"
                        color="#eb934b"
                    >
                        Забыли пароль?
                    </v-btn>
                    <v-spacer></v-spacer>
                    <v-btn
                        :loading="reqLoading"
                        @click="state?signIn():signUp()"
                        outlined
                        color="#eb934b"
                    >
                        {{ state ? "Войти" : "Зарегистрироваться" }}
                    </v-btn>
                </v-row>
            </v-form>
        </v-row>
        <v-row style="z-index: 1;">
            <vue-wavify fill="#3f1637"
                        :points="9"
                        :amplitude="20"
                        :speed="0.15"
                        style="position: fixed; bottom: 0; top: 77vh; left: 0; right: 0;"
                        :style="`width:${waves[0].width}%`"/>
            <vue-wavify fill="#9f3c4e"
                        :points="7"
                        :amplitude="25"
                        :speed="0.17"
                        style="position: fixed; bottom: 0; top: 82vh; left: 0; right: 0;"
                        :style="`width:${waves[0].width}%`"/>
            <vue-wavify fill="#E98145"
                        :points="5"
                        :amplitude="35"
                        :speed="0.19"
                        style="position: fixed; bottom: 0; top: 87vh; left: 0; right: 0;"
                        :style="`width:${waves[0].width}%`"/>
            <vue-wavify fill="#FBAE3C"
                        :points="3"
                        :amplitude="40"
                        :speed="0.21"
                        style="position: fixed; bottom: 0; top: 92vh; left: 0; right: 0;"
                        :style="`width:${waves[0].width}%`"/>
        </v-row>
<!--        <vue-wavify fill="url(#gradient)"
                    :points="4"
                    :amplitude="100"
                    :speed="0.1"
                    style="position: fixed; bottom: 0; top: 5vh; left: 0; right: 0; z-index: 0; opacity: 0.3;"
                    mask="url(#mask)">
            <defs>
                <linearGradient id="gradient">
                    <stop offset="0%" style="stop-color:#c3447d;"/>
                    <stop offset="100%" style="stop-color:#fbae3c;"/>
                </linearGradient>
                <mask id="mask">
                    &lt;!&ndash;                    <svg id="Слой_1" data-name="Слой 1" xmlns="http://www.w3.org/2000/svg"
                                             xmlns:xlink="http://www.w3.org/1999/xlink" width="100%" height="100%"
                                             viewBox="0 0 1065 1121.45">
                                            <defs>
                                                <style>.cls-1, .cls-2, .cls-3, .cls-4, .cls-5, .cls-6, .cls-7, .cls-8, .cls-9 {
                                                    stroke-miterlimit: 10;
                                                }

                                                .cls-1 {
                                                    fill: url(#Безымянный_градиент_56);
                                                    stroke: url(#Безымянный_градиент_14);
                                                }

                                                .cls-2 {
                                                    fill: url(#Безымянный_градиент_56-2);
                                                    stroke: url(#Безымянный_градиент_14-2);
                                                }

                                                .cls-3 {
                                                    fill: url(#Безымянный_градиент_56-3);
                                                    stroke: url(#Безымянный_градиент_14-3);
                                                }

                                                .cls-4 {
                                                    fill: url(#Безымянный_градиент_56-4);
                                                    stroke: url(#Безымянный_градиент_14-4);
                                                }

                                                .cls-5 {
                                                    fill: url(#Безымянный_градиент_56-5);
                                                    stroke: url(#Безымянный_градиент_14-5);
                                                }

                                                .cls-6 {
                                                    fill: url(#Безымянный_градиент_56-6);
                                                    stroke: url(#Безымянный_градиент_14-6);
                                                }

                                                .cls-7 {
                                                    fill: url(#Безымянный_градиент_56-7);
                                                    stroke: url(#Безымянный_градиент_14-7);
                                                }

                                                .cls-8 {
                                                    fill: url(#Безымянный_градиент_56-8);
                                                    stroke: url(#Безымянный_градиент_14-8);
                                                }

                                                .cls-9 {
                                                    fill: url(#Безымянный_градиент_56-9);
                                                    stroke: url(#Безымянный_градиент_14-9);
                                                }</style>
                                                <linearGradient id="Безымянный_градиент_56" x1="372.35" y1="4.76" x2="518.57"
                                                                y2="157.05" gradientUnits="userSpaceOnUse">
                                                    <stop offset="0" stop-color="#c3447d"/>
                                                    <stop offset="0.28" stop-color="#d15e6d"/>
                                                    <stop offset="0.88" stop-color="#f39f45"/>
                                                    <stop offset="1" stop-color="#fbae3c"/>
                                                </linearGradient>
                                                <linearGradient id="Безымянный_градиент_14" x1="428.08" y1="85" x2="428.27" y2="85"
                                                                gradientUnits="userSpaceOnUse">
                                                    <stop offset="0" stop-color="#fff"/>
                                                    <stop offset="1"/>
                                                </linearGradient>
                                                <linearGradient id="Безымянный_градиент_56-2" x1="765.9" y1="146.44" x2="841.34"
                                                                y2="225.02" xlink:href="#Безымянный_градиент_56"/>
                                                <linearGradient id="Безымянный_градиент_14-2" x1="774.14" y1="188.04" x2="774.43"
                                                                y2="188.04" xlink:href="#Безымянный_градиент_14"/>
                                                <linearGradient id="Безымянный_градиент_56-3" x1="581.04" y1="20.95" x2="697.67"
                                                                y2="142.43" xlink:href="#Безымянный_градиент_56"/>
                                                <linearGradient id="Безымянный_градиент_14-3" x1="621.25" y1="85" x2="621.45" y2="85"
                                                                xlink:href="#Безымянный_градиент_14"/>
                                                <linearGradient id="Безымянный_градиент_56-4" x1="874.98" y1="30.64" x2="943.31"
                                                                y2="101.82" xlink:href="#Безымянный_градиент_56"/>
                                                <linearGradient id="Безымянный_градиент_14-4" x1="894.73" y1="68.02" x2="894.88"
                                                                y2="68.02" xlink:href="#Безымянный_градиент_14"/>
                                                <linearGradient id="Безымянный_градиент_56-5" x1="426.96" y1="633.3" x2="493.27"
                                                                y2="702.36" xlink:href="#Безымянный_градиент_56"/>
                                                <linearGradient id="Безымянный_градиент_14-5" x1="446.13" y1="669.73" x2="446.27"
                                                                y2="669.73" xlink:href="#Безымянный_градиент_14"/>
                                                <linearGradient id="Безымянный_градиент_56-6" x1="-0.49" y1="141.82" x2="1009.97"
                                                                y2="1194.28" xlink:href="#Безымянный_градиент_56"/>
                                                <linearGradient id="Безымянный_градиент_14-6" x1="281.72" y1="722.16" x2="284"
                                                                y2="722.16" xlink:href="#Безымянный_градиент_14"/>
                                                <linearGradient id="Безымянный_градиент_56-7" x1="206.77" y1="428.33" x2="417.56"
                                                                y2="647.88" xlink:href="#Безымянный_градиент_56"/>
                                                <linearGradient id="Безымянный_градиент_14-7" x1="282.28" y1="544.19" x2="282.6"
                                                                y2="544.19" xlink:href="#Безымянный_градиент_14"/>
                                                <linearGradient id="Безымянный_градиент_56-8" x1="200.86" y1="99" x2="362.69"
                                                                y2="267.55" xlink:href="#Безымянный_градиент_56"/>
                                                <linearGradient id="Безымянный_градиент_14-8" x1="254.6" y1="188.04" x2="254.89"
                                                                y2="188.04" xlink:href="#Безымянный_градиент_14"/>
                                                <linearGradient id="Безымянный_градиент_56-9" x1="145.26" y1="29.82" x2="214.03"
                                                                y2="101.45" xlink:href="#Безымянный_градиент_56"/>
                                                <linearGradient id="Безымянный_градиент_14-9" x1="165.24" y1="67.48" x2="165.39"
                                                                y2="67.48" xlink:href="#Безымянный_градиент_14"/>
                                            </defs>
                                            <g id="Слой_2" data-name="Слой 2">
                                                <path class="cls-1"
                                                      d="M428,142.3c4.36,16.28,17.77,27.65,32.61,27.65a23.15,23.15,0,0,0,9.07-1.41c18.15-5.22,28.94-26.4,23.62-46L471.11,27.49C467,13.47,456.1,2.9,443.23.55a28.7,28.7,0,0,0-5.35-.49,31.38,31.38,0,0,0-9,1.38c-18.17,6.52-28.29,26.77-23.1,45.8Z"
                                                      transform="translate(0.72 0.45)"/>
                                                <path class="cls-2"
                                                      d="M772.55,263.66c8.75,0,17.75-4.35,24.08-11.63L863,175.91c13-15,12.9-38.41,0-52-6.45-7.42-15.09-11.51-24.32-11.51a30.5,30.5,0,0,0-23.84,11.51l-66.21,76.24c-13,14.93-12.87,38.31,0,51.87C755,259.42,763.75,263.66,772.55,263.66Z"
                                                      transform="translate(0.72 0.45)"/>
                                                <path class="cls-3"
                                                      d="M621.71,168.31a24.38,24.38,0,0,0,9.73,1.64c14.85,0,28.26-11.37,32.68-27.91l22.19-94.93c4.29-19.76-5.66-39.4-23.66-45.84A30.71,30.71,0,0,0,654.14.05a29.51,29.51,0,0,0-5.38.5C635.24,3,624,14.46,620.92,28.84L598.73,122.7C594.44,142.46,604.39,162.1,621.71,168.31Z"
                                                      transform="translate(0.72 0.45)"/>
                                                <path class="cls-4"
                                                      d="M882,88.77a25.11,25.11,0,0,0,4.21,6,26.12,26.12,0,0,0,6.42,5.7,14,14,0,0,1,1.42,1,29.83,29.83,0,0,0,2.87,1.89A19.12,19.12,0,0,0,901,105a5.23,5.23,0,0,1,.89.31l4.12,1.09h5.11c9.82,0,19-4.56,24.3-11.87a27.26,27.26,0,0,0,4.59-6.78c.33-.74.64-1.32,1-1.9.51-.93,1-1.88,1.53-3.08a22.23,22.23,0,0,0,1.36-4.52,9.44,9.44,0,0,1,.33-1.33,22,22,0,0,0,1.62-9.1c0-10.61-3.75-20.29-9.76-26-6.86-7.88-15.72-12.22-25-12.22a30.94,30.94,0,0,0-6.18.63c-3.21.28-5.72,1.75-8,3.08a29.57,29.57,0,0,0-5.29,3.59,25.61,25.61,0,0,0-5.86,5.5c-6.18,8.52-9.19,16.84-9.19,25.42v5.82A22.51,22.51,0,0,0,879,82.79,34.75,34.75,0,0,0,882,88.77Z"
                                                      transform="translate(0.72 0.45)"/>
                                                <path class="cls-5"
                                                      d="M462,632.63c-18.31,0-33.19,16.64-33.19,37.1s14.88,37.11,33.19,37.11,33.19-16.64,33.19-37.11S480.25,632.63,462,632.63Z"
                                                      transform="translate(0.72 0.45)"/>
                                                <path class="cls-6"
                                                      d="M937.05,414.54a1.83,1.83,0,0,1-.51-1.78,512.18,512.18,0,0,0,2.54-51.83c0-20.11-15.2-37.11-33.19-37.11H157.67c-18.3,0-33.19,16.65-33.19,37.11a509.69,509.69,0,0,0,2.62,52.4,1.75,1.75,0,0,1-.45,1.15C54,431.91.63,506.46-.22,591.81-.22,610.4,11,626,27.32,629.74a30.11,30.11,0,0,0,5.53.51c9.17,0,17.71-4.12,24-11.6a39.93,39.93,0,0,0,9.25-25.88C66.15,542.06,97,498.1,139,488.22a3.16,3.16,0,0,1,.71.67c45.23,187.64,188.9,324.88,358.5,341.93a3.16,3.16,0,0,1,.41,1.49v97.17a6.46,6.46,0,0,1-.15,1.37H373.82c-18.61,0-33.18,16.3-33.18,37.11v77a6.46,6.46,0,0,1-.15,1.37H209.21c-18.17,0-33.79,15.58-34.83,34.76a39.7,39.7,0,0,0,10.6,29.33,31.15,31.15,0,0,0,22.57,10.12H373.82c18.61,0,33.19-16.3,33.19-37.11v-77a6.46,6.46,0,0,1,.15-1.37l249.1-.22a3.17,3.17,0,0,1,.29,1.59v38.49a7.71,7.71,0,0,1-.14,1.37H491.88c-18.18,0-33.81,15.58-34.84,34.76a39.7,39.7,0,0,0,10.6,29.33,31.11,31.11,0,0,0,22.57,10.12H854.35c18.17,0,33.79-15.58,34.83-34.76a39.72,39.72,0,0,0-10.6-29.32A31.1,31.1,0,0,0,856,1046.29l-132.8.21a3.06,3.06,0,0,1-.29-1.58V968c0-20.81-14.57-37.11-33.18-37.11l-124.48.22a3.17,3.17,0,0,1-.29-1.59V831.35a1.65,1.65,0,0,1,.83-1.49C734.55,814,878.38,676.68,924,487.28c41.81,9.86,72.7,53.07,73.45,102.61,0,20.27,13.87,37.77,31,39,.68,0,1.35.07,2,.07,18.7,0,33.35-16.32,33.35-37.16C1063.78,505.46,1010.37,430.87,937.05,414.54ZM531.78,757.69C356.66,757.69,209,600.84,192.31,399H871.25C854.57,600.84,706.91,757.69,531.78,757.69Z"
                                                      transform="translate(0.72 0.45)"/>
                                                <path class="cls-7"
                                                      d="M381.11,581.93C347.69,550.81,322,510.41,306.79,465c-5-14.48-17.22-23.83-31.13-23.83a31.12,31.12,0,0,0-12.54,2.69c-16.55,7.65-24.68,28.54-18.43,47.82,20.82,57.2,53.45,107.86,94.37,146.51l.63.54c5.1,3.92,12.08,8.44,20.83,8.44,10,0,19.1-4.94,26-14.26C397.14,616.93,394.66,594,381.11,581.93Z"
                                                      transform="translate(0.72 0.45)"/>
                                                <path class="cls-8"
                                                      d="M295.37,252c6.33,7.28,15.34,11.63,24.08,11.63s17.75-4.35,24.09-11.63c13-14.92,12.87-38.31,0-51.87l-66.33-76.24a32.15,32.15,0,0,0-24.44-11.51A30,30,0,0,0,229,123.92c-13,15-12.91,38.4,0,52Z"
                                                      transform="translate(0.72 0.45)"/>
                                                <path class="cls-9"
                                                      d="M149,77.33a21.89,21.89,0,0,0,1.33,4.48,33.31,33.31,0,0,0,3.09,5.89,25.49,25.49,0,0,0,4.21,6A26.17,26.17,0,0,0,164,99.37a11.33,11.33,0,0,1,1.2.86,25.46,25.46,0,0,0,3.09,2.13,19,19,0,0,0,5.1,1.88l4.12,1.1h5c9.82,0,19-4.56,24.08-11.64a38.42,38.42,0,0,0,9.77-25.86c0-9.59-4.8-20.64-11.43-26.95a31.32,31.32,0,0,0-30.31-10.64c-3.2.28-5.7,1.74-8,3.08a34.52,34.52,0,0,0-4.65,3,19.58,19.58,0,0,0-5.21,4.52A38.63,38.63,0,0,0,147.11,67a21.24,21.24,0,0,0,1.52,9A7.18,7.18,0,0,1,149,77.33Z"
                                                      transform="translate(0.72 0.45)"/>
                                            </g>
                                        </svg>&ndash;&gt;
                    <svg id="Слой_1" data-name="Слой 1" xmlns="http://www.w3.org/2000/svg"
                         xmlns:xlink="http://www.w3.org/1999/xlink" width="100%" height="100%"
                         viewBox="0 0 1065 797.68">
                        <defs>
                            <style>.cls-1, .cls-2, .cls-3 {
                                stroke-miterlimit: 10;
                            }

                            .cls-1 {
                                fill: url(#Безымянный_градиент_60);
                                stroke: url(#Безымянный_градиент_14);
                            }

                            .cls-2 {
                                fill: url(#Безымянный_градиент_60-2);
                                stroke: url(#Безымянный_градиент_14-2);
                            }

                            .cls-3 {
                                fill: url(#Безымянный_градиент_60-3);
                                stroke: url(#Безымянный_градиент_14-3);
                            }</style>
                            <linearGradient id="Безымянный_градиент_60" x1="206.77" y1="104.33" x2="417.56" y2="323.88"
                                            gradientUnits="userSpaceOnUse">
                                <stop offset="0" stop-color="#c3447d"/>
                                <stop offset="0.28" stop-color="#d15e6d"/>
                                <stop offset="0.88" stop-color="#f39f45"/>
                                <stop offset="1" stop-color="#fbae3c"/>
                            </linearGradient>
                            <linearGradient id="Безымянный_градиент_14" x1="282.28" y1="220.19" x2="282.6" y2="220.19"
                                            gradientUnits="userSpaceOnUse">
                                <stop offset="0" stop-color="#fff"/>
                                <stop offset="1"/>
                            </linearGradient>
                            <linearGradient id="Безымянный_градиент_60-2" x1="-0.49" y1="-182.18" x2="1009.97"
                                            y2="870.28" xlink:href="#Безымянный_градиент_60"/>
                            <linearGradient id="Безымянный_градиент_14-2" x1="281.72" y1="398.16" x2="284" y2="398.16"
                                            xlink:href="#Безымянный_градиент_14"/>
                            <linearGradient id="Безымянный_градиент_60-3" x1="426.96" y1="309.3" x2="493.27" y2="378.36"
                                            xlink:href="#Безымянный_градиент_60"/>
                            <linearGradient id="Безымянный_градиент_14-3" x1="446.13" y1="345.73" x2="446.27"
                                            y2="345.73" xlink:href="#Безымянный_градиент_14"/>
                        </defs>
                        <g id="Слой_2" data-name="Слой 2">
                            <path class="cls-1"
                                  d="M381.11,257.93C347.69,226.81,322,186.41,306.79,141c-5-14.48-17.22-23.83-31.13-23.83a31.12,31.12,0,0,0-12.54,2.69c-16.55,7.65-24.68,28.54-18.43,47.82,20.82,57.2,53.45,107.86,94.37,146.51l.63.54c5.1,3.92,12.08,8.44,20.83,8.44,10,0,19.1-4.94,26-14.26C397.14,292.93,394.66,270,381.11,257.93Z"
                                  transform="translate(0.72 0.68)"/>
                            <path class="cls-2"
                                  d="M937.05,90.54a1.83,1.83,0,0,1-.51-1.78,512.18,512.18,0,0,0,2.54-51.83c0-20.11-15.2-37.11-33.19-37.11H157.67c-18.3,0-33.19,16.65-33.19,37.11a509.69,509.69,0,0,0,2.62,52.4,1.75,1.75,0,0,1-.45,1.15C54,107.91.63,182.46-.22,267.81-.22,286.4,11,302,27.32,305.74a30.11,30.11,0,0,0,5.53.51c9.17,0,17.71-4.12,24-11.6a39.93,39.93,0,0,0,9.25-25.88C66.15,218.06,97,174.1,139,164.22a3.16,3.16,0,0,1,.71.67c45.23,187.64,188.9,324.88,358.5,341.93a3.16,3.16,0,0,1,.41,1.49v97.17a6.46,6.46,0,0,1-.15,1.37H373.82c-18.61,0-33.18,16.3-33.18,37.11v77a6.46,6.46,0,0,1-.15,1.37H209.21c-18.17,0-33.79,15.58-34.83,34.76A39.7,39.7,0,0,0,185,786.38a31.15,31.15,0,0,0,22.57,10.12H373.82c18.61,0,33.19-16.3,33.19-37.11v-77a6.46,6.46,0,0,1,.15-1.37l249.1-.22a3.17,3.17,0,0,1,.29,1.59v38.49a7.71,7.71,0,0,1-.14,1.37H491.88c-18.18,0-33.81,15.58-34.84,34.76a39.7,39.7,0,0,0,10.6,29.33,31.11,31.11,0,0,0,22.57,10.12H854.35c18.17,0,33.79-15.58,34.83-34.76a39.72,39.72,0,0,0-10.6-29.32A31.1,31.1,0,0,0,856,722.29l-132.8.21a3.06,3.06,0,0,1-.29-1.58V644c0-20.81-14.57-37.11-33.18-37.11l-124.48.22a3.17,3.17,0,0,1-.29-1.59V507.35a1.65,1.65,0,0,1,.83-1.49C734.55,490,878.38,352.68,924,163.28c41.81,9.86,72.7,53.07,73.45,102.61,0,20.27,13.87,37.77,31,39,.68,0,1.35.07,2,.07,18.7,0,33.35-16.32,33.35-37.16C1063.78,181.46,1010.37,106.87,937.05,90.54ZM531.78,433.69C356.66,433.69,209,276.84,192.31,75H871.25C854.57,276.84,706.91,433.69,531.78,433.69Z"
                                  transform="translate(0.72 0.68)"/>
                            <path class="cls-3"
                                  d="M462,308.63c-18.31,0-33.19,16.64-33.19,37.1s14.88,37.11,33.19,37.11,33.19-16.64,33.19-37.11S480.25,308.63,462,308.63Z"
                                  transform="translate(0.72 0.68)"/>
                        </g>
                    </svg>
                </mask>
            </defs>
        </vue-wavify>-->
    </v-container>
</template>

<script>
import Vue from "vue";

export default {
    layout: "login",
    components: {},
    data: () => ({
        state: true,
        email: '',
        name: '',
        username: '',
        pass: '',
        pass2: '',
        loading: false,
        waves: [],
        defWave: {width: 100},
        interval: null,
        reqLoading: false,
    }),
    beforeMount() {
        this.loading = true
        document.addEventListener("keydown", this.enterKey);
        for (let i = 0; i < 4; i++) {
            Vue.set(this.waves, i, JSON.parse(JSON.stringify(this.defWave)));
        }
        this.loading = false
    },
    beforeDestroy() {
        document.removeEventListener("keydown", this.enterKey)
    },
    methods: {
        enterKey(e){
            if(e.code === "Enter"){
                if(this.state)
                    this.signIn()
                else
                    this.signUp()
            }
        },
        signIn() {
            this.reqLoading = true
            console.log('trying to sign in')
            if (this.interval === null) {
                this.interval = setInterval(() => {
                    for (let i = 0; i < 4; i++) {
                        this.waves[i].width += 0.6
                    }
                }, 30)
            }
            this.$auth.loginWith("local", {data: {login: this.email, password: this.pass}})
                .then(res => {
                    console.log(res)
                    this.reqLoading = false
                    this.$router.push("/")
                })
                .catch(err => {
                    this.reqLoading = false
                    console.log(err)
                    clearInterval(this.interval)
                    this.interval = setInterval(() => {
                        for (let i = 0; i < 4; i++) {
                            this.waves[i].width -= 0.2
                            if (this.waves[i].width <= 105) {
                                clearInterval(this.interval)
                                this.interval = null
                            }
                        }
                    }, 30)
                })
        },
        signUp() {
            this.reqLoading = true
            console.log("trying to sign up")
            this.$refs.regFields.validate().then(res=>{
                console.log(res)
                if(res){
                    this.$axios.$post("/api/v1/register", {username: this.username, name: this.name, password: this.pass, email: this.email})
                        .then(res=>{
                            this.reqLoading = false
                            console.log(res)
                            this.signIn()
                        })
                        .catch(err=>{
                            this.reqLoading = false
                            console.log(err)
                        })
                }
            }).catch(err=>{console.warn(err)})
        },
    },
}
</script>

<style scoped>
.v-text-field >>> input {
    font-size: 21px;
    font-weight: 400;
    margin-left: 5px;
}

>>> .v-text-field .v-input__slot {
    height: 55px;
    width: 30vw;
    max-width: 500px;
    min-width: 300px;
}

>>> .v-text-field .v-icon {
    font-size: 28px;
    margin-right: 5px;
}

.compName {
    color: #E9B44C;
    font-size: 23px;
    font-weight: 400;
    margin-left: 5px;
}

>>> .theme--light.v-btn.v-btn--disabled {
    color: #dbba98 !important;
}
>>> .v-messages__message{
    color: #C62828 !important;
}

>>> .v-icon.error--text{
    color: #C62828 !important;
}
>>> .v-icon.success--text{
    color: #2E7D32 !important;
}
</style>
