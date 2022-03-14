export const state = () => ({
    toast: {
        icon: "",
        content: "",
        color: ""
    },
    current_entity: {},
})

export const getters = {
    
    current_entity(state){
        return state.current_entity
    },
    
    
}

export const mutations = {

    showToast(state, payload) {
        state.toast.icon = payload.icon;
        state.toast.content = payload.content;
        state.toast.color = payload.color;
    },
    
    updateCurrentEntity(state, entity){
        state.current_entity = entity
    }
    

}

export const actions = {
    getEntity({commit}, {ids}) {
        return new Promise((resolve, reject)=>{
            this.$axios.$get(`/v1/competition/${ids[0]}` + ((ids.length >= 2)?`/category/${ids[1]}`:'')).then(res=>{
                console.log("entity updated")
                commit('updateCurrentEntity', res)
                resolve(res)
            }).catch(err=>{
                reject(err)
            })
        })
       
    },
}

