
var api = require('./api');

var prefix = '';

function get(url, fn) {
    var fnfail;
    
    api.doRequest('GET', prefix + url, function (err, data) {
        if (err)
            fnfail(err);
        else
            fn(JSON.parse(data));
    });
    
    return {
        fail: function (fn) {
            fnfail = fn;
            return this;
        }
    }
}

function ajax(data) {
    api.doRequest(data.type, prefix + data.url, data.data, function (err, response) {
        if (err)
            data.error(err);
        else
            data.success(JSON.parse(response));
    });
}

module.exports = {
    get: get,
    setPrefix: function (pref) { prefix = pref; }
}
