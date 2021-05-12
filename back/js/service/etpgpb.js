/**
 * Created: NextNextDev
 */
class Etpgpb {
    _status_44 = false;
    _status_223 = false;
    constructor() {}
    storage_status() {
        return new Promise((resolve, reject) => {
            chrome.storage.sync.get(['etpgpb_44', 'etpgpb_223'], function (result) {
                if (chrome.runtime.lastError) {
                    console.error('Не смог получить статус:', chrome.runtime.lastError);
                    return resolve(false);
                } else {
                    let statusObj = {
                        etpgpb_44: false,
                        etpgpb_223: false,
                    };
                    if (result.etpgpb_44 !== undefined) {
                        statusObj.etpgpb_44 = result.etpgpb_44;
                    }
                    if (result.etpgpb_223 !== undefined) {
                        statusObj.etpgpb_223 = result.etpgpb_223;
                    }
                    return resolve(statusObj);
                }
            });
        });
    }
    /**
     * @desc enable or disable etpgpb 44
     * @param {boolean} status
     */
    set status_44(value) {
        if (this._status_44 === value) {
            return true;
        }
        this._status_44 = value;
        if (this._status_44 === true) {
            this.enable_44();
        } else {
            this.disable_44();
        }
        return true;
    }

    get status_44() {
        return this._status_44;
    }

    enable_44() {
        chrome.webRequest.onBeforeSendHeaders.addListener(
            this.#addCookie,
            {
                urls: [
                    'https://gos.etpgpb.ru/44/catalog/procedure/published?q=*&simple-search=%D0%9D%D0%B0%D0%B9%D1%82%D0%B8',
                ],
            },
            ['blocking', 'requestHeaders', 'extraHeaders'],
        );
    }

    disable_44() {
        chrome.webRequest.onBeforeSendHeaders.removeListener(this.#addCookie);
    }

    #addCookie(details) {
        let check = details.url.match(
            /https:\/\/gos\.etpgpb\.ru\/44\/catalog\/procedure\/published\?q=[0-9].*&simple-search=%D0%9D%D0%B0%D0%B9%D1%82%D0%B8/,
        );
        if (check) {
            details.requestHeaders.forEach(function (requestHeader) {
                if (requestHeader.name.toLowerCase() === 'cookie') {
                    requestHeader.value =
                        'gridSettings=eyJDYXRhbG9nNDRfdmlzaWJsZUNvbHVtbnMiOlsidHlwZSIsInJlcXVlc3RzX2NvdW50Il19; etp=8h9id5f19qajimnoptufbi52hnfoi937';
                }
            });
        }
        return { requestHeaders: details.requestHeaders };
    }

    /**
     * @desc enable or disable etpgpb 44
     * @param {boolean} status
     */
    set status_223(value) {
        if (this._status_223 === value) {
            return true;
        }
        this._status_223 = value;
        return true;
    }

    get status_223() {
        return this._status_223;
    }
}
