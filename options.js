/*global chrome*/

var filters = {};
var filterList = [];

function addFilter(fil){
  var li = document.createElement('li');
  li.textContent = fil.inword + ' → ' + fil.outword + ' ';

  function deleteFilter(){
    document.getElementById('filters').removeChild(li);
    filterList.splice(filterList.indexOf(fil),1);
    delete filters[fil.inword.toLowerCase()];
  }

  var edButton = document.createElement('button');
  edButton.type = 'button';
  edButton.textContent = 'Edit';
  edButton.addEventListener('click', function () {
    document.getElementById('word-in').value = fil.inword;
    document.getElementById('word-out').value = fil.outword;
    document.getElementById('lwb').checked = fil.lwb;
    document.getElementById('rwb').checked = fil.rwb;
    document.getElementById('strict').checked = fil.strict;
    deleteFilter();
  });
  li.appendChild(edButton);

  var delButton = document.createElement('button');
  delButton.type = 'button';
  delButton.textContent = 'Delete';
  delButton.addEventListener('click',deleteFilter);
  li.appendChild(delButton);

  document.getElementById('filters').appendChild(li);
  filterList.push(fil);
  filters[fil.inword.toLowerCase()] = fil;
}

function addCurrentFilter(){
  if (document.getElementById('word-in').value
    && document.getElementById('word-out').value
    && !filters[document.getElementById('word-in').value.toLowerCase()]) {
    addFilter({
      enabled: true,
      inword: document.getElementById('word-in').value,
      outword: document.getElementById('word-out').value,
      lwb: document.getElementById('lwb').checked,
      rwb: document.getElementById('rwb').checked,
      strict: document.getElementById('strict').checked});
    document.getElementById('word-in').value = '';
    document.getElementById('word-out').value = '';
  }
}

function loadExistingFilters(){
  //TODO: sort filters before writing list
  chrome.storage.sync.get('filters', function(res){
    Object.keys(res.filters).forEach(function(key){
      addFilter(res.filters[key]);
    });
  });
}

loadExistingFilters();

document.getElementById('save').addEventListener('click', function(){
  chrome.storage.sync.set({filters: filters});
});

document.getElementById('newfilter').addEventListener(
  'click', addCurrentFilter);
