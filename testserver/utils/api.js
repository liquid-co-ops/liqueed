'use strict';

var http = require('http');
var url = require('url');

var cookies = [];

function setCookies(setcookies) {
    setcookies.forEach(function (cookie) {
        var p = cookie.indexOf(';');
        
        if (p > 0)
            cookie = cookie.substring(0, p);
            
        cookies.push(cookie);
    });
}

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
        options.headers = { 'Content-Type': 'application/json' };
        
    if (cookies && cookies.length) {
        if (!options.headers)
            options.headers = { };
            
        if (cookies.length == 1)
            options.headers.Cookie = cookies[0];
        else
            options.headers.Cookie = cookies;
    }

    var req = http.request(options, function(res) {
        var buffer = '';
        
        if (res.headers['set-cookie'])
            setCookies(res.headers['set-cookie']);

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
