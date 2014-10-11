
var controller = require('../controllers/projectapi');
var loaddata = require('../utils/loaddata');
var db = require('../utils/db');
var personService = require('../services/person');
var projectService = require('../services/project');
var sl = require('simplelists');
var async = require('simpleasync');

var projects;
var project;
var team;
var periods;
var period;

function getProjectByName(projectName) {
	for ( var p in projects) {
			if (projects[p].name === projectName) {
				return projects[p];
			}
	}
}

exports['clear and load data'] = function (test) {
    test.async();
    
    async()
    .then(function (data, next) { db.clear(next); })
    .then(function (data, next) { loaddata(next); })
    .then(function (data, next) { projectService.getProjects(next); })
    .then(function (data, next) {
        projects = data;
        test.ok(projects);
        test.ok(projects.length);
        test.ok(sl.exist(projects, { name: 'FaceHub' }));
    
        project = sl.first(projects, { name: 'FaceHub' });
        projectService.getPeriods(project.id, next);
    })
    .then(function (data, next) {
        periods = data;
        test.ok(periods);
        test.ok(periods.length);
        
        period = periods[0];
        projectService.getTeam(project.id, next);
    })
    .then(function (data, next) {
        team = data;
        test.ok(team);
        test.ok(team.length);
        test.done();
    })
    .run();
};

exports['get list'] = function (test) {
    test.async();
    
    var request = {};

    var response = {
        send: function (model) {
            test.ok(model);
            test.ok(Array.isArray(model));
            test.ok(model.length);
            test.ok(model[0].id);
            test.ok(model[0].name);
            test.done();
        }
    };
    
    controller.list(request, response);
};

exports['get first project'] = function (test) {
    test.async();
    
    var request = {
        params: {
            id: project.id.toString()
        }
    };

    var response = {
        send: function (model) {
            test.ok(model);
            test.equal(model.id, projects[0].id);
            test.equal(model.name, projects[0].name);
            
            test.done();
        }
    };
    
    controller.get(request, response);
};

exports['get first project team'] = function (test) {
    test.async();
    
    var request = {
        params: {
            id: project.id.toString()
        }
    };

    var response = {
        send: function (model) {
            test.ok(model);

            test.ok(Array.isArray(model));

            test.equal(model.length, 3);
            test.equal(model[0].name, 'Alice');
            test.equal(model[1].name, 'Bob');
            test.equal(model[2].name, 'Charlie');
            
            test.done();
        }
    };
    
    controller.getTeam(request, response);
};

exports['get first project shareholders'] = function (test) {
    test.async();
    
    var request = {
        params: {
            id: project.id.toString()
        }
    };

    var response = {
        send: function (model) {
            test.ok(model);

            test.ok(Array.isArray(model));

            test.equal(model.length, 3);
            test.equal(model[0].name, 'Alice');
            test.equal(model[1].name, 'Bob');
            test.equal(model[2].name, 'Charlie');
            
            test.done();
        }
    };
    
    controller.getShareholders(request, response);
};

exports['get first project periods'] = function (test) {
    test.async();
    
    var request = {
        params: {
            id: project.id.toString()
        }
    };

    var response = {
        send: function (model) {
            test.ok(model);

            test.ok(Array.isArray(model));

            test.equal(model.length, 2);
            test.equal(model[0].name, 'January 2014');
            test.equal(model[0].date, '2014-01-31');
            test.equal(model[1].name, 'February 2014');
            test.equal(model[1].date, '2014-02-28');
            
            test.done();
        }
    };
    
    controller.getPeriods(request, response);
};

exports['add a period to a project'] = function (test) {
    test.async();
	var myProject;    
	async()
	.then(function (data, next) {
		myProject = getProjectByName("My project 3");
		test.ok(myProject);
		test.done();
    })
    .then(function (data, next) {
	    var request = {
	        params: { id:myProject.id.toString()},
		
	        body: { 
	        	    period: {
	        	    		name: "new period", 
	        	    		amount: 100
	        	    }
	        }
	    };	
	    var response = {
	        json: function (id) {        	
	            test.ok(id);           
	            projectService.getPeriods(myProject.id, function(err,result){
	    			test.ok(result);
					var period = function() {
						for ( var n in result) {
							if (result[n].name === "new period") {
								return result[n]
							}
						}
					}();
	    			test.ok(period);
	    			test.equal(period.name, "new period");
	    			test.equal(period.amount, 100);
	    			test.ok(period.date);
	    			test.done()
	    		});
	        }
	    };    
	    controller.addPeriod(request, response);
    }).run();
};


