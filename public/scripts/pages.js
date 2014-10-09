
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

            gotoProjects();            
        });
    }

    function doSignOut() {
        me = null;
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
        currentproject = null;
        client.getMyProjects(function (err, projects) {
            if (err)
                alert(err);
            else
                pages.showProjects(projects);
        });
    }

    function showProjects(projects) {
        var page = $("#projectspage");

        var projs = $("#projects");
        projs.empty();

        projects.forEach(function (project) {
            var element = $("<div>").html(makeProjectButton(project.name, function () {
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
    }

    function showProject(project, periods, shares) {
        var page = $("#projectpage");

        var projname = $("#projectname");
        var chartcontainer = $('#projectshares');

        chartcontainer.hide();

        projname.html(project.name);

        var pers = $("#periods");
        pers.empty();

        periods.forEach(function (period) {
            var element = $("<div>").html(makePeriodButton(period.name, function () {
                client.getShareholders(project.id, function (err, shareholders) {
                    if (err)
                        alert(err);
                    else
                        showPeriod(project, period, shareholders);
                });
            }));

            pers.append(element);
        });

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
    	
    	if(!project) {
    		alert("You should select a project");
    		return;
    	}
    	var name = $("#periodnewname").val();
    	if(!name) {
    		alert("A period name is needed");
    		return;
    	}
    	var amount = $("#periodnewamount").val();
    	if(!amount || isNaN(amount) || amount <= 0) {
    		alert("You should input an amount > 0");
    		return;
    	}
    	
    	//TODO: to implement in clientserver and reneame to local
    	if(client != clientlocal) {
    		alert("TODO: be implemented in clientserver");
    		return;
    	}
    	client.addPeriod(project.id, {name: name, amount: amount}, function(err,result) {
    		//TODO: change to error
    		if(result.error) {
    			alert(result.error);
    		} else {
    			alert("A new period was created");    			
    			gotoProject(project);
    		}
    	});
    }

    function showPeriod(project, period, shareholders) {
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
        amountLeft.html(period.amount);
        var shares = $("#shares");
        shares.empty();

        var inputs = [];

        shareholders.forEach(function (shareholder) {
            if (shareholder.id == me)
                return;
            var template = $("#shareTemplate").html();
            template = template.replace("shareholder.name", shareholder.name)
                               .replace("period.amount", period.amount)
            var row = $(template);
            shares.append(row);
            var input = row.find("input");
            var slider = row.find('[role="slider"]').slider({
                min: 0,
                max:period.amount,
                slide: function (event, ui) {
                    input.val(ui.value);
                }
            });
            input.shareholder = shareholder;
            input.change(function () {
                var value = parseInt($(this).val());
                if (!(isNaN(value) || value < 0)) {
                    slider.slider("value", value);
                };
                var total = 0;
                $('.personal-amount').each(function(i, obj) {
                  total += +obj.value;
                });
                amountLeft.html(amount.text() - total);
            });
            inputs.push(input);
        });

        retval.sharesDone = function () {
            var values = [];

            inputs.forEach(function (input) {
                values.push({
                    id: input.shareholder.id,
                    name: input.shareholder.name,
                    amount: input.val()
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

                        assignments.push({ to: value.id, amount: amount });
                    });

                    client.putAssigments(project.id, period.id, me, assignments, done);
                }
                else
                    done(null, true);

                function done(err, result) {
                    alert('Thanks for your input');
                    gotoProject(project);
                    return;
                }

                return;
            }

            alert(result);
        }

        activatePage(page);
    }
    
    function gotoNewPeriod(project, cb) {
    	if(project==null) {
    		alert("you must select a project");
    		return;
    	}    	
        var page = $("#createperiodpage");        
        var projname = $("#newperiodprojectname");
        projname.html(project.name);
        activatePage(page);
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
        gotoNewPeriod:  function () { gotoNewPeriod(currentproject); },
        createPeriod: function () { createPeriod(currentproject); }
    }

    return retval;
})();

if (typeof window == 'undefined')
    module.exports = pages;
