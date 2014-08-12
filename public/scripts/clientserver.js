
var clientserver = (function() {
    if (typeof $ == 'undefined')
        $ = require('../../testserver/utils/ajax');

    function getMyProjects(cb) {
        $.get('/api/project', function (data) {
            cb(null, data);
        }).fail(function (err) {
            cb(err, null);
        });
    }
    
    function getProject(idproj, cb) {
        $.get('/api/project/' + idproj, function (data) {
            cb(null, data);
        }).fail(function (err) {
            cb(err, null);
        });
    }

    function getEntity(idproj, cb, entityName) {
        $.get('/api/project/' + idproj + entityName, function (data) {
            cb(null, data);
        }).fail(function (err) {
            cb(err, null);
        });
    }

    function getPeriods(idproj, cb) {
        getEntity(idproj, cb, "/period");
    }
    
    function getShareholders(idproj, cb) {
        getEntity(idproj, cb, "/shareholder");
    }

    return {
        getMyProjects: getMyProjects,
        getProject: getProject,
        getPeriods: getPeriods,
        getShareholders: getShareholders
    };
})();

if (typeof window == 'undefined')
    module.exports = clientserver;
