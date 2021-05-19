window.onload = start;

let findMode = false;
let findPlace;

let screenData = {};
let screenDataDb = {};
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
                screenDataDb = body.screenData;
                if (screenData['game'].status === true) {
                    let newItems = screenData['game'].items.filter((value) => value.status);
                    screenData['game'].items = newItems;
                }

                if (screenData['business'].status === true) {
                    let newItems = screenData['business'].items.filter((value) => value.status);
                    screenData['business'].items = newItems;
                }

                let timerId = setTimeout(function check() {
                    let findSpan = document.querySelector('#react-tabs-1');
                    if (findSpan) {
                        createObservGame(findSpan);
                    } else {
                        timerId = setTimeout(check, 500); // (*)
                    }
                }, 500);

                let timerBusiness = setTimeout(function check() {
                    let findSpan = document.querySelector('.business-wrapper');
                    if (findSpan) {
                        console.log('started create');
                        createObservBusiness(findSpan);
                    } else {
                        timerBusiness = setTimeout(check, 500); // (*)
                    }
                }, 500);

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

function createObservGame(observElement) {
    let observer = new MutationObserver((mutation) => {
        mutation.forEach((mut) => {
            if (
                mut.addedNodes.length === 1 &&
                mut.addedNodes[0].classList.contains('lobby-item') &&
                findMode == true &&
                screenData['game'].status === true
            ) {
                console.log('EST');
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

/**
 * bussines
 */

function createObservBusiness(observElement) {
    console.log('create observ businsess');
    let observer = new MutationObserver((mutation) => {
        mutation.forEach((mut) => {
            try {
                console.log('MUT', mut);
                if (mut.addedNodes[0].children[0].classList.contains('business-image')) {
                    console.log('call')
                    addPlusBisness(mut.addedNodes[0].children[0]);
                }
                // для плюсов
                if (mut.addedNodes[0].children[0].className === 'usersForAttack') {
                    checkBus(mut.addedNodes[0].children[0].children.querySelector('.lobby-players__item--add'));
                }
                // для зеленых кнопок
                if (mut.addedNodes[0].children[0].className === 'btn lobby-item__button lobby-item__green') {
                }
            } catch (error) {}
            // if (
            //     mut.addedNodes.length === 1 &&
            //     mut.addedNodes[0].classList.contains('lobby-item') &&
            //     findMode == true &&
            //     screenData['business'].status === true
            // ) {
            //     console.log("EST")
            //     check(mut.addedNodes[0], 'game');
            // }
        });
    });
    observer.observe(observElement, { childList: true });
}

function checkBus(childrens) {
    // for (let index = 0; index < screenData[screen].items.length; index++) {
    //     //console.log(`${addedNode.children[0].innerText} === ? ${screenData[screen].items[index].name}`)
    //     if (addedNode.children[0].innerText === screenData[screen].items[index].name) {
    //         findPlace = addedNode.querySelector('.lobby-players__item--add');
    //         if (findPlace) {
    //             findPlace.click();
    //             acceptConfirm();
    //             checkResult();
    //             break;
    //         }
    //     }
    // }
    console.log('CHILD', childrens);
}

function addPlusBisness(imgNode) {
    //let imgNode = node.addedNodes[0].children[0];
    let plus = document.createElement('div');
    plus.innerHTML = `
        <button class="js-toggle-state || c-button-reset c-animated-button c-animated-button--plus-to-check" data-active="false">
            <span class="c-animated-button__text">
            Add
            </span>
        </button>
    `
    plus.children[0].addEventListener('click', function (event) {
        let businessName = event.path[2].classList[1].replace(/item--/, '');
        console.log(businessName)
        let found = false;
        let action = this.getAttribute('data-active') === 'true' ? false : true;
        if (action === true) {
            for (let index = 0; index < screenDataDb.business.items.length; index++) {
                if (screenDataDb.business.items[index].name === businessName) {
                    screenDataDb.business.items[index].status = action;
                    found = action;
                    break;
                }
            }
            if (found === false) {
                screenDataDb.business.items.push({
                    name: businessName,
                    status: true
                })
            }
        }
        
        this.setAttribute('data-active', action);
        event.preventDefault();
        event.stopPropagation();
    });
    imgNode.append(plus)
}
addCssToDocument();
function addCssToDocument() {
    let style = document.createElement('style');
    style.innerText = `
    *, *:before, *:after {
        box-sizing: border-box;
      }
      .c-button-reset {
        display: inline-block;
        font-family: inherit;
        font-size: 1em;
        outline: none;
        border: none;
        border-radius: 0;
        box-shadow: none;
        text-shadow: none;
        color: inherit;
        cursor: pointer;
        padding: 0;
        -webkit-tap-highlight-color: transparent;
      }
      .c-animated-button {
        position: relative;
        min-width: 40px;
        min-height: 40px;
        width: 2.5em;
        height: 2.5em;
        background-color: #ffd60000;
      }
      .c-animated-button__text {
        display: inline-block;
        text-indent: -3125em;
      }
      .c-animated-button:before, .c-animated-button:after, .c-animated-button__text:before {
        content: "";
        display: inline-block;
        position: absolute;
        top: 50%;
        left: 0.375em;
        right: 0.375em;
        height: 0.25em;
      }
      .c-animated-button:before, .c-animated-button:after {
        transition: transform 300ms cubic-bezier(0.75, -0.6, 0.14, 1.59) 150ms;
        will-change: transform background-color;
      }
      .c-animated-button[data-active='true']:before, .c-animated-button[data-active='true']:after {
        transition-duration: 150ms;
        transition-timing-function: ease-out;
        transition-delay: 0s;
      }
      .c-animated-button--plus-to-check:before, .c-animated-button--plus-to-check:after {
        background-color: #ffd600;
      }
      .c-animated-button--plus-to-check[data-active='true']:before, .c-animated-button--plus-to-check[data-active='true']:after {
        background-color: #ffd600;
      }
      .c-animated-button--plus-to-check[data-active='true']:before {
        transform: translate(calc(25% - .175em), -0.175em) rotate(-45deg) scale(1, 1);
      }
      .c-animated-button--plus-to-check[data-active='true']:after {
        transform: translate(-25%, 0.175em) rotate(45deg) scale(0.43, 1);
      }
      .c-animated-button--plus-to-check:before {
        transform: translate(0, 0) rotate(-90deg) scale(1, 1);
      }
      .c-animated-button--plus-to-check:after {
        transform: translate(0, 0) rotate(180deg) scale(1, 1);
      }      
    `;
    document.head.appendChild(style);
}
