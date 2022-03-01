export default ({ app, store }, inject) => {
    inject("toast", {
        show({ icon = "", content = "", color = "" }) {
            store.commit("showToast", { icon, content, color });
        },
        success(content = "") {
            store.commit("showToast", { icon: "mdi-check-underline", content, color: "green" });
        },
        error(content = "") {
            store.commit("showToast", { icon: "mdi-alert-circle-outline", content, color: "red" });
        }
    })
}
