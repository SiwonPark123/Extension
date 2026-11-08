var timeOpen = 0;
var timer;
var checkSettingsAvailable;
var scanTimer;
var tab;
var tabIndex;
var limitedSitesIndex;
var closingTabs = false;
var settingData = await browser.storage.local.get([
    "limitedSites",
    "timeLimit",
    "settingsSet"
]);

// Last time working on implementing specific time limits for each site, got stuck at time open for each site

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
                timeOpen += 1;
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
    if (timeOpen >= settingData.timeLimit) {
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