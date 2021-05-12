/**
 * Created: NextNextDev
 */
function routing({etpgpb}) {
    chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
        switch (request.command) {
            case 'getSettings': {
                let responseObj = {
                    body: {
                        etpgpb: {
                            status_44: etpgpb.status_44,
                        },
                    },
                };

                return sendResponse(responseObj);
            }
            case 'setSettings': {
                etpgpb.status_44 = request.body.etpgpb.status_44;
                setSettings(request.body).then((result) => {
                    if (result === true) {
                        sendResponse(true);
                    } else {
                        sendResponse(false);
                    }
                });
                // The return indicates that the response will be asynchronous
                return true;
            }
            case 'getStatus': {
                switch (request.body) {
                    case 'etpgpb_44': {
                        return sendResponse(etpgpb.status_44);
                    }
                    default:
                        return sendResponse(false);
                }
            }
            default:
                break;
        }
    });
}
