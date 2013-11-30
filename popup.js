/*global chrome*/

document.getElementById('optionslink').addEventListener('click',
  function(evt){chrome.tabs.create({url: "options.html"});});

document.getElementById('active').addEventListener('click',
  function(evt){chrome.storage.sync.set({active: evt.target.checked});});

function reloadTab() {
  chrome.tabs.reload();
}

document.getElementById('reload-button').addEventListener('click', reloadTab);

function dismissPopup(){
  window.close();
}

document.getElementById('ok-button').addEventListener('click', dismissPopup);

chrome.storage.sync.get({active: true}, function(res){
  document.getElementById('active').checked = res.active;
});
