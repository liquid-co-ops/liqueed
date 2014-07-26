
var service = require('../services/person');

var aliceid;

exports['add person'] = function (test) {
    var result = service.addPerson({ name: 'Alice' });
    
    test.ok(result);
    aliceid = result;
};

exports['get person by id'] = function (test) {
    var result = service.getPersonById(aliceid);
    
    test.ok(result);
    test.equal(result.name, 'Alice');
    test.equal(result.id, aliceid);
};

exports['get persons'] = function (test) {
    var result = service.getPersons();
    
    test.ok(result);
    test.ok(Array.isArray(result));
    test.ok(result.length);
};