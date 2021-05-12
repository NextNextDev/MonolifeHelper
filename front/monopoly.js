window.onload = start;

let GAMES = ['БОНУС ДЛЯ КОЧКОВ', 'БОНУС ДЛЯ НОВИЧКОВ', 'Играем с другомS'];
let findMode = true;
let findPlace;
// function start() {
//     try {
//         chrome.runtime.sendMessage({ command: 'getStatus', body: "etpgpb_44" }, function (status) {
//             if (chrome.runtime.lastError) {
//                 throw new Error(chrome.runtime.lastError);
//             }
//             if (status === true) {
//                 getAllData();
//             }
//             return true;
//         });
//     } catch (error) {
//         console.error(error);
//     }
// }
function start() {
    let timerId = setTimeout(function check() {
        let findSpan = document.querySelector('.lobby-window__content.inside_content>span');
        if (findSpan) {
            createObserv(findSpan);
        } else {
            timerId = setTimeout(check, 500); // (*)
        }
    }, 500);
}

function createObserv(observElement) {
    let observer = new MutationObserver((mutation) => {
        if (mutation[0].addedNodes.length === 1 && findMode == true) {
            check(mutation[0].addedNodes[0]);
        }
    });
    observer.observe(observElement, { childList: true });
}

function check(addedNode) {
    for (let index = 0; index < GAMES.length; index++) {
        if (addedNode.children[0].innerText === GAMES[index]) {
            console.dir(addedNode)
            findPlace = addedNode.querySelector('.lobby-players__item--add');
            console.dir(findPlace);
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