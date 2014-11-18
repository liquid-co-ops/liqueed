
'use strict';

var client;
var $;

if (typeof client == 'undefined' && typeof clientlocal == 'undefined' && typeof clientserver == 'undefined')
    client = require('./client');

if (typeof $ == 'undefined')
    $ = require('simplejquery').$;

var pages = (function () {
    var active;
    var me;
    var currentproject = null;
    var breadcrumb = null;

    function activatePage(page) {
        if (active)
            active.hide();

        active = page;
        active.show();
    }

    function makeProjectButton(text, fnclick) {
        return $("<button>")
            .html(text)
            .attr("type", "button")
            .addClass('btn')
            .addClass('btn-success')
            .addClass('project')
            .click(fnclick);
    }

    function makePeriodButton(text, fnclick) {
        return $("<button>")
            .html(text)
            .attr("type", "button")
            .addClass('btn')
            .addClass('btn-success')
            .addClass('period')
            .click(fnclick);
    }

	function makeAnAlert(text) {
		return $("<div>")
				.html("<strong>Warning!</strong> " + text)
				.addClass('alert').addClass('alert-warning')
	}

    function doSignIn() {
        var username = $("#login_username").val();
        var password = $("#login_password").val();

        client.loginPerson(username, password, function (err, user) {
            if (err) {
                alert(err);
                return;
            }

            if (user.error) {
                alert(user.error);
                return;
            }

            var userid = user.id;

            if (userid.length && userid.length < 10)
                me = parseInt(userid);
            else
                me = userid;
            breadcrumb = $('#my-breadcrumb').breadcrumb();
            gotoProjects();
        });
    }

    function doSignOut() {
        me = null;
        breadcrumb.reset();
        gotoSignIn();
    }

    function gotoSignIn(cb) {
        client.getPersons(function (err, persons) {
            if (err)
                if (cb)
                    cb(err, null);
                else
                    alert(err);
            else
                showSignIn(persons, cb);
        });
    }

    function showSignIn(persons, cb) {
        var page = $("#signinpage");

        var select = $("#personlist");

        select.empty();

        persons.forEach(function (item) {
            var option = $("<option>").attr("value", item.id).html(item.name);
            select.append(option);
        });

        activatePage(page);

        if (cb)
            cb(null, persons);
    }

	function gotoProjects() {
		if (currentproject) {
			breadcrumb.pop();
		} else {
			breadcrumb.push('Home', function() {
				console.log("Home");
				innerGotoProjects();
			});
		}
		innerGotoProjects();
	}

	function innerGotoProjects() {
		currentproject = null;
		client.getProjectsByUser(me, function(err, projects) {
			if (err)
				alert(err);
			else
				pages.showProjects(projects);
		});
		showAlerts("alerts");
	}

	function showAlerts(id) {
		var alerts = $("#" + id);
		alerts.empty();
		client.getPendingShareProjects(me, function(err, projects) {
			if (err) {
				alert(err);
			} else {
				projects.forEach(function(project) {
					alerts.append(makeAnAlert("Pending to share point for "
							+ project.name + " project."))
				});
			}
		});
	}

	function showProjects(projects) {
		var page = $("#projectspage");

		var projs = $("#projects");
		projs.empty();

		projects.forEach(function(project) {
			var element = $("<div>").html(
					makeProjectButton(project.name, function() {
						gotoProject(project);
					}));

			projs.append(element);
		});
		activatePage(page);
	}

    function gotoNewProject(cb) {
        currentproject = null;
        var page = $("#projectnewpage");
        activatePage(page);
        if (cb)
            cb(null, null);
	}

	function gotoProject(project, cb) {
		if (currentproject) {
			breadcrumb.pop();
		} else {
			breadcrumb.push(project.name, function() {
				console.log(project.name);
				innerGotoProject(project, cb);
			});
		}
		innerGotoProject(project, cb);
	}
	
    function innerGotoProject(project, cb) {
        currentproject = project;
        client.getPeriods(project.id, function (err, periods) {
            if (err) {
            	alert(err);
                return;
            }

            periods = sl.sort(periods, 'date', true);

            if (client.getSharesByProject)
                client.getSharesByProject(project.id, function (err, shares) {
                    if (err)
                        alert(err);
                    else
                        showProject(project, periods, shares);
                });
            else
                showProject(project, periods);
        });
        
        showAlerts("projectalerts");
    }

    function showProject(project, periods, shares) {
        var page = $("#projectpage");
        var projname = $("#projectname");
        var chartcontainer = $('#projectshares');
        var sharingButton = $('#sharingButton');
        var openSharing;
        
        chartcontainer.hide();
        projname.html(project.name);
	    periods.some(function(period) {
			if (period.closed === false) {
				openSharing = period;
				return true;
			}
			return false;
		});
        sharingButton.off("click");
        if(openSharing) {
               sharingButton.click(function () {
                client.getShareholders(project.id, function (err, shareholders) {
                    if (err) {
                        alert(err);
                    }
                    else {
                      client.getAssignments(project.id, openSharing.id, function (err, assignments) {
                        if (err) {
                          showPeriod(project, openSharing, shareholders);
                        }
                        else {
                            showPeriod(project, openSharing, shareholders, assignments);
                        }
                      });
                    }
                });}
               );
        } else {
          sharingButton.click(function (){gotoNewPeriod(project);});
        }
        if (shares && shares.length) {
            showSharesChart(chartcontainer, shares);
            chartcontainer.show();
        }

        activatePage(page);
    }

    function showSharesChart(container, shares) {
        var data = [];

        shares.forEach(function (share) {
            data.push([share.name, share.shares]);
        });

        $(container).highcharts({
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: 1,//null,
                plotShadow: false
            },
            title: {
                text: 'Project Shares'
            },
            tooltip: {
                pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: true,
                        format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                        style: {
                            color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                        }
                    }
                }
            },
            series: [{
                type: 'pie',
                name: 'Project Share',
                data: data
            }]
        });
    }

    function createProject() {
        var name = $("#projectnew_name").val();
        var proj = { name: name };
        client.addProject(proj, function (err, id) {
            if (err)
                alert(err);
            else
                gotoProjects();
        });
    }

    function createPeriod(project) {
		if (!project) {
			alert("You should select a project");
			return;
		}
		var name = $("#periodnewname").val();
		if (!name) {
			alert("A period name is needed");
			return;
		}
		var amount = $("#periodnewamount").val();
		if (!amount || isNaN(amount) || amount <= 0) {
			alert("You should input an amount > 0");
			return;
		}

		client.addPeriod(project.id, {
			name : name,
			amount : amount
		}, function(err, result) {
			if (err) {
				alert(err);
				return;
			}
			if (result.error) {
				alert(result.error);
			} else {
				alert("A new period was created");
				gotoProject(project);
			}
		});
	}

    function showPeriod(project, period, shareholders, assignments) {
        var page = $("#periodpage");

        var projname = $("#periodprojectname");
        projname.html(project.name);
        var pername = $("#periodname");
        pername.html(period.name);
        var perdate = $("#perioddate");
        perdate.html(period.date);
        var amount = $("#periodamount");
        amount.html(period.amount);
        var amountLeft = $("#periodamountLeft");
        var leftAmount = period.amount;

        var shares = $("#shares");
        shares.empty();

        var inputs = [];

        breadcrumb.push(period.name);
        
        shareholders.forEach(function (shareholder) {
            if (shareholder.id == me)
                return;
            var note = "";
            var sharedAmount = "";
            for(var i = 0; i < assignments.length; i++) {
              if(assignments[i].to.id == shareholder.id) {
                note = assignments[i].note;
                sharedAmount = assignments[i].amount;
                leftAmount -= +sharedAmount;
                break;
              }
            }
            var template = $("#shareTemplate").html();
            template = template.replace("#shareholder.name", shareholder.name)
            .replace("#period.amount", sharedAmount).replace("#period.note", note);

            var row = $(template);
            shares.append(row);
            var _ammount = row.find('[data-role="period.amount"]');
            var _note = row.find('[data-role="period.note"]');
            var input = {amount : _ammount, note : _note};

            input.shareholder = shareholder;
                input.amount.change(function () {

                var value = parseInt($(this).val());
                var total = 0;
                $('.personal-amount').each(function(i, obj) {
                  total += +obj.value;
                });
                amountLeft.html(amount.text() - total);
            });
            inputs.push(input);
        });
        
        amountLeft.html(leftAmount);

        retval.sharesDone = function () {
            var values = [];

            inputs.forEach(function (input) {
                values.push({
                    id: input.shareholder.id,
                    name: input.shareholder.name,
                    amount: input.amount.val(),
					note: input.note.val()
                });
            });

            var result = logic.acceptShares(period.amount, values);

            if (result === true) {
                if (client.putAssigments) {
                    var assignments = [];

                    values.forEach(function (value) {
                        var amount = value.amount;

                        if (typeof amount == 'string')
                            amount = parseInt(amount);

                        if (isNaN(amount) || amount < 0)
                            amount = 0;

                        assignments.push({ to: value.id, amount: amount,note: value.note });
                    });

                    client.putAssigments(project.id, period.id, me, assignments, done);
                }
                else
                    done(null, true);

                return;
            }

            function done(err, result) {
                alert('Thanks for your input');
                gotoProject(project);
                return;
            }
            
            alert(result);
        }

        activatePage(page);
    }

    function gotoNewPeriod(project, cb) {
        if (project == null) {
			alert("you must select a project");
			return;
		}
        var page = $("#createperiodpage");
        var projname = $("#newperiodprojectname");
        projname.html(project.name);
        activatePage(page);
        breadcrumb.push("New Sharing");
        if (cb)
            cb(null, null);
    }


    var retval = {
        gotoProjects: gotoProjects,
        gotoProject: function () { gotoProject(currentproject); },
        gotoNewProject: gotoNewProject,
        createProject: createProject,
        showProjects: showProjects,
        doSignOut: doSignOut,
        doSignIn: doSignIn,
        gotoSignIn: gotoSignIn,
        createPeriod: function () { createPeriod(currentproject); }
    }

    return retval;
})();

if (typeof window == 'undefined')
    module.exports = pages;
