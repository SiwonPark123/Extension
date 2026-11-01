var timeOpen = 0;
var timer;
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

if (settingData.settingsSet) {
    scanTabsContinuous();
}

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
                timeOpen++;
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
    setInterval(() => {
        if (!closingTabs) {
            getTabs();
        }
    }, 1000);
}