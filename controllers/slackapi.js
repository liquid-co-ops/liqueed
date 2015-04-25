
var service = require('../services/slack');

function doTest(request, response) {
    response.send(service.doTest(request.query));
}

module.exports = {
    doTest: doTest
}