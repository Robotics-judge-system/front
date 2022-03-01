export const state = () => ({
    toast: {
        icon: "",
        content: "",
        color: ""
    }
})

export const getters = {
}

export const mutations = {

    showToast(state, payload) {
        state.toast.icon = payload.icon;
        state.toast.content = payload.content;
        state.toast.color = payload.color;
    }

}

export const actions = {
}
