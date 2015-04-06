'use strict';

var service = require('../services/decision');

function getId(id) {
    if (id && id.length && id.length > 10)
        return id;

    return parseInt(id);
}

function list(req, res) {
    var projid = getId(req.params.projid);
    
    service.getDecisionsByProject(projid, function (err, items) {
        res.send(items);
    });
}

module.exports = {
    list: list
}

