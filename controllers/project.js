
var service = require('../services/project');
var sperson = require('../services/person');

function index(req, res) {
    var items = service.getProjects();
    res.render('projectlist', { title: 'Projects', items: items });
}

function view(req, res) {
    var item = service.getProjectById(req.params.id);
    var teamdata = service.getTeam(req.params.id);
    
    var team = [];
    
    teamdata.forEach(function (teammember) {
        var person = sperson.getPersonById(teammember.person);
        team.push(person);
    });
    
    res.render('projectview', { title: 'Project', item: item, team: team });
}

module.exports = {
    index: index,
    view: view
}
