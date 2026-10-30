export var limitedSites = "";
export var timeLimit = 0;
export var settingsSet = false;

function saveSettings() {
    limitedSites = document.getElementById('siteInput').value;
    console.log(limitedSites);
    timeLimit = document.getElementById('timeLimit').value * 60;
    console.log(timeLimit);
    settingsSet = true;
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('save').addEventListener("click", saveSettings);
    document.getElementById('close').addEventListener("click", () => {
        window.close();
    });
});