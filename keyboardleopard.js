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
  allFilterRegexp = new RegExp('('
    + filters.keys
      .filter(function(fil){return fil.enabled})
      .sort(function(m,n){
        return m.length == n.length ? m < n : m.length > n.length})
      .map(function(fil){return fil.inword})
      .map(escapeRegExp)
      .join('|')
    + ')','gi');
}

function caseMatchSpan(source,base,output) {
  return base == base.toLowerCase ? 
  // If the span is expected to be all lower-case
    source != source.toLowerCase && source == source.toUpperCase ?
      output.toUpperCase : output
    // Only capitalize the output if the source is entirely upper-case
    : base == base.toUpperCase ?
    // If the span is expected to be all upper-case
      source != source.toUpperCase && source == source.toLowerCase ?
        output.toLowerCase : output
      // Only lowercase the output if the source is entirely lower-case
    // Otherwise, if the input matches either full-case push,
    // push the output to that case
    : source != source.toLowerCase && source == source.toUpperCase ?
      output.toUpperCase
    : source != source.toUpperCase && source == source.toLowerCase ?
      output.toLowerCase
    : output;
}

// Slice against, for arrays or strings.
function sliceAgainst(i, ars, other) {
  return ars.slice(
    Math.floor(i/other.length*ars.length),
    Math.floor((i+1)/other.length*ars.length));
}

function caseMatchWords(source, base, output) {
  //special case the first letter
  var result = caseMatchSpan(source[0],base[0],output[0]);
  
  var sRest = source.slice(1);
  var bRest = base.slice(1);
  var oRest = output.slice(1);

  for(var i = 0; i < Math.min(bRest.length,oRest.length); i++){
    result += caseMatchSpan(
      sliceAgainst(i, sRest, oRest),
      sliceAgainst(i, bRest, oRest),
      sliceAgainst(i, oRest, bRest));
  }
}

function replacement(match) {
  var filter = filters[match.toLowerCase()];
  
  var inWords = filter.inword.split(' ');
  var outWords = filter.outword.split(' ');
  var matchWords = match.split(' ');
  
  var iwl = inWords.length;
  var owl = outWords.length;
  
  var replacementWords = [];
  
  for(var i = 0; i < Math.min(iwl,owl); i++){
    replacementWords[i] = caseMatchWords(
      sliceAgainst(i,matchWords,outWords),
      sliceAgainst(i,inWords,outWords),
      sliceAgainst(i,outWords,inWords));
  }
  
  return replacementWords.join(' ');
}

function performSubstitutions(str) {
  return str.replace(allFilterRegexp, replacement);
}

// define the nodeType value for TEXT_NODEs (the kind we want to replace)
// Some browsers may fail to make this value available - it's 3
var TEXT_NODE = Node.TEXT_NODE || 3;

// Semaphore to signal that we're replacing text, so that our changes don't
// trigger recursive substitutions
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
