/* global chrome loadFilters startReplacing */

chrome.storage.sync.get(['filters','active'], function(res) {
  loadFilters(res.filters);
  if (res.active) {
    startReplacing();
  }
});
