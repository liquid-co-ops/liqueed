
var client = (function() {
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
    
    function getPeriods(idproj, cb) {
        $.get('/api/project/' + idproj + '/period', function (data) {
            cb(null, data);
        }).fail(function (err) {
            cb(err, null);
        });
    }
    
    function getShareholders(idproj, cb) {
        $.get('/api/project/' + idproj + '/team', function (data) {
            cb(null, data);
        }).fail(function (err) {
            cb(err, null);
        });
    }

    return {
        getMyProjects: getMyProjects,
        getProject: getProject,
        getPeriods: getPeriods,
        getShareholders: getShareholders
    };
})();

if (typeof window == 'undefined')
    module.exports = client;
