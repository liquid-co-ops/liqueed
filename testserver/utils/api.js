
var http = require('http');
var url = require('url');

function doRequest(method, pageurl, data, cb) {
    var urldata = url.parse(pageurl);
    
    if (!cb) {
        cb = data;
        data = null;
    }
    
    var options = {
        host: urldata.hostname,
        port: urldata.port,
        path: urldata.path,
        method: method
    };
    
    if (data)
        options.headers = { 'content-type': 'application/json' };
    
    var req = http.request(options, function(res) {
        var buffer = '';

        res.on('data', function(d) {
            var text = d.toString();
            buffer += text;
        });

        res.on('err', function(err) {
            cb(err);
        });

        res.on('end', function(d) {
            if (d) {
                var text = d.toString();
                buffer += text;
            }

            cb(null, buffer);
        });
    });
    
    if (data)
        req.write(data);

    req.end();    
}

module.exports = {
    doRequest: doRequest
};

