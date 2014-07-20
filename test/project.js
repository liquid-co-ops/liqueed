
var service = require('../services/project');

var liqueedid;

exports['add project'] = function (test) {
    var result = service.addProject({ name: 'liqueedid' });
    
    test.ok(result);
    liqueedid = result;
};

exports['get project by id'] = function (test) {
    var result = service.getProjectById(liqueedid);
    
    test.ok(result);
    test.equal(result.name, 'liqueedid');
    test.equal(result.id, liqueedid);
};