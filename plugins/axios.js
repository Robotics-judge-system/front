export default function ({ $axios, app }) {
    $axios.onError(error => {
        if (error.response.status === 401) {
            app.$auth.logout();
        } /*else if (error.response.status === 502) {
            app.$toast.error("Ошибка: сервер недоступен");
        }*/ else if (error.response.status !== 409) {
            app.$toast.error("Ошибка: " + error.response.data.message);
        } else if (error.response.status > 200){
            console.error(error)
            console.log(error.response)
        }
    })
}
