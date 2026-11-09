var timeOpen = [];
var timer;
var checkSettingsAvailable;
var scanTimer;
var tab;
var tabIndex;
var limitedSitesIndex;
var timeLimitIndex;
var closingTabs = false;
var settingData = await browser.storage.local.get([
    "limitedSites",
    "timeLimit",
    "settingsSet"
]);

browser.action.onClicked.addListener(() => {
    console.log("settings opened");
    browser.tabs.create({
        url: browser.runtime.getURL("popup.html")
    });
});

browser.storage.onChanged.addListener((changes, areaName) => {
    if (areaName == "local") {
        if (changes.limitedSites) {
            settingData.limitedSites = changes.limitedSites.newValue;
            console.log(settingData.limitedSites);
        }

        if (changes.timeLimit) {
            settingData.timeLimit = changes.timeLimit.newValue;
            timeOpen.length = 0;
            for (let i = 0; i < settingData.timeLimit.length; i++) {
                timeOpen.push(0);
                console.log(timeOpen);
            }
            console.log(settingData.timeLimit);
        }

        if (changes.settingsSet) {
            settingData.settingsSet = changes.settingsSet.newValue;
            console.log(settingData.settingsSet);
            if (changes.settingsSet.newValue) {
                scanTabsContinuous();
            } else {
                clearInterval(scanTimer);
            }
        }
    }
});

async function getTabs() {
    tab = await browser.tabs.query({});
    console.log("scanning tabs");
    for (let i = 0; i < tab.length; i++) {
        for (let j = 0; j < settingData.limitedSites.length; j++) {
            if (tab[i].url.includes(settingData.limitedSites[j])) {
                closingTabs = true;
                tabIndex = i;
                limitedSitesIndex = j;
                timeLimitIndex = j;
                checkAvailable();
            }
        }
    }
}

function checkAvailable() {
    timer = setInterval(() => {
        browser.tabs.query({}).then((tab) => {
            if (tab[tabIndex].url.includes(settingData.limitedSites[limitedSitesIndex])) {
                console.log("Tab is still open");
                timeOpen[timeLimitIndex] += 1;
                closeTab();
            } else {
                console.log("Tab has been closed through other means");
                clearInterval(timer);
                timer = null;
                closingTabs = false;
            }
        });
    }, 1000);
}

function closeTab() {
    if (timeOpen[timeLimitIndex] >= settingData.timeLimit[timeLimitIndex]) {
        browser.tabs.remove(tab[tabIndex].id);
        console.log("tab index " + tabIndex + " closed");
        clearInterval(timer);
        timer = null;
        closingTabs = false;
    }
}

function scanTabsContinuous() {
    scanTimer = setInterval(() => {
        if (!closingTabs) {
            getTabs();
        }
    }, 1000);
}