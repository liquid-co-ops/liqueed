
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
    
    function getShares(idproj, cb) {
        getEntity(idproj, cb, "/share");
    }
    
    function putAssignments(projectid, periodid, fromid, assignments, cb) {
        var data = {
            from: fromid,
            assigments: assignments
        }
        
        $.ajax({
            type: "PUT",
            contentType: "application/json; charset=utf-8",
            url: '/api/project/' + projectid + '/period/' + periodid + '/assigns',
            data: JSON.stringify(data),
            dataType: "json",
            success: function (msg) {
                cb(null, msg);
            },
            error: function (err){
                cb(err, null);
            }            
        });
    }

    return {
        getMyProjects: getMyProjects,
        getProject: getProject,
        getPeriods: getPeriods,
        getShareholders: getShareholders,
        getShares: getShares
    };
})();

if (typeof window == 'undefined')
    module.exports = clientserver;
