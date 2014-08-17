
var pages = (function () {
    var active;
    var me = 1;
    var currentproject = null;
    
    function makeProjectButton(text, fnclick) {
        return $("<button>")
            .html(text)
            .attr("type", "button")
            .addClass('btn')
            .addClass('btn-primary')
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
        
        if (active)
            active.hide();
            
        active = page;
        page.show();
    }
    
    function gotoProject(project) {
        currentproject = project;
        client.getPeriods(project.id, function (err, periods) {
            if (err)
                alert(err);
            else
                showProject(project, periods);
        });
    }
    
    function showProject(project, periods) {
        var page = $("#projectpage");
        
        var projname = $("#projectname");
        
        projname.html(project.name);

        var pers = $("#periods");
        pers.empty();
        
        periods.forEach(function (period) {
            var element = $("<div>").html(makePeriodButton(period.name, function () {
                client.getShareholders(project.id, function (err, shareholders) {
                    if (err)
                        alert(err);
                    else
                        showPeriod(project, period, shareholders, periods);
                });
            }));
            
            pers.append(element);
        });
        
        if (active)
            active.hide();
            
        active = page;
        page.show();
    }

    function showPeriod(project, period, shareholders, periods) {
        var page = $("#periodpage");
        
        var projname = $("#periodprojectname");        
        projname.html(project.name);
        var pername = $("#periodname");        
        pername.html(period.name);
        var amount = $("#periodamount");
        amount.html(period.amount);

        var shares = $("#shares");
        shares.empty();
        
        var inputs = [];
        
        shareholders.forEach(function (shareholder) {
            if (shareholder.id == me)
                return;
            
            var row = $("<tr>");
            row.append($("<td>").html(shareholder.name));
            var input = $("<input>").addClass('form-control').width(50);
            input.shareholder = shareholder;
            inputs.push(input);
            row.append($("<td>").html(input));
            
            shares.append(row);
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
                if (client.putAssigments)
                    client.putAssigments(project.id, period.id, me, values, done);
                else
                    done(null, true);
                
                function done(err, result) {
                    alert('Thanks for your input');
                    showProject(project, periods);
                    return;
                }
                
                return;
            }
                
            alert(result);
        }
        
        if (active)
            active.hide();
            
        active = page;
        page.show();
    }
    
    var retval = {
        gotoProjects: gotoProjects,
        gotoProject: function () { gotoProject(currentproject); },
        showProjects: showProjects
    }
    
    return retval;
})();