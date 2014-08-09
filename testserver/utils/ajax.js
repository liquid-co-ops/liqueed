
var api = require('./api');

var prefix = '';

function get(url, fn) {
    var fnfail;
    
    api.doRequest('GET', prefix + url, function (err, data) {
        console.log('api err', err);
        console.log('api data', data);
        
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

module.exports = {
    get: get,
    setPrefix: function (pref) { prefix = pref; }
}
