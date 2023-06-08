export const secondsToDhms = (dateNow, dateFuture) => {
    if (dateFuture - dateNow > 0) {
        let delta = (dateFuture - dateNow) / 1000;
        const dDisplay = Math.floor(delta / 86400);
        delta -= dDisplay * 86400;

        const hDisplay = Math.floor(delta / 3600) % 24;
        delta -= hDisplay * 3600;

        const mDisplay = Math.floor(delta / 60) % 60;
        delta -= mDisplay * 60;

        const sDisplay = Math.floor(delta % 60)
        // console.log({ dDisplay: Math.abs(dDisplay), hDisplay: Math.abs(hDisplay), mDisplay: Math.abs(mDisplay), sDisplay: Math.abs(sDisplay) })
        return { dDisplay: Math.abs(dDisplay), hDisplay: Math.abs(hDisplay), mDisplay: Math.abs(mDisplay), sDisplay: Math.abs(sDisplay) };
    }
    else {
        const dDisplay = 0
        const hDisplay = 0
        const mDisplay = 0
        const sDisplay = 0
        return { dDisplay, hDisplay, mDisplay, sDisplay };
    }
}

export const copy = (text) => {
    if (navigator.clipboard && window.isSecureContext)
        navigator.clipboard.writeText(text)
    else {
        // text area method
        let textArea = document.createElement("textarea");
        textArea.value = text;
        // make the textarea out of viewport
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        return new Promise((res, rej) => {
            // here the magic happens
            document.execCommand('copy') ? res() : rej();
            textArea.remove();
        });
    }
}

export const toast = (text) => {
    Toastify({
        text,
        duration: 7000,
        newWindow: true,
        close: true,
        gravity: "top", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
            background: "#524EEE",
            boxShadow: "none",
            display: "flex",
            alignItems: "center",
            gap: "32px"
        },
        onClick: function () { } // Callback after click
    }).showToast()
}