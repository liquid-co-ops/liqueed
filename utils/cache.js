
// See http://stackoverflow.com/questions/49547/making-sure-a-web-page-is-not-cached-across-all-browsers

module.exports = function (res) {
    if (res.set) {
        res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.set('Pragma', 'no-cache');
        res.set('Expires', '0');
    }
}
