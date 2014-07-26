
var service = require('../services/project');

function index(req, res) {
    var items = service.getProjects();
    res.render('projectlist', { title: 'Projects', items: items });
}

function view(req, res) {
    var item = service.getProjectById(req.params.id);
    res.render('projectview', { title: 'Project', item: item });
}

module.exports = {
    index: index,
    view: view
}
