
var service = require('../services/project');
var sperson = require('../services/person');

var async = require('simpleasync');

function getId(id) {
    if (id && id.length && id.length > 10)
        return id;
        
    return parseInt(id);
}

function index(req, res) {
    service.getProjects(function (err, items) {
        res.render('projectlist', { title: 'Projects', items: items });
    });
}

function view(req, res) {
    var id = getId(req.params.id);
    
    var model = {
        title: 'Project'
    };
    
    async()
    .then(function (data, next) { service.getProjectById(id, next); })
    .then(function (data, next) {
        model.item = data;
        service.getTeam(id, next);
    })
    .then(function (data, next) {
        model.team = data;
        service.getPeriods(id, next);
    })
    .then(function (data, next) {
        model.periods = data;
        res.render('projectview', model);
    })
    .run();
}

function viewPeriod(req, res) {
    var projectId = getId(req.params.id);
    var periodId = getId(req.params.idp);
    
    var model = {
        title: 'Period'
    }

    async()
    .then(function (data, next) { service.getProjectById(projectId, next); })
    .then(function (data, next) {
        model.project = data;
        service.getPeriodById(periodId, next);
    })
    .then(function (data, next) {
        model.item = data;
        service.getAssignments(periodId, next);
    })
    .then(function (data, next) {
        model.assignments = data;
        res.render('periodview', model);
    })
    .run();
}

module.exports = {
    index: index,
    view: view,
    viewPeriod: viewPeriod
}

