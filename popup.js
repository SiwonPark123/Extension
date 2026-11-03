var limitedSites = "";
var timeLimit = 0;
var settingsSet = false;

document.getElementById('save').addEventListener("click", async () => {
    await browser.storage.local.set({
        limitedSites: document.getElementById('siteInput').value,
        timeLimit: document.getElementById('timeLimit').value * 60,
        settingsSet: true
    });
    var setData = await browser.storage.local.get([
        "limitedSites",
        "timeLimit",
        "settingsSet"
    ]);
    console.log(setData.limitedSites);
    console.log(setData.timeLimit);
    console.log(setData.settingsSet);
})

document.getElementById('close').addEventListener("click", () => {
    window.close();
})