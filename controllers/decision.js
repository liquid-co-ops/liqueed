'use strict';

var service = require('../services/decision');
var async = require('simpleasync');

function index(req, res) {
    var projectid = req.params.projectid;
    
    service.getDecisionsByProject(projectid, function (err, items) {
        if (err)
            throw err;
            
        res.render('decisionlist', { title: 'Decisions', items: items, projectid: projectid });
    });
}

module.exports = {
    index: index
};

