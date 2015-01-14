var Browser = require('zombie');
var assert  = require('assert');

// We call our test example.com
Browser.localhost('localhost', 3000);

// Load the page from localhost
var browser = Browser.create();

browser.visit('/', function (error) {
    assert.ifError(error);
    browser.assert.element('#signinpage');
});

