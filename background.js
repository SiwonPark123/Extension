var timeOpen = 0;
var timer;
var checkSettingsAvailable;
var scanTimer;
var tab;
var tabIndex;
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
            console.log(settingData.timeLimit);
        }

        if (changes.settingsSet) {
            settingData.settingsSet = changes.settingsSet.newValue;
            console.log(settingData.settingsSet);
        }
    }
});

checkSettingsAvailable = setInterval(() => {
    if (settingData.settingsSet) {
        scanTabsContinuous();
        clearInterval(checkSettingsAvailable);
    }
}, 100);

async function getTabs() {
    tab = await browser.tabs.query({});
    console.log("scanning tabs");
    for (var i = 0; i < tab.length; i++) {
        if (tab[i].url.includes(settingData.limitedSites)) {
            closingTabs = true;
            tabIndex = i;
            checkAvailable();
        }
    }
}

function checkAvailable() {
    timer = setInterval(() => {
        browser.tabs.query({}).then((tab) => {
            if (tab[tabIndex].url.includes(settingData.limitedSites)) {
                console.log("Tab is still open");
                timeOpen += 0.5;
                closeTab();
            } else {
                console.log("Tab has been closed through other means");
                clearInterval(timer);
                timer = null;
                closingTabs = false;
            }
        });
    }, 500);
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
        if (!settingData.settingsSet) {
            // Last worked here on repeating code if settings get reset
            clearInterval(scanTimer);
        }
        if (!closingTabs) {
            getTabs();
        }
    }, 1000);
}