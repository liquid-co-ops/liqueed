'use strict';

var sl;

if (typeof sl == 'undefined')
    sl = require('simplelists');

var projects = [
    { id: 1, name: 'My project 1',
        periods: [
            { id: 1, name: 'January 2014', amount: 100, "date": "2014-01-31", closed: true  },
            { id: 2, name: 'February 2014', amount: 100, "date": "2014-02-28", closed: true  },
            { id: 3, name: 'March 2014', amount: 100, "date": "2014-03-31", closed: true  }
        ],
        shareholders: [
            { id: 1, name: 'Alan', username: 'alan' },
            { id: 2, name: 'Fabricio', username: 'fabricio' },
            { id: 3, name: 'Nicolas', username: 'nicolas' },
            { id: 4, name: 'Maximo', username: 'maximo' },
            { id: 5, name: 'Angel', username: 'ajlopez' },
            { id: 6, name: 'Sebastian Streiger', username: 'sebastian' },
            { id: 7, name: 'Laura Fraile', username: 'laura' },
            { id: 8, name: 'Martin', username: 'martin' }
        ]
    },
    { id: 2, name: 'My project 2',
    shareholders: [
        { id: 5, name: 'Angel', username: 'ajlopez' },
        { id: 6, name: 'Sebastian Streiger', username: 'sebastian' },
        { id: 7, name: 'Laura Fraile', username: 'laura' }
    ]
    },
    { id: 3, name: 'My project 3',
        periods: [
                  { id: 1, name: 'First 2014', amount: 100, "date": "2014-06-01", closed: true },
                  { id: 2, name: 'Second 2014', amount: 100, "date": "2014-07-01", closed: true },
                  { id: 3, name: 'Third 2014', amount: 100, "date": "2014-08-01", closed: true }
             ],

            shareholders: [
                { id: 1, name: 'Alan', username: 'alan' },
                { id: 2, name: 'Fabricio', username: 'fabricio' },
                { id: 7, name: 'Laura Fraile', username: 'laura' },
                { id: 8, name: 'Martin', username: 'martin' }
            ]
    }


];

var maxprojid = 3;

var clientlocal = (function() {
    function getPersons(cb) {
        var result = [];

        projects[0].shareholders.forEach(function (item) {
            result.push(item);
        });

        cb(null, sl.sort(result, 'name'));
    }

    function loginPerson(username, password, cb) {
        getPersons(function (err, persons) {
            if (err) {
                cb(err, null);
                return;
            }

            for (var n in persons) {
                var person = persons[n];

                if (person.username == username) {
                    if (username == password)
                        cb(null, person);
                    else
                        cb(null, { error: 'Invalid password' });

                    return;
                }
            }

            cb(null, { error: 'Unknown username' });
        });
    }

    function getProjectsByUser(userid, cb) {
      var result = [];
      projects.forEach(function (item) {    	  
        item.shareholders.forEach(function (person) {
          if(person.id == userid)
            result.push(item);
        });
        
      });
      cb(null, sl.sort(result, 'name'));
    }
    
    function isBelongTo(userid, project) {    	
		for (var j = 0; j < project.shareholders.length; j++) {
			if(project.shareholders[j].id === userid) {
				return true;
			}
		}
		return false;
    }

	function getPendingShareProjects(userid, cb) {
		var result = [];
		var myProject;
		for (var i = 0; i < projects.length; i++) {
			myProject = projects[i];			
			if(isBelongTo(userid,myProject)) {
				var openPeriod = myProject.periods.filter(function(period) {
					if (period.closed) {
						return false;
					}
					if (period.assignments) {
						return !period.assignments.some(function(assigment) {
							return assigment.from === me[0].name;
						});
					} else {
						return true;
					}
				});
				if (openPeriod.length > 0) {
					result.push(myProject);
				}				
			}
		}	
		cb(null, sl.sort(result, 'name'));
	}

	function getMyProjects(cb) {
		cb(null, sl.sort(projects, 'name'));
	}

	function addProject(project, cb) {
		project.id = ++maxprojid;
		projects.push(project);

		cb(null, project.id);
	}

	function getProject(idproj, cb) {
		for (var k = 0; k < projects.length; k++)
			if (projects[k].id == idproj) {
                cb(null, projects[k]);
                return;
            }

        cb(null, null);
    }

    function getViaCallback(objectName, cb){
        return function (err, project) {
            var object = project[objectName];
            if (!object)
                cb(null, []);
            else
                cb(null, object);
        }
    }

	function getPeriods(idproj, cb) {
		getProject(idproj, getViaCallback("periods", cb));
	}

	function getPeriod(idproj, idper, cb) {
        getPeriods(idproj, function (err, periods) {
            if (err)
                cb(err, null);
            else
                cb(null, sl.first(periods, { id: idper }));
        });
	}

	function addPeriod(projid, period, cb) {
		// validation
		if (!projid) {
			cb(null, {error : 'the project id is undefined'})
			return;
		}
		if (!period) {
			cb(null, {error : 'the period to be created is not defined'})
			return;
		}
		if (!period.name) {
			cb(null, {error : "A period name is needed"});
			return;
		}
		if (!period.amount || isNaN(period.amount) || period.amount <= 0) {
			cb(null, {error : "You should input an amount > 0"});
			return;
		}

		getPeriods(projid, function(err, result) {
			if (err) {
				cb(err, null);
				return;
			}

			for ( var n in result) {
				var aPeriod = result[n];
				if (!aPeriod.closed) {
					cb(null,{error : 'There is an open period, to create another all periods should be closed'})
					return;
				}
				if (aPeriod.name === period.name) {
					cb(null,{error : 'Already exist a period with the same name'});
					return;
				}
			}

			// create period
			period.id = result.length;
			var today = new Date();
			period.date = [ today.getFullYear(),("00" + (today.getMonth() + 1)).slice(-2),("00" + today.getDate()).slice(-2) ].join('-');
			period.closed = false;

			result.push(period);

			cb(null, period.id);
		});
	}

    function getShareholders(idproj, cb) {
        getProject(idproj, getViaCallback("shareholders", cb));
    }

    return {
        getProjectsByUser: getProjectsByUser,
        getPendingShareProjects: getPendingShareProjects,
        getMyProjects: getMyProjects,
        getProject: getProject,
        addProject: addProject,
        getPeriods: getPeriods,
        getPeriod: getPeriod,
        addPeriod: addPeriod,
        getShareholders: getShareholders,
        getPersons: getPersons,
        loginPerson: loginPerson
    };
})();

if (typeof window == 'undefined')
    module.exports = clientlocal;
