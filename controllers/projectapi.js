'use strict';

var service = require('../services/project');
var sperson = require('../services/person');

function getId(id) {
    if (id && id.length && id.length > 10)
        return id;

    return parseInt(id,10);
}

function list(req, res) {
    service.getProjects(function (err, items) {
        res.send(items);
    });
}

function get(req, res) {
    var id = getId(req.params.id);
    service.getProjectById(id, function (err, item) {
        res.send(item);
    });
}

function addProject(req, res) {
    service.addProject(req.body, function (err, id) {
        res.json(id);
    });
}

function getTeam(req, res) {
    var id = getId(req.params.id);
    service.getTeam(id, function (err, items) {
        res.send(items);
    });
}

function addPersonToTeam(req, res) {
    var projid = getId(req.params.id);
    var persid = getId(req.params.pid);
    service.addPersonToTeam(projid, persid, function (err, id) {
        res.json(id);
    });
}

function getShareholders(req, res) {
    var id = getId(req.params.id);
    service.getShareholders(id, function (err, items) {
        res.send(items);
    });
}

function getSharesByProject(req, res) {
    var id = getId(req.params.id);
    service.getSharesByProject(id, function (err, items) {
        res.send(items);
    });
}

function getClosedSharesByProject(req, res) {
    var id = getId(req.params.id);
    service.getSharesByProject(id, { closed: true }, function (err, items) {
        res.send(items);
    });
}

function getPeriods(req, res) {
    var id = getId(req.params.id);
    service.getPeriods(id, function (err, items) {
        res.send(items);
    });
}

function getPeriod(req, res) {
    var id = getId(req.params.id);
    var idp = getId(req.params.idp);
    service.getPeriodById(idp, function (err, item) {
        res.send(item);
    });
}

function addPeriod(req, res) {
    var id = getId(req.params.id);
    service.addPeriod(id, req.body.period, function (err, id) {
		if (err) {
			res.send({ error : err });
		} else {
			res.json(id);
		}
    });
}


function getAssignments(req, res) {
    var id = getId(req.params.id);
    var idp = getId(req.params.idp);
    service.getAssignments(idp, function (err, items) {
        res.send(items);
    });
}

function putAssignment(req, res) {
    var id = getId(req.params.id);
    var idp = getId(req.params.idp);
    var data = req.body;

    service.putAssignment(id, idp, data.from, data.to, data.amount, data.note, function (err, id) {
        if (err)
            res.send({ error: err });
        else
            res.send({ id: id });
    });
}

function putAssignments(req, res) {
    var id = getId(req.params.id);
    var idp = getId(req.params.idp);
    var data = req.body;
    service.putAssignments(id, idp, data.from, data.assignments, function (err, result) {
        if (err)
            res.send({ error: err });
        else
            res.send(result);
    });
}

function openPeriod(req, res) {
    var id = getId(req.params.id);
    var idp = getId(req.params.idp);
    service.openPeriod(id, idp, function (err, data) {
        res.json(true);
    });
}

function closePeriod(req, res) {
    var id = getId(req.params.id);
    var idp = getId(req.params.idp);
    service.closePeriod(id, idp, function (err, data) {
        res.json(true);
    });
}

module.exports = {
    list: list,
    get: get,
    addProject: addProject,
    getTeam: getTeam,
    addPersonToTeam: addPersonToTeam,
    getShareholders: getShareholders,
    getSharesByProject: getSharesByProject,
    getClosedSharesByProject: getClosedSharesByProject,
    getPeriods: getPeriods,
    getPeriod: getPeriod,
    getAssignments: getAssignments,
    putAssignment: putAssignment,
    putAssignments: putAssignments,
    addPeriod: addPeriod,
    openPeriod: openPeriod,
    closePeriod: closePeriod
};
