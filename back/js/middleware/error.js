/**
 * Created: NextNextDev
 */
// Stores errors in the current life of the extension
let errorsArray = [];
/**
 * @desc Handles errors in back side
 * @param {string} error - error msg
 */
function errorHandler(error) {
  errorsArray.push(error.message ? error.message : error);
  console.log(error);
  setStatus(0)
    .then((data) => {
      if (data !== 'saved') {
        chrome.runtime.reload();
      }
      if (openBetterId !== false) {
        chrome.tabs.remove(openBetterId, function () {
          openBetterId = false;
        });
      }
      removeMonitor()
        .then((data) => {
          if (data !== 'saved') {
            chrome.runtime.reload();
          }
        })
        .catch(() => {
          chrome.runtime.reload();
        });
    })
    .catch(() => {
      chrome.runtime.reload();
    });
}
/**
 * @desc Gets a list of errors
 * @return {array} errors
 */
function getErrorsLog() {
  return new Promise((resolve, reject) => {
    resolve(errorsArray);
  });
}
