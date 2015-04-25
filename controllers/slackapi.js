
var service = require('../services/slack');

function doTest(request, response) {
    var params;
    
    if (request.body && Object.keys(request.body).length > 0)
        params = request.body;
    else
        params = request.query;
        
    response.send(service.doTest(params));
}

module.exports = {
    doTest: doTest
}