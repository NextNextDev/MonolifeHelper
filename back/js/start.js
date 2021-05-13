/**
 * Created: NextNextDev
 */
async function init() {
    let main = new Main();
    let init = await main.init();
    routing({main})
}

init();