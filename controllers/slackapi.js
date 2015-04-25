
var service = require('../services/slack');

function doTest(request, response) {
    var params = getParams(request);
        
    response.send(service.doTest(params));
}

function doSlack(request, response) {
    var params = getParams(request);
    var text = getText(params);
    
    if (text && text == 'person')
        service.doPerson(function (err, data) {
            if (err)
                response.send(err);
            else
                response.send(data);
        });
    else
        response.send(service.doTest(params));
}

function getParams(request) {
    if (request.body && Object.keys(request.body).length > 0)
        return request.body;
    else
        return request.query;
}

function getText(params) {
    if (params.text)
        return params.text.trim();
    
    return null;
}

module.exports = {
    doTest: doTest,
    doSlack: doSlack
}