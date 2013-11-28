/*global chrome*/
document.getElementById('optionslink').addEventListener('click',
  function(){chrome.tabs.create({url: "options.html"});});
