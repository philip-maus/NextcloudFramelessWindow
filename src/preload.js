const remote = require('@electron/remote'), fs = remote.require("fs");

window.addEventListener('DOMContentLoaded', () => {
    document.getElementById("close").addEventListener("click", () => remote.getCurrentWindow().close());
    document.getElementById("save").addEventListener("click", () => {
        const url = document.querySelector("input[type=url]").value;
        fetch(url).then(() => {
            if (url.indexOf('http://') === 0 || url.indexOf('https://') === 0)
                fs.writeFile("url.conf", url, err => {
                    if (err) {
                        document.querySelector("#error > span").innerText = err;
                        document.getElementById("error").style.display = "block";
                    } else remote.getCurrentWindow().loadURL(url);
                });
            else {
                document.querySelector("#error > span").innerText = "URL does not exist. NOTICE: Your URL must start with https:// or http://";
                document.getElementById("error").style.display = "block";
            }
        }).catch(() => {
            document.querySelector("#error > span").innerText = "URL does not exist. NOTICE: Your URL must start with https:// or http://";
            document.getElementById("error").style.display = "block";
        });
    })
})
