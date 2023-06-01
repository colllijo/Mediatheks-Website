export class ToastHandler {
    constructor() {
    }

    showToast(message, time) {
        if (!time) {
            time = 5000;
        }

        let toast = document.createElement("div");
        toast.id = "toast"
        toast.classList.add("toast");
        toast.innerHTML = message;

        document.body.appendChild(toast);
        window.setTimeout(_ => document.getElementById("toast").remove(), time);
    }
}