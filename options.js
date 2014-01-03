/*global chrome*/

var filters = {};
var filterList = [];

function addFilter(fil){
  var row = document.createElement('tr');

  var enCell = document.createElement('td');
  var tog = document.createElement('input');
  tog.type = 'checkbox';
  tog.checked = fil.enabled;
  tog.addEventListener('click', function(evt){
    fil.enabled = tog.checked;
  });
  enCell.appendChild(tog);
  row.appendChild(enCell);

  var labelCell = document.createElement('td');
  labelCell.textContent = fil.inword + ' → ' + fil.outword;
  row.appendChild(labelCell);

  function deleteFilter(){
    document.getElementById('filters').removeChild(row);
    filterList.splice(filterList.indexOf(fil),1);
    delete filters[fil.inword.toLowerCase()];
  }

  var actionCell = document.createElement('td');

  var edButton = document.createElement('button');
  edButton.type = 'button';
  edButton.className = 'btn btn-default btn-sm';
  edButton.textContent = 'Edit';
  edButton.addEventListener('click', function () {
    document.getElementById('word-in').value = fil.inword;
    document.getElementById('word-out').value = fil.outword;
    document.getElementById('lwb').checked = fil.lwb;
    document.getElementById('rwb').checked = fil.rwb;
    document.getElementById('strict').checked = fil.strict;
    deleteFilter();
  });
  actionCell.appendChild(edButton);

  actionCell.appendChild(document.createTextNode(' '));

  var delButton = document.createElement('button');
  delButton.type = 'button';
  delButton.className = 'btn btn-danger btn-sm';
  delButton.textContent = 'Delete';
  delButton.addEventListener('click',deleteFilter);

  actionCell.appendChild(delButton);

  row.appendChild(actionCell);

  document.getElementById('filters').appendChild(row);

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

function populateFilters(filters) {
  return Object.keys(filters).forEach(function(key){
    addFilter(filters[key]);
  });
}

function loadExistingFilters(){
  //TODO: sort filters before writing list
  chrome.storage.sync.get('filters', function(res){
    populateFilters(res.filters);
  });
}

loadExistingFilters();

document.getElementById('save').addEventListener('click', function(){
  chrome.storage.sync.set({filters: filters});
});

document.getElementById('newfilter').addEventListener(
  'click', addCurrentFilter);
