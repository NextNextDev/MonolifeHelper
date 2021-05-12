/**
 * Перехватывает запрос и кладет тело запроса в див.
 * @param {string} checkUrl - адресс который нужно записывать в дис
 */
function interceptData(checkUrl) {
    let xhrOverrideScript = document.createElement('script');
    xhrOverrideScript.type = 'text/javascript';
    xhrOverrideScript.innerHTML = `
    (function() {
        let NextIndex = 0;
        let dataDOMElement = document.createElement('div');
        dataDOMElement.id = '__interceptedData';
        dataDOMElement.style.height = 0;
        dataDOMElement.style.overflow = 'hidden';
        document.body.appendChild(dataDOMElement);
        let XHR = XMLHttpRequest.prototype;
        let send = XHR.send;
        let open = XHR.open;
        XHR.open = function(method, url) {
            this.url = url; // the request url
            return open.apply(this, arguments);
        }
        XHR.send = function() {
            this.addEventListener('load', function() {
                //console.log("URL:",this.url);
                if (this.url.includes('${checkUrl}')) {
                    let dataDOMElement = document.getElementById('__interceptedData');
                    dataDOMElement.textContent = this.response;
                    NextIndex++;
                    dataDOMElement.dataset.index = NextIndex;
                }
            });
            return send.apply(this, arguments);
        };
    })();
    `;
    document.head.prepend(xhrOverrideScript);
}

/**
 * Что-бы отследить изменения можно использовать обсервер
 * function createObserv(params) {
        let observer = new MutationObserver((mutation) => {
            let response = JSON.parse(mutation[0].addedNodes[0].data);
            if (response.action === 'Procedure' && response.method === 'list') { // проверка содержания
                show(response.result.procedures)
            }
        });
        observer.observe(document.getElementById('__interceptedData'), {childList: true});
    }
 */