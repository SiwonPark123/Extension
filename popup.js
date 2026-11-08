var limitedSites = [];
var timeLimit = [];
var settingsSet = false;

document.getElementById('save').addEventListener("click", async () => {
    if (document.getElementById('siteInput').value == "") {
        await browser.storage.local.set({
            limitedSites: [" "],
            timeLimit: [],
            settingsSet: false
        });
        console.log("Please input sites");
    } else {
        timeLimit = document.getElementById('timeLimit').value.split(",")
        await browser.storage.local.set({
            limitedSites: document.getElementById('siteInput').value.split("\n"),
            timeLimit: timeLimit.map(minutes => minutes * 60),
            settingsSet: true
        });
    }
});

document.getElementById('reset').addEventListener("click", async () => {
    console.log("reset settings");
    await browser.storage.local.set({
        limitedSites: [],
        timeLimit: 0,
        settingsSet: false
    });
});