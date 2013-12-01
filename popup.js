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

function populateToggles(filters) {
  var toggles = document.getElementById('toggles');
  return filters
    .sort(function(m,n){
      return m.length == n.length ? m < n : m.length > n.length})
    .forEach(function(k){
      var row = document.createElement('tr');

      var tog = document.createElement('input');
      tog.type = 'checkbox';
      tog.addEventListener('click', function(evt){
        filters[k].enabled = tog.checked;
        chrome.storage.sync.set({filters: filters});
      });
      var ttd = document.createElement('td');
      ttd.appendChild(tog);
      row.appendChild(ttd);

      var fillabel = document.createElement('td');
      fillabel.textContent = filters[k].inword + ' → ' + filters[k].outword;
      row.appendChild(fillabel);

      toggles.appendChild(row);
    });
}

chrome.storage.sync.get({filters: {}, active: true}, function(res){
  document.getElementById('active').checked = res.active;
});
