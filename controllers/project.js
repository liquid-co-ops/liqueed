
var service = require('../services/project');

exports.index = function(req, res) {
    var items = service.getProjects();
    res.render('projectlist', { title: 'Projects', items: items });
};