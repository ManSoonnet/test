module.exports = {
no_err: (arg) => {
    if ((arg == null) || (typeof arg == undefined) || ( arg == {} ) || (arg == '') || (arg == [])) {
        return false;
    } else {
        return true;
    }
}
}