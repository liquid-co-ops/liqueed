
var pages = require('../public/scripts/pages');
var $ = require('simplejquery').$;

exports['Go to sign in'] = function (test) {
    test.async();
    
    pages.gotoSignIn(function (err, data) {
        test.equal(err, null);
        
        test.ok(data);
        test.ok(Array.isArray(data));
        test.ok(data.length);
        
        test.ok($("#signinpage").$.visible());
        
        var html = $("#personlist").html();
        
        test.ok(html);
        
        data.forEach(function (person) {
            test.ok(html.indexOf(person.name) >= 0);
        });
        
        test.done();
    });
}

exports['Go to new project'] = function (test) {
    test.async();
    
    pages.gotoNewProject(function (err, data) {
        test.equal(err, null);
        
        test.ok($("#projectnewpage").$.visible());
        
        test.done();
    });
}