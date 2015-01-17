var Browser = require('zombie');
var assert  = require('assert');

// We call our test example.com
Browser.localhost('localhost', 3000);

// Load the page from localhost
var browser = Browser.create();

browser.visit('/', function (error) {
    assert.ifError(error);
    browser.assert.element('#signinpage');
    browser.fill('#login_username', 'admin')
        .fill('#login_password', 'root')
        .pressButton('Sign In', function (error) {
            assert.ifError(error);
            //browser.assert.text("#projectspage h1", "My Projects");
            browser.assert.style("#projectspage", "display", "");
            browser.assert.success();
        });
});

