
var service = require('../services/slack');

function doTest(request, response) {
    var params = getParams(request);
        
    response.send(service.doTest(params));
}

function doSlack(request, response) {
    var params = getParams(request);
    var text = getText(params);
    var words = getWords(text);
    
    if (words && words[0] == 'person')
        service.doPerson(function (err, data) {
            if (err)
                response.send(err);
            else
                response.send(data);
        });
    else if (words && words[0] == 'project') {
        words.shift();
        service.doProject(words, function (err, data) {
            if (err)
                response.send(err);
            else
                response.send(data);
        });
    }
    else if (words && words[0] == 'kudo') {
        words.shift();
        service.doKudo(words, function (err, data) {
            if (err)
                response.send(err);
            else {
                if (words.length > 1)
                    response.send(words[0] + ' sent a kudo to ' + words[1]);
                else
                    response.send(words[0] + ' has ' + data + ' kudo(s)');
            }
        });
    }
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

function getWords(text) {
    if (!text)
        return null;
        
    return text.trim().split(/\s+/);
}

module.exports = {
    doTest: doTest,
    doSlack: doSlack
}