exports['get first project first period'] = function (test) {
    test.async();
    
    var request = {
        params: {
            id: project.id.toString(),
            idp: period.id.toString()
        }
    };

    var response = {
        send: function (model) {
            test.ok(model);

            test.equal(model.name, 'January 2014');
            test.equal(model.date, '2014-01-31');
            
            test.done();
        }
    };
    
    controller.getPeriod(request, response);
};

exports['get first project first period assignments'] = function (test) {
    test.async();
    
    var request = {
        params: {
            id: project.id.toString(),
            idp: period.id.toString()
        }
    };

    var response = {
        send: function (model) {
            test.ok(model);
            test.ok(Array.isArray(model));
            test.equal(model.length, 6);

            test.equal(model[0].from.name, 'Alice');
            test.equal(model[0].to.name, 'Bob');
            test.equal(model[0].amount, 50);
            
            test.done();
        }
    };
    
    controller.getAssignments(request, response);
};

exports['get first project first period put assignment'] = function (test) {
    test.async();
    
    var request = {
        params: {
            id: project.id.toString(),
            idp: period.id.toString()
        },
        body: {
            from: team[0].id,
            to: team[1].id,
            amount: 1
        }
    };

    var response = {
        send: function (model) {
            test.ok(model);
            test.ok(model.id);
            
            projectService.getAssignments(period.id, function (err, assignments) {
                test.ok(!err);
                var assignment;
                
                for (var k in assignments)
                    if (assignments[k].from.id == team[0].id && assignments[k].to.id == team[1].id && assignments[k].amount == 1) {
                        assignment = assignments[k];
                        break;
                    }
                
                test.ok(assignment);
                
                test.done();
            });
        }
    };
    
    controller.putAssignment(request, response);
};

exports['close first project first period'] = function (test) {
    test.async();
    
    var request = {
        params: {
            id: project.id.toString(),
            idp: period.id.toString()
        }
    };

    var response = {
        json: function (model) {
            test.ok(model);
            
            projectService.getPeriodById(period.id, function (err, period) {
                test.ok(!err);
                test.ok(period.id);
                test.ok(period.name);
                test.ok(period.date);
                test.equal(period.closed, true);
                
                test.done();
            });
        }
    };
    
    controller.closePeriod(request, response);
};

exports['reopen first project first period'] = function (test) {
    test.async();
    
    var request = {
        params: {
            id: project.id.toString(),
            idp: period.id.toString()
        }
    };

    var response = {
        json: function (model) {
            test.ok(model);
            
            projectService.getPeriodById(period.id, function (err, period) {
                test.ok(!err);
                test.ok(period.id);
                test.ok(period.name);
                test.ok(period.date);
                test.equal(period.closed, false);
                
                test.done();
            });
        }
    };
    
    controller.openPeriod(request, response);
};

exports['get first project first period put assignments'] = function (test) {
    test.async();
    
    var request = {
        params: {
            id: project.id.toString(),
            idp: period.id.toString()
        },
        body: {
            from: team[0].id,
            assignments: [
                { to: team[1].id, amount: 10 },
                { to: team[2].id, amount: 90 }
            ]
        }
    };

    var response = {
        send: function (model) {
            test.ok(model);
            
            var assignments = projectService.getAssignments(period.id, function (err, assignments) {
                test.ok(!err);
                var assignment;
                var found = 0;

                for (var k in assignments)
                    if (assignments[k].from.id == team[0].id && assignments[k].to.id == team[1].id && assignments[k].amount == 10)
                        found++;
                    else if (assignments[k].from.id == team[0].id && assignments[k].to.id == team[2].id && assignments[k].amount == 90)
                        found++;
                
                test.equal(found, 2);
                
                test.done();
            });
        }
    };
    
    controller.putAssignments(request, response);
};

exports['add new project'] = function (test) {
    test.async();
    
    var request = {
        body: {
            name: 'New Project'
        }
    };

    var response = {
        json: function (id) {
            test.ok(id);
            
            projectService.getProjectById(id, function (err, project) {
                test.ok(!err);
                test.equal(project.id, id);
                test.equal(project.name, 'New Project');
                
                test.done();
            });
        }
    };
    
    controller.addProject(request, response);
};


exports['add person to first project team'] = function (test) {
    test.async();
    
    async()
    .then(function (data, next) {
        personService.getPersonByName('Daniel', next);
    })
    .then(function (data, next) {
        var request = {
            params: {
                id: project.id.toString(),
                pid: data.id.toString()
            }
        };

        var response = {
            json: function (model) {
                test.ok(model);
                projectService.getTeam(project.id, next);
            }
        };
        
        controller.addPersonToTeam(request, response);
    })
    .then(function (data, next) {
        test.ok(data);
        test.ok(Array.isArray(data));
        test.ok(sl.exist(data, { name: 'Daniel' }));
        test.done();
    })
    .run();
};
