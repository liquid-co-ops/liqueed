
var service = require('../services/project');
var sperson = require('../services/person');

function getId(id) {
    if (id && id.length && id.length > 10)
        return id;
        
    return parseInt(id);
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

function getTeam(req, res) {
    var id = getId(req.params.id);
    service.getTeam(id, function (err, items) {
        res.send(items);
    });
}

function getShareholders(req, res) {
    var id = getId(req.params.id);
    service.getShareholders(id, function (err, items) {
        res.send(items);
    });
}

function getShares(req, res) {
    var id = getId(req.params.id);
    service.getShares(id, function (err, items) {
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
    
    service.putAssignment(id, idp, data.from, data.to, data.amount, data.feedback, function (err, id) {
        res.send({ id: id });
    });
}

function putAssignments(req, res) {
    var id = getId(req.params.id);
    var idp = getId(req.params.idp);
    var data = req.body;
    service.putAssignments(id, idp, data.from, data.assignments, function (err, result) {
        res.send(result);
    });
}

module.exports = {
    list: list,
    get: get,
    getTeam: getTeam,
    getShareholders: getShareholders,
    getShares: getShares,
    getPeriods: getPeriods,
    getPeriod: getPeriod,
    getAssignments: getAssignments,
    putAssignment: putAssignment,
    putAssignments: putAssignments
}

