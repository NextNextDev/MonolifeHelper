/**
 * Created: NextNextDev
 */
function routing({ main }) {
    chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
        switch (request.command) {
            case 'getSettings': {
                let responseObj = {
                    status: true,
                    body: {
                        screen: main.screen,
                        screenData: main.screenData
                    },
                };

                return sendResponse(responseObj);
            }
            case 'setSettings': {
                console.log("SET SETT",request.body)
                main.setScreenData(request.body).then((result) => {
                    if (result === true) {
                        sendResponse({ status: true });
                    } else {
                        sendResponse({ status: false });
                    }
                });
                
                return true;
            }
            case 'getScreen': {
                let responseObj = {
                    status: true,
                    body: main.screen,
                };

                return sendResponse(responseObj);
            }
            case 'setScreen': {
                main.setScreen(request.body).then((result) => {
                    if (result === true) {
                        sendResponse({ status: true });
                    } else {
                        sendResponse({ status: false });
                    }
                });
                return true;
            }
            default:
                break;
        }
    });
}
