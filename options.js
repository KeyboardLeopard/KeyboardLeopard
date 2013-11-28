/*global chrome*/
var filters = {};
var filterList = [];
function addFilter(fil){
  var li = document.createElement('li');
  li.textContent = fil.inword + ' -> ' + fil.outword + ' ';

  function deleteFilter(){
    document.getElementById('filters').removeChild(li);
    filterList.splice(filterList.indexOf(fil),1);
    delete filters[fil.inword.toLowerCase()];
  }

  var edButton = document.createElement('button');
  edButton.type = 'button';
  edButton.textContent = 'Edit';
  edButton.addEventListener('click',function(){
    document.getElementById('word-in').value = fil.inword;
    document.getElementById('word-out').value = fil.outword;
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
  //TODO: error checking (no empty words / replacements)
  addFilter({
    inword: document.getElementById('word-in').value,
    outword: document.getElementById('word-out').value});
}

function loadExistingFilters(){
  //TODO: sort filters before writing list
  chrome.storage.sync.get('filters', function(savedFilters){
    savedFilters.keys.forEach(function(key){
      addFilter(savedFilters[key]);
    });
  });
}

loadExistingFilters();
document.getElementById('save').addEventListener('click', function(){
  chrome.storage.sync.set('filters',filters);
});
document.getElementById('newfilter')
  .addEventListener('click', addCurrentFilter);