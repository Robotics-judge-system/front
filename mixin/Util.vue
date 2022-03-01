<script>
export default {
    data: () => ({}),
    methods: {
        async delay(delay) {
            return new Promise(resolve => {
                setTimeout(() => {
                    resolve(2);
                }, delay);
            });
        },

        getHumanMessage(response){
            let ret
            try{
                ret = response.response.data.human_message
            }
            catch(err){
                console.error(err)
                ret = response.message
            }
            return ret
        },
        randomString(length = 10) {
            let text = "";
            const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            for (let i = 0; i < length; i++) {
                text += possible.charAt(Math.floor(Math.random() * possible.length));
            }
            return text;
        },
        getInitials(str = "") {
            let arr = str.split(" ");
            let result = arr[0].substr(0, 1);
            if (arr.length > 1) {
                result += arr[1].substr(0, 1);
            }
            return result.toUpperCase();
        },
        capitalizeFirstLetter(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        },
        isImage(type) {
            const mimes = ["image/jpeg", "image/png", "image/gif"];
            if (mimes.indexOf(type) != -1) {
                return true;
            }
            return false;
        },
        isVideo(type) {
            const mimes = ["video/mp4", "video/ogg", "video/webm"];
            if (mimes.indexOf(type) != -1) {
                return true;
            }
            return false;
        },
        getDocumentIcon(type) {
            if (this.isImage(type)) {
                return "mdi-file-image-outline";
            } else if (this.isVideo(type)) {
                return "mdi-file-video-outline";
            } else if (type === "application/pdf") {
                return "mdi-file-pdf-outline";
            } else {
                return "mdi-file-document-outline";
            }
        },
        bytesToSize(bytes) {
            let sizes = ["Байт", "КБ", "МБ", "ГБ", "ТБ"];
            if (bytes == 0) return "0 Byte";
            let i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
            return Math.round(bytes / Math.pow(1024, i), 2) + " " + sizes[i];
        },
        isLightColor(color) {
            if (color) {
                color = color.substring(0, 7);
                var r, g, b, hsp;
                if (color.match(/^rgb/)) {
                    color = color.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/);
                    r = color[1];
                    g = color[2];
                    b = color[3];
                } else {
                    color = +("0x" + color.slice(1).replace(color.length < 5 && /./g, "$&$&"));
                    r = color >> 16;
                    g = (color >> 8) & 255;
                    b = color & 255;
                }
                hsp = Math.sqrt(0.299 * (r * r) + 0.587 * (g * g) + 0.114 * (b * b));
                if (hsp > 127.5) {
                    return true;
                } else {
                    return false;
                }
            } else {
                return true;
            }
        },
        getDateBefore(date, days, expiration) {
            let result = this.$moment
                .unix(date)
                .subtract(days + expiration, "days")
                .format("DD.MM.YYYY");
            if (days !== "" && expiration !== "" && result !== "Invalid date") {
                return "с " + result;
            } else {
                return "";
            }
        },
        getDateAfter(date, expiration) {
            let result = this.$moment.unix(date).subtract(expiration, "days").format("DD.MM.YYYY");
            if (expiration !== "" && result !== "Invalid date") {
                return "по " + result;
            } else {
                return "";
            }
        },
        getWeekTaskStart(expiration, days) {
            if (days !== "" && expiration !== "") {
                return this.$moment()
                    .startOf("week")
                    .add(expiration, "days")
                    .subtract(days - 1, "days")
                    .format("dddd [10:00]"); //TODO: capitalize
            } else return "";
        },
        getMonthTaskStart(expiration, days) {
            if (days !== "" && expiration !== "") {
                return this.$moment()
                    .startOf("month")
                    .add(expiration - 1, "days")
                    .subtract(days - 1, "days")
                    .format("Do");
            } else return "";
        },
        getMonthTaskEnd(days) {
            if (days !== "") {
                return this.$moment()
                    .startOf("month")
                    .add(days - 1, "days")
                    .format("Do");
            } else return "";
        },
        declOfNum(number, titles) {
            number = Math.abs(number);
            let cases = [2, 0, 1, 1, 1, 2];
            return titles[number % 100 > 4 && number % 100 < 20 ? 2 : cases[number % 10 < 5 ? number % 10 : 5]];
        },
        trimString(str, length) {
            return str.length > length ? str.substring(0, length) : str;
        },
        copyToClipboard(text) {
            var input = document.body.appendChild(document.createElement("input"));
            input.value = text;
            input.focus();
            input.select();
            document.execCommand("copy");
            input.parentNode.removeChild(input);
        },
        // Секунды в строку времени
        formatTimeToString(time) {
            let hrs = ~~(time / 3600);
            let mins = ~~((time % 3600) / 60);
            let secs = ~~time % 60;
            let string = "";
            if (hrs > 0) {
                string += "" + hrs + ":" + (mins < 10 ? "0" : "");
            }
            string += "" + mins + ":" + (secs < 10 ? "0" : "");
            string += "" + secs;
            return string;
        },
        // Строка времени в секунды
        formatStringToTime(string) {
            let secs = 0;
            let array = string.split(":");
            if (array.length === 3) {
                secs += parseInt(array[0]) * 3600; //часы
                secs += parseInt(array[1]) * 60; //минуты
                secs += parseInt(array[2]); //секунды
            } else if (array.length === 2) {
                secs += parseInt(array[0]) * 60; //минуты
                secs += parseInt(array[1]); //секунды
            }
            return secs;
        },
        percentToColor(perc, min, max) {
            var base = max - min;
            if (base == 0) {
                perc = 100;
            } else {
                perc = ((perc - min) / base) * 100;
            }
            var r,
                g,
                b = 0;
            if (perc < 50) {
                r = 255;
                g = Math.round(5.1 * perc);
            } else {
                g = 230;
                r = Math.round(510 - 5.1 * perc);
            }
            var h = r * 0x10000 + g * 0x100 + b * 0x1;
            return "#" + ("000000" + h.toString(16)).slice(-6);
        },
        percentToHsl(perc, minHue = 0, maxHue = 120) {
            const hue = perc * (maxHue - minHue) + minHue;
            return `hsl(${hue}, 100%, 50%)`;
        },
    },
};
</script>
