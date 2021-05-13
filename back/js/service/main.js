/**
 * Created: NextNextDev
 */
/**
 * Класс менеджер
 * _step отвечает за текущее состояние расширения
 * возможные значения:
 * 1 - вход
 * 2 - форма с логином
 * 3 - выбор сайта
 * 4 - список форм
 * 5 - настройка формы
 */
class Main {
    _screen = '';
    _screenData = {}; // токен пользователя

    constructor() {}

    /**
     * Устанавливает текущее состояние.
     * Проверяет авторизацию.
     * @returns {boolean}
     */
    async init() {
        let {screen, screenData} = await this.#getDataStorage();
        if (screen) {
            this._screen = screen;
            this._screenData = screenData;
            return true
        } else {
            let obj = {
                game: {
                    status: false,
                    items: []
                },
                business: {
                    status: false,
                    items: []
                }
            };
            this.setScreenData(obj)
            this.setScreen('game')
            this._screenData = obj;
        }
    }

    #getDataStorage() {
        return new Promise((resolve, reject) => {
            chrome.storage.sync.get(['screen', 'screenData'], async function (result) {
                if (chrome.runtime.lastError) {
                    console.error('Не смог получить статус:', chrome.runtime.lastError);
                    return resolve(false);
                }
                console.log(result)
                return resolve(result)
            });
        });
    }

    setScreen(value) {
        return new Promise((resolve, reject) => {
            if (this._screen === value) {
                return true;
            }
            this._screen = value;

            chrome.storage.sync.set(
                {
                    screen: value,
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

    get screen() {
        return this._screen;
    }

    setScreenData(value) {
        return new Promise((resolve, reject) => {
            this._screenData = value;
            chrome.storage.sync.set(
                {
                    screenData: value,
                },
                function () {
                    if (chrome.runtime.lastError) {
                        var errorMsg = chrome.runtime.lastError.message;
                        return reject(errorMsg);
                    } else {
                        console.log("Saved:",value)
                        return resolve(true);
                    }
                },
            );
        });
    }

    get screenData() {
        return this._screenData;
    }
}
