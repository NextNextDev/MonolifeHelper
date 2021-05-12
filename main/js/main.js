window.onload = start;
let nodeList = {};
function start() {
    return new Promise((resolve, reject) => {
        try {
            chrome.runtime.sendMessage({ command: 'getSettings' }, function ({ body }) {
                if (chrome.runtime.lastError) {
                    throw new Error(chrome.runtime.lastError);
                }
                if (body) {

                }
                return resolve(true);
            });
        } catch (error) {
            console.error(error);
        }
    });
}