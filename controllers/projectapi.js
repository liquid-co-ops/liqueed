
var service = require('../services/project');
var sperson = require('../services/person');

function list(req, res) {
    var items = service.getProjects();
    res.send(items);
}

function get(req, res) {
    var id = parseInt(req.params.id);
    var item = service.getProjectById(id);
    
    res.send(item);
}

function getTeam(req, res) {
    var id = parseInt(req.params.id);
    var items = service.getTeam(id);
    
    res.send(items);
}

function getPeriods(req, res) {
    var id = parseInt(req.params.id);
    var items = service.getPeriods(id);
    
    res.send(items);
}

function getPeriod(req, res) {
    var id = parseInt(req.params.id);
    var idp = parseInt(req.params.idp);
    var item = service.getPeriodById(idp);
    
    res.send(item);
}

function getAssignments(req, res) {
    var id = parseInt(req.params.id);
    var idp = parseInt(req.params.idp);
    var items = service.getAssignments(idp);
    
    res.send(items);
}

function putAssignment(req, res) {
    var id = parseInt(req.params.id);
    var idp = parseInt(req.params.idp);
    var data = req.body;
    
    var id = service.putAssignment(id, idp, data.from, data.to, data.amount);
    
    res.send({ id: id });
}

module.exports = {
    list: list,
    get: get,
    getTeam: getTeam,
    getPeriods: getPeriods,
    getPeriod: getPeriod,
    getAssignments: getAssignments,
    putAssignment: putAssignment
}

