
var controller = require('../controllers/project');

exports['get index'] = function (test) {
    var request = {};

    var response = {
        render: function (name, model) {
            test.ok(name);
            test.equal(name, 'projectlist');
            test.ok(model);
            test.equal(model.title, 'Projects');
            test.ok(model.items);
            test.ok(Array.isArray(model.items));
            test.ok(model.items.length);
            test.ok(model.items[0].id);
            test.ok(model.items[0].name);
            test.done();
        }
    };
    
    controller.index(request, response);
};
