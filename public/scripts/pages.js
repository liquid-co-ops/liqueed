
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
    
    function breadcrumbGotoHome(title) {
        breadcrumb.reset();
        
        if (title) {
            breadcrumb.push('Home', function() {
                console.log("Home");
                innerGotoProjects();
            });
            breadcrumb.push(title);
        }
        else
            breadcrumb.push('Home');
    }
    
    function breadcrumbGotoProject(project, title) {
        breadcrumb.reset();
        breadcrumb.push('Home', function() {
            console.log("Home");
            innerGotoProjects();
        });
        breadcrumb.push(project.name, function() {
            console.log(project.name);
            innerGotoProject(project, function() {});
        });
        breadcrumb.push(title);
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

    function makePersonButton(text, fnclick) {
        return $("<button>")
            .html(text)
            .attr("type", "button")
            .addClass('btn')
            .addClass('btn-success')
            .addClass('person')
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
            $('#username').text(username);
            $('#usercontext').show();
            gotoProjects();
        });
    }

    function doSignOut() {
        me = null;
        currentproject = null;
        $('#usercontext').hide();
        breadcrumb.reset();
        gotoSignIn();
    }

    function gotoSignIn(cb) {
        showSignIn([], cb);
    }

    function showSignIn(persons, cb) {
        var page = $("#signinpage");

        activatePage(page);

        if (cb)
            cb(null, persons);
    }

	function gotoProjects() {
        breadcrumbGotoHome();
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
        breadcrumbGotoHome(project.name);
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

            if (client.getClosedSharesByProject)
                client.getClosedSharesByProject(project.id, function (err, shares) {
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
			if (!period.closed) {
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
            showSharesChart(chartcontainer, shares, 'Project Points');
            chartcontainer.show();
        }

		var pers = $("#projectperiods");
		pers.empty();

		periods.forEach(function(period) {
			var element = $("<div>").html(
					makePeriodButton(period.name, function() {
                        showViewPeriod(project, period);
					}));

			pers.append(element);
		});
        
        var people = $("#projectpersons");
        people.empty();
        
        client.getShareholders(project.id, function (err, shareholders) {
            if (err) {
                alert(err);
                return;
            }
            
            if (!shareholders || !shareholders.length)
                return;
                
            shareholders.forEach(function (person) {
                var element = $("<div>").html(
                        makePersonButton(person.name, function() {
                            gotoShares(person.id, person.name);
                        }));

                people.append(element);
            });
        });

        activatePage(page);
    }
    
    function gotoMyShares() {
        if (!currentproject || !currentproject.id || !me)
            return;
            
        gotoShares(me, null);
    }
    
    function gotoShares(personid, personname) {
        if (!currentproject || !currentproject.id || !personid)
            return;
            
        var page = $("#sharespage");
        var project = currentproject;

        var projname = $("#sharesprojectname");
        projname.html(project.name);
        var pername = $("#sharespersonname");
        
        var title = 'Me';
        
        if (personname && personid != me) {
            pername.html(personname);
            title = personname  ;
        }
        else
            pername.html('Me');
        
        var myreceived = $("#receivedshares");
        var mygiven = $("#givenshares");

        client.getReceivedAssignmentsByProjectPerson(project.id, personid, function (err, received) {
            if (err) {
                alert(err);
                return;
            }

            client.getGivenAssignmentsByProjectPerson(project.id, personid, function (err, given) {
                if (err) {
                    alert(err);
                    return;
                }
                
                myreceived.empty();
                mygiven.empty();

                received.forEach(function (item) {
                    if (!item.period.closed)
                        return;
                        
                    var row = $("<tr>");
                    var aperiod = $("<a>").text(item.period.name);
                    aperiod.click(function () {
                        client.getPeriod(project.id, item.period.id, function (err, period) {
                            if (err)
                                alert(err);
                            else
                                showViewPeriod(project, period);
                        });
                    });
                    row.append($("<td>").append(aperiod));
                    var aperson = $("<a>").text(item.from.name);
                    aperson.click(function () {
                        gotoShares(item.from.id, item.from.name);
                    });
                    row.append($("<td>").append(aperson));
                    row.append($("<td>").text(item.amount));
                    row.append($("<td>").text(item.note));
                    myreceived.append(row);
                });

                given.forEach(function (item) {
                    if (!item.period.closed)
                        return;
                        
                    var row = $("<tr>");
                    var aperiod = $("<a>").text(item.period.name);
                    aperiod.click(function () {
                        client.getPeriod(project.id, item.period.id, function (err, period) {
                            if (err)
                                alert(err);
                            else
                                showViewPeriod(project, period);
                        });
                    });
                    row.append($("<td>").append(aperiod));
                    var aperson = $("<a>").text(item.to.name);
                    aperson.click(function () {
                        gotoShares(item.to.id, item.to.name);
                    });
                    row.append($("<td>").append(aperson));
                    row.append($("<td>").text(item.amount));
                    row.append($("<td>").text(item.note));
                    mygiven.append(row);
                });
                
                activatePage(page);
                
                breadcrumbGotoProject(project, title);
            });
        });
    }

    function showSharesChart(container, shares, title) {
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
                text: title
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

    function showViewPeriod(project, period) {
        var page = $("#viewperiodpage");

        var projname = $("#viewperiodprojectname");
        projname.html(project.name);
        var pername = $("#viewperiodname");
        pername.html(period.name);
        var perdate = $("#viewperioddate");
        perdate.html(period.date);
        var amount = $("#viewperiodamount");
        amount.html(period.amount);

        var chartcontainer = $('#viewperiodshares');
        chartcontainer.hide();
        var sharescontainer = $('#viewperiodshared');
        sharescontainer.hide();
        
        if (period.closed) {
            client.getClosedSharesByPeriod(project.id, period.id, function (err, shares) {
                if (err) {
                    alert(err);
                    return;
                }
                
                if (shares && shares.length) {
                    showSharesChart(chartcontainer, shares, 'Period Points');
                    chartcontainer.show();
                }
            });
            
            client.getAssignments(project.id, period.id, function (err, assignments) {
                if (err) {
                    alert(err);
                    return;
                }
                
                if (!assignments || !assignments.length)
                    return;
                    
                var assigntable = $('#viewperiodassignments');
                assigntable.empty();
                
                assignments.forEach(function (assignment) {
                    var row = $("<tr>");
                    
                    var aperson = $("<a>").text(assignment.from.name);
                    aperson.click(function () {
                        gotoShares(assignment.from.id, assignment.from.name);
                    });
                    row.append($("<td>").append(aperson));
                    
                    var aperson = $("<a>").text(assignment.to.name);
                    aperson.click(function () {
                        gotoShares(assignment.to.id, assignment.to.name);
                    });
                    row.append($("<td>").append(aperson));

                    row.append($("<td>").text(assignment.amount));
                    row.append($("<td>").text(assignment.note));
                    
                    assigntable.append(row);
                });
                    
                sharescontainer.show();
            });
        }

        breadcrumbGotoProject(project, period.name);
        
        activatePage(page);
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

        breadcrumbGotoProject(project, period.name);
        
        shareholders.forEach(function (shareholder) {
            if (shareholder.id == me)
                return;
            var note = "";
            var sharedAmount = "";
            for(var i = 0; i < assignments.length; i++) {
              if(assignments[i].from.id == me && assignments[i].to.id == shareholder.id) {
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
        breadcrumbGotoProject(project, "Share Points");
        if (cb)
            cb(null, null);
    }

    function showChangePassword() {
        var page = $("#changepasspage");
        activatePage(page);
    }

    function doChangePassword() {
        var password = $("#changepass_password").val();
        var repassword = $("#changepass_repassword").val();
        
        if (password != repassword) {
            alert("Retype password");
            return;
        }

        client.changePassword(me, password, function (err, user) {
            if (err) {
                alert(err);
                return;
            }

            if (user.error) {
                alert(user.error);
                return;
            }

            gotoProjects();
        });
    }

    var retval = {
        gotoProjects: gotoProjects,
        gotoProject: function () { gotoProject(currentproject); },
        gotoNewProject: gotoNewProject,
        gotoMyShares: gotoMyShares,
        createProject: createProject,
        showProjects: showProjects,
        
        doSignOut: doSignOut,
        doSignIn: doSignIn,
        gotoSignIn: gotoSignIn,
        
        createPeriod: function () { createPeriod(currentproject); },
        
        showChangePassword: showChangePassword,
        doChangePassword: doChangePassword
    }

    return retval;
})();

if (typeof window == 'undefined')
    module.exports = pages;

 