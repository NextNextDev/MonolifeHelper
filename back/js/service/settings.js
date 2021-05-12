/**
 * Created: NextNextDev
 */

/**
 * @desc set settings to storage
 * @param {object} firstValue - coefficient range
 *  {
 *    {number} start
 *    {number} finish
 *  }
 * @param {object} secondValue - coefficient range
 *  {
 *    {number} start
 *    {number} finish
 *  }
 * @param {object} autoBet - auto delivery amount
 *  {
 *    {number} less
 *    {number} more
 *  }
 * @param {number} coefficient - coefficients depending on which auto delivery takes place
 * @param {number} stakeAmount - amount to bet
 * @return {string} - If successful, the string is "saved".
 * Otherwise, error description
 */
function setSettings({ etpgpb, lot_online }) {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.set(
      {
        etpgpb_44: etpgpb.status_44,
        etpgpb_223: etpgpb.status_223,
        lot_online_44: lot_online.status_44,
        lot_online_223: lot_online.status_223
      },
      function () {
        if (chrome.runtime.lastError) {
          var errorMsg = chrome.runtime.lastError.message;
          return reject(errorMsg);
        } else {
          return resolve(true);
        }
      },
    );
  });
}
