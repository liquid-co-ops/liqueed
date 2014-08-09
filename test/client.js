
var client = require('../public/scripts/client.js');

exports['get my projects'] = function (test) {
    var result = client.getMyProjects();
    test.ok(result);
    test.ok(Array.isArray(result));
    test.ok(result.length);
}

