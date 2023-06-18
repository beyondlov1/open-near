/*
# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/


var currActiveUrl = "";
var currActiveTabId = 0;
var tabId2url = {}

function handleCreated(tab) {
  console.log(tab.id);
  
  // tab.openerTabId
  browser.tabs.get(currActiveTabId).then((activetab)=>{
    if(!activetab) return;
    browser.tabs.move(tab.id, {index:activetab.index+1})
  })

}
browser.tabs.onCreated.addListener(handleCreated);

function handleUpdated(tabId, changeInfo, tab) {
  console.log(changeInfo.url);
  if(changeInfo.url){
    let oldurl = tabId2url[tabId]
    tabId2url[tabId] = changeInfo.url;
  }
}
browser.tabs.onUpdated.addListener(handleUpdated);


function handleActivated(activeInfo) {
  try {
    currActiveTabId = activeInfo.tabId;
    browser.tabs.get(currActiveTabId).then((tab)=>{
      currActiveUrl = tab.url;
      tabId2url[tab.id] = tab.url;
      console.log("currActiveUrl"+currActiveUrl)
    })
  } catch (error) {
    console.error(error);
  }
}
browser.tabs.onActivated.addListener(handleActivated);