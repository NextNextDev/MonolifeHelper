window.onload = start;

let findMode = false;
let findPlace;

let screenData = {};
function start() {
    return new Promise((resolve, reject) => {
        try {
            chrome.runtime.sendMessage({ command: 'getSettings' }, function ({ status, body }) {
                if (chrome.runtime.lastError) {
                    throw new Error(chrome.runtime.lastError);
                }
                if (status !== true) {
                    return reject(false);
                }
                screen = body.screen;
                screenData = body.screenData;

                if (screenData['game'].status === true) {
                    let newItems = screenData['game'].items.filter((value) => value.status);
                    screenData['game'].items = newItems;
                }

                let timerId = setTimeout(function check() {
                    let findSpan = document.querySelector('#react-tabs-1');
                    if (findSpan) {
                        createObserv(findSpan);
                    } else {
                        timerId = setTimeout(check, 500); // (*)
                    }
                }, 500);
                console.log(screenData)
                if (screenData['game'].status === true && screenData['game'].items.length > 0) {
                    findMode = true;
                }

                return resolve(true);
            });
        } catch (error) {
            console.error(error);
        }
    });
}

function createObserv(observElement) {
    let observer = new MutationObserver((mutation) => {
        mutation.forEach((mut) => {
            if (
                mut.addedNodes.length === 1 &&
                mut.addedNodes[0].classList.contains('lobby-item') &&
                findMode == true &&
                screenData['game'].status === true
            ) {
                console.log("EST")
                check(mut.addedNodes[0], 'game');
            }
        });
    });
    observer.observe(observElement, { childList: true, subtree: true });
}

function check(addedNode, screen) {
    for (let index = 0; index < screenData[screen].items.length; index++) {
        //console.log(`${addedNode.children[0].innerText} === ? ${screenData[screen].items[index].name}`)
        if (addedNode.children[0].innerText === screenData[screen].items[index].name) {
            findPlace = addedNode.querySelector('.lobby-players__item--add');
            if (findPlace) {
                findPlace.click();
                acceptConfirm();
                checkResult();
                break;
            }
        }
    }
}

function acceptConfirm() {
    let timeOut = 0; // 5 sec
    let timerId = setTimeout(function check() {
        let conf = document.querySelector('.react-confirm-alert');
        if (conf) {
            conf.querySelector('.green').click();
        } else if (timeOut < 50) {
            timeOut++;
            timerId = setTimeout(check, 100); // (*)
        }
    }, 100);
}

function checkResult() {
    findMode = false;
    let timeOut = 0; // 10 sec
    let timerId = setTimeout(function check() {
        if (findPlace.parentElement == null) {
            // отправить запрос на отключение поиска в расширение
            return;
        } else if (timeOut < 10) {
            timeOut++;
            timerId = setTimeout(check, 100); // (*)
        } else {
            findMode = true;
        }
    }, 1000);
}
