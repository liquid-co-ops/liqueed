
var service = require('../services/project');
var sperson = require('../services/person');

function index(req, res) {
    var items = service.getProjects();
    res.render('projectlist', { title: 'Projects', items: items });
}

function view(req, res) {
    var id = parseInt(req.params.id);
    var item = service.getProjectById(id);
    var team = service.getTeam(id);
    var periods = service.getPeriods(id);
    
    res.render('projectview', { title: 'Project', item: item, team: team, periods: periods });
}

module.exports = {
    index: index,
    view: view
}
