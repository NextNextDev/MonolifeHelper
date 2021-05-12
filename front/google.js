window.onload = start;

function start() {
    try {
        chrome.runtime.sendMessage({ command: 'getStatus', body: "etpgpb_44" }, function (status) {
            if (chrome.runtime.lastError) {
                throw new Error(chrome.runtime.lastError);
            }
            if (status === true) {
                getAllData();
            }
            return true;
        });
    } catch (error) {
        console.error(error);
    }
}