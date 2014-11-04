'use strict';

var client = require('../public/scripts/client.js');
var async = require('simpleasync');

var projects;
var project;
var persons;

exports['get my projects'] = function (test) {
    test.async();
    client.getMyProjects(function (err, result) {
        test.ok(!err);
        test.ok(result);
        test.ok(Array.isArray(result));
        test.ok(result.length);

        projects = result;
        project = projects[0];

        test.done();
    });
}

exports['get first project'] = function (test) {
    test.async();

    client.getProject(project.id, function (err, result) {
        test.ok(!err);
        test.ok(result);
        test.ok(result.id);
        test.ok(result.name);
        test.equal(result.id, 1);
        test.done();
    });
}

exports['get periods from first project'] = function (test) {
    test.async();

    client.getPeriods(project.id, function (err, result) {
        test.ok(!err);
        test.ok(result);
        test.ok(Array.isArray(result));
        test.ok(result.length);
        test.done();
    });
}

exports['get periods from second project'] = function (test) {
    test.async();

    client.getPeriods(projects[1].id, function (err, result) {
        test.ok(!err);
        test.ok(result);
        test.ok(Array.isArray(result));
        test.equal(result.length, 0);
        test.done();
    });
}

exports['get shareholders from first project'] = function (test) {
    test.async();

    client.getShareholders(project.id, function (err, result) {
        test.ok(!err);
        test.ok(result);
        test.ok(Array.isArray(result));
        test.ok(result.length);
        test.done();
    });
}

exports['get persons'] = function (test) {
    test.async();

    client.getPersons(function (err, result) {
        test.ok(!err);
        test.ok(result);
        test.ok(Array.isArray(result));
        test.ok(result.length);

        result.forEach(function (item) {
            test.ok(item.id);
            test.ok(item.name);
        });

        persons = result;

        test.done();
    });
}


exports['login person'] = function (test) {
    test.async();

    client.loginPerson(persons[0].username, persons[0].username, function (err, result) {
        test.ok(!err);
        test.ok(result);

        test.equal(result.id, persons[0].id);
        test.equal(result.name, persons[0].name);
        test.equal(result.username, persons[0].username);

        test.done();
    });
}

exports['login unknown person'] = function (test) {
    test.async();

    client.loginPerson('foo', 'foo', function (err, result) {
        test.ok(!err);
        test.ok(result);
        test.equal(result.error, 'Unknown username');

        test.done();
    });
}

exports['login invalid password'] = function (test) {
    test.async();

    client.loginPerson(persons[0].username, 'foo', function (err, result) {
        test.ok(!err);
        test.ok(result);
        test.equal(result.error, 'Invalid password');

        test.done();
    });
}

exports['add project'] = function (test) {
    test.async();

    async()
    .then(function (data, next) { client.addProject({ name: 'New Project', shareholders: [] }, next); })
    .then(function (data, next) {
        test.ok(data);
        client.getProject(data, next);
    })
    .then(function (data, next) {
        test.ok(data);
        test.ok(data.id);
        test.ok(data.name);
        test.equal(data.name, 'New Project');
        test.done();
    })
    .fail(function (err) {
        console.log(err);
        throw err;
    })
    .run();
}

exports['fails when adding a period with invalid input'] = function (test) {
	test.async();

    client.addPeriod( projects[2].id, {amount: 100},  function (err, result) {
    	test.ok(!err);
		test.ok(result.error);
		test.equal(result.error, "A period name is needed");
		test.done();
    });

    client.addPeriod( projects[2].id, {name: 'A period', amount: 0},  function (err, result) {
    	test.ok(!err);
        test.ok(result.error);
        test.equal(result.error, 'You should input an amount > 0');
        test.done();
    });

    client.addPeriod( projects[2].id, {name: 'A period'},  function (err, result) {
    	  test.ok(!err);
          test.ok(result.error);
          test.equal(result.error, 'You should input an amount > 0');
          test.done();
      });

    client.addPeriod( projects[2].id, {name: 'A period', amount: 'foo'},  function (err, result) {
  	    test.ok(!err);
        test.ok(result.error);
        test.equal(result.error, 'You should input an amount > 0');
        test.done();
    });

    client.addPeriod(undefined, {name: 'A period', amount: '100'},  function (err, result) {
    	  test.ok(!err);
          test.ok(result.error);
          test.equal(result.error, 'the project id is undefined');
          test.done();
      });
}

exports['fails when adding a period with an existing name'] = function (test) {
	test.async();

    client.addPeriod( projects[2].id, {name: 'First 2014', amount: 100},  function (err, result) {
    	  test.ok(!err);
          test.ok(result.error);
          test.equal(result.error, 'Already exist a period with the same name');
          test.done();
    });
}

exports['successfully add a period to a project'] = function (test) {
	test.async();

	client.addPeriod( projects[2].id, {name: "new period", amount: 100},  function (err, data) {
		test.ok(data);
		client.getPeriods(projects[2].id, function(err,result){
			test.ok(result);
			test.ok(result[data]);
			test.equal(result[data].name, "new period");
			test.equal(result[data].amount, 100);
			test.ok(result[data].date);
			test.done()
		});
    });
}

exports['fails when adding a period to a project with an open periods'] = function (test) {
	test.async();

	client.addPeriod( projects[2].id, {name: "an other period", amount: 100}, function (err, data) {
	        test.ok(data);
	        test.equal(data.error, 'There is an open period, to create another all periods should be closed');
	        test.done();
	});
}

exports['get projects by user'] = function (test) {
    test.async();
    client.getProjectsByUser(persons[0].id, function (err, result) {
        test.ok(!err);
        test.ok(result);
        test.ok(Array.isArray(result));
        test.ok(result.length);
        test.done();
    });
}

exports['get my pending to share projects'] = function (test) {
    test.async();
    client.getPendingShareProjects(persons[0].id, function (err, result) {
        test.ok(!err);
        test.ok(result);
        test.ok(Array.isArray(result));
        test.equal(result.length,1)
        test.equal(result[0].name,"My project 3");
        test.done();
    });
}