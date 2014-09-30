
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

function newProject(req, res) {
    res.render('projectnew', { title: 'New Project' });
}

function addProject(req, res) {
    var project = makeProject(req);
    service.addProject(project, function (err, id) {
        if (!req.params)
            req.params = { };
        req.params.id = id;
        view(req, res);
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

function closePeriod(req, res) {
    var projectId = getId(req.params.id);
    var periodId = getId(req.params.idp);
    
    service.closePeriod(projectId, periodId, function (err, result) {
        viewPeriod(req, res);
    });
}

function openPeriod(req, res) {
    var projectId = getId(req.params.id);
    var periodId = getId(req.params.idp);
    
    service.openPeriod(projectId, periodId, function (err, result) {
        viewPeriod(req, res);
    });
}

function makeProject(req) {
    return {
        name: req.param('name')
    }
}

module.exports = {
    index: index,
    view: view,
    newProject: newProject,
    addProject: addProject,
    viewPeriod: viewPeriod,
    openPeriod: openPeriod,
    closePeriod: closePeriod
}

