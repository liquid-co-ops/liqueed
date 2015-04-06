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
            url: prefix + '/auth/api/login',
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

    function getPeriod(idproj, idper, cb) {
        $.get(prefix + '/api/project/' + idproj + '/period/' + idper, function (data) {
            cb(null, data);
        }).fail(function (err) {
            cb(err, null);
        });
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

    function getClosedSharesByProject(idproj, cb) {
        getEntity(idproj, cb, "/closedshare");
    }

    function getSharesByPeriod(idproj, idper, cb) {
        getEntity(idproj, cb, "/period/" + idper + "/share");
    }

    function getClosedSharesByPeriod(idproj, idper, cb) {
        getEntity(idproj, cb, "/period/" + idper + "/closedshare");
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
    
    function getGivenAssignmentsByProjectPerson(projectid, personid, cb) {
        getEntity(projectid, cb, "/person/" + personid + "/givenassign");
    }
    
    function getReceivedAssignmentsByProjectPerson(projectid, personid, cb) {
        getEntity(projectid, cb, "/person/" + personid + "/receivedassign");
    }

    function getPendingShareProjects(userid, cb) {
	    $.get(prefix + '/api/person/' + userid + '/pendigshares', function (data) {
	        cb(null, data);
	    }).fail(function (err) {
	        cb(err, null);
	    });
    }
    
    function changePassword(userid, password, cb) {
        var data = { password: password };
        
        $.ajax({
            type: "PUT",
            contentType: "application/json; charset=utf-8",
            url: prefix + '/api/person/' + userid + '/chpwd',
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

    function getDecisionsByProject(idproj, cb) {
        getEntity(idproj, cb, "/decision");
    }

    return {
        getProjectsByUser: getProjectsByUser,
        getMyProjects: getMyProjects,
        getProject: getProject,
        addProject: addProject,
        getPeriods: getPeriods,
        getPeriod: getPeriod,
        addPeriod: addPeriod,
        getTeam: getTeam,
        getShareholders: getShareholders,

        getSharesByProject: getSharesByProject,
        getClosedSharesByProject: getClosedSharesByProject,
        getSharesByPeriod: getSharesByPeriod,
        getClosedSharesByPeriod: getClosedSharesByPeriod,
        getPendingShareProjects: getPendingShareProjects,
        
        getAssignments: getAssignments,
        putAssigments: putAssignments,
        getGivenAssignmentsByProjectPerson: getGivenAssignmentsByProjectPerson,
        getReceivedAssignmentsByProjectPerson: getReceivedAssignmentsByProjectPerson,

        getPersons: getPersons,
        loginPerson: loginPerson,
        setPrefix: function (prf) { prefix = prf; },
        
        changePassword: changePassword,
        
        getDecisionsByProject: getDecisionsByProject
    };
})();

if (typeof window == 'undefined')
    module.exports = clientserver;
