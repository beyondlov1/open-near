/*
# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/


// var currActiveUrl = "";
// var tabId2url = {}
var windowActiveTabIdMap = {}

function opennear(currActiveTabId, movingtab){
  if(currActiveTabId == movingtab.id) return;
  chrome.tabs.get(currActiveTabId, (activetab)=>{
    if(!activetab) return;
    if(activetab.groupId >= 0){
      chrome.tabs.group({groupId:activetab.groupId, tabIds:[movingtab.id]}).then((groupId)=>{
        chrome.tabs.move(movingtab.id, {index:activetab.index+1}).then(()=>{
          chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            windowActiveTabIdMap[tabs[0].windowId] = tabs[0].id
            console.log("after move"+windowActiveTabIdMap)
          })        
        })
      })
    }else{
      chrome.tabs.move(movingtab.id, {index:activetab.index+1}).then(()=>{
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
          if(tabs.length > 0){
            windowActiveTabIdMap[tabs[0].windowId] = tabs[0].id
            console.log("after move"+windowActiveTabIdMap)
          }
        })
      })
    }
  })
}

function handleCreated(tab) {
  console.log(tab.id);
  let currActiveTabId = windowActiveTabIdMap[tab.windowId] 
  if (!currActiveTabId || currActiveTabId == 0){
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      opennear(tabs[0].id, tab)
    })
    return
  }
  opennear(currActiveTabId, tab)
}
chrome.tabs.onCreated.addListener(handleCreated);

function handleUpdated(tabId, changeInfo, tab) {
  console.log(changeInfo.url);
  // if(changeInfo.url){
    // let oldurl = tabId2url[tabId]
    // tabId2url[tabId] = changeInfo.url;
  // }
}
chrome.tabs.onUpdated.addListener(handleUpdated);


function handleActivated(activeInfo) {
  try {
    if (activeInfo.tabId == 0) return;
    chrome.tabs.get(activeInfo.tabId, (tab)=>{
      // currActiveUrl = tab.url;
      // tabId2url[tab.id] = tab.url;
      windowActiveTabIdMap[tab.windowId] = tab.id
    })
  } catch (error) {
    console.error(error);
  }
}
chrome.tabs.onActivated.addListener(handleActivated);