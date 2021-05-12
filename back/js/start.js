/**
 * Created: NextNextDev
 */
async function init() {
    let etpgpb = new Etpgpb();
    let etpgpb_status = await etpgpb.storage_status();
    if (etpgpb_status.etpgpb_44 === true) {
        etpgpb.status_44 = true;
    }
    
    routing({etpgpb})
}

init();