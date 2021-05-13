window.onload = start;
let screen = 'game';
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
                console.log(body)
                switchScreen(screen);
                return resolve(true);
            });
        } catch (error) {
            console.error(error);
        }
    });
}

function addEditEvents() {
    // let editNodes = Array.from(document.querySelectorAll('.write_input'));
    // editNodes.forEach((node) => {
    //     node.addEventListener('click', editFn);
    // });
    // let removeNodes = Array.from(document.querySelectorAll('.close_input'));
    // removeNodes.forEach((node) => {
    //     node.addEventListener('click', removeFn);
    // });
    // let inputNodes = Array.from(document.querySelectorAll('.input__btn'));
    // inputNodes.forEach((node) => {
    //     node.addEventListener('click', toggleActive);
    // });
    let addNodes = Array.from(document.querySelectorAll('.add__point'));
    addNodes.forEach((node) => {
        node.addEventListener('click', addInput);
    });
    let switchNode = document.querySelector('.svgContainer')
    switchNode.addEventListener('click', switchScreen)
    let toggleScreenNode = document.querySelector('header label')
    toggleScreenNode.addEventListener('click', toggleScreen)
}

function editFn(event) {
    let input = event.path[1].children[2];
    if (input.readOnly) {
        event.target.classList.add('--active')
        input.readOnly = false;
        input.style.cursor = 'text';
    } else {
        event.target.classList.remove('--active')
        input.readOnly = true;
        input.style.cursor = 'pointer';
        let id = event.path[1].dataset.id;
        screenData[screen].items[id].name = event.path[1].children[2].value;
        updateData('data')
    }
}

function removeFn(event) {
    // remove in db
    let input = event.path[1].remove();
    let inputNode = event.path[1].children[2];
    let newItems = screenData[screen].items.filter((item) => item.name !== inputNode.value);
    console.log(newItems)
    screenData[screen].items = newItems;
    updateData('data');
}

function toggleActive(event) {
    let input = event.path[1].children[2];
    if (!input.readOnly) {
        return;
    }
    let id = event.path[1].dataset.id;
    if (input.classList.contains('--active')) {
        //deactivate in db
        screenData[screen].items[id].status = false;
        
    } else {
        //activate in db
        screenData[screen].items[id].status = true;
    }
    updateData('data')
    input.classList.toggle('--active');
}

async function addInput(name, index) {
    if (typeof name !== 'string') {
        console.log(name)
        name = "Название";
    }
    let itemNode = document.createElement('div');
    itemNode.classList.add('input');

    let closeNode = document.createElement('div');
    closeNode.classList.add('close_input');

    let editNode = document.createElement('div');
    editNode.classList.add('write_input');

    let inputNode = document.createElement('input');
    inputNode.classList.add('input__btn');
    inputNode.value = name ? name : 'Название';
    inputNode.readOnly = true;

    if (index != undefined) {
        itemNode.dataset.id = index;
        if (screenData[screen].items[index].status === true) {
            inputNode.classList.add('--active');
        }
    } else {
        itemNode.dataset.id = screenData[screen].items.length
        screenData[screen].items.push({name, status: false})
        updateData('data')
    }

    itemNode.append(closeNode, editNode, inputNode);

    let containerNode = document.querySelector('.input._add');
    containerNode.before(itemNode);

    inputNode.addEventListener('click', toggleActive);
    editNode.addEventListener('click', editFn);
    closeNode.addEventListener('click', removeFn);
}

async function switchScreen(eventOrName) {
    if (typeof eventOrName !== 'string') {
        screen = screen === 'game' ? 'business': 'game';
        await updateData('screen')
        location.reload();
    } else {
        screen = eventOrName;
    }

    let screenNode = document.querySelector('.screen');
    screenNode.textContent = screen === 'game' ? 'Игры' : 'Бизнесы';

    if (Object.keys(screenData).length == 0 || !(screen in screenData)) {
        addEditEvents()
        return;
    }

    let data = screenData[screen];
    if (data.status === true) {
        document.querySelector('header > label').click();
    }

    if (data.items.length > 0) {
        data.items.forEach((value, index) => {
            addInput(value.name, index);
        });
    }
    addEditEvents()
}

function updateData(action) {
    return new Promise((resolve, reject) => {
        if (action === 'screen') {
            chrome.runtime.sendMessage({ command: 'setScreen', body: screen }, function ({ status, body }) {
                if (chrome.runtime.lastError) {
                    throw new Error(chrome.runtime.lastError);
                }
                return resolve(true);
            });
        } else {
            // data
            chrome.runtime.sendMessage({ command: 'setSettings', body: screenData }, function ({ status, body }) {
                if (chrome.runtime.lastError) {
                    throw new Error(chrome.runtime.lastError);
                }
                return resolve(true);
            });
        }
    });
}

function toggleScreen(event) {
    if (event.detail !== 1) {
        return;
    }

    if (screenData[screen].status === true) {
        screenData[screen].status = false
    } else {
        screenData[screen].status = true
    }
    updateData('data')
}
