// Copyright 2013 Stuart P. Bentley.
// This work may be used freely as long as this notice is included.
// The work is provided "as is" without warranty, express or implied.

function escapeRegExp(str) {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}

var filters;
var allFilterRegexp;

function loadFilters(){
  filters = localStorage.getItem('filters');
  allFilterRegexp = new RegExp('('+
    filters.keys.map(escapeRegExp).join('|') + ')','gi');
}

function replacement(match) {
  //TODO: alter case to match
  return filters[match.toLowerCase()].outword;
}

function performSubstitutions(str) {
  return str.replace(allFilterRegexp, replacement);
}

// define the noteType value for TEXT_NODEs (the kind we want to replace)
// Some browsers may fail to make this value available - it's 3
var TEXT_NODE = Node.TEXT_NODE || 3;

// Flag to signal that we're replacing text, so that change doesn't trigger
// another replacement (technically, that can't happen if all the instances
// of "keyboard" that would trigger a replacement have been replaced with
// "leopard", but it's still good practice)
var replacingContent = false;

function replaceTextContent(node) {
  if (~node.textContent.search(allFilterRegexp)) {
    //flag that content is being replaced so the event it generates
    //won't trigger another replacement
    replacingContent = true;
    node.textContent = performSubstitutions(node.textContent);
    replacingContent = false;
  }
}

function changeTextNodes(node) {
  var length, childNodes;
  //If this is a text node, attempt substitutions on it
  if (node.nodeType == TEXT_NODE) {
    replaceTextContent(node);
  //If this is anything other than a text node, recurse any children
  } else {
    childNodes = node.childNodes;
    length = childNodes.length;
    for(var i = 0; i < length; ++i){
      changeTextNodes(childNodes[i]);
    }
  }
}

function insertion_listener(event) {
  //change any new text nodes in a node that is added to the body
  changeTextNodes(event.target);
}

function cdm_listener(event) {
  //avoid infinite loop by ignoring events triggered by replacement
  if(!replacingContent){
    replaceTextContent(event.target);
  }
}

loadFilters();
changeTextNodes(document.body);
document.title = performSubstitutions(document.title);
document.body.addEventListener("DOMNodeInserted", insertion_listener, false);
document.body.addEventListener("DOMCharacterDataModified", cdm_listener, false);
