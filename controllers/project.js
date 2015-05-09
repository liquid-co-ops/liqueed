'use strict';

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
    .fail(function (err) {
        res.render('error', { title: 'Error', error: err });
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
    .fail(function (err) {
        res.render('error', { title: 'Error', error: err });
    })
    .run();
}

function getPeriodMatrix(req, res) {
    var projectId = getId(req.params.id);
    var periodId = getId(req.params.idp);

    var model = {
        title: 'Period Assignment Matrix'
    }

    async()
    .then(function (data, next) { service.getProjectById(projectId, next); })
    .then(function (data, next) {
        model.project = data;
        service.getPeriodById(periodId, next);
    })
    .then(function (data, next) {
        model.period = data;
        service.getTeam(projectId, next);
    })
    .then(function (data, next) {
        model.team = data;
        service.getShareholders(projectId, next);
    })
    .then(function (data, next) {
        model.shareholders = data;
        res.render('periodmatrix', model);
    })
    .fail(function (err) {
        res.render('error', { title: 'Error', error: err });
    })
    .run();
}

function updatePeriodMatrix(req, res) {
    var projectId = getId(req.params.id);
    var periodId = getId(req.params.idp);
    
    var nfrom = 0;
    
    doFromStep();
    
    function doFromStep() {
        nfrom++;
        var fromname = 'from_' + nfrom;
        
        if (!req.param(fromname)) {
            viewPeriod(req, res);
            return;
        }
        
        var fromid = getId(req.param(fromname));
        
        var assignments = [];
        
        var nto = 0;
        
        while (true) {
            nto++;
            var toname = 'to_' + nto;
            
            if (!req.param(toname))
                break;
                
            var toid = getId(req.param(toname));
            
            var assignname = 'assign_' + nfrom + '_' + nto;
            
            var assign = 0;
            
            assign = parseInt(req.param(assignname));
            
            if (fromid != toid && !Number.isNaN(assign))
                assignments.push({ to: toid, amount: assign, note: 'N/A' });
        }
        
        service.putAssignments(projectId, periodId, fromid, assignments, function (err, data) {
            if (err) {
                cb(err, null);
                return;
            }
            
            setTimeout(doFromStep, 0);
        });
    }
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

function newTeamMember(req, res) {
    var id = getId(req.params.id);

    var model = { title: 'Add to Team' };

    async()
    .then(function (data, next) { service.getProjectById(id, next); })
    .then(function (data, next) {
        model.item = data;
        sperson.getPersons(next);
    })
    .then(function (items, next) {
        model.persons = items;
        res.render('teammembernew', model);
    })
    .fail(function (err) {
        res.render('error', { title: 'Error', error: err });
    })
    .run();
}

function addTeamMember(req, res) {
    var id = getId(req.params.id);
    var pid = getId(req.param('person'));

    service.addPersonToTeam(id, pid, function (err, data) {
        view(req, res);
    });
}

function removeTeamMember(req, res) {
    var id = getId(req.params.id);
    var pid = getId(req.params.pid);

    service.removePersonFromTeam(id, pid, function (err, data) {
        view(req, res);
    });
}

function newPeriod(req, res) {
    var id = getId(req.params.id);
    res.render('periodnew', { title: 'New Period', project: { id: id } });
}

function addPeriod(req, res) {
    var id = getId(req.params.id);
    var name = req.param('name');
    var amount = req.param('amount');
    
    try {
        amount = parseInt(amount);
    }
    catch (ex) {
        amount = 0;
    }
    
    var period = { name: name, amount: amount };

    service.addPeriod(id, period, function (err, data) {
        if (err)
            res.render('error', { error: err });
        else
            view(req, res);
    });
}

function editPeriod(req, res) {
    var projectId = getId(req.params.id);
    var periodId = getId(req.params.idp);

    var model = {
        title: 'Edit Period'
    }

    async()
    .then(function (data, next) { service.getProjectById(projectId, next); })
    .then(function (data, next) {
        model.project = data;
        service.getPeriodById(periodId, next);
    })
    .then(function (data, next) {
        model.item = data;
        res.render('periodedit', model);
    })
    .fail(function (err) {
        res.render('error', { title: 'Error', error: err });
    })
    .run();
}

function updatePeriod(req, res) {
    var id = getId(req.params.id);
    var pid = getId(req.params.idp);
    
    var name = req.param('name');
    var amount = req.param('amount');
    var date = req.param('date');
    
    var period = { name: name, amount: amount, date: date };
    service.updatePeriod(id, pid, period, function (err, data) {
        if (err)
            res.render('error', { error: err });
        else
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
    closePeriod: closePeriod,
    newTeamMember: newTeamMember,
    addTeamMember: addTeamMember,
    removeTeamMember: removeTeamMember,
    newPeriod: newPeriod,
    addPeriod: addPeriod,
    editPeriod: editPeriod,
    updatePeriod: updatePeriod,
    getPeriodMatrix: getPeriodMatrix,
    updatePeriodMatrix: updatePeriodMatrix
}
