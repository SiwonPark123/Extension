var timeOpen;
var limitedSite = "youtube.com";
var tab;
var ran = false;

async function findTabs() {
    console.log("finding 1");
    tab = await browser.tabs.query({});
    console.log("tabs: ", tab);
    for (let i = 0; i < tab.length; i++) {
        if (tab[i].url.includes(limitedSite)) {
            browser.tabs.remove(tab[i].id);
            console.log("tab index " + i + " closed");
        } else {
            console.log("tab index " + i + " kept");
        }
    }
}

findTabs();


// if (browser.tabs.query.url == limitedSite) {
//     setInterval(() => {
//         timeOpen = performance.now();
//         console.log(timeOpen);
//     }, 1000);
// }
