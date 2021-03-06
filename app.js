'use strict';

var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressLayouts = require('express-ejs-layouts');
var pack = require('./package.json');

var homeRoutes = require('./routes/home');
var adminRoutes = require('./routes/admin');
var personRoutes = require('./routes/person');
var projectRoutes = require('./routes/project');
var authRoutes = require('./routes/auth');

var personApiRoutes = require('./routes/personapi');
var projectApiRoutes = require('./routes/projectapi');
var slackApiRoutes = require('./routes/slackapi');

var cache = require('./utils/cache');

var app = express();

var session = require('express-session');

app.use(session({
    secret: 'cat and dog',
    resave: false,
    saveUninitialized: true
}))

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser('secret'));
app.use(expressLayouts);
app.use(express.static(path.join(__dirname, 'public')));

var adminprefix = '/admin';

app.use(function (req, res, next) {
    res.locals.adminprefix = adminprefix;
    res.locals.title = 'Liqueed';
    res.locals.version = pack.version;
    next();
});

//app.use('/', adminRoutes);
app.use(adminprefix, function (req, res, next) { cache(res); next(); });
app.all(adminprefix, requiredAuthentication);
app.all(adminprefix + '/*', requiredAuthentication);
app.use(adminprefix + '/', adminRoutes);
app.use(adminprefix + '/person', personRoutes);
app.use(adminprefix + '/project', projectRoutes);

app.use('/api', function (req, res, next) { cache(res); next(); });
app.all('/api/person', requiredApiAuthentication);
app.all('/api/project', requiredApiAuthentication);
app.use('/api/person', personApiRoutes);
app.use('/api/project', projectApiRoutes);
app.use('/api/slack', slackApiRoutes);

app.use('/auth', authRoutes);
app.use('/home', homeRoutes);

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            title: 'Error',
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

function requiredAuthentication(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        req.session.error = 'Access denied!';
        res.redirect('/auth/signin');
    }
}

function requiredApiAuthentication(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        res.statusCode = 404;
        res.end();
    }
}

module.exports = app;
