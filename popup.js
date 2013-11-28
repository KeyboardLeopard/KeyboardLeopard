/*global chrome*/

document.getElementById('optionslink').addEventListener('click',
  function(){chrome.tabs.create({url: "options.html"});});

document.getElementById('active').addEventListener('click',
  function(evt){chrome.storage.sync.set({active: evt.target.checked});});

chrome.storage.sync.get({active: true}, function(res){
  document.getElementById('active').checked = res.active;
});
