
var service = require('../services/slack');

function doTest(request, response) {
    response.send(service.doTest(request.params));
}

module.exports = {
    doTest: doTest
}