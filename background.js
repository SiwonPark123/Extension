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
    browser.tabs.create({
        url: browser.runtime.getURL("popup.html")
    });
});

checkSettingsAvailable = setInterval(() => {
    if (settingData.settingsSet) {
        scanTabsContinuous();
        clearInterval(checkSettingsAvailable);
    }
}, 100);

async function getTabs() {
    tab = await browser.tabs.query({}); // Gets info on tabs open
    console.log("scanning tabs");
    for (var i = 0; i < tab.length; i++) { // Check through each index of the array
        if (tab[i].url.includes(settingData.limitedSites)) { // If the url includes the limited site, then close it, otherwise keep it
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