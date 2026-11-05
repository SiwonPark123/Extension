var limitedSites = " ";
var timeLimit = 0;
var settingsSet = false;

document.getElementById('save').addEventListener("click", async () => {
    if (document.getElementById('siteInput').value == "") {
        await browser.storage.local.set({
            limitedSites: " ",
            timeLimit: document.getElementById('timeLimit').value * 60,
            settingsSet: true
        });
    } else {
        await browser.storage.local.set({
            limitedSites: document.getElementById('siteInput').value,
            timeLimit: document.getElementById('timeLimit').value * 60,
            settingsSet: true
        });
    }
});

document.getElementById('reset').addEventListener("click", async () => {
    console.log("reset settings");
    await browser.storage.local.set({
        limitedSites: " ",
        timeLimit: 0,
        settingsSet: false
    });
});