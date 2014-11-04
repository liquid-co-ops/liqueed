'use strict';

var sl;
var $;

if (typeof sl == 'undefined')
    sl = require('simplelists');

var clientserver = (function() {
    var prefix = '';
    
     if (typeof $ == 'undefined')
        $ = require('../../testserver/utils/ajax');

    function getPersons(cb) {
        $.get(prefix + '/api/person', function (data) {
            cb(null, sl.sort(data, 'name'));
        }).fail(function (err) {
            cb(err, null);
        });
    }

    function getProjectsByUser(userid, cb) {
      $.get(prefix + '/api/person/' + userid+'/project', function (data) {
          cb(null, data);
      }).fail(function (err) {
          cb(err, null);
      });
    }

    function getMyProjects(cb) {
        $.get(prefix + '/api/project', function (data) {
            cb(null, sl.sort(data, 'name'));
        }).fail(function (err) {
            cb(err, null);
        });
    }

    function getProject(idproj, cb) {
        $.get(prefix + '/api/project/' + idproj, function (data) {
            cb(null, data);
        }).fail(function (err) {
            cb(err, null);
        });
    }

    function addProject(proj, cb) {
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: prefix + '/api/project/',
            data: JSON.stringify(proj),
            dataType: "json",
            success: function (msg) {
                cb(null, msg);
            },
            error: function (err){
                cb(err, null);
            }
        });
    }

    function loginPerson(username, password, cb) {
        var data = {
            username: username,
            password: password
        };

        $.ajax({
            type: "PUT",
            contentType: "application/json; charset=utf-8",
            url: prefix + '/api/person/login/',
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

    function getEntity(idproj, cb, entityName) {
        $.get(prefix + '/api/project/' + idproj + entityName, function (data) {
            cb(null, data);
        }).fail(function (err) {
            cb(err, null);
        });
    }

    function getPeriods(idproj, cb) {
        getEntity(idproj, cb, "/period");
    }
    
    
    function addPeriod(projid, period, cb) {
        var data = {
			projid: projid,
			period: period
         };
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: prefix + '/api/project/' + projid + '/period',
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

    function getShareholders(idproj, cb) {
        getEntity(idproj, cb, "/shareholder");
    }

    function getTeam(idproj, cb) {
        getEntity(idproj, cb, "/team");
    }

    function getSharesByProject(idproj, cb) {
        getEntity(idproj, cb, "/share");
    }

    function getAssignments(projectid, periodid, cb) {
        getEntity(projectid, cb, "/period/" + periodid + "/assign");
    }

    function putAssignments(projectid, periodid, fromid, assignments, cb) {
        var data = {
            from: fromid,
            assignments: assignments
        }

        $.ajax({
            type: "PUT",
            contentType: "application/json; charset=utf-8",
            url: prefix + '/api/project/' + projectid + '/period/' + periodid + '/assigns',
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
    
    function getPendingShareProjects(userid, cb) {
	    $.get(prefix + '/api/person/' + userid+'/pendigshares', function (data) {
	        cb(null, data);
	    }).fail(function (err) {
	        cb(err, null);
	    });
    }

    return {
        getProjectsByUser: getProjectsByUser,
        getMyProjects: getMyProjects,
        getProject: getProject,
        addProject: addProject,
        getPeriods: getPeriods,
        addPeriod: addPeriod,
        getTeam: getTeam,
        getShareholders: getShareholders,
        getSharesByProject: getSharesByProject,
        getPendingShareProjects: getPendingShareProjects,
        getAssignments: getAssignments,
        putAssigments: putAssignments,
        getPersons: getPersons,
        loginPerson: loginPerson,
        setPrefix: function (prf) { prefix = prf; }
    };
})();

if (typeof window == 'undefined')
    module.exports = clientserver;
