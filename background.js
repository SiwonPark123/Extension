import { limitedSites, timeLimit, settingsSet } from "./popup.js";
var timeOpen = 0;
var timer;
var tab;
var tabIndex;
var closingTabs = false;

browser.action.onClicked.addListener(() => {
    console.log("extension clicked");
    settingsOpen = true;
    console.log(settingsOpen);
    browser.tabs.create({
        url: browser.runtime.getURL("popup.html")
    });
});

if (settingsSet) {
    scanTabsContinuous();
}

async function getTabs() {
    tab = await browser.tabs.query({}); // Gets info on tabs open
    console.log("tabs: ", tab);
    for (var i = 0; i < tab.length; i++) { // Check through each index of the array
        if (tab[i].url.includes(limitedSites)) { // If the url includes the limited site, then close it, otherwise keep it
            closingTabs = true;
            tabIndex = i;
            checkAvailable();
        }
        else {
            console.log("tab index " + i + " kept");
        }
    }
}

function checkAvailable() {
    timer = setInterval(() => {
        browser.tabs.query({}).then((tab) => {
            console.log("tabs: ", tab)
            if (tab[tabIndex].url.includes(limitedSites)) {
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
    if (timeOpen >= timeLimit) {
